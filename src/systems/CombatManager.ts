import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Drone } from '../entities/enemies/Drone';
import { Turret } from '../entities/enemies/Turret';
import { Projectile } from '../entities/Projectile';
import { ProjectilePool } from './ProjectilePool';
import { EnemyProjectilePool } from './EnemyProjectilePool';
import {
  PLAYER_HP,
  PROJECTILE_DAMAGE,
  ENEMY_PROJECTILE_DAMAGE,
  ROOM_W_TILES,
  ROOM_H_TILES,
  TILE_DISPLAY,
} from '../utils/Constants';
import { getWaveConfig, planSpawnPoint } from './WaveSpawn';
import { spawnWallImpact } from '../effects/Impact';

/** Knockback speed applied to player on contact damage. */
const PLAYER_HIT_KNOCKBACK = 180;

/** Keep spawns this far from the room edge (avoids the perimeter walls). */
const SPAWN_MARGIN = 128;

/** Keep freshly spawned enemies at least this far from the player. */
const SPAWN_PLAYER_CLEARANCE = 150;

/**
 * Central combat system — manages enemy spawning, collision wiring,
 * damage application, and player HP tracking.
 */
export class CombatManager {
  private scene: Phaser.Scene;
  private player: Player;
  private projectilePool: ProjectilePool;
  private enemyProjectilePool: EnemyProjectilePool;
  private enemies: Phaser.Physics.Arcade.Group;
  private wallLayer: Phaser.Tilemaps.TilemapLayer;
  private playerHP: number;
  private playerDead = false;
  private colliders: Phaser.Physics.Arcade.Collider[] = [];

  constructor(
    scene: Phaser.Scene,
    player: Player,
    projectilePool: ProjectilePool,
    wallLayer: Phaser.Tilemaps.TilemapLayer,
    initialHP?: number
  ) {
    this.scene = scene;
    this.player = player;
    this.projectilePool = projectilePool;
    this.wallLayer = wallLayer;
    this.playerHP = initialHP ?? PLAYER_HP;

    this.enemies = scene.physics.add.group();
    this.enemyProjectilePool = new EnemyProjectilePool(scene);

    this.wireCollisions();
    this.listenForTurretFire();
    this.scene.events.on('player-heal', this.healPlayer, this);
  }

  /** Heals the player up to max HP (driven by lifesteal/boons via 'player-heal'). */
  healPlayer(amount: number): void {
    if (this.playerDead || amount <= 0 || this.playerHP >= PLAYER_HP) return;
    this.playerHP = Math.min(PLAYER_HP, this.playerHP + amount);
    this.scene.events.emit('player-hp-changed', this.playerHP);
  }

  /** Sets up all collision/overlap handlers. */
  private wireCollisions(): void {
    // Player projectiles hit enemies (argument swap protection)
    this.colliders.push(
      this.scene.physics.add.overlap(
        this.projectilePool.getGroup(),
        this.enemies,
        (objA, objB) => {
          // Identify which is projectile and which is enemy
          let proj: Projectile;
          let enemy: Enemy;
          if ((objA as Projectile).deactivate) {
            proj = objA as Projectile;
            enemy = objB as Enemy;
          } else {
            proj = objB as Projectile;
            enemy = objA as Enemy;
          }
          if (!proj.active || !enemy.active) return;

          enemy.takeDamage(PROJECTILE_DAMAGE, proj.x, proj.y);
          spawnWallImpact(this.scene, proj.x, proj.y);
          proj.deactivate();
        }
      )
    );

    // Enemies collide with walls
    this.colliders.push(
      this.scene.physics.add.collider(this.enemies, this.wallLayer)
    );

    // Enemies collide with each other (prevent stacking)
    this.colliders.push(
      this.scene.physics.add.collider(this.enemies, this.enemies)
    );

    // Player ↔ enemies contact damage (argument swap protection)
    this.colliders.push(
      this.scene.physics.add.overlap(
        this.player,
        this.enemies,
        (objA, objB) => {
          const enemy = (objA === this.player ? objB : objA) as Enemy;
          if (!enemy.active) return;
          this.damagePlayer(enemy.getContactDamage(), enemy.x, enemy.y);
        }
      )
    );

    // Enemy projectiles hit player
    this.colliders.push(
      this.scene.physics.add.overlap(
        this.enemyProjectilePool.getGroup(),
        this.player,
        (objA, objB) => {
          const proj = (objA === this.player ? objB : objA) as Projectile;
          if (!proj.active) return;
          this.damagePlayer(ENEMY_PROJECTILE_DAMAGE, proj.x, proj.y);
          proj.deactivate();
        }
      )
    );

    // Enemy projectiles collide with walls
    this.colliders.push(
      this.scene.physics.add.collider(
        this.enemyProjectilePool.getGroup(),
        this.wallLayer,
        (projObj) => {
          const proj = projObj as Projectile;
          spawnWallImpact(this.scene, proj.x, proj.y);
          proj.deactivate();
        }
      )
    );
  }

  /** Listens for turret-fire events and spawns enemy projectiles. */
  private listenForTurretFire(): void {
    this.scene.events.on('turret-fire', (x: number, y: number, angle: number) => {
      this.enemyProjectilePool.fire(x, y, angle);
    });
  }

  /** Damages the player if not invulnerable. Applies knockback and VFX. */
  private damagePlayer(amount: number, fromX: number, fromY: number): void {
    if (this.playerDead) return;
    if (this.player.getIsInvulnerable()) return;

    this.playerHP -= amount;
    this.player.startIFrames();

    // Red flash
    this.player.setTintFill(0xff2244);
    window.setTimeout(() => {
      if (this.player && this.player.active) this.player.clearTint();
    }, 100);

    // Screen shake
    this.scene.cameras.main.shake(100, 0.005);

    // Knockback away from enemy
    const angle = Phaser.Math.Angle.Between(fromX, fromY, this.player.x, this.player.y);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(
      Math.cos(angle) * PLAYER_HIT_KNOCKBACK,
      Math.sin(angle) * PLAYER_HIT_KNOCKBACK
    );

    // Notify HUD
    this.scene.events.emit('player-hp-changed', this.playerHP);

    if (this.playerHP <= 0) {
      this.playerHP = 0;
      this.playerDead = true;
      this.scene.events.emit('player-hp-changed', 0);

      // Reset timeScale before death fade (in case enemy hitstop is active)
      this.scene.time.timeScale = 1;

      this.scene.cameras.main.fade(800, 0, 0, 0, false, (_cam: Phaser.Cameras.Scene2D.Camera, progress: number) => {
        if (progress >= 1) {
          this.scene.scene.start('GameOverScene');
        }
      });
    }
  }

  /** Spawns a drone at the given position. */
  spawnDrone(x: number, y: number): Drone {
    const drone = new Drone(this.scene, x, y);
    this.enemies.add(drone);
    return drone;
  }

  /** Spawns a turret at the given position. */
  spawnTurret(x: number, y: number): Turret {
    const turret = new Turret(this.scene, x, y);
    this.enemies.add(turret);
    return turret;
  }

  /** Spawns an enemy wave scaled to the given room number. */
  spawnWave(roomNumber: number): void {
    const config = getWaveConfig(roomNumber);

    for (let i = 0; i < config.drones; i++) {
      const pos = this.pickSpawn();
      this.spawnDrone(pos.x, pos.y);
    }
    for (let i = 0; i < config.turrets; i++) {
      const pos = this.pickSpawn();
      this.spawnTurret(pos.x, pos.y);
    }
  }

  /**
   * Returns a spawn position clear of walls/obstacles and not too close to the
   * player. Rejecting blocked tiles keeps enemies (especially stationary
   * turrets) from spawning inside procedural pillars.
   */
  private pickSpawn(): { x: number; y: number } {
    const roomW = ROOM_W_TILES * TILE_DISPLAY;
    const roomH = ROOM_H_TILES * TILE_DISPLAY;
    return planSpawnPoint({
      bounds: {
        minX: SPAWN_MARGIN,
        maxX: roomW - SPAWN_MARGIN,
        minY: SPAWN_MARGIN,
        maxY: roomH - SPAWN_MARGIN,
      },
      isBlocked: (x, y) => {
        const tile = this.wallLayer.getTileAtWorldXY(x, y);
        return tile !== null && tile.index !== -1;
      },
      playerX: this.player.x,
      playerY: this.player.y,
      minPlayerDist: SPAWN_PLAYER_CLEARANCE,
      rng: () => Math.random(),
    });
  }

  /** Must be called every frame from scene update. */
  update(delta: number): void {
    // Snapshot array to avoid issues if enemies are destroyed during iteration
    const children = [...this.enemies.getChildren()];
    for (const child of children) {
      const enemy = child as Enemy;
      if (enemy.active) {
        enemy.updateEnemy(this.player, delta);
      }
    }

    this.enemyProjectilePool.update();
  }

  /** Returns the number of alive enemies. */
  getAliveCount(): number {
    return this.enemies.getChildren().filter((c) => c.active).length;
  }

  /** Returns the enemy group for external collision setup. */
  getEnemyGroup(): Phaser.Physics.Arcade.Group {
    return this.enemies;
  }

  /** Returns current player HP. */
  getPlayerHP(): number {
    return this.playerHP;
  }

  /** Returns the enemy projectile pool (for room clear). */
  getEnemyProjectilePool(): EnemyProjectilePool {
    return this.enemyProjectilePool;
  }

  /** Destroys all enemies, clears projectiles, removes colliders and event listeners. */
  cleanup(): void {
    // Remove turret-fire + heal listeners
    this.scene.events.off('turret-fire');
    this.scene.events.off('player-heal', this.healPlayer, this);

    // Destroy all enemies (calls overridden destroy which cleans up shadows)
    const children = [...this.enemies.getChildren()];
    for (const child of children) {
      child.destroy();
    }
    this.enemies.clear(true, true);

    // Clear projectile pools
    this.enemyProjectilePool.clearAll();
    this.projectilePool.clearAll();

    // Destroy all per-room colliders
    for (const collider of this.colliders) {
      collider.destroy();
    }
    this.colliders = [];
  }
}
