import Phaser from 'phaser';
import { PLAYER_SPEED, DASH_DISTANCE, DASH_DURATION_MS, DASH_COOLDOWN_MS, IFRAME_DURATION_MS } from '../utils/Constants';

/**
 * Player character using DungeonAssetPack hero-warrior.
 * ASSET-REGISTRY: hero-warrior.png, 576×64, 64×64 cells, 9 frames
 * Frame layout: Idle 0-3, Run 4-6, Attack 7-8
 * 64×64 native matches tile display (32×32 at 2× scale) — no scaling needed.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  private wasMoving = false;

  // Dash state
  private isDashing = false;
  private dashTimer = 0;
  private dashCooldownTimer = 0;
  private dashVelX = 0;
  private dashVelY = 0;

  // Invulnerability state
  private invulnerable = false;
  private iframeTimer = 0;
  private iframeBlinkTimer = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hero-warrior');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    // 64×64 frame, visible char ~30×50 centered in lower portion
    // Body: chest-to-feet for 3/4-view collision
    this.setSize(24, 32);
    this.setOffset(20, 28);
    this.setDepth(10);

    this.createAnimations();
    this.play('player-idle');
  }

  /** Creates idle, run, and attack animations from hero-warrior sheet. */
  private createAnimations(): void {
    const anims = this.scene.anims;

    if (anims.exists('player-idle')) anims.remove('player-idle');
    if (anims.exists('player-run')) anims.remove('player-run');
    if (anims.exists('player-attack')) anims.remove('player-attack');

    anims.create({
      key: 'player-idle',
      frames: anims.generateFrameNumbers('hero-warrior', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
    });

    anims.create({
      key: 'player-run',
      frames: anims.generateFrameNumbers('hero-warrior', { start: 4, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: 'player-attack',
      frames: anims.generateFrameNumbers('hero-warrior', { start: 7, end: 8 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  /** Updates animation based on velocity (does NOT set flipX — faceMouse handles that). */
  updateAnimation(): void {
    if (this.isDashing) return; // Don't change anim during dash

    const vx = this.body?.velocity.x ?? 0;
    const vy = this.body?.velocity.y ?? 0;
    const moving = Math.abs(vx) > 10 || Math.abs(vy) > 10;

    if (moving && !this.wasMoving) {
      this.play('player-run');
    } else if (!moving && this.wasMoving) {
      this.play('player-idle');
    }

    this.wasMoving = moving;
  }

  /** Flips sprite horizontally to face the mouse cursor world position. */
  faceMouse(worldX: number, worldY: number): void {
    if (this.isDashing) return; // Don't flip during dash
    this.setFlipX(worldX < this.x);
  }

  /** Returns the muzzle point slightly in front of the player. */
  getFireOrigin(): { x: number; y: number } {
    const offsetX = this.flipX ? -18 : 18;
    return { x: this.x + offsetX, y: this.y + 4 };
  }

  /** Moves the player with normalized diagonal speed. */
  move(dirX: number, dirY: number): void {
    if (this.isDashing) return; // Dash overrides movement

    const len = Math.sqrt(dirX * dirX + dirY * dirY);
    if (len > 0) {
      this.setVelocity(
        (dirX / len) * PLAYER_SPEED,
        (dirY / len) * PLAYER_SPEED
      );
    } else {
      this.setVelocity(0, 0);
    }
  }

  /**
   * Initiates a dash in the given direction.
   * Returns true if dash started, false if on cooldown.
   */
  dash(dirX: number, dirY: number): boolean {
    if (this.isDashing || this.dashCooldownTimer > 0) return false;

    // Default to facing direction if no input
    let dx = dirX;
    let dy = dirY;
    if (dx === 0 && dy === 0) {
      dx = this.flipX ? -1 : 1;
    }

    const len = Math.sqrt(dx * dx + dy * dy);
    const speed = DASH_DISTANCE / (DASH_DURATION_MS / 1000);
    this.dashVelX = (dx / len) * speed;
    this.dashVelY = (dy / len) * speed;

    this.isDashing = true;
    this.dashTimer = DASH_DURATION_MS;
    this.startIFrames();

    this.setVelocity(this.dashVelX, this.dashVelY);
    this.play('player-run');

    return true;
  }

  /** Cancels any active dash and resets state (used on room transitions). */
  cancelDash(): void {
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashCooldownTimer = 0;
    this.invulnerable = false;
    this.iframeTimer = 0;
    this.setAlpha(1.0);
    this.setVelocity(0, 0);
  }

  /** Starts invulnerability frames (used by dash and on-hit). */
  startIFrames(): void {
    this.invulnerable = true;
    this.iframeTimer = IFRAME_DURATION_MS;
    this.iframeBlinkTimer = 0;
  }

  /** Returns true if the player is currently invulnerable. */
  getIsInvulnerable(): boolean {
    return this.invulnerable;
  }

  /** Returns true if the player is currently dashing. */
  getIsDashing(): boolean {
    return this.isDashing;
  }

  /** Must be called every frame from the scene's update. */
  updateTimers(delta: number): void {
    // Dash timer
    if (this.isDashing) {
      this.dashTimer -= delta;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
        this.dashCooldownTimer = DASH_COOLDOWN_MS;
        this.setVelocity(0, 0);
      }
    }

    // Dash cooldown
    if (this.dashCooldownTimer > 0) {
      this.dashCooldownTimer -= delta;
    }

    // I-frame timer + alpha blink
    if (this.invulnerable) {
      this.iframeTimer -= delta;
      this.iframeBlinkTimer += delta;

      // Blink alpha every 60ms
      if (this.iframeBlinkTimer >= 60) {
        this.iframeBlinkTimer = 0;
        this.setAlpha(this.alpha < 1 ? 1.0 : 0.3);
      }

      if (this.iframeTimer <= 0) {
        this.invulnerable = false;
        this.setAlpha(1.0);
      }
    }
  }
}
