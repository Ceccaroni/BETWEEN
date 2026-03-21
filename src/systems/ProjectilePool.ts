import Phaser from 'phaser';
import { Projectile } from '../entities/Projectile';
import { PROJECTILE_SPEED, FIRE_RATE_MS } from '../utils/Constants';

/** Player projectile start frame (green energy bolt, row 0). */
const PLAYER_BOLT_FRAME = 0;

/**
 * Object pool for player projectiles. Pre-allocates 20 sprites,
 * enforces fire-rate cooldown, and provides the physics group for collision.
 */
export class ProjectilePool {
  private scene: Phaser.Scene;
  private pool: Phaser.Physics.Arcade.Group;
  private lastFireTime = 0;
  private trailEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.pool = scene.physics.add.group({
      classType: Projectile,
      maxSize: 20,
      runChildUpdate: true,
    });

    for (let i = 0; i < 20; i++) {
      const p = new Projectile(scene, -100, -100);
      this.pool.add(p, true);
    }

    this.trailEmitter = this.createTrailEmitter();
  }

  /** Attempts to fire a projectile. Returns true if one was fired. */
  tryFire(x: number, y: number, angle: number): boolean {
    const now = this.scene.time.now;
    if (now - this.lastFireTime < FIRE_RATE_MS) return false;

    const proj = this.pool.getFirstDead(false) as Projectile | null;
    if (!proj) return false;

    proj.fire(x, y, angle, PROJECTILE_SPEED, PLAYER_BOLT_FRAME);
    this.lastFireTime = now;
    return true;
  }

  /** Returns the physics group for collision setup. */
  getGroup(): Phaser.Physics.Arcade.Group {
    return this.pool;
  }

  /** Emits trail particles from all active projectiles. */
  update(): void {
    this.pool.getChildren().forEach((child) => {
      const p = child as Projectile;
      if (p.active) {
        this.trailEmitter.emitParticleAt(p.x, p.y, 1);
      }
    });
  }

  /** Creates the shared trail particle emitter for projectiles. */
  private createTrailEmitter(): Phaser.GameObjects.Particles.ParticleEmitter {
    const gfx = this.scene.add.graphics();
    gfx.fillStyle(0x44ff88, 1);
    gfx.fillCircle(2, 2, 2);
    gfx.generateTexture('proj-trail', 4, 4);
    gfx.destroy();

    const emitter = this.scene.add.particles(0, 0, 'proj-trail', {
      speed: { min: 5, max: 15 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 200,
      emitting: false,
    });
    emitter.setDepth(14);
    return emitter;
  }
}
