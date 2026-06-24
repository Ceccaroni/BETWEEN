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

    // --- Hero Wizard (backup, commented out for hero-warrior swap) ---
    // ASSET-REGISTRY: hero-wizard-idle.png, 2112×768, 352×384 cells, 12 frames
    // this.load.spritesheet('hero-wizard-idle', 'assets/characters/hero-wizard/hero-wizard-idle.png', {
    //   frameWidth: 352, frameHeight: 384,
    // });
    // ASSET-REGISTRY: hero-wizard-run.png, 2816×1536, 352×384 cells, 32 frames
    // this.load.spritesheet('hero-wizard-run', 'assets/characters/hero-wizard/hero-wizard-run.png', {
    //   frameWidth: 352, frameHeight: 384,
    // });

    // ASSET-REGISTRY: hero-warrior.png, 576×64, 64×64 cells, 9 frames (Idle 0-3, Run 4-6, Attack 7-8)
    this.load.spritesheet('hero-warrior', 'assets/packs/dungeon-asset-pack/hero/hero-warrior.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    // --- DungeonAssetPack Props ---
    // ASSET-REGISTRY: bonfire-32x32-Sheet.png, 256×32, 32×32 cells, 8 frames
    this.load.spritesheet('dap-bonfire', 'assets/packs/dungeon-asset-pack/props/bonfire-32x32-Sheet.png', {
      frameWidth: 32, frameHeight: 32,
    });
    // ASSET-REGISTRY: candle-32x32-Sheet.png, 256×32, 32×32 cells, 8 frames
    this.load.spritesheet('dap-candle', 'assets/packs/dungeon-asset-pack/props/candle-32x32-Sheet.png', {
      frameWidth: 32, frameHeight: 32,
    });
    // ASSET-REGISTRY: candle2-32x32-Sheet.png, 256×32, 32×32 cells, 8 frames (copied from candle#2)
    this.load.spritesheet('dap-candle2', 'assets/packs/dungeon-asset-pack/props/candle2-32x32-Sheet.png', {
      frameWidth: 32, frameHeight: 32,
    });
    // ASSET-REGISTRY: chest-32x32-Sheet.png, 320×32, 32×32 cells, 10 frames
    this.load.spritesheet('dap-chest', 'assets/packs/dungeon-asset-pack/props/chest-32x32-Sheet.png', {
      frameWidth: 32, frameHeight: 32,
    });
    // ASSET-REGISTRY: cargo_box.png, 32×32, static
    this.load.image('dap-cargo-box', 'assets/packs/dungeon-asset-pack/props/cargo_box.png');
    // ASSET-REGISTRY: wooden-barrel.png, 32×32, static (copied from "wooden barrel.png")
    this.load.image('dap-barrel', 'assets/packs/dungeon-asset-pack/props/wooden-barrel.png');

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

    // --- DungeonAssetPack Enemies ---
    // ASSET-REGISTRY: Green_mucus-64x64-Sheet.png, 512×64, 64×64 cells, 8 frames
    this.load.spritesheet('enemy-drone', 'assets/packs/dungeon-asset-pack/enemies/Green_mucus-64x64-Sheet.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    // ASSET-REGISTRY: Witch_64x64-Sheet.png, 512×64, 64×64 cells, 8 frames
    this.load.spritesheet('enemy-turret', 'assets/packs/dungeon-asset-pack/enemies/Witch_64x64-Sheet.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    // --- DungeonAssetPack Doors ---
    // ASSET-REGISTRY: door2-32x32-Sheet.png, 512×32, 32×32 cells, 16 frames
    this.load.spritesheet('dap-door', 'assets/packs/dungeon-asset-pack/props/door2-32x32-Sheet.png', {
      frameWidth: 32, frameHeight: 32,
    });

    // --- DungeonAssetPack VFX ---
    // ASSET-REGISTRY: hurt_vfx64x64-Sheet.png, 640×64, 64×64 cells, 10 frames
    this.load.spritesheet('vfx-hurt', 'assets/packs/dungeon-asset-pack/vfx/hurt_vfx64x64-Sheet.png', {
      frameWidth: 64,
      frameHeight: 64,
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
    const params = new URLSearchParams(window.location.search);
    if (params.get('scene') === 'tileset') {
      this.scene.start('TilesetViewer');
      return;
    }
    if (params.get('scene') === 'melee') {
      this.scene.start('MeleeTestScene');
      return;
    }
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
