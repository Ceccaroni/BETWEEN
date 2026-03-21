import Phaser from 'phaser';

/**
 * Custom crosshair replacing the OS cursor in GameScene.
 * Drawn procedurally as a thin cross with a center gap.
 */
export class Crosshair {
  private scene: Phaser.Scene;
  private gfx: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    scene.input.setDefaultCursor('none');

    this.gfx = scene.add.graphics();
    this.gfx.setDepth(200);
    this.gfx.setScrollFactor(0);
    this.drawCross();
  }

  /** Redraws the crosshair shape. */
  private drawCross(): void {
    const arm = 10;
    const gap = 3;
    this.gfx.clear();
    this.gfx.lineStyle(2, 0xffffff, 0.85);

    // Horizontal arms
    this.gfx.lineBetween(-arm, 0, -gap, 0);
    this.gfx.lineBetween(gap, 0, arm, 0);
    // Vertical arms
    this.gfx.lineBetween(0, -arm, 0, -gap);
    this.gfx.lineBetween(0, gap, 0, arm);

    // Center dot
    this.gfx.fillStyle(0xffffff, 0.9);
    this.gfx.fillCircle(0, 0, 1.5);
  }

  /** Call every frame to track pointer position. */
  update(): void {
    const p = this.scene.input.activePointer;
    this.gfx.setPosition(p.x, p.y);
  }

  /** Returns the crosshair position in world space. */
  getWorldPosition(): Phaser.Math.Vector2 {
    const p = this.scene.input.activePointer;
    return this.scene.cameras.main.getWorldPoint(p.x, p.y);
  }

  /** Cleanup. */
  destroy(): void {
    this.gfx.destroy();
  }
}
