import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { InputSystem } from '../systems/InputSystem';
import { DungeonGenerator, RoomData } from '../systems/DungeonGenerator';

/** Effective tile display size (32×2 = 64). */
const TILE_DISPLAY = 64;

/** Main gameplay scene: room + player + movement + camera. */
export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputSystem!: InputSystem;
  private room!: RoomData;
  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private lastDirX = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#0a0a12');
    this.cameras.main.fadeIn(500);

    // No camera zoom — tilemap layer scale handles magnification
    this.room = DungeonGenerator.createRoom(this);

    // Spawn player at room center
    this.player = new Player(this, this.room.spawnX, this.room.spawnY);

    // Player shadow (sized for Hero Wizard at WIZARD_SCALE 0.55)
    const shadow = this.add.ellipse(0, 0, 50, 14, 0x000000, 0.35);
    shadow.setDepth(9);
    this.player.setData('shadow', shadow);

    // Collision: player vs walls
    this.physics.add.collider(this.player, this.room.wallLayer);

    // Place animated props
    this.createProps();

    // Input system
    this.inputSystem = new InputSystem(this);

    // Camera: smooth follow, bounds = room
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, this.room.widthPx, this.room.heightPx);

    // Dust particles
    this.createDustEmitter();

  }

  update(): void {
    const dir = this.inputSystem.getDirection();
    this.player.move(dir.x, dir.y);
    this.player.updateAnimation();

    // Update shadow position
    const shadow = this.player.getData('shadow') as Phaser.GameObjects.Ellipse;
    shadow.setPosition(this.player.x, this.player.y + 50);

    const vx = this.player.body?.velocity.x ?? 0;
    const vy = this.player.body?.velocity.y ?? 0;
    const moving = Math.abs(vx) > 10 || Math.abs(vy) > 10;

    // Continuous dust trail while running
    if (moving) {
      this.dustEmitter.emitParticleAt(
        this.player.x + Phaser.Math.Between(-8, 8),
        this.player.y + 50,
        1
      );
    }

    // Burst on direction change
    if (dir.x !== 0 && dir.x !== this.lastDirX) {
      this.dustEmitter.emitParticleAt(this.player.x, this.player.y + 50, 5);
    }
    this.lastDirX = dir.x;
  }

  /** Places static props in the room (world coords = tile * 64). */
  private createProps(): void {
    // ASSET-REGISTRY: props and items x1.png, 768×704, 32×32 cells, 24×22 grid
    // Props are static single-frame sprites, scaled 2× to match tilemap

    const placeProp = (tileX: number, tileY: number, frame: number) => {
      const s = this.add.sprite(
        tileX * TILE_DISPLAY + TILE_DISPLAY / 2,
        tileY * TILE_DISPLAY + TILE_DISPLAY / 2,
        'machine-props', frame
      );
      s.setScale(2).setDepth(5);
      return s;
    };

    placeProp(3, 2, 48);   // Monitor (row 2, col 0)
    placeProp(16, 2, 144);  // Green tank (row 6, col 0)
    placeProp(3, 8, 96);   // Blue screen (row 4, col 0)
  }

  private createDustEmitter(): void {
    const gfx = this.add.graphics();
    gfx.fillStyle(0x888888, 1);
    gfx.fillCircle(3, 3, 3);
    gfx.generateTexture('dust-particle', 6, 6);
    gfx.destroy();

    this.dustEmitter = this.add.particles(0, 0, 'dust-particle', {
      speed: { min: 10, max: 30 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 400,
      gravityY: -20,
      emitting: false,
    });
    this.dustEmitter.setDepth(11);
  }
}
