import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';
import { AudioSystem } from '../systems/AudioSystem';

interface MenuItem {
  label: string;
  enabled: boolean;
  action: () => void;
}

/**
 * Main menu scene with navigable options.
 * Background is a placeholder for a custom-coded menu background (TypeScript/Phaser).
 */
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
    this.cameras.main.setBackgroundColor('#0a0a12');
    this.cameras.main.fadeIn(400);

    this.audio = new AudioSystem(this);

    this.createBackground();
    this.createMenu();
    this.createFooter();
    this.setupInput();
  }

  /** Placeholder background — replace with custom-coded menu background. */
  private createBackground(): void {
    // Vignette
    const gfx = this.add.graphics();
    gfx.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.7, 0.7, 0, 0);
    gfx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT / 3);
    gfx.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.7, 0.7);
    gfx.fillRect(0, GAME_HEIGHT * 2 / 3, GAME_WIDTH, GAME_HEIGHT / 3);

    // Subtle particles
    const dot = this.add.graphics();
    dot.fillStyle(0x6644cc, 1);
    dot.fillCircle(3, 3, 3);
    dot.generateTexture('menu-dot', 6, 6);
    dot.destroy();

    this.add.particles(0, 0, 'menu-dot', {
      x: { min: 0, max: GAME_WIDTH },
      y: { min: 0, max: GAME_HEIGHT },
      lifespan: 8000,
      speed: { min: 3, max: 12 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.4, end: 0 },
      frequency: 300,
      blendMode: Phaser.BlendModes.ADD,
    });

    // Small title at top
    this.add.text(GAME_WIDTH / 2, 80, 'BETWEEN', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#444444',
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
      const color = item.enabled ? '#888888' : '#333333';

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
      color: '#333333',
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
        text.setColor(enabled ? '#888888' : '#333333');
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
