import Phaser from 'phaser';
import { Enemy } from '../Enemy';
import { TURRET_HP, TURRET_FIRE_INTERVAL_MS, TURRET_TELEGRAPH_MS } from '../../utils/Constants';

/** Contact damage dealt to player on touch. */
const TURRET_CONTACT_DAMAGE = 1;

/**
 * Turret enemy — Witch.
 * Stationary. Telegraphs a red pulsing line, then fires a cyan bolt.
 * Locks target angle at telegraph start, fires at that locked angle.
 * ASSET-REGISTRY: Witch_64x64-Sheet.png, 512×64, 64×64 cells, 8 frames
 */
export class Turret extends Enemy {
  private fireTimer: number;
  private isTelegraphing = false;
  private telegraphTimer = 0;
  private telegraphAngle = 0;
  private telegraphLine: Phaser.GameObjects.Graphics | null = null;
  private telegraphPulseTime = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-turret', TURRET_HP, TURRET_CONTACT_DAMAGE, 0);

    this.createAnimations();
    this.play('turret-idle');

    // Stagger first shot so all turrets don't fire simultaneously
    this.fireTimer = Phaser.Math.Between(500, TURRET_FIRE_INTERVAL_MS);
  }

  /** Creates turret animation (all 8 frames looping). */
  private createAnimations(): void {
    if (!this.scene.anims.exists('turret-idle')) {
      this.scene.anims.create({
        key: 'turret-idle',
        frames: this.scene.anims.generateFrameNumbers('enemy-turret', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1,
      });
    }
  }

  /** Stationary AI: count down to telegraph, then fire. */
  updateAI(player: Phaser.Physics.Arcade.Sprite, delta: number): void {
    // Face the player
    this.setFlipX(player.x < this.x);

    // Stop all movement (stationary)
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);

    if (this.isTelegraphing) {
      this.telegraphTimer -= delta;
      this.telegraphPulseTime += delta;
      this.updateTelegraphLine();

      if (this.telegraphTimer <= 0) {
        this.fireBolt();
      }
    } else {
      this.fireTimer -= delta;
      if (this.fireTimer <= 0) {
        this.startTelegraph(player);
      }
    }
  }

  /** Begins telegraph phase: locks angle and shows pulsing red line. */
  private startTelegraph(player: Phaser.Physics.Arcade.Sprite): void {
    this.isTelegraphing = true;
    this.telegraphTimer = TURRET_TELEGRAPH_MS;
    this.telegraphPulseTime = 0;
    this.telegraphAngle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);

    this.telegraphLine = this.scene.add.graphics();
    this.telegraphLine.setDepth(50);
    this.updateTelegraphLine();
  }

  /** Draws the pulsing red telegraph line. */
  private updateTelegraphLine(): void {
    if (!this.telegraphLine) return;

    this.telegraphLine.clear();

    // Pulsing alpha 0.3 → 0.8
    const pulse = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(this.telegraphPulseTime * 0.02));
    this.telegraphLine.lineStyle(2, 0xff2244, pulse);

    const lineLen = 400;
    const endX = this.x + Math.cos(this.telegraphAngle) * lineLen;
    const endY = this.y + Math.sin(this.telegraphAngle) * lineLen;

    this.telegraphLine.beginPath();
    this.telegraphLine.moveTo(this.x, this.y);
    this.telegraphLine.lineTo(endX, endY);
    this.telegraphLine.strokePath();
  }

  /** Fires the bolt and resets timers. */
  private fireBolt(): void {
    // Destroy telegraph line
    if (this.telegraphLine) {
      this.telegraphLine.destroy();
      this.telegraphLine = null;
    }

    this.isTelegraphing = false;
    this.fireTimer = TURRET_FIRE_INTERVAL_MS;

    // Muzzle flash
    const flashX = this.x + Math.cos(this.telegraphAngle) * 20;
    const flashY = this.y + Math.sin(this.telegraphAngle) * 20;
    const flash = this.scene.add.circle(flashX, flashY, 8, 0x44ccff, 0.9);
    flash.setDepth(20);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.5,
      duration: 80,
      onComplete: () => flash.destroy(),
    });

    // Emit event for CombatManager to spawn the projectile
    this.scene.events.emit('turret-fire', this.x, this.y, this.telegraphAngle);
  }

  /** Clean up telegraph graphics on death. */
  override destroy(fromScene?: boolean): void {
    if (this.telegraphLine) {
      this.telegraphLine.destroy();
      this.telegraphLine = null;
    }
    super.destroy(fromScene);
  }
}
