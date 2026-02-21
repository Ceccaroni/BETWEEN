import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

/** Loads all initial assets and shows a minimal loading bar. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.createLoadingBar();

    // ASSET-REGISTRY: screen-splash.png, 2752×1536, single image
    this.load.image('screen-splash', 'assets/branding/screen-splash.png');
    // ASSET-REGISTRY: screen-title.png, 2752×1536, single image
    this.load.image('screen-title', 'assets/branding/screen-title.png');
    // ASSET-REGISTRY: screen-menu.png, 2752×1536, single image
    this.load.image('screen-menu', 'assets/branding/screen-menu.png');

    // ASSET-REGISTRY: player-blue.png, 320×416, 40×32 cells (Pupkin backup)
    this.load.spritesheet('player-blue', 'assets/characters/player/player-blue.png', {
      frameWidth: 40,
      frameHeight: 32,
    });

    // ASSET-REGISTRY: hero-wizard-idle.png, 2112×768, 352×384 cells, 6×2=12 frames — idle cycle
    this.load.spritesheet('hero-wizard-idle', 'assets/characters/hero-wizard/hero-wizard-idle.png', {
      frameWidth: 352,
      frameHeight: 384,
    });

    // ASSET-REGISTRY: hero-wizard-run.png, 2816×1536, 352×384 cells, 32 frames — run cycle
    this.load.spritesheet('hero-wizard-run', 'assets/characters/hero-wizard/hero-wizard-run.png', {
      frameWidth: 352,
      frameHeight: 384,
    });

    // ASSET-REGISTRY: enemies.png, 320×1216, 32×32 cells, 10 cols × 38 rows (Pack: 10x38 Cells)
    this.load.spritesheet('machine-enemies', 'assets/enemies/machine/enemies.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    // ASSET-REGISTRY: tileset.png, 1184×736, 32×32 tiles, 37 cols × 23 rows
    this.load.image('machine-tileset', 'assets/tilesets/machine/tileset.png');

    // ASSET-REGISTRY: props.png, 768×704, 32×32 cells, 24 cols × 22 rows (Pack: 24x22 Cells)
    this.load.spritesheet('machine-props', 'assets/props/machine/props.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    // ASSET-REGISTRY: projectiles.png, 160×288, 32×32 cells, 5 cols × 9 rows (Pack: 5x9 Cells)
    this.load.spritesheet('projectiles', 'assets/effects/projectiles/projectiles.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    // ASSET-REGISTRY: ui.png, 640×352, 32×32 cells, 20 cols × 11 rows (Pack: 20x11 Cells)
    this.load.spritesheet('machine-ui', 'assets/ui/machine/ui.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Audio
    this.load.audio('title-theme', 'assets/audio/music/title-theme.mp3');
    // menu-select.mp3 and menu-confirm.mp3 not yet created — add when available

    // Ignore load errors for optional assets
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
