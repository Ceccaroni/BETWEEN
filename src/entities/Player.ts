import Phaser from 'phaser';
import { PLAYER_SPEED } from '../utils/Constants';

/** Player character using Pupkin blue spritesheet (8 cols x 13 rows, 40x32 per frame). */
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-blue');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.setSize(16, 20);
    this.setOffset(12, 10);

    this.createAnimations();
    this.play('player-idle');
  }

  /** Creates all player animations from the spritesheet. */
  private createAnimations(): void {
    // Row 0: Idle (frames 0-3)
    this.scene.anims.create({
      key: 'player-idle',
      frames: this.scene.anims.generateFrameNumbers('player-blue', {
        start: 0, end: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });

    // Row 3: Run (frames 24-27)
    this.scene.anims.create({
      key: 'player-run',
      frames: this.scene.anims.generateFrameNumbers('player-blue', {
        start: 24, end: 27,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Row 4: Shoot (frames 32-34)
    this.scene.anims.create({
      key: 'player-shoot',
      frames: this.scene.anims.generateFrameNumbers('player-blue', {
        start: 32, end: 34,
      }),
      frameRate: 10,
      repeat: 0,
    });

    // Row 5: Death (frames 40-45)
    this.scene.anims.create({
      key: 'player-death',
      frames: this.scene.anims.generateFrameNumbers('player-blue', {
        start: 40, end: 45,
      }),
      frameRate: 8,
      repeat: 0,
    });
  }

  /** Updates player animation based on velocity. */
  updateAnimation(): void {
    const vx = this.body?.velocity.x ?? 0;
    const vy = this.body?.velocity.y ?? 0;
    const moving = Math.abs(vx) > 1 || Math.abs(vy) > 1;

    if (moving) {
      this.play('player-run', true);
      if (vx < 0) this.setFlipX(true);
      else if (vx > 0) this.setFlipX(false);
    } else {
      this.play('player-idle', true);
    }
  }

  /** Moves the player with normalized diagonal speed. */
  move(dirX: number, dirY: number): void {
    const len = Math.sqrt(dirX * dirX + dirY * dirY);
    if (len > 0) {
      this.setVelocity(
        (dirX / len) * PLAYER_SPEED,
        (dirY / len) * PLAYER_SPEED
      );
    } else {
      this.setVelocity(0, 0);
    }
  }
}
