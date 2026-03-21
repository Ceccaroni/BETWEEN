import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Projectile } from '../entities/Projectile';
import { Door } from '../entities/Door';
import { InputSystem } from '../systems/InputSystem';
import { DungeonGenerator, RoomData } from '../systems/DungeonGenerator';
import { PropManager } from '../systems/PropManager';
import { ProjectilePool } from '../systems/ProjectilePool';
import { CombatManager } from '../systems/CombatManager';
import { RoomClearManager } from '../systems/RoomClearManager';
import { RunState, WallSide, oppositeSide } from '../systems/RunState';
import { Crosshair } from '../ui/Crosshair';
import { HUD } from '../ui/HUD';
import { createAfterimage } from '../effects/Afterimage';
import { TILE_DISPLAY, ROOM_W_TILES, ROOM_H_TILES } from '../utils/Constants';

/** Main gameplay scene: room lifecycle, player, combat, transitions. */
export class GameScene extends Phaser.Scene {
  // --- PERSISTENT (survive room transitions) ---
  private player!: Player;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private inputSystem!: InputSystem;
  private crosshair!: Crosshair;
  private projectilePool!: ProjectilePool;
  private hud!: HUD;
  private runState!: RunState;
  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private lastDirX = 0;
  private afterimageTimer = 0;

  // --- PER-ROOM (destroyed and rebuilt each room) ---
  private room!: RoomData;
  private combatManager!: CombatManager;
  private roomClearManager!: RoomClearManager;
  private exitDoor: Door | null = null;
  private roomProps: Phaser.GameObjects.GameObject[] = [];
  private roomColliders: Phaser.Physics.Arcade.Collider[] = [];
  private ambientEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private vignetteGfx: Phaser.GameObjects.Graphics | null = null;
  private isTransitioning = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#0a0a12');
    this.cameras.main.fadeIn(500);

    // Initialize run state
    this.runState = new RunState();

    // --- Persistent setup (once per run) ---
    this.createDustEmitter();

    // Player at room center for first room
    const spawnX = (ROOM_W_TILES * TILE_DISPLAY) / 2;
    const spawnY = (ROOM_H_TILES * TILE_DISPLAY) / 2;
    this.player = new Player(this, spawnX, spawnY);

    this.playerShadow = this.add.ellipse(0, 0, 28, 8, 0x000000, 0.35);
    this.playerShadow.setDepth(9);

    this.inputSystem = new InputSystem(this);
    this.crosshair = new Crosshair(this);
    this.projectilePool = new ProjectilePool(this);
    this.hud = new HUD(this);

    // Build first room
    this.buildRoom();

    // Listen for door transitions
    this.events.on('door-entered', (exitSide: WallSide) => {
      this.transitionToNextRoom(exitSide);
    });
  }

  update(_time: number, delta: number): void {
    if (this.isTransitioning) return;

    this.player.updateTimers(delta);

    const dir = this.inputSystem.getDirection();
    this.player.move(dir.x, dir.y);
    this.player.updateAnimation();

    // Mouse aiming
    this.crosshair.update();
    const pw = this.crosshair.getWorldPosition();
    this.player.faceMouse(pw.x, pw.y);

    // Dash input
    if (this.inputSystem.isDashPressed()) {
      if (this.player.dash(dir.x, dir.y)) {
        this.dustEmitter.emitParticleAt(this.player.x, this.player.y + 26, 10);
        this.afterimageTimer = 0;
      }
    }

    // Afterimage ghosts during dash (every 30ms)
    if (this.player.getIsDashing()) {
      this.afterimageTimer += delta;
      if (this.afterimageTimer >= 30) {
        this.afterimageTimer = 0;
        createAfterimage(this, this.player);
      }
    }

    // Shooting (blocked during dash)
    if (!this.player.getIsDashing() && this.inputSystem.isFireDown()) {
      const origin = this.player.getFireOrigin();
      const angle = Phaser.Math.Angle.Between(origin.x, origin.y, pw.x, pw.y);
      if (this.projectilePool.tryFire(origin.x, origin.y, angle)) {
        this.createMuzzleFlash(origin.x, origin.y);
        this.cameras.main.shake(50, 0.002);
      }
    }

    this.projectilePool.update();
    this.combatManager.update(delta);
    this.roomClearManager.update();
    this.hud.update(delta);

    // Shadow follows player feet
    this.playerShadow.setPosition(this.player.x, this.player.y + 26);

    const vx = this.player.body?.velocity.x ?? 0;
    const vy = this.player.body?.velocity.y ?? 0;
    const moving = Math.abs(vx) > 10 || Math.abs(vy) > 10;

    if (moving) {
      this.dustEmitter.emitParticleAt(
        this.player.x + Phaser.Math.Between(-6, 6),
        this.player.y + 26, 1
      );
    }

    if (dir.x !== 0 && dir.x !== this.lastDirX) {
      this.dustEmitter.emitParticleAt(this.player.x, this.player.y + 26, 5);
    }
    this.lastDirX = dir.x;
  }

  // ========== ROOM LIFECYCLE ==========

  /** Builds a new room: geometry, props, enemies, door, atmosphere. */
  private buildRoom(): void {
    const roomNum = this.runState.roomNumber;
    const entrySide = this.runState.lastExitSide
      ? oppositeSide(this.runState.lastExitSide)
      : null;
    const exitSide = this.pickExitSide(entrySide);

    // Generate room with wall gaps
    this.room = DungeonGenerator.createRoom(this, {
      entrySide,
      exitSide,
      proceduralObstacles: true,
      roomNumber: roomNum,
    });

    // Player-wall collision
    this.roomColliders.push(
      this.physics.add.collider(this.player, this.room.wallLayer)
    );

    // Props
    this.roomProps = PropManager.placeAll(this);

    // Projectile-wall collision
    this.roomColliders.push(
      this.physics.add.collider(
        this.projectilePool.getGroup(),
        this.room.wallLayer,
        (_proj) => {
          const p = _proj as Projectile;
          this.spawnWallImpact(p.x, p.y);
          p.deactivate();
        }
      )
    );

    // Combat system
    this.combatManager = new CombatManager(
      this,
      this.player,
      this.projectilePool,
      this.room.wallLayer,
      this.runState.playerHP
    );
    this.combatManager.spawnWave(roomNum);

    // Exit door (hidden until room clear)
    this.exitDoor = new Door(this, exitSide);

    // Door overlap with player (argument swap protection)
    this.roomColliders.push(
      this.physics.add.overlap(
        this.player,
        this.exitDoor,
        (objA, objB) => {
          const door = (objA === this.player ? objB : objA) as Door;
          door.playerEntered();
        }
      )
    );

    // Room clear manager (with door reference)
    this.roomClearManager = new RoomClearManager(this, this.combatManager, this.exitDoor);

    // Camera
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, this.room.widthPx, this.room.heightPx);

    // Atmosphere
    this.ambientEmitter = this.createAmbientParticles();
    this.vignetteGfx = this.createVignette();

    // Room indicator + HUD sync
    this.showRoomIndicator(roomNum);
    this.hud.setRoomNumber(roomNum, this.runState.totalRooms);
    this.hud.setHP(this.runState.playerHP);
  }

  /** Tears down all per-room objects, preserving persistent ones. */
  private teardownRoom(): void {
    // Safety: reset timeScale in case enemy death freeze-frame is active
    this.time.timeScale = 1;

    // Remove per-room event listeners
    this.events.off('room-cleared');

    // Combat cleanup (enemies, colliders, projectiles, listeners)
    this.combatManager.cleanup();

    // Clear player projectiles
    this.projectilePool.clearAll();

    // Destroy door
    if (this.exitDoor) {
      this.exitDoor.destroy();
      this.exitDoor = null;
    }

    // Destroy props
    PropManager.destroyAll(this.roomProps);
    this.roomProps = [];

    // Destroy room geometry
    DungeonGenerator.destroyRoom(this.room);

    // Destroy atmosphere
    if (this.ambientEmitter) {
      this.ambientEmitter.destroy();
      this.ambientEmitter = null;
    }
    if (this.vignetteGfx) {
      this.vignetteGfx.destroy();
      this.vignetteGfx = null;
    }

    // Destroy per-room colliders (player-wall, projectile-wall, door overlap)
    for (const c of this.roomColliders) {
      c.destroy();
    }
    this.roomColliders = [];
  }

  /** Handles the transition from current room to the next. */
  private transitionToNextRoom(exitSide: WallSide): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Save player HP
    this.runState.playerHP = this.combatManager.getPlayerHP();

    // Advance run state
    const entrySide = this.runState.advanceRoom(exitSide);

    // Check if run is complete
    if (this.runState.isRunComplete()) {
      this.cameras.main.fade(800, 255, 255, 255, false, (_cam: Phaser.Cameras.Scene2D.Camera, progress: number) => {
        if (progress >= 1) {
          this.scene.start('VictoryScene');
        }
      });
      return;
    }

    // Fade to black
    this.cameras.main.fade(400, 0, 0, 0, false, (_cam: Phaser.Cameras.Scene2D.Camera, progress: number) => {
      if (progress >= 1) {
        // Teardown old room
        this.teardownRoom();

        // Cancel any active dash/iframes
        this.player.cancelDash();

        // Reposition player at entry point
        const entryPos = Door.getEntryPosition(entrySide);
        this.player.setPosition(entryPos.x, entryPos.y);
        this.player.setVelocity(0, 0);

        // Build new room
        this.buildRoom();

        // Brief invulnerability on room entry
        this.player.startIFrames();

        // Fade in
        this.cameras.main.fadeIn(400);
        this.isTransitioning = false;
      }
    });
  }

  /** Picks a random exit side different from the entry side. */
  private pickExitSide(entrySide: WallSide | null): WallSide {
    const sides: WallSide[] = ['top', 'bottom', 'left', 'right'];
    const available = entrySide
      ? sides.filter((s) => s !== entrySide)
      : sides;
    return available[Phaser.Math.Between(0, available.length - 1)];
  }

  /** Shows a brief room number indicator. */
  private showRoomIndicator(roomNum: number): void {
    const isBoss = this.runState.isBossRoom();
    const label = isBoss ? 'BOSS ROOM' : `ROOM ${roomNum}`;
    const color = isBoss ? '#ff4444' : '#aaaaaa';

    const text = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 80,
      label,
      {
        fontFamily: 'monospace',
        fontSize: '32px',
        color,
        stroke: '#000000',
        strokeThickness: 4,
      }
    );
    text.setOrigin(0.5).setScrollFactor(0).setDepth(150).setAlpha(0);

    this.tweens.add({
      targets: text,
      alpha: 1,
      duration: 300,
      yoyo: true,
      hold: 1000,
      onComplete: () => text.destroy(),
    });
  }

  // ========== VFX HELPERS ==========

  /** Brief white flash at the fire origin. */
  private createMuzzleFlash(x: number, y: number): void {
    const flash = this.add.circle(x, y, 8, 0xffffff, 0.85);
    flash.setDepth(20);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.5,
      duration: 80,
      onComplete: () => flash.destroy(),
    });
  }

  /** Spark particles when a projectile hits a wall. */
  private spawnWallImpact(x: number, y: number): void {
    for (let i = 0; i < 4; i++) {
      const spark = this.add.circle(
        x, y, Phaser.Math.Between(2, 4), 0xffcc44, 1
      );
      spark.setDepth(20);
      this.tweens.add({
        targets: spark,
        x: x + Phaser.Math.Between(-20, 20),
        y: y + Phaser.Math.Between(-20, 20),
        alpha: 0,
        scale: 0,
        duration: Phaser.Math.Between(100, 200),
        onComplete: () => spark.destroy(),
      });
    }
  }

  /** Creates the persistent dust particle emitter. */
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

  /** Creates ambient floating motes (per-room, returned for cleanup). */
  private createAmbientParticles(): Phaser.GameObjects.Particles.ParticleEmitter {
    const gfx = this.add.graphics();
    gfx.fillStyle(0x556688, 1);
    gfx.fillCircle(2, 2, 2);
    gfx.generateTexture('ambient-mote', 4, 4);
    gfx.destroy();

    const emitter = this.add.particles(0, 0, 'ambient-mote', {
      x: { min: TILE_DISPLAY, max: (ROOM_W_TILES - 1) * TILE_DISPLAY },
      y: { min: TILE_DISPLAY, max: (ROOM_H_TILES - 1) * TILE_DISPLAY },
      speed: { min: 3, max: 8 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.25, end: 0 },
      lifespan: { min: 3000, max: 6000 },
      gravityY: -5,
      frequency: 500,
      quantity: 1,
    });
    emitter.setDepth(12);
    return emitter;
  }

  /** Creates dark-edge vignette overlay (per-room, returned for cleanup). */
  private createVignette(): Phaser.GameObjects.Graphics {
    const w = this.room.widthPx;
    const h = this.room.heightPx;
    const gfx = this.add.graphics();

    const steps = 8;
    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      const alpha = 0.15 * (1 - ratio);
      const inset = ratio * Math.min(w, h) * 0.35;
      gfx.fillStyle(0x000000, alpha);
      gfx.fillRect(0, 0, w, inset);
      gfx.fillRect(0, h - inset, w, inset);
      gfx.fillRect(0, 0, inset, h);
      gfx.fillRect(w - inset, 0, inset, h);
    }

    gfx.setDepth(100);
    gfx.setScrollFactor(0);
    return gfx;
  }
}
