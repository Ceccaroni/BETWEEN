import Phaser from 'phaser';
import { WallSide } from '../systems/RunState';
import { TILE_DISPLAY, ROOM_W_TILES, ROOM_H_TILES } from '../utils/Constants';

/**
 * Door sprite that appears in a wall gap after room clear.
 * ASSET-REGISTRY: door2-32x32-Sheet.png, 512×32, 32×32 cells, 16 frames
 * Frame 0 = closed, frame 15 = fully open.
 */
export class Door extends Phaser.Physics.Arcade.Sprite {
  private wallSide: WallSide;
  private isOpening = false;
  private isOpen = false;

  constructor(scene: Phaser.Scene, wallSide: WallSide) {
    const pos = Door.getDoorPosition(wallSide);
    super(scene, pos.x, pos.y, 'dap-door', 0);

    this.wallSide = wallSide;
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body

    this.setScale(2);
    this.setDepth(5);
    this.setActive(false);
    this.setVisible(false);

    // Wider trigger zone for easy overlap
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(28, 28);
    body.enable = false;

    this.createAnimations();
  }

  /** World position at the wall gap midpoint. */
  private static getDoorPosition(side: WallSide): { x: number; y: number } {
    const midX = Math.floor(ROOM_W_TILES / 2) * TILE_DISPLAY;     // tile 10 → 640
    const midY = Math.floor(ROOM_H_TILES / 2) * TILE_DISPLAY;     // tile 5  → 320
    const half = TILE_DISPLAY / 2;                                  // 32
    const W = ROOM_W_TILES * TILE_DISPLAY;                          // 1280
    const H = ROOM_H_TILES * TILE_DISPLAY;                          // 704
    switch (side) {
      case 'top':    return { x: midX, y: half };
      case 'bottom': return { x: midX, y: H - half };
      case 'left':   return { x: half, y: midY };
      case 'right':  return { x: W - half, y: midY };
    }
  }

  /** Returns the world position where the player should spawn when entering from this side. */
  static getEntryPosition(side: WallSide): { x: number; y: number } {
    const midX = Math.floor(ROOM_W_TILES / 2) * TILE_DISPLAY;
    const midY = Math.floor(ROOM_H_TILES / 2) * TILE_DISPLAY;
    const margin = TILE_DISPLAY * 2; // 2 tiles inward from the wall
    const W = ROOM_W_TILES * TILE_DISPLAY;
    const H = ROOM_H_TILES * TILE_DISPLAY;
    switch (side) {
      case 'top':    return { x: midX, y: margin };
      case 'bottom': return { x: midX, y: H - margin };
      case 'left':   return { x: margin, y: midY };
      case 'right':  return { x: W - margin, y: midY };
    }
  }

  /** Registers the door-open animation if not already present. */
  private createAnimations(): void {
    if (!this.scene.anims.exists('door-open')) {
      this.scene.anims.create({
        key: 'door-open',
        frames: this.scene.anims.generateFrameNumbers('dap-door', {
          start: 0,
          end: 15,
        }),
        frameRate: 16,
        repeat: 0,
      });
    }
  }

  /** Shows the door with a bounce-in tween (called after room clear). */
  reveal(): void {
    this.setActive(true);
    this.setVisible(true);
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.enable = true;

    // Bounce-in scale animation
    this.setScale(0);
    this.scene.tweens.add({
      targets: this,
      scaleX: 2,
      scaleY: 2,
      duration: 400,
      ease: 'Back.easeOut',
    });
  }

  /** Called when player overlaps — plays open animation, then emits transition event. */
  playerEntered(): void {
    if (this.isOpening || this.isOpen) return;
    this.isOpening = true;

    this.play('door-open');
    this.once('animationcomplete', () => {
      this.isOpen = true;
      this.scene.events.emit('door-entered', this.wallSide);
    });
  }

  /** Returns the wall side this door is placed on. */
  getWallSide(): WallSide {
    return this.wallSide;
  }
}
