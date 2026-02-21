import Phaser from 'phaser';
import { PLAYER_SPEED } from '../utils/Constants';

/**
 * Scale for 352×384 wizard sheets to match tile display size.
 * Tiles: 32px × scale 2 = 64px display. Wizard visible char ~140px in 352 frame.
 * 0.55 × 140 ≈ 77px visible char → ~1.2 tiles wide, ~1.5 tiles tall.
 */
const WIZARD_SCALE = 0.55;

/**
 * Player character using Hero Wizard spritesheets (DungeonAssetPack).
 * ASSET-REGISTRY: hero-wizard-idle.png, 2816×1536, 352×384 cells, 32 frames
 * ASSET-REGISTRY: hero-wizard-run.png, 2816×1536, 352×384 cells, 32 frames
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  private wasMoving = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hero-wizard-idle');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.setScale(WIZARD_SCALE);
    // Physics body for 352×384 frame at WIZARD_SCALE (~194×211 display)
    // Visible character roughly centered, ~140×220 in frame
    this.setSize(80, 140);
    this.setOffset(136, 160);
    this.setDepth(10);

    this.createAnimations();
    this.play('player-idle');
  }

  /** Creates animations from both spritesheets. */
  private createAnimations(): void {
    if (this.scene.anims.exists('player-idle')) this.scene.anims.remove('player-idle');
    if (this.scene.anims.exists('player-run')) this.scene.anims.remove('player-run');

    this.scene.anims.create({
      key: 'player-idle',
      frames: this.scene.anims.generateFrameNumbers('hero-wizard-idle', { start: 0, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'player-run',
      frames: this.scene.anims.generateFrameNumbers('hero-wizard-run', { start: 0, end: 31 }),
      frameRate: 20,
      repeat: -1,
    });
  }

  /** Updates animation based on velocity. */
  updateAnimation(): void {
    const vx = this.body?.velocity.x ?? 0;
    const vy = this.body?.velocity.y ?? 0;
    const moving = Math.abs(vx) > 10 || Math.abs(vy) > 10;

    if (moving && !this.wasMoving) {
      this.play('player-run');
    } else if (!moving && this.wasMoving) {
      this.play('player-idle');
    }

    if (moving) {
      if (vx < 0) this.setFlipX(true);
      else if (vx > 0) this.setFlipX(false);
    }

    this.wasMoving = moving;
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
