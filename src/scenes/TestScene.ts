import Phaser from 'phaser';

/** Sandbox scene — currently shows tileset grid with tile indices for debugging. */
export class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TestScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#111111');

    const cols = 37;
    const rows = 23;
    const tileSize = 32;
    const gap = 2;
    const cellSize = tileSize + gap;

    this.add.text(8, 8, 'Tileset Debug — scroll to explore, indices shown below each tile', {
      fontFamily: 'monospace', fontSize: '12px', color: '#888',
    });

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        const x = 8 + col * cellSize;
        const y = 30 + row * (cellSize + 12);

        this.add.sprite(x + tileSize / 2, y + tileSize / 2, 'machine-tileset', idx);

        this.add.text(x, y + tileSize + 1, `${idx}`, {
          fontFamily: 'monospace', fontSize: '8px', color: '#666',
        });
      }
    }

    // Enable camera drag to scroll
    this.cameras.main.setBounds(0, 0, cols * cellSize + 16, rows * (cellSize + 12) + 40);
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (p.isDown) {
        this.cameras.main.scrollX -= p.velocity.x / 10;
        this.cameras.main.scrollY -= p.velocity.y / 10;
      }
    });
  }
}
