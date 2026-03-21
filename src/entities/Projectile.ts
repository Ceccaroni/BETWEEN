import Phaser from 'phaser';

/**
 * Pooled projectile sprite. Created once by a pool, recycled via fire/deactivate.
 * ASSET-REGISTRY: projectiles.png, 160×288, 32×32 cells, 5 cols × 9 rows
 * Player bolt: frames 0-2 (green dashes). Enemy bolt: frames 5-7 (cyan dashes).
 */
export class Projectile extends Phaser.Physics.Arcade.Sprite {
  private fireTime = 0;
  private maxLifetime = 2000;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'projectiles', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setActive(false);
    this.setVisible(false);
    this.setScale(2);
    this.setDepth(15);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(12, 12);
    body.setOffset(10, 10);
    body.enable = false;
  }

  /** Fires this projectile from (x, y) at the given angle and speed. */
  fire(x: number, y: number, angle: number, speed: number, startFrame: number): void {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setFrame(startFrame);
    this.setRotation(angle);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = true;
    this.scene.physics.velocityFromAngle(
      Phaser.Math.RadToDeg(angle), speed, body.velocity
    );

    this.fireTime = this.scene.time.now;
  }

  /** Returns to pool. */
  deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
    this.setPosition(-100, -100);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = false;
    body.setVelocity(0, 0);
  }

  /** Checks lifetime expiry each frame. */
  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    if (!this.active) return;

    if (time - this.fireTime >= this.maxLifetime) {
      this.deactivate();
    }
  }
}
