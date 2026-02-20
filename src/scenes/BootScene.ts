import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

/** Loads all initial assets and shows a minimal loading bar. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.createLoadingBar();
    this.load.image('ceccaroni-logo', 'assets/branding/ceccaroni-games.png');
  }

  create(): void {
    this.scene.start('SplashScene');
  }

  private createLoadingBar(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const barWidth = 320;
    const barHeight = 20;

    const border = this.add.rectangle(cx, cy, barWidth + 4, barHeight + 4)
      .setStrokeStyle(2, 0x444444);

    const fill = this.add.rectangle(
      cx - barWidth / 2, cy, 0, barHeight, 0x8844ff
    ).setOrigin(0, 0.5);

    const text = this.add.text(cx, cy - 30, 'LOADING...', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#888888',
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      fill.width = barWidth * value;
    });

    this.load.on('complete', () => {
      border.destroy();
      fill.destroy();
      text.destroy();
    });
  }
}
