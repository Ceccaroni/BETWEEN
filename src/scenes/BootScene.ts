import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

/** Loads all initial assets and shows a minimal loading bar. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.createLoadingBar();

    // Branding
    this.load.image('ceccaroni-logo', 'assets/branding/ceccaroni-games.png');

    // Player spritesheet (8 cols x 13 rows, 40x32 per frame)
    this.load.spritesheet('player-blue', 'assets/characters/player/player-blue.png', {
      frameWidth: 40,
      frameHeight: 32,
    });

    // Machine tileset (37 cols x 23 rows, 32x32)
    this.load.image('machine-tileset', 'assets/tilesets/machine/tileset.png');

    // Props spritesheet (24 cols x 22 rows, 32x32)
    this.load.spritesheet('machine-props', 'assets/props/machine/props.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Projectiles (5 cols x 9 rows, 32x32)
    this.load.spritesheet('projectiles', 'assets/effects/projectiles/projectiles.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Audio — files are optional, missing files are silently skipped
    this.load.audio('title-theme', 'assets/audio/music/title-theme.mp3');
    this.load.audio('menu-select', 'assets/audio/sfx/menu-select.mp3');
    this.load.audio('menu-confirm', 'assets/audio/sfx/menu-confirm.mp3');

    // Ignore audio load errors (files may not exist yet)
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.warn(`Asset not found (skipped): ${file.key}`);
    });
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
