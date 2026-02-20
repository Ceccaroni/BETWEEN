import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

/** Death screen with restart option. */
export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#000000');

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, 'GAME OVER', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#cc2222',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, 'Press R to restart', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#888888',
    }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-R', () => {
      this.scene.start('TitleScene');
    });
  }
}
