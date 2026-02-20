import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';
import { AudioSystem } from '../systems/AudioSystem';

/** Black pause → Ceccaroni Games logo → fade to TitleScene. Music starts here. */
export class SplashScene extends Phaser.Scene {
  private skipped = false;

  constructor() {
    super({ key: 'SplashScene' });
  }

  create(): void {
    this.skipped = false;
    this.cameras.main.setBackgroundColor('#000000');

    // Start music immediately
    const audio = new AudioSystem(this);
    audio.playMusic('title-theme', 3000);

    // Black pause (1.5s) before logo appears
    this.time.delayedCall(1500, () => {
      if (this.skipped) return;
      this.showLogo();
    });

    // Skip on click or keypress
    this.input.once('pointerdown', () => this.skip());
    this.input.keyboard?.once('keydown', () => this.skip());
  }

  private showLogo(): void {
    const logo = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'ceccaroni-logo')
      .setAlpha(0);

    const maxHeight = GAME_HEIGHT * 0.6;
    if (logo.height > maxHeight) {
      logo.setScale(maxHeight / logo.height);
    }

    // Fade in → hold → fade out
    this.tweens.add({
      targets: logo,
      alpha: 1,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        this.time.delayedCall(2500, () => {
          if (this.skipped) return;
          this.fadeOut();
        });
      },
    });
  }

  private skip(): void {
    if (this.skipped) return;
    this.skipped = true;
    this.fadeOut();
  }

  private fadeOut(): void {
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('TitleScene');
    });
  }
}
