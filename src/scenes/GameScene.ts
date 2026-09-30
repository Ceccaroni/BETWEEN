import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { InputSystem } from '../systems/InputSystem';
import { ProjectilePool } from '../systems/ProjectilePool';
import { MeleeWeapon, Deflectable } from '../systems/MeleeWeapon';
import { Enemy } from '../entities/Enemy';
import { RunState } from '../systems/RunState';
import { RoomDirector } from '../systems/RoomDirector';
import { Crosshair } from '../ui/Crosshair';
import { HUD } from '../ui/HUD';
import { createAfterimage } from '../effects/Afterimage';
import { createDustEmitter } from '../effects/Atmosphere';
import { TILE_DISPLAY, ROOM_W_TILES, ROOM_H_TILES } from '../utils/Constants';

/**
 * Main gameplay scene. Owns the persistent player/input/weapon/HUD and the
 * per-frame update loop; the per-room lifecycle (build, transition, teardown,
 * boons) is delegated to {@link RoomDirector}.
 */
export class GameScene extends Phaser.Scene {
  // --- PERSISTENT (survive room transitions) ---
  private player!: Player;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private inputSystem!: InputSystem;
  private crosshair!: Crosshair;
  private projectilePool!: ProjectilePool;
  private weapon!: MeleeWeapon;
  private hud!: HUD;
  private runState!: RunState;
  private director!: RoomDirector;
  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private lastDirX = 0;
  private afterimageTimer = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#0a0a12');
    this.cameras.main.fadeIn(500);

    // Initialize run state
    this.runState = new RunState();

    // --- Persistent setup (once per run) ---
    this.dustEmitter = createDustEmitter(this);

    // Player at room center for first room
    const spawnX = (ROOM_W_TILES * TILE_DISPLAY) / 2;
    const spawnY = (ROOM_H_TILES * TILE_DISPLAY) / 2;
    this.player = new Player(this, spawnX, spawnY);

    this.playerShadow = this.add.ellipse(0, 0, 28, 8, 0x000000, 0.35);
    this.playerShadow.setDepth(9);

    this.inputSystem = new InputSystem(this);
    this.crosshair = new Crosshair(this);
    this.projectilePool = new ProjectilePool(this);
    this.weapon = new MeleeWeapon(this, this.player, this.runState.stats);
    this.hud = new HUD(this);

    // Per-room lifecycle: build first room + wire door transitions.
    this.director = new RoomDirector(this, this.player, this.projectilePool, this.runState, this.hud);
    this.director.start();
  }

  update(_time: number, delta: number): void {
    if (this.director.isTransitioning) return;

    this.player.updateTimers(delta);

    const dir = this.inputSystem.getDirection();

    // Mouse aiming
    this.crosshair.update();
    const pw = this.crosshair.getWorldPosition();

    // Melee attack (hold to chain swings, blocked during dash)
    if (!this.player.getIsDashing() && this.inputSystem.isFireDown() && this.weapon.canAttack()) {
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pw.x, pw.y);
      this.weapon.tryAttack(angle);
    }

    // Movement + facing are suspended during a swing (the lunge drives velocity).
    if (!this.weapon.isActive()) {
      this.player.move(dir.x, dir.y);
      this.player.faceMouse(pw.x, pw.y);
      this.player.updateAnimation();
    }

    // Dash input
    if (this.inputSystem.isDashPressed()) {
      if (this.player.dash(dir.x, dir.y)) {
        this.dustEmitter.emitParticleAt(this.player.x, this.player.y + 26, 10);
        this.afterimageTimer = 0;
      }
    }

    // Afterimage ghosts during dash (every 30ms)
    if (this.player.getIsDashing()) {
      this.afterimageTimer += delta;
      if (this.afterimageTimer >= 30) {
        this.afterimageTimer = 0;
        createAfterimage(this, this.player);
      }
    }

    this.weapon.update(
      delta,
      this.director.combatManager.getEnemyGroup().getChildren() as Enemy[],
      this.director.combatManager.getEnemyProjectilePool().getGroup().getChildren() as unknown as Deflectable[]
    );
    this.projectilePool.update();
    this.director.combatManager.update(delta);
    this.director.roomClearManager.update();
    this.hud.update(delta);

    // Shadow follows player feet
    this.playerShadow.setPosition(this.player.x, this.player.y + 26);

    const vx = this.player.body?.velocity.x ?? 0;
    const vy = this.player.body?.velocity.y ?? 0;
    const moving = Math.abs(vx) > 10 || Math.abs(vy) > 10;

    if (moving) {
      this.dustEmitter.emitParticleAt(
        this.player.x + Phaser.Math.Between(-6, 6),
        this.player.y + 26, 1
      );
    }

    if (dir.x !== 0 && dir.x !== this.lastDirX) {
      this.dustEmitter.emitParticleAt(this.player.x, this.player.y + 26, 5);
    }
    this.lastDirX = dir.x;
  }
}
