import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

/**
 * Pure title card scene: "BETWEEN" with atmospheric effects.
 * Press any key → MenuScene.
 * This scene is a placeholder for a custom title animation (TypeScript/Phaser).
 */
export class TitleScene extends Phaser.Scene {
  private leaving = false;

  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    this.leaving = false;
    this.cameras.main.setBackgroundColor('#0a0a12');
    this.cameras.main.fadeIn(800);

    this.createBackgroundParticles();
    this.createVignette();
    this.createTitle();
    this.createPrompt();

    // Any key → MenuScene
    this.time.delayedCall(600, () => {
      this.input.keyboard?.once('keydown', () => this.goToMenu());
      this.input.once('pointerdown', () => this.goToMenu());
    });
  }

  private createBackgroundParticles(): void {
    const gfx = this.add.graphics();
    gfx.fillStyle(0x6644cc, 1);
    gfx.fillCircle(4, 4, 4);
    gfx.generateTexture('particle-dot', 8, 8);
    gfx.destroy();

    this.add.particles(0, 0, 'particle-dot', {
      x: { min: 0, max: GAME_WIDTH },
      y: { min: 0, max: GAME_HEIGHT },
      lifespan: 6000,
      speed: { min: 5, max: 20 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.6, end: 0 },
      frequency: 200,
      blendMode: Phaser.BlendModes.ADD,
    });
  }

  private createVignette(): void {
    const gfx = this.add.graphics();
    gfx.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.7, 0.7, 0, 0);
    gfx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT / 3);
    gfx.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.7, 0.7);
    gfx.fillRect(0, GAME_HEIGHT * 2 / 3, GAME_WIDTH, GAME_HEIGHT / 3);
  }

  private createTitle(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT * 0.42;

    // Glow layer
    const glow = this.add.text(cx, cy, 'BETWEEN', {
      fontFamily: 'monospace',
      fontSize: '90px',
      color: '#6644cc',
    }).setOrigin(0.5).setAlpha(0);

    // Main title
    const title = this.add.text(cx, cy, 'BETWEEN', {
      fontFamily: 'monospace',
      fontSize: '90px',
      color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0);

    // Title reveal
    this.tweens.add({
      targets: [title],
      alpha: 1,
      duration: 1500,
      delay: 300,
      ease: 'Power2',
    });

    this.tweens.add({
      targets: glow,
      alpha: { from: 0, to: 0.4 },
      duration: 2000,
      delay: 500,
      ease: 'Power2',
      onComplete: () => {
        // Pulsing glow loop
        this.tweens.add({
          targets: glow,
          alpha: { from: 0.2, to: 0.6 },
          scaleX: { from: 1.0, to: 1.05 },
          scaleY: { from: 1.0, to: 1.05 },
          duration: 2000,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1,
        });
      },
    });

    // Subtle float
    this.tweens.add({
      targets: [title, glow],
      y: cy - 4,
      duration: 3000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private createPrompt(): void {
    const prompt = this.add.text(
      GAME_WIDTH / 2, GAME_HEIGHT * 0.72,
      'PRESS ANY KEY', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#666666',
      }
    ).setOrigin(0.5).setAlpha(0);

    // Delayed appearance
    this.tweens.add({
      targets: prompt,
      alpha: 1,
      duration: 800,
      delay: 2000,
      onComplete: () => {
        this.tweens.add({
          targets: prompt,
          alpha: { from: 1, to: 0.2 },
          duration: 1000,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1,
        });
      },
    });
  }

  private goToMenu(): void {
    if (this.leaving) return;
    this.leaving = true;
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}
