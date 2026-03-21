import Phaser from 'phaser';
import { PROJECTILE_DAMAGE } from '../utils/Constants';

/** Knockback impulse speed in px/s. */
const KNOCKBACK_SPEED = 200;
/** Duration of knockback impulse in ms. */
const KNOCKBACK_MS = 100;
/** Duration of white flash on hit in ms. */
const FLASH_MS = 100;
/** Freeze-frame duration on kill in ms. */
const FREEZE_MS = 80;

/**
 * Abstract base class for all enemies.
 * Provides HP, damage handling, knockback, flash, death VFX.
 */
export abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
  protected hp: number;
  protected maxHp: number;
  protected contactDamage: number;
  protected moveSpeed: number;
  protected isStunned = false;
  private knockbackTimer = 0;
  private shadow!: Phaser.GameObjects.Ellipse;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    hp: number,
    contactDamage: number,
    moveSpeed: number
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp = hp;
    this.maxHp = hp;
    this.contactDamage = contactDamage;
    this.moveSpeed = moveSpeed;

    this.setDepth(10);
    this.setSize(24, 28);
    this.setOffset(20, 30);

    this.shadow = scene.add.ellipse(x, y, 20, 6, 0x000000, 0.3);
    this.shadow.setDepth(8);
  }

  /** Override in subclasses to implement movement/attack AI. */
  abstract updateAI(player: Phaser.Physics.Arcade.Sprite, delta: number): void;

  /** Ensures shadow is cleaned up on any destroy path. */
  override destroy(fromScene?: boolean): void {
    if (this.shadow) {
      this.shadow.destroy();
    }
    super.destroy(fromScene);
  }

  /** Called each frame — handles knockback timer and shadow. */
  updateEnemy(player: Phaser.Physics.Arcade.Sprite, delta: number): void {
    if (!this.active) return;

    if (this.knockbackTimer > 0) {
      this.knockbackTimer -= delta;
      if (this.knockbackTimer <= 0) {
        this.isStunned = false;
      }
    } else {
      this.updateAI(player, delta);
    }

    this.shadow.setPosition(this.x, this.y + 26);
  }

  /** Deals damage to this enemy, applies knockback and VFX. Returns true if killed. */
  takeDamage(amount: number, fromX: number, fromY: number): boolean {
    if (!this.active) return false;

    this.hp -= amount;
    this.flashWhite();
    this.applyKnockback(fromX, fromY);
    this.spawnHurtVFX();

    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  /** Returns contact damage value. */
  getContactDamage(): number {
    return this.contactDamage;
  }

  /** White tint flash on hit. */
  private flashWhite(): void {
    this.setTintFill(0xffffff);
    window.setTimeout(() => {
      if (this.active) this.clearTint();
    }, FLASH_MS);
  }

  /** Pushes enemy away from damage source. */
  private applyKnockback(fromX: number, fromY: number): void {
    const angle = Phaser.Math.Angle.Between(fromX, fromY, this.x, this.y);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(
      Math.cos(angle) * KNOCKBACK_SPEED,
      Math.sin(angle) * KNOCKBACK_SPEED
    );
    this.isStunned = true;
    this.knockbackTimer = KNOCKBACK_MS;
  }

  /** Plays hurt VFX sprite at enemy position. */
  private spawnHurtVFX(): void {
    const vfx = this.scene.add.sprite(this.x, this.y, 'vfx-hurt', 0);
    vfx.setDepth(20);

    if (!this.scene.anims.exists('vfx-hurt-play')) {
      this.scene.anims.create({
        key: 'vfx-hurt-play',
        frames: this.scene.anims.generateFrameNumbers('vfx-hurt', { start: 0, end: 9 }),
        frameRate: 20,
        repeat: 0,
      });
    }

    vfx.play('vfx-hurt-play');
    vfx.once('animationcomplete', () => vfx.destroy());
  }

  /** Death sequence: freeze-frame, dissolve, particles. */
  private die(): void {
    const scene = this.scene;

    // Hitstop: brief real-time pause via window.setTimeout (immune to timeScale)
    scene.time.timeScale = 0.05;
    window.setTimeout(() => {
      scene.time.timeScale = 1;
    }, FREEZE_MS);

    // Death particles
    this.spawnDeathParticles();

    // Dissolve tween (starts after hitstop restores timeScale)
    scene.tweens.add({
      targets: this,
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.destroy();
      },
    });

    // Stop physics
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.enable = false;
    this.setActive(false);
  }

  /** Burst of colored particles on death. */
  private spawnDeathParticles(): void {
    const colors = [0x44ff88, 0x88ffaa, 0x22cc66];
    for (let i = 0; i < 12; i++) {
      const color = colors[i % colors.length];
      const particle = this.scene.add.circle(
        this.x, this.y,
        Phaser.Math.Between(2, 5),
        color, 1
      );
      particle.setDepth(20);
      this.scene.tweens.add({
        targets: particle,
        x: this.x + Phaser.Math.Between(-30, 30),
        y: this.y + Phaser.Math.Between(-30, 30),
        alpha: 0,
        scale: 0,
        duration: Phaser.Math.Between(200, 400),
        onComplete: () => particle.destroy(),
      });
    }
  }
}
