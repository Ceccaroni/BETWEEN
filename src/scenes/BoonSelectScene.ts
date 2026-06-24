import Phaser from 'phaser';
import { Boon } from '../systems/Boon';

/** Launch data: the offered boons and a callback for the chosen one. */
export interface BoonSelectData {
  choices: Boon[];
  onPick: (boon: Boon) => void;
}

/**
 * Modal overlay shown after a room clear. Runs on top of the paused gameplay
 * scene, offers 3 boon cards, and calls back with the chosen one.
 * Pick with 1/2/3, ←/→ + Enter, or click.
 */
export class BoonSelectScene extends Phaser.Scene {
  private choices: Boon[] = [];
  private onPick!: (boon: Boon) => void;
  private selected = 0;
  private picked = false;
  private cardBgs: Phaser.GameObjects.Rectangle[] = [];

  constructor() {
    super({ key: 'BoonSelectScene' });
  }

  init(data: BoonSelectData): void {
    this.choices = data.choices;
    this.onPick = data.onPick;
    this.selected = 0;
    this.picked = false;
    this.cardBgs = [];
  }

  create(): void {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x05070d, 0.82).setDepth(0);
    this.add
      .text(w / 2, h / 2 - 220, 'WÄHLE EINEN BOON', {
        fontFamily: 'monospace', fontSize: '34px', color: '#ffcc22', stroke: '#000000', strokeThickness: 5,
      })
      .setOrigin(0.5).setDepth(1);
    this.add
      .text(w / 2, h / 2 - 178, '1 / 2 / 3   ·   ← →   ·   Enter   ·   Klick', {
        fontFamily: 'monospace', fontSize: '14px', color: '#7d8aa0',
      })
      .setOrigin(0.5).setDepth(1);

    const cardW = 320;
    const cardH = 380;
    const gap = 40;
    const total = this.choices.length * cardW + (this.choices.length - 1) * gap;
    const startX = (w - total) / 2 + cardW / 2;
    const cy = h / 2 + 24;

    this.choices.forEach((boon, i) => {
      const cx = startX + i * (cardW + gap);
      const bg = this.add
        .rectangle(cx, cy, cardW, cardH, 0x141a26, 1)
        .setStrokeStyle(3, 0x2c3650)
        .setDepth(1)
        .setInteractive({ useHandCursor: true });
      this.add.text(cx, cy - cardH / 2 + 34, `${i + 1}`, {
        fontFamily: 'monospace', fontSize: '26px', color: '#5b6680',
      }).setOrigin(0.5).setDepth(2);
      this.add.text(cx, cy - 36, boon.name, {
        fontFamily: 'monospace', fontSize: '22px', color: '#eaf0fb', align: 'center', wordWrap: { width: cardW - 40 },
      }).setOrigin(0.5).setDepth(2);
      this.add.text(cx, cy + 36, boon.desc, {
        fontFamily: 'monospace', fontSize: '15px', color: '#aeb9cf', align: 'center', wordWrap: { width: cardW - 44 },
      }).setOrigin(0.5).setDepth(2);

      bg.on('pointerover', () => { this.selected = i; this.refresh(); });
      bg.on('pointerdown', () => this.pick(i));
      this.cardBgs.push(bg);
    });

    this.bindKeys();
    this.refresh();
  }

  /** Wires number / arrow / confirm keys. */
  private bindKeys(): void {
    const kb = this.input.keyboard!;
    kb.on('keydown-ONE', () => this.pick(0));
    kb.on('keydown-TWO', () => this.pick(1));
    kb.on('keydown-THREE', () => this.pick(2));
    kb.on('keydown-LEFT', () => this.move(-1));
    kb.on('keydown-A', () => this.move(-1));
    kb.on('keydown-RIGHT', () => this.move(1));
    kb.on('keydown-D', () => this.move(1));
    kb.on('keydown-ENTER', () => this.pick(this.selected));
    kb.on('keydown-SPACE', () => this.pick(this.selected));
  }

  /** Moves the highlighted card by the given step, wrapping around. */
  private move(step: number): void {
    const n = this.choices.length;
    this.selected = (this.selected + step + n) % n;
    this.refresh();
  }

  /** Updates card highlight to match the selected index. */
  private refresh(): void {
    this.cardBgs.forEach((bg, i) => {
      const on = i === this.selected;
      bg.setStrokeStyle(on ? 4 : 3, on ? 0xffcc22 : 0x2c3650);
      bg.setFillStyle(on ? 0x1d2738 : 0x141a26, 1);
      bg.setScale(on ? 1.04 : 1);
    });
  }

  /** Confirms a choice, fires the callback, and closes the overlay. */
  private pick(i: number): void {
    if (this.picked || i < 0 || i >= this.choices.length) return;
    this.picked = true;
    this.onPick(this.choices[i]);
    this.scene.stop();
  }
}
