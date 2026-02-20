import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { InputSystem } from '../systems/InputSystem';
import { DungeonGenerator, RoomData } from '../systems/DungeonGenerator';

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

    // Generate room
    this.room = DungeonGenerator.createRoom(this);

    // Spawn player at room center
    this.player = new Player(this, this.room.spawnX, this.room.spawnY);

    // Player shadow
    const shadow = this.add.ellipse(0, 0, 18, 8, 0x000000, 0.35);
    this.player.setData('shadow', shadow);

    // Collision: player vs walls
    this.physics.add.collider(this.player, this.room.wallLayer);

    // Input system
    this.inputSystem = new InputSystem(this);

    // Camera: smooth follow with bounds
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, this.room.widthPx, this.room.heightPx);

    // Dust particles for direction changes
    this.createDustEmitter();
  }

  update(): void {
    const dir = this.inputSystem.getDirection();
    this.player.move(dir.x, dir.y);
    this.player.updateAnimation();

    // Update shadow position
    const shadow = this.player.getData('shadow') as Phaser.GameObjects.Ellipse;
    shadow.setPosition(this.player.x, this.player.y + 12);

    // Emit dust on direction change
    if (dir.x !== 0 && dir.x !== this.lastDirX) {
      this.dustEmitter.emitParticleAt(this.player.x, this.player.y + 10, 3);
    }
    this.lastDirX = dir.x;
  }

  private createDustEmitter(): void {
    const gfx = this.add.graphics();
    gfx.fillStyle(0x888888, 1);
    gfx.fillCircle(2, 2, 2);
    gfx.generateTexture('dust-particle', 4, 4);
    gfx.destroy();

    this.dustEmitter = this.add.particles(0, 0, 'dust-particle', {
      speed: { min: 10, max: 30 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 400,
      gravityY: -20,
      emitting: false,
    });
  }
}
