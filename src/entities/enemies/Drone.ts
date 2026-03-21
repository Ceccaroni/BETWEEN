import Phaser from 'phaser';
import { Enemy } from '../Enemy';

/** Drone HP. */
const DRONE_HP = 6;
/** Drone movement speed in px/s. */
const DRONE_SPEED = 60;
/** Contact damage dealt to player. */
const DRONE_CONTACT_DAMAGE = 1;

/**
 * Drone enemy — Green Mucus.
 * Chases the player directly. Low HP, slow, persistent.
 * ASSET-REGISTRY: Green_mucus-64x64-Sheet.png, 512×64, 64×64 cells, 8 frames
 */
export class Drone extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-drone', DRONE_HP, DRONE_CONTACT_DAMAGE, DRONE_SPEED);

    this.createAnimations();
    this.play('drone-idle');
  }

  /** Creates drone animation (all 8 frames looping). */
  private createAnimations(): void {
    if (!this.scene.anims.exists('drone-idle')) {
      this.scene.anims.create({
        key: 'drone-idle',
        frames: this.scene.anims.generateFrameNumbers('enemy-drone', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1,
      });
    }
  }

  /** Chase the player directly. */
  updateAI(player: Phaser.Physics.Arcade.Sprite): void {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(
      Math.cos(angle) * this.moveSpeed,
      Math.sin(angle) * this.moveSpeed
    );

    // Face the player
    this.setFlipX(player.x < this.x);
  }
}
