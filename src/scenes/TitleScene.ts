import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

/** Liminal glitch title card. "BETWEEN" flickers unstably, rare violent shifts. */
export class TitleScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private leaving = false;

  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    this.leaving = false;
    this.cameras.main.setBackgroundColor('#000000');

    this.titleText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'BETWEEN', {
      fontSize: '120px',
      fontFamily: 'monospace',
      color: '#ffffff',
      letterSpacing: 15,
    }).setOrigin(0.5).setAlpha(0);

    // Slow fade to dim presence
    this.tweens.add({
      targets: this.titleText,
      alpha: 0.15,
      duration: 3000,
      onComplete: () => this.startGlitchLoop(),
    });

    // Navigate away after title settles
    this.time.delayedCall(2000, () => {
      this.input.keyboard?.once('keydown', () => this.goToMenu());
      this.input.once('pointerdown', () => this.goToMenu());
    });
  }

  private startGlitchLoop(): void {
    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (this.leaving) return;
        const rand = Math.random();

        // Rare violent glitch
        if (rand > 0.97) {
          this.titleText.setAlpha(0.8).setX(GAME_WIDTH / 2 + 15);
          this.time.delayedCall(50, () => {
            this.titleText.setX(GAME_WIDTH / 2).setAlpha(0.15);
          });
        }
        // Permanent subtle noise
        else {
          this.titleText.setAlpha(Phaser.Math.FloatBetween(0.1, 0.25));
        }
      },
      loop: true,
    });
  }

  private goToMenu(): void {
    if (this.leaving) return;
    this.leaving = true;
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}
