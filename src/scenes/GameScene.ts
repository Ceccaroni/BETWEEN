import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

/** Placeholder scene for main gameplay. */
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#1a1a2e');
    this.cameras.main.fadeIn(500);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'The Machine — Coming Soon', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#8844ff',
    }).setOrigin(0.5);
  }
}
