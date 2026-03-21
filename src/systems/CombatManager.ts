import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Drone } from '../entities/enemies/Drone';
import { Turret } from '../entities/enemies/Turret';
import { Projectile } from '../entities/Projectile';
import { ProjectilePool } from './ProjectilePool';
import { EnemyProjectilePool } from './EnemyProjectilePool';
import { PLAYER_HP, PROJECTILE_DAMAGE, ENEMY_PROJECTILE_DAMAGE } from '../utils/Constants';

/** Knockback speed applied to player on contact damage. */
const PLAYER_HIT_KNOCKBACK = 180;

/** Enemy wave config per room number. */
const WAVE_CONFIG: Record<number, { drones: number; turrets: number }> = {
  1: { drones: 3, turrets: 1 },
  2: { drones: 4, turrets: 2 },
  3: { drones: 5, turrets: 2 },
  4: { drones: 5, turrets: 3 },
  5: { drones: 6, turrets: 3 },
  6: { drones: 8, turrets: 4 },
};

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
  }

  /** Sets up all collision/overlap handlers. */
  private wireCollisions(): void {
    // Player projectiles hit enemies
    this.colliders.push(
      this.scene.physics.add.overlap(
        this.projectilePool.getGroup(),
        this.enemies,
        (projObj, enemyObj) => {
          const proj = projObj as Projectile;
          const enemy = enemyObj as Enemy;
          if (!proj.active || !enemy.active) return;

          enemy.takeDamage(PROJECTILE_DAMAGE, proj.x, proj.y);
          this.spawnWallImpact(proj.x, proj.y);
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

    // Player ↔ enemies contact damage
    this.colliders.push(
      this.scene.physics.add.overlap(
        this.player,
        this.enemies,
        (_playerObj, enemyObj) => {
          const enemy = enemyObj as Enemy;
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
          this.spawnWallImpact(proj.x, proj.y);
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
    if (this.player.getIsInvulnerable()) return;

    this.playerHP -= amount;
    this.player.startIFrames();

    // Red flash
    this.player.setTintFill(0xff2244);
    window.setTimeout(() => {
      if (this.player.active) this.player.clearTint();
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
      this.scene.events.emit('player-hp-changed', 0);
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
    const config = WAVE_CONFIG[roomNumber] ?? { drones: 3, turrets: 2 };
    const margin = 128;
    const roomW = 20 * 64;
    const roomH = 11 * 64;

    for (let i = 0; i < config.drones; i++) {
      const pos = this.getSafeSpawn(margin, roomW, roomH);
      this.spawnDrone(pos.x, pos.y);
    }
    for (let i = 0; i < config.turrets; i++) {
      const pos = this.getSafeSpawn(margin, roomW, roomH);
      this.spawnTurret(pos.x, pos.y);
    }
  }

  /** Spawns the initial wave (legacy, calls spawnWave(1)). */
  spawnInitialWave(): void {
    this.spawnWave(1);
  }

  /** Returns a spawn position that isn't too close to the player. */
  private getSafeSpawn(margin: number, roomW: number, roomH: number): { x: number; y: number } {
    let x = Phaser.Math.Between(margin, roomW - margin);
    let y = Phaser.Math.Between(margin, roomH - margin);

    const dist = Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y);
    if (dist < 150) {
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, x, y);
      x = this.player.x + Math.cos(angle) * 200;
      y = this.player.y + Math.sin(angle) * 200;
    }
    return { x, y };
  }

  /** Must be called every frame from scene update. */
  update(delta: number): void {
    this.enemies.getChildren().forEach((child) => {
      const enemy = child as Enemy;
      if (enemy.active) {
        enemy.updateEnemy(this.player, delta);
      }
    });

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
    // Remove turret-fire listener
    this.scene.events.off('turret-fire');

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

  /** Spark particles at impact point. */
  private spawnWallImpact(x: number, y: number): void {
    for (let i = 0; i < 4; i++) {
      const spark = this.scene.add.circle(
        x, y, Phaser.Math.Between(2, 4), 0xffcc44, 1
      );
      spark.setDepth(20);
      this.scene.tweens.add({
        targets: spark,
        x: x + Phaser.Math.Between(-20, 20),
        y: y + Phaser.Math.Between(-20, 20),
        alpha: 0,
        scale: 0,
        duration: Phaser.Math.Between(100, 200),
        onComplete: () => spark.destroy(),
      });
    }
  }
}
