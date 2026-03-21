import Phaser from 'phaser';

/** Effective tile display size (32×2 = 64). */
const TD = 64;

/** Animated prop definition. */
interface AnimPropDef {
  tileX: number;
  tileY: number;
  key: string;
  animKey: string;
  depth: number;
}

/** Machine-prop definition (Pupkin spritesheet frame). */
interface MachinePropDef {
  tileX: number;
  tileY: number;
  frame: number;
}

/** Static prop definition. */
interface StaticPropDef {
  tileX: number;
  tileY: number;
  key: string;
  depth: number;
}

// --- Prop Placement Data ---

const MACHINE_PROPS: MachinePropDef[] = [
  { tileX: 3, tileY: 2, frame: 48 },    // Monitor
  { tileX: 16, tileY: 2, frame: 144 },   // Green tank
  { tileX: 3, tileY: 8, frame: 96 },     // Blue screen
];

const STATIC_PROPS: StaticPropDef[] = [
  { tileX: 2, tileY: 2, key: 'dap-cargo-box', depth: 3 },
  { tileX: 17, tileY: 9, key: 'dap-cargo-box', depth: 3 },
  { tileX: 2, tileY: 9, key: 'dap-barrel', depth: 3 },
  { tileX: 17, tileY: 2, key: 'dap-barrel', depth: 3 },
];

const ANIM_PROPS: AnimPropDef[] = [
  { tileX: 10, tileY: 5, key: 'dap-bonfire', animKey: 'bonfire-burn', depth: 4 },
  { tileX: 5, tileY: 2, key: 'dap-candle', animKey: 'candle-flicker', depth: 4 },
  { tileX: 14, tileY: 2, key: 'dap-candle', animKey: 'candle-flicker', depth: 4 },
  { tileX: 5, tileY: 8, key: 'dap-candle2', animKey: 'candle2-flicker', depth: 4 },
  { tileX: 14, tileY: 8, key: 'dap-candle2', animKey: 'candle2-flicker', depth: 4 },
  { tileX: 10, tileY: 2, key: 'dap-chest', animKey: 'chest-idle', depth: 4 },
];

/** Manages prop placement and animations for dungeon rooms. */
export class PropManager {
  /** Registers all prop animations. Call once per scene. */
  static registerAnimations(scene: Phaser.Scene): void {
    const a = scene.anims;

    if (!a.exists('bonfire-burn')) {
      a.create({
        key: 'bonfire-burn',
        frames: a.generateFrameNumbers('dap-bonfire', { start: 0, end: 7 }),
        frameRate: 8, repeat: -1,
      });
    }
    if (!a.exists('candle-flicker')) {
      a.create({
        key: 'candle-flicker',
        frames: a.generateFrameNumbers('dap-candle', { start: 0, end: 7 }),
        frameRate: 8, repeat: -1,
      });
    }
    if (!a.exists('candle2-flicker')) {
      a.create({
        key: 'candle2-flicker',
        frames: a.generateFrameNumbers('dap-candle2', { start: 0, end: 7 }),
        frameRate: 8, repeat: -1,
      });
    }
    if (!a.exists('chest-idle')) {
      a.create({
        key: 'chest-idle',
        frames: a.generateFrameNumbers('dap-chest', { start: 0, end: 0 }),
        frameRate: 1, repeat: -1,
      });
    }
  }

  /** Places all props in the room. Returns array for cleanup. */
  static placeAll(scene: Phaser.Scene): Phaser.GameObjects.GameObject[] {
    PropManager.registerAnimations(scene);
    const created: Phaser.GameObjects.GameObject[] = [];

    for (const p of MACHINE_PROPS) {
      const s = scene.add.sprite(
        p.tileX * TD + TD / 2, p.tileY * TD + TD / 2,
        'machine-props', p.frame
      );
      s.setScale(2).setDepth(5);
      created.push(s);
    }

    for (const p of STATIC_PROPS) {
      const s = scene.add.image(
        p.tileX * TD + TD / 2, p.tileY * TD + TD / 2, p.key
      );
      s.setScale(2).setDepth(p.depth);
      created.push(s);
    }

    for (const p of ANIM_PROPS) {
      const s = scene.add.sprite(
        p.tileX * TD + TD / 2, p.tileY * TD + TD / 2, p.key
      );
      s.setScale(2).setDepth(p.depth);
      s.play(p.animKey);
      created.push(s);
    }

    return created;
  }

  /** Destroys all props created by placeAll(). */
  static destroyAll(props: Phaser.GameObjects.GameObject[]): void {
    for (const p of props) {
      p.destroy();
    }
  }
}
