import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';
import { AudioSystem } from '../systems/AudioSystem';

/** Ceccaroni Games splash — fullscreen image, music starts here. */
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

    // Black pause, then show splash image
    this.time.delayedCall(1500, () => {
      if (this.skipped) return;
      this.showSplash();
    });

    this.input.once('pointerdown', () => this.skip());
    this.input.keyboard?.once('keydown', () => this.skip());
  }

  private showSplash(): void {
    const img = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'screen-splash')
      .setAlpha(0);

    // Scale to cover screen
    const scaleX = GAME_WIDTH / img.width;
    const scaleY = GAME_HEIGHT / img.height;
    img.setScale(Math.max(scaleX, scaleY));

    this.tweens.add({
      targets: img,
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
