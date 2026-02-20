import Phaser from 'phaser';

/** Empty sandbox scene for prototyping new features. */
export class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TestScene' });
  }

  create(): void {
    this.add.text(16, 16, 'TestScene — Sandbox', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#444444',
    });
  }
}
