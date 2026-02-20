import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

/** BETWEEN title card — fullscreen image + "press any key" prompt. */
export class TitleScene extends Phaser.Scene {
  private leaving = false;

  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    this.leaving = false;
    this.cameras.main.setBackgroundColor('#000000');
    this.cameras.main.fadeIn(800);

    // Fullscreen title image
    const img = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'screen-title');
    const scaleX = GAME_WIDTH / img.width;
    const scaleY = GAME_HEIGHT / img.height;
    img.setScale(Math.max(scaleX, scaleY));

    // "Press any key" prompt — appears after delay
    const prompt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.88, 'PRESS ANY KEY', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#666666',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: prompt,
      alpha: 1,
      duration: 800,
      delay: 1500,
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

    // Navigate to menu after prompt appears
    this.time.delayedCall(1500, () => {
      this.input.keyboard?.once('keydown', () => this.goToMenu());
      this.input.once('pointerdown', () => this.goToMenu());
    });
  }

  private goToMenu(): void {
    if (this.leaving) return;
    this.leaving = true;
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}
