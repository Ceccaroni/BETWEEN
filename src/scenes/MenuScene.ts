import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';
import { AudioSystem } from '../systems/AudioSystem';

interface MenuItem {
  label: string;
  enabled: boolean;
  action: () => void;
}

/** Liminal-style main menu with dust particles, scanlines, and keyboard navigation. */
export class MenuScene extends Phaser.Scene {
  private menuItems: MenuItem[] = [];
  private menuTexts: Phaser.GameObjects.Text[] = [];
  private arrow!: Phaser.GameObjects.Text;
  private selectedIndex = 0;
  private audio!: AudioSystem;
  private canInput = true;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    this.canInput = true;
    this.menuTexts = [];
    this.cameras.main.setBackgroundColor('#000000');
    this.cameras.main.fadeIn(400);

    this.audio = new AudioSystem(this);

    this.generateRuntimeAssets();
    this.createBackground();
    this.createMenu();
    this.createFooter();
    this.setupInput();
  }

  /** Generates runtime textures (no external assets needed). */
  private generateRuntimeAssets(): void {
    if (!this.textures.exists('dust')) {
      const gfx = this.add.graphics();
      gfx.fillStyle(0xffffff, 1);
      gfx.fillCircle(8, 8, 8);
      gfx.generateTexture('dust', 16, 16);
      gfx.destroy();
    }
  }

  /** Liminal background: gradient, dust particles, scanlines. */
  private createBackground(): void {
    // 1. Depth gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0a0a, 0x0a0a0a, 0x000000, 0x000000, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // 2. Liminal dust — extremely slow, almost invisible
    this.add.particles(0, 0, 'dust', {
      x: { min: 0, max: GAME_WIDTH },
      y: { min: 0, max: GAME_HEIGHT },
      lifespan: { min: 8000, max: 15000 },
      speedX: { min: -1, max: 1 },
      speedY: { min: -1, max: 1 },
      scale: { start: 0.01, end: 0.05 },
      alpha: { start: 0, end: 0.1 },
      frequency: 400,
      blendMode: Phaser.BlendModes.ADD,
    });

    // 3. Scanline overlay
    const lines = this.add.graphics();
    lines.lineStyle(1, 0xffffff, 0.02);
    for (let i = 0; i < GAME_HEIGHT; i += 4) {
      lines.lineBetween(0, i, GAME_WIDTH, i);
    }

    // Small dim title at top
    this.add.text(GAME_WIDTH / 2, 80, 'BETWEEN', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#222222',
    }).setOrigin(0.5);
  }

  private createMenu(): void {
    const cx = GAME_WIDTH / 2;
    const startY = GAME_HEIGHT * 0.38;
    const spacing = 48;

    this.menuItems = [
      { label: 'New Run', enabled: true, action: () => this.startGame() },
      { label: 'Continue', enabled: false, action: () => {} },
      { label: 'Settings', enabled: true, action: () => this.showSettings() },
      { label: 'Credits', enabled: true, action: () => this.showCredits() },
    ];

    this.arrow = this.add.text(0, 0, '\u25b8', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: this.arrow,
      x: '-=4',
      duration: 600,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    this.menuItems.forEach((item, i) => {
      const y = startY + i * spacing;
      const color = item.enabled ? '#666666' : '#222222';

      const text = this.add.text(cx, y, item.label, {
        fontFamily: 'monospace',
        fontSize: '24px',
        color,
      }).setOrigin(0.5);

      this.menuTexts.push(text);
    });

    this.selectedIndex = this.menuItems.findIndex(m => m.enabled);
    this.updateSelection();
  }

  private createFooter(): void {
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 40, 'Ceccaroni Games \u00b7 2025', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#1a1a1a',
    }).setOrigin(0.5);
  }

  private setupInput(): void {
    const kb = this.input.keyboard!;
    kb.on('keydown-UP', () => this.navigate(-1));
    kb.on('keydown-W', () => this.navigate(-1));
    kb.on('keydown-DOWN', () => this.navigate(1));
    kb.on('keydown-S', () => this.navigate(1));
    kb.on('keydown-ENTER', () => this.confirm());
    kb.on('keydown-SPACE', () => this.confirm());
  }

  private navigate(dir: number): void {
    if (!this.canInput) return;

    let next = this.selectedIndex;
    do {
      next += dir;
      if (next < 0) next = this.menuItems.length - 1;
      if (next >= this.menuItems.length) next = 0;
    } while (!this.menuItems[next].enabled && next !== this.selectedIndex);

    if (next !== this.selectedIndex) {
      this.selectedIndex = next;
      this.updateSelection();
      this.audio.playSFX('menu-select');
    }
  }

  private confirm(): void {
    if (!this.canInput) return;
    const item = this.menuItems[this.selectedIndex];
    if (!item.enabled) return;

    this.canInput = false;
    this.audio.playSFX('menu-confirm');

    this.tweens.add({
      targets: this.menuTexts[this.selectedIndex],
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 100,
      yoyo: true,
      onComplete: () => item.action(),
    });
  }

  private updateSelection(): void {
    this.menuTexts.forEach((text, i) => {
      const selected = i === this.selectedIndex;
      const enabled = this.menuItems[i].enabled;

      if (selected) {
        text.setColor('#ffffff');
        this.arrow.setPosition(text.x - text.width / 2 - 28, text.y);

        this.tweens.add({
          targets: text,
          scaleX: { from: 1.0, to: 1.05 },
          scaleY: { from: 1.0, to: 1.05 },
          duration: 150,
          yoyo: true,
          ease: 'Back.easeOut',
        });
      } else {
        text.setColor(enabled ? '#666666' : '#222222');
        text.setScale(1);
      }
    });
  }

  private startGame(): void {
    this.cameras.main.flash(200, 100, 68, 204);
    this.time.delayedCall(200, () => {
      this.cameras.main.fadeOut(800, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene');
      });
    });
  }

  private showCredits(): void {
    this.scene.start('CreditsScene');
  }

  private showSettings(): void {
    this.scene.start('SettingsScene');
  }
}
