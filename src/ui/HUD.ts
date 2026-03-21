import Phaser from 'phaser';
import { PLAYER_HP, GAME_WIDTH } from '../utils/Constants';

/** Color for full/half hearts. */
const HEART_FULL = 0xff2244;
/** Color for empty heart background. */
const HEART_EMPTY = 0x442244;
/** Heart spacing in pixels. */
const HEART_SPACING = 36;
/** HUD left margin. */
const HUD_X = 32;
/** HUD top margin. */
const HUD_Y = 28;
/** Number of hearts (HP / 2). */
const HEART_COUNT = PLAYER_HP / 2;

/**
 * Heads-up display — procedural hearts showing player HP,
 * plus room counter in top-right.
 * Each heart = 2 HP. States: full, half, empty.
 */
export class HUD {
  private scene: Phaser.Scene;
  private hearts: Phaser.GameObjects.Graphics[] = [];
  private currentHP: number;
  private jitterTimer = 0;
  private roomText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.currentHP = PLAYER_HP;

    for (let i = 0; i < HEART_COUNT; i++) {
      const g = scene.add.graphics();
      g.setScrollFactor(0);
      g.setDepth(150);
      this.hearts.push(g);
    }

    this.drawHearts();
    this.listenForDamage();

    // Room counter (top-right)
    this.roomText = scene.add.text(GAME_WIDTH - 32, HUD_Y, '1/6', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#666666',
    });
    this.roomText.setOrigin(1, 0.5).setScrollFactor(0).setDepth(150);
  }

  /** Syncs displayed HP (used on room transitions). */
  setHP(hp: number): void {
    this.currentHP = Math.max(0, hp);
    this.drawHearts();
  }

  /** Updates the room counter display. */
  setRoomNumber(num: number, total: number): void {
    this.roomText.setText(`${num}/${total}`);
  }

  /** Listens for HP changes from CombatManager. */
  private listenForDamage(): void {
    this.scene.events.on('player-hp-changed', (hp: number) => {
      const oldHP = this.currentHP;
      this.currentHP = Math.max(0, hp);
      this.drawHearts();

      if (hp < oldHP) {
        this.bounceHearts();
      }
    });
  }

  /** Redraws all hearts based on current HP. */
  private drawHearts(): void {
    for (let i = 0; i < HEART_COUNT; i++) {
      const g = this.hearts[i];
      g.clear();

      const hpForThisHeart = this.currentHP - i * 2;
      const x = HUD_X + i * HEART_SPACING;
      const y = HUD_Y;

      if (hpForThisHeart >= 2) {
        this.drawHeart(g, x, y, HEART_FULL, 1.0);
      } else if (hpForThisHeart === 1) {
        // Half heart: empty bg + left half filled
        this.drawHeart(g, x, y, HEART_EMPTY, 0.6);
        this.drawHalfHeart(g, x, y, HEART_FULL, 1.0);
      } else {
        this.drawHeart(g, x, y, HEART_EMPTY, 0.6);
      }
    }
  }

  /** Draws a full heart shape at (x, y). */
  private drawHeart(g: Phaser.GameObjects.Graphics, x: number, y: number, color: number, alpha: number): void {
    g.fillStyle(color, alpha);
    // Two circles + triangle to form a heart
    g.fillCircle(x - 5, y - 2, 6);
    g.fillCircle(x + 5, y - 2, 6);
    g.fillTriangle(x - 11, y, x + 11, y, x, y + 12);
  }

  /** Draws the left half of a heart (for half-heart state). */
  private drawHalfHeart(g: Phaser.GameObjects.Graphics, x: number, y: number, color: number, alpha: number): void {
    g.fillStyle(color, alpha);
    g.fillCircle(x - 5, y - 2, 6);
    g.fillTriangle(x - 11, y, x, y, x, y + 12);
  }

  /** Bounce animation on all hearts when player takes damage. */
  private bounceHearts(): void {
    this.hearts.forEach((g, i) => {
      this.scene.tweens.add({
        targets: g,
        scaleX: 1.4,
        scaleY: 1.4,
        duration: 80,
        yoyo: true,
        delay: i * 30,
      });
    });
  }

  /** Must be called every frame for low-HP jitter. */
  update(delta: number): void {
    if (this.currentHP <= 3 && this.currentHP > 0) {
      this.jitterTimer += delta;
      if (this.jitterTimer >= 80) {
        this.jitterTimer = 0;
        this.hearts.forEach((g, i) => {
          const baseX = HUD_X + i * HEART_SPACING;
          g.setPosition(
            baseX + Phaser.Math.Between(-2, 2) - baseX,
            Phaser.Math.Between(-1, 1)
          );
        });
      }
    } else {
      // Reset jitter positions
      this.hearts.forEach((g) => g.setPosition(0, 0));
    }
  }
}
