import Phaser from 'phaser';
import { GAME_WIDTH } from '../utils/Constants';

/**
 * ASSET-REGISTRY: tileset x1.png, 1184×736, 32×32 tiles, 37 cols × 23 rows
 */
const COLS = 37;
const ROWS = 23;
const TILE_PX = 32;

/** Displays every Pupkin tileset tile in a scrollable grid with indices. */
export class TilesetViewer extends Phaser.Scene {
  constructor() {
    super({ key: 'TilesetViewer' });
  }

  preload(): void {
    // Load tileset as spritesheet so individual frames are accessible
    // ASSET-REGISTRY: tileset x1.png, 1184×736, 32×32 tiles
    if (!this.textures.exists('tileset-sheet')) {
      this.load.spritesheet('tileset-sheet', 'assets/tilesets/machine/tileset.png', {
        frameWidth: TILE_PX,
        frameHeight: TILE_PX,
      });
    }
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#111111');

    const gap = 4;
    const labelH = 14;
    const cellW = TILE_PX + gap;
    const cellH = TILE_PX + labelH + gap;
    const padX = 12;
    const padY = 36;

    this.add.text(padX, 10, 'Tileset Viewer \u2014 Drag to scroll, ESC to return', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#888888',
    });

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const idx = row * COLS + col;
        const x = padX + col * cellW;
        const y = padY + row * cellH;

        this.add.sprite(x + TILE_PX / 2, y + TILE_PX / 2, 'tileset-sheet', idx);

        this.add.text(x, y + TILE_PX + 1, `${col},${row}`, {
          fontFamily: 'monospace',
          fontSize: '8px',
          color: '#ffffff',
        });
      }
    }

    const totalW = Math.max(GAME_WIDTH, padX * 2 + COLS * cellW);
    const totalH = padY + ROWS * cellH + 20;
    this.cameras.main.setBounds(0, 0, totalW, totalH);

    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (p.isDown) {
        this.cameras.main.scrollX -= p.velocity.x / 10;
        this.cameras.main.scrollY -= p.velocity.y / 10;
      }
    });

    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });
  }
}
