import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants';

type SettingsTab = 'sound' | 'game' | 'player';

interface SliderData {
  label: string;
  key: string;
  value: number;
  bar: Phaser.GameObjects.Rectangle;
  fill: Phaser.GameObjects.Rectangle;
  valueText: Phaser.GameObjects.Text;
}

/** Settings scene with Sound, Game, and Player tabs. */
export class SettingsScene extends Phaser.Scene {
  private leaving = false;
  private currentTab: SettingsTab = 'sound';
  private tabTexts: Map<SettingsTab, Phaser.GameObjects.Text> = new Map();
  private contentContainer!: Phaser.GameObjects.Container;
  private sliders: SliderData[] = [];
  private selectedSlider = 0;

  /** Persisted settings values. */
  private static settings: Record<string, number> = {
    musicVolume: 40,
    sfxVolume: 60,
    screenShake: 100,
    particleIntensity: 100,
    playerColor: 0,
  };

  constructor() {
    super({ key: 'SettingsScene' });
  }

  create(): void {
    this.leaving = false;
    this.cameras.main.setBackgroundColor('#0a0a12');
    this.cameras.main.fadeIn(300);

    this.createHeader();
    this.createTabs();
    this.contentContainer = this.add.container(0, 0);
    this.showTab('sound');
    this.createFooter();
    this.setupInput();
  }

  private createHeader(): void {
    this.add.text(GAME_WIDTH / 2, 50, 'SETTINGS', {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: '#ffffff',
    }).setOrigin(0.5);
  }

  private createTabs(): void {
    const tabs: SettingsTab[] = ['sound', 'game', 'player'];
    const labels: Record<SettingsTab, string> = {
      sound: 'Sound',
      game: 'Game',
      player: 'Player',
    };
    const startX = GAME_WIDTH / 2 - 150;
    const y = 110;

    tabs.forEach((tab, i) => {
      const text = this.add.text(startX + i * 150, y, labels[tab], {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#666666',
      }).setOrigin(0.5);
      this.tabTexts.set(tab, text);
    });
  }

  private showTab(tab: SettingsTab): void {
    this.currentTab = tab;
    this.sliders = [];
    this.selectedSlider = 0;
    this.contentContainer.removeAll(true);

    // Update tab highlight
    this.tabTexts.forEach((text, key) => {
      text.setColor(key === tab ? '#ffffff' : '#666666');
    });

    const s = SettingsScene.settings;

    if (tab === 'sound') {
      this.createSlider('Music Volume', 'musicVolume', s.musicVolume, 0);
      this.createSlider('SFX Volume', 'sfxVolume', s.sfxVolume, 1);
    } else if (tab === 'game') {
      this.createSlider('Screen Shake', 'screenShake', s.screenShake, 0);
      this.createSlider('Particle Intensity', 'particleIntensity', s.particleIntensity, 1);
    } else if (tab === 'player') {
      this.createColorPicker(s.playerColor);
    }

    this.updateSliderHighlight();
  }

  private createSlider(label: string, key: string, value: number, index: number): void {
    const cx = GAME_WIDTH / 2;
    const y = 180 + index * 80;
    const barWidth = 300;
    const barHeight = 12;

    const labelText = this.add.text(cx, y, label, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#888888',
    }).setOrigin(0.5);
    this.contentContainer.add(labelText);

    const barX = cx - barWidth / 2;
    const barY = y + 28;

    const bar = this.add.rectangle(cx, barY, barWidth, barHeight, 0x333333)
      .setOrigin(0.5);
    this.contentContainer.add(bar);

    const fillWidth = (value / 100) * barWidth;
    const fill = this.add.rectangle(
      barX, barY, fillWidth, barHeight, 0x6644cc
    ).setOrigin(0, 0.5);
    this.contentContainer.add(fill);

    const valueText = this.add.text(cx + barWidth / 2 + 20, barY, `${value}%`, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#888888',
    }).setOrigin(0, 0.5);
    this.contentContainer.add(valueText);

    this.sliders.push({ label, key, value, bar, fill, valueText });
  }

  private createColorPicker(colorIndex: number): void {
    const cx = GAME_WIDTH / 2;
    const y = 200;

    const label = this.add.text(cx, y, 'Player Color', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#888888',
    }).setOrigin(0.5);
    this.contentContainer.add(label);

    const colors = ['Blue', 'Red', 'Green', 'Grey'];
    const hexColors = [0x4488ff, 0xff4444, 0x44cc44, 0x999999];

    colors.forEach((name, i) => {
      const x = cx - 120 + i * 80;
      const selected = i === colorIndex;

      const swatch = this.add.rectangle(x, y + 40, 32, 32, hexColors[i])
        .setStrokeStyle(selected ? 3 : 1, selected ? 0xffffff : 0x444444);
      this.contentContainer.add(swatch);

      const nameText = this.add.text(x, y + 66, name, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: selected ? '#ffffff' : '#666666',
      }).setOrigin(0.5);
      this.contentContainer.add(nameText);
    });

    // Use slider array for navigation compatibility
    this.sliders.push({
      label: 'Player Color',
      key: 'playerColor',
      value: colorIndex,
      bar: this.add.rectangle(0, 0, 0, 0).setVisible(false),
      fill: this.add.rectangle(0, 0, 0, 0).setVisible(false),
      valueText: this.add.text(0, 0, '').setVisible(false),
    });
  }

  private createFooter(): void {
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 50,
      'LEFT/RIGHT: adjust  |  W/S: select  |  Q/E: tab  |  ESC: back', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#444444',
      }).setOrigin(0.5);
  }

  private setupInput(): void {
    const kb = this.input.keyboard!;

    kb.on('keydown-ESC', () => this.goBack());
    kb.on('keydown-BACKSPACE', () => this.goBack());
    kb.on('keydown-UP', () => this.selectSlider(-1));
    kb.on('keydown-W', () => this.selectSlider(-1));
    kb.on('keydown-DOWN', () => this.selectSlider(1));
    kb.on('keydown-S', () => this.selectSlider(1));
    kb.on('keydown-LEFT', () => this.adjustValue(-5));
    kb.on('keydown-A', () => this.adjustValue(-5));
    kb.on('keydown-RIGHT', () => this.adjustValue(5));
    kb.on('keydown-D', () => this.adjustValue(5));
    kb.on('keydown-Q', () => this.switchTab(-1));
    kb.on('keydown-E', () => this.switchTab(1));
  }

  private selectSlider(dir: number): void {
    if (this.sliders.length === 0) return;
    this.selectedSlider = Phaser.Math.Clamp(
      this.selectedSlider + dir, 0, this.sliders.length - 1
    );
    this.updateSliderHighlight();
  }

  private adjustValue(delta: number): void {
    const slider = this.sliders[this.selectedSlider];
    if (!slider) return;

    if (slider.key === 'playerColor') {
      const colors = 4;
      slider.value = Phaser.Math.Clamp(slider.value + Math.sign(delta), 0, colors - 1);
      SettingsScene.settings[slider.key] = slider.value;
      this.showTab(this.currentTab);
      return;
    }

    slider.value = Phaser.Math.Clamp(slider.value + delta, 0, 100);
    SettingsScene.settings[slider.key] = slider.value;

    const barWidth = 300;
    slider.fill.width = (slider.value / 100) * barWidth;
    slider.valueText.setText(`${slider.value}%`);
  }

  private switchTab(dir: number): void {
    const tabs: SettingsTab[] = ['sound', 'game', 'player'];
    const idx = tabs.indexOf(this.currentTab);
    const next = Phaser.Math.Clamp(idx + dir, 0, tabs.length - 1);
    if (next !== idx) this.showTab(tabs[next]);
  }

  private updateSliderHighlight(): void {
    this.sliders.forEach((s, i) => {
      const active = i === this.selectedSlider;
      if (s.bar.visible) {
        s.bar.setStrokeStyle(active ? 2 : 0, 0x6644cc);
      }
    });
  }

  private goBack(): void {
    if (this.leaving) return;
    this.leaving = true;
    this.scene.start('TitleScene');
  }

  /** Get a setting value from anywhere. */
  static getSetting(key: string): number {
    return SettingsScene.settings[key] ?? 0;
  }
}
