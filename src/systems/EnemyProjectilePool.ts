import Phaser from 'phaser';
import { Projectile } from '../entities/Projectile';
import { ENEMY_PROJECTILE_SPEED } from '../utils/Constants';

/** Enemy projectile start frame (cyan energy bolt, row 1). */
const ENEMY_BOLT_FRAME = 5;

/**
 * Object pool for enemy projectiles. Pre-allocates 15 sprites,
 * uses cyan bolts (frames 5-7) visually distinct from player green.
 */
export class EnemyProjectilePool {
  private scene: Phaser.Scene;
  private pool: Phaser.Physics.Arcade.Group;
  private trailEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.pool = scene.physics.add.group({
      classType: Projectile,
      maxSize: 15,
      runChildUpdate: true,
    });

    for (let i = 0; i < 15; i++) {
      const p = new Projectile(scene, -100, -100);
      this.pool.add(p, true);
    }

    this.trailEmitter = this.createTrailEmitter();
  }

  /** Fires an enemy projectile from (x, y) at the given angle. */
  fire(x: number, y: number, angle: number): boolean {
    const proj = this.pool.getFirstDead(false) as Projectile | null;
    if (!proj) return false;

    proj.fire(x, y, angle, ENEMY_PROJECTILE_SPEED, ENEMY_BOLT_FRAME);
    return true;
  }

  /** Returns the physics group for collision setup. */
  getGroup(): Phaser.Physics.Arcade.Group {
    return this.pool;
  }

  /** Deactivates all active projectiles (used on room clear). */
  clearAll(): void {
    this.pool.getChildren().forEach((child) => {
      const p = child as Projectile;
      if (p.active) p.deactivate();
    });
  }

  /** Emits cyan trail particles from all active projectiles. */
  update(): void {
    this.pool.getChildren().forEach((child) => {
      const p = child as Projectile;
      if (p.active) {
        this.trailEmitter.emitParticleAt(p.x, p.y, 1);
      }
    });
  }

  /** Creates the shared cyan trail emitter for enemy projectiles. */
  private createTrailEmitter(): Phaser.GameObjects.Particles.ParticleEmitter {
    const gfx = this.scene.add.graphics();
    gfx.fillStyle(0x44ccff, 1);
    gfx.fillCircle(2, 2, 2);
    gfx.generateTexture('enemy-proj-trail', 4, 4);
    gfx.destroy();

    const emitter = this.scene.add.particles(0, 0, 'enemy-proj-trail', {
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
