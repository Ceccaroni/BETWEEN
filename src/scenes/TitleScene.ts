import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';
import { AudioSystem } from '../systems/AudioSystem';

interface MenuItem {
  label: string;
  enabled: boolean;
  action: () => void;
}

/** Title screen with navigable menu, atmospheric effects, and music. */
export class TitleScene extends Phaser.Scene {
  private menuItems: MenuItem[] = [];
  private menuTexts: Phaser.GameObjects.Text[] = [];
  private arrow!: Phaser.GameObjects.Text;
  private selectedIndex = 0;
  private audio!: AudioSystem;
  private canInput = true;

  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#0a0a12');
    this.cameras.main.fadeIn(500);

    this.audio = new AudioSystem(this);
    this.audio.playMusic('title-theme', 2000);

    this.createVignette();
    this.createBackgroundParticles();
    this.createTitle();
    this.createMenu();
    this.createFooter();
    this.setupInput();
  }

  private createVignette(): void {
    const gfx = this.add.graphics();
    // Dark edges vignette
    gfx.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.7, 0.7, 0, 0);
    gfx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT / 3);
    gfx.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.7, 0.7);
    gfx.fillRect(0, GAME_HEIGHT * 2 / 3, GAME_WIDTH, GAME_HEIGHT / 3);
  }

  private createBackgroundParticles(): void {
    const gfx = this.add.graphics();
    gfx.fillStyle(0x6644cc, 1);
    gfx.fillCircle(4, 4, 4);
    gfx.generateTexture('particle-dot', 8, 8);
    gfx.destroy();

    this.add.particles(0, 0, 'particle-dot', {
      x: { min: 0, max: GAME_WIDTH },
      y: { min: 0, max: GAME_HEIGHT },
      lifespan: 6000,
      speed: { min: 5, max: 20 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.6, end: 0 },
      frequency: 200,
      blendMode: Phaser.BlendModes.ADD,
    });
  }

  private createTitle(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT * 0.28;

    const glow = this.add.text(cx, cy, 'BETWEEN', {
      fontFamily: 'monospace',
      fontSize: '80px',
      color: '#6644cc',
    }).setOrigin(0.5).setAlpha(0.4);

    const title = this.add.text(cx, cy, 'BETWEEN', {
      fontFamily: 'monospace',
      fontSize: '80px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: glow,
      alpha: { from: 0.2, to: 0.6 },
      scaleX: { from: 1.0, to: 1.05 },
      scaleY: { from: 1.0, to: 1.05 },
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: [title, glow],
      y: cy - 4,
      duration: 3000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private createMenu(): void {
    const cx = GAME_WIDTH / 2;
    const startY = GAME_HEIGHT * 0.52;
    const spacing = 42;

    this.menuItems = [
      { label: 'New Run', enabled: true, action: () => this.startGame() },
      { label: 'Continue', enabled: false, action: () => {} },
      { label: 'Settings', enabled: false, action: () => {} },
      { label: 'Credits', enabled: true, action: () => this.showCredits() },
    ];

    // Arrow indicator
    this.arrow = this.add.text(0, 0, '\u25b8', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Subtle arrow sway
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
        fontSize: '22px',
        color,
      }).setOrigin(0.5);

      this.menuTexts.push(text);
    });

    // Find first enabled item
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

    // Quick flash on selected text
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
        this.arrow.setPosition(text.x - text.width / 2 - 24, text.y);

        // Scale bounce
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
    this.audio.stopMusic(1000);

    // Brief screen flash
    this.cameras.main.flash(200, 100, 68, 204);
    this.time.delayedCall(200, () => {
      this.cameras.main.fadeOut(800, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene');
      });
    });
  }

  private showCredits(): void {
    this.audio.stopMusic(500);
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('CreditsScene');
    });
  }
}
