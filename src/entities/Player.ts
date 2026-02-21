import Phaser from 'phaser';
import { PLAYER_SPEED } from '../utils/Constants';

/** Scale for 64×64 idle sheet to match display size. */
const IDLE_SCALE = 2;
/** Scale for 352×384 run sheet to match same display size. */
const RUN_SCALE = 0.36;

/**
 * Player character using Hero Wizard spritesheets (DungeonAssetPack).
 * ASSET-REGISTRY: hero-wizard.png, 512×64, 64×64 cells, 8 frames — idle
 * ASSET-REGISTRY: hero-wizard-run.png, 2816×1536, 352×384 cells, 32 frames — run
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  private wasMoving = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hero-wizard');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.setScale(IDLE_SCALE);
    // Physics body sized for idle sheet (64×64, visible char ~24×40)
    this.setSize(20, 34);
    this.setOffset(22, 20);
    this.setDepth(10);

    this.createAnimations();
    this.play('player-idle');
  }

  /** Creates animations from both spritesheets. */
  private createAnimations(): void {
    if (this.scene.anims.exists('player-idle')) this.scene.anims.remove('player-idle');
    if (this.scene.anims.exists('player-run')) this.scene.anims.remove('player-run');

    // Idle: 64×64 sheet, subtle 8-frame cycle
    this.scene.anims.create({
      key: 'player-idle',
      frames: this.scene.anims.generateFrameNumbers('hero-wizard', { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1,
    });

    // Run: 352×384 sheet, full 32-frame cycle with visible movement
    this.scene.anims.create({
      key: 'player-run',
      frames: this.scene.anims.generateFrameNumbers('hero-wizard-run', { start: 0, end: 31 }),
      frameRate: 20,
      repeat: -1,
    });
  }

  /** Updates animation, switches texture + scale between idle/run. */
  updateAnimation(): void {
    const vx = this.body?.velocity.x ?? 0;
    const vy = this.body?.velocity.y ?? 0;
    const moving = Math.abs(vx) > 10 || Math.abs(vy) > 10;

    if (moving && !this.wasMoving) {
      // Switch to run sheet
      this.setScale(RUN_SCALE);
      this.play('player-run');
      // Adjust physics body for 352×384 frame at RUN_SCALE
      this.setSize(110, 190);
      this.setOffset(120, 120);
    } else if (!moving && this.wasMoving) {
      // Switch back to idle sheet
      this.setScale(IDLE_SCALE);
      this.play('player-idle');
      // Restore physics body for 64×64 frame at IDLE_SCALE
      this.setSize(20, 34);
      this.setOffset(22, 20);
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
