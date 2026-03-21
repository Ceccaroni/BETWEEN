import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

/** Victory screen shown after clearing all rooms in a run. */
export class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#000000');
    this.cameras.main.fadeIn(500);

    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    const title = this.add.text(cx, cy - 40, 'RUN COMPLETE', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#ffcc22',
      stroke: '#442200',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Scale-in with bounce
    title.setScale(0);
    this.tweens.add({
      targets: title,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: 'Back.easeOut',
    });

    this.add.text(cx, cy + 30, 'Press R to play again', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#888888',
    }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-R', () => {
      this.scene.start('GameScene');
    });
  }
}
