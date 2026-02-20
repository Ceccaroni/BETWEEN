import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

/** Credits screen with game info. ESC or Backspace returns to title. */
export class CreditsScene extends Phaser.Scene {
  private leaving = false;

  constructor() {
    super({ key: 'CreditsScene' });
  }

  create(): void {
    this.leaving = false;
    this.cameras.main.setBackgroundColor('#0a0a12');
    this.cameras.main.fadeIn(400);

    const cx = GAME_WIDTH / 2;
    const lines = [
      { text: 'BETWEEN', size: '48px', color: '#ffffff', gap: 60 },
      { text: 'A game by Ceccaroni Games', size: '18px', color: '#888888', gap: 50 },
      { text: 'Built with Phaser 3 + Claude Code', size: '14px', color: '#666666', gap: 30 },
      { text: 'Assets: Pupkin Assets \u2013 Tech Dungeon Roguelite', size: '14px', color: '#666666', gap: 50 },
      { text: 'ESC to return', size: '14px', color: '#444444', gap: 0 },
    ];

    let y = GAME_HEIGHT * 0.3;
    for (const line of lines) {
      this.add.text(cx, y, line.text, {
        fontFamily: 'monospace',
        fontSize: line.size,
        color: line.color,
      }).setOrigin(0.5);
      y += line.gap;
    }

    this.input.keyboard?.on('keydown-ESC', () => this.goBack());
    this.input.keyboard?.on('keydown-BACKSPACE', () => this.goBack());
  }

  private goBack(): void {
    if (this.leaving) return;
    this.leaving = true;
    this.scene.start('MenuScene');
  }
}
