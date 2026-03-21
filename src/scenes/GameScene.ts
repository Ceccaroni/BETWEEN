import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Projectile } from '../entities/Projectile';
import { InputSystem } from '../systems/InputSystem';
import { DungeonGenerator, RoomData } from '../systems/DungeonGenerator';
import { PropManager } from '../systems/PropManager';
import { ProjectilePool } from '../systems/ProjectilePool';
import { Crosshair } from '../ui/Crosshair';
import { createAfterimage } from '../effects/Afterimage';

/** Effective tile display size (32×2 = 64). */
const TILE_DISPLAY = 64;
const ROOM_W_TILES = 20;
const ROOM_H_TILES = 11;

/** Main gameplay scene: room + player + shooting + camera + atmosphere. */
export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputSystem!: InputSystem;
  private room!: RoomData;
  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private lastDirX = 0;
  private crosshair!: Crosshair;
  private projectilePool!: ProjectilePool;
  private afterimageTimer = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#0a0a12');
    this.cameras.main.fadeIn(500);

    this.room = DungeonGenerator.createRoom(this);

    this.player = new Player(this, this.room.spawnX, this.room.spawnY);

    const shadow = this.add.ellipse(0, 0, 28, 8, 0x000000, 0.35);
    shadow.setDepth(9);
    this.player.setData('shadow', shadow);

    this.physics.add.collider(this.player, this.room.wallLayer);

    PropManager.placeAll(this);

    this.inputSystem = new InputSystem(this);
    this.crosshair = new Crosshair(this);
    this.projectilePool = new ProjectilePool(this);

    // Projectiles destroy on wall hit
    this.physics.add.collider(
      this.projectilePool.getGroup(),
      this.room.wallLayer,
      (_proj) => {
        const p = _proj as Projectile;
        this.spawnWallImpact(p.x, p.y);
        p.deactivate();
      }
    );

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, this.room.widthPx, this.room.heightPx);

    this.createDustEmitter();
    this.createAmbientParticles();
    this.createVignette();
  }

  update(_time: number, delta: number): void {
    this.player.updateTimers(delta);

    const dir = this.inputSystem.getDirection();
    this.player.move(dir.x, dir.y);
    this.player.updateAnimation();

    // Mouse aiming
    this.crosshair.update();
    const pw = this.crosshair.getWorldPosition();
    this.player.faceMouse(pw.x, pw.y);

    // Dash input
    if (this.inputSystem.isDashPressed()) {
      if (this.player.dash(dir.x, dir.y)) {
        // Dust burst at dash start
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

    // Shooting (blocked during dash)
    if (!this.player.getIsDashing() && this.inputSystem.isFireDown()) {
      const origin = this.player.getFireOrigin();
      const angle = Phaser.Math.Angle.Between(origin.x, origin.y, pw.x, pw.y);
      if (this.projectilePool.tryFire(origin.x, origin.y, angle)) {
        this.createMuzzleFlash(origin.x, origin.y);
        this.cameras.main.shake(50, 0.002);
      }
    }

    this.projectilePool.update();

    // Shadow follows player feet
    const shadow = this.player.getData('shadow') as Phaser.GameObjects.Ellipse;
    shadow.setPosition(this.player.x, this.player.y + 26);

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

  /** Brief white flash at the fire origin. */
  private createMuzzleFlash(x: number, y: number): void {
    const flash = this.add.circle(x, y, 8, 0xffffff, 0.85);
    flash.setDepth(20);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.5,
      duration: 80,
      onComplete: () => flash.destroy(),
    });
  }

  /** Spark particles when a projectile hits a wall. */
  private spawnWallImpact(x: number, y: number): void {
    for (let i = 0; i < 4; i++) {
      const spark = this.add.circle(
        x, y, Phaser.Math.Between(2, 4), 0xffcc44, 1
      );
      spark.setDepth(20);
      this.tweens.add({
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

  private createDustEmitter(): void {
    const gfx = this.add.graphics();
    gfx.fillStyle(0x888888, 1);
    gfx.fillCircle(3, 3, 3);
    gfx.generateTexture('dust-particle', 6, 6);
    gfx.destroy();

    this.dustEmitter = this.add.particles(0, 0, 'dust-particle', {
      speed: { min: 10, max: 30 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 400,
      gravityY: -20,
      emitting: false,
    });
    this.dustEmitter.setDepth(11);
  }

  /** Slow floating ambient motes for atmosphere. */
  private createAmbientParticles(): void {
    const gfx = this.add.graphics();
    gfx.fillStyle(0x556688, 1);
    gfx.fillCircle(2, 2, 2);
    gfx.generateTexture('ambient-mote', 4, 4);
    gfx.destroy();

    const emitter = this.add.particles(0, 0, 'ambient-mote', {
      x: { min: TILE_DISPLAY, max: (ROOM_W_TILES - 1) * TILE_DISPLAY },
      y: { min: TILE_DISPLAY, max: (ROOM_H_TILES - 1) * TILE_DISPLAY },
      speed: { min: 3, max: 8 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.25, end: 0 },
      lifespan: { min: 3000, max: 6000 },
      gravityY: -5,
      frequency: 500,
      quantity: 1,
    });
    emitter.setDepth(12);
  }

  /** Dark-edge vignette overlay for mood. */
  private createVignette(): void {
    const w = this.room.widthPx;
    const h = this.room.heightPx;
    const gfx = this.add.graphics();

    const steps = 8;
    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      const alpha = 0.15 * (1 - ratio);
      const inset = ratio * Math.min(w, h) * 0.35;
      gfx.fillStyle(0x000000, alpha);
      gfx.fillRect(0, 0, w, inset);
      gfx.fillRect(0, h - inset, w, inset);
      gfx.fillRect(0, 0, inset, h);
      gfx.fillRect(w - inset, 0, inset, h);
    }

    gfx.setDepth(100);
    gfx.setScrollFactor(0);
  }
}
