import Phaser from 'phaser';
import { PLAYER_SPEED } from '../utils/Constants';

/**
 * Player character using FreeKnight_v1 spritesheets.
 * ASSET-REGISTRY: FreeKnight Colour1/Outline, 120×80 per frame.
 * Separate sheets per animation (fk-idle, fk-run, fk-attack, etc.).
 * Character ~40×50px visible within 120×80 frame.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'fk-idle');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.setScale(2);
    // Physics body: tight around the visible knight (scaled 2×)
    this.setSize(30, 45);
    this.setOffset(45, 17);
    this.setDepth(10);

    this.createAnimations();
    this.play('player-idle');
  }

  /** Creates all player animations from separate FreeKnight sheets. */
  private createAnimations(): void {
    this.scene.anims.create({
      key: 'player-idle',
      frames: this.scene.anims.generateFrameNumbers('fk-idle', { start: 0, end: 9 }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'player-run',
      frames: this.scene.anims.generateFrameNumbers('fk-run', { start: 0, end: 9 }),
      frameRate: 12,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'player-attack',
      frames: this.scene.anims.generateFrameNumbers('fk-attack', { start: 0, end: 3 }),
      frameRate: 12,
      repeat: 0,
    });

    this.scene.anims.create({
      key: 'player-death',
      frames: this.scene.anims.generateFrameNumbers('fk-death', { start: 0, end: 9 }),
      frameRate: 8,
      repeat: 0,
    });

    this.scene.anims.create({
      key: 'player-hit',
      frames: this.scene.anims.generateFrameNumbers('fk-hit', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: 0,
    });
  }

  /** Updates player animation based on velocity. */
  updateAnimation(): void {
    const vx = this.body?.velocity.x ?? 0;
    const vy = this.body?.velocity.y ?? 0;
    const moving = Math.abs(vx) > 10 || Math.abs(vy) > 10;

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
