import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

/** Atmospheric title screen with glow, particles, and pulsing text. */
export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#0a0a12');
    this.cameras.main.fadeIn(500);

    this.createBackgroundParticles();
    this.createTitle();
    this.createPrompt();

    this.input.keyboard?.once('keydown', () => this.startGame());
    this.input.once('pointerdown', () => this.startGame());
  }

  private createBackgroundParticles(): void {
    // Create a small glowing dot texture
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

  private createTitle(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2 - 40;

    // Glow layer (larger, blurred text behind)
    const glow = this.add.text(cx, cy, 'BETWEEN', {
      fontFamily: 'monospace',
      fontSize: '80px',
      color: '#6644cc',
    }).setOrigin(0.5).setAlpha(0.4);

    // Main title
    const title = this.add.text(cx, cy, 'BETWEEN', {
      fontFamily: 'monospace',
      fontSize: '80px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Pulsing glow
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

    // Subtle title float
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
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 + 80,
      'PRESS ANY KEY TO START',
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#888888',
      }
    ).setOrigin(0.5);

    // Blinking fade
    this.tweens.add({
      targets: prompt,
      alpha: { from: 1, to: 0.2 },
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private startGame(): void {
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene');
    });
  }
}
