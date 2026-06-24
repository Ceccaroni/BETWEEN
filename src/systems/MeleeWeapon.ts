import Phaser from 'phaser';
import {
  ATTACK_DAMAGE,
  ATTACK_RANGE,
  ATTACK_ARC_DEG,
  ATTACK_DURATION_MS,
  ATTACK_COOLDOWN_MS,
  ATTACK_LUNGE_SPEED,
} from '../utils/Constants';
import type { Enemy } from '../entities/Enemy';

/** Anything the swing can knock out of the air (e.g. enemy projectiles). */
export interface Deflectable {
  x: number;
  y: number;
  active: boolean;
  deactivate(): void;
}

/**
 * Melee sword weapon: a cone-shaped swing toward an aim angle.
 * The swing angle locks at start, each enemy is damaged at most once per swing,
 * and the swing draws a sweeping slash arc, lunges the owner forward, and
 * shakes the camera when a hit lands. Owned by a scene, points at one sprite.
 */
export class MeleeWeapon {
  private readonly scene: Phaser.Scene;
  private readonly owner: Phaser.Physics.Arcade.Sprite;
  private readonly gfx: Phaser.GameObjects.Graphics;

  private swinging = false;
  private swingTimer = 0;
  private cooldownTimer = 0;
  private swingAngle = 0;
  private readonly hitThisSwing = new Set<Enemy>();

  constructor(scene: Phaser.Scene, owner: Phaser.Physics.Arcade.Sprite) {
    this.scene = scene;
    this.owner = owner;
    this.gfx = scene.add.graphics();
    this.gfx.setDepth(15);
  }

  /** True when a new swing may be started (not mid-swing, off cooldown). */
  canAttack(): boolean {
    return !this.swinging && this.cooldownTimer <= 0;
  }

  /** True while the swing's active hit window is open. */
  isActive(): boolean {
    return this.swinging;
  }

  /**
   * Starts a swing toward the given world angle.
   * @param angleRad Aim direction in radians (player → cursor).
   * @returns true if the swing started, false if blocked by cooldown.
   */
  tryAttack(angleRad: number): boolean {
    if (!this.canAttack()) return false;

    this.swinging = true;
    this.swingTimer = ATTACK_DURATION_MS;
    this.cooldownTimer = ATTACK_COOLDOWN_MS;
    this.swingAngle = angleRad;
    this.hitThisSwing.clear();

    // Forward lunge — commit weight to the swing (Hades-style).
    const body = this.owner.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(
      Math.cos(angleRad) * ATTACK_LUNGE_SPEED,
      Math.sin(angleRad) * ATTACK_LUNGE_SPEED
    );

    this.owner.play('player-attack', true);
    return true;
  }

  /**
   * Advances timers, resolves hits/deflects, and draws VFX.
   * Call every frame from the scene's update loop.
   * @param deflectables Projectiles the swing can slice out of the air.
   */
  update(delta: number, enemies: Enemy[], deflectables: Deflectable[] = []): void {
    if (this.cooldownTimer > 0) this.cooldownTimer -= delta;
    if (!this.swinging) return;

    this.swingTimer -= delta;
    const progress = 1 - Math.max(this.swingTimer, 0) / ATTACK_DURATION_MS;

    this.resolveHits(enemies);
    this.resolveDeflects(deflectables);
    this.drawArc(progress);

    if (this.swingTimer <= 0) {
      this.swinging = false;
      this.gfx.clear();
    }
  }

  /** Damages each in-cone enemy once per swing; shakes camera on any hit. */
  private resolveHits(enemies: Enemy[]): void {
    const halfArc = Phaser.Math.DegToRad(ATTACK_ARC_DEG / 2);
    let landed = false;

    for (const enemy of enemies) {
      if (!enemy.active || this.hitThisSwing.has(enemy)) continue;

      const dist = Phaser.Math.Distance.Between(this.owner.x, this.owner.y, enemy.x, enemy.y);
      if (dist > ATTACK_RANGE) continue;

      const toEnemy = Phaser.Math.Angle.Between(this.owner.x, this.owner.y, enemy.x, enemy.y);
      if (Math.abs(Phaser.Math.Angle.Wrap(toEnemy - this.swingAngle)) > halfArc) continue;

      this.hitThisSwing.add(enemy);
      enemy.takeDamage(ATTACK_DAMAGE, this.owner.x, this.owner.y);
      landed = true;
    }

    if (landed) this.scene.cameras.main.shake(70, 0.006);
  }

  /** Slices any in-cone projectile out of the air, once each. */
  private resolveDeflects(deflectables: Deflectable[]): void {
    if (deflectables.length === 0) return;
    const halfArc = Phaser.Math.DegToRad(ATTACK_ARC_DEG / 2);
    let deflected = false;

    for (const d of deflectables) {
      if (!d.active) continue;

      const dist = Phaser.Math.Distance.Between(this.owner.x, this.owner.y, d.x, d.y);
      if (dist > ATTACK_RANGE) continue;

      const toD = Phaser.Math.Angle.Between(this.owner.x, this.owner.y, d.x, d.y);
      if (Math.abs(Phaser.Math.Angle.Wrap(toD - this.swingAngle)) > halfArc) continue;

      this.spawnDeflectSpark(d.x, d.y);
      d.deactivate();
      deflected = true;
    }

    if (deflected) this.scene.cameras.main.shake(50, 0.004);
  }

  /** Cyan spark burst where a projectile was sliced. */
  private spawnDeflectSpark(x: number, y: number): void {
    const flash = this.scene.add.circle(x, y, 7, 0xbff7ff, 0.9).setDepth(21);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 2.2,
      duration: 140,
      onComplete: () => flash.destroy(),
    });
    for (let i = 0; i < 5; i++) {
      const s = this.scene.add.circle(x, y, Phaser.Math.Between(2, 3), 0xeaffff, 1).setDepth(21);
      this.scene.tweens.add({
        targets: s,
        x: x + Phaser.Math.Between(-22, 22),
        y: y + Phaser.Math.Between(-22, 22),
        alpha: 0,
        scale: 0,
        duration: Phaser.Math.Between(120, 220),
        onComplete: () => s.destroy(),
      });
    }
  }

  /** Draws the faint cone plus a bright blade edge sweeping across it. */
  private drawArc(progress: number): void {
    const halfArc = Phaser.Math.DegToRad(ATTACK_ARC_DEG / 2);
    const { x, y } = this.owner;
    const fade = 1 - progress;

    this.gfx.clear();

    // Faint filled cone showing the threatened wedge.
    this.gfx.fillStyle(0xffffff, 0.12 * fade);
    this.gfx.slice(x, y, ATTACK_RANGE, this.swingAngle - halfArc, this.swingAngle + halfArc, false);
    this.gfx.fillPath();

    // Bright leading edge sweeps from one side of the cone to the other.
    const edge = this.swingAngle - halfArc + progress * 2 * halfArc;
    this.gfx.lineStyle(4, 0xeaf6ff, 0.9 * fade);
    this.gfx.beginPath();
    this.gfx.moveTo(x, y);
    this.gfx.lineTo(x + Math.cos(edge) * ATTACK_RANGE, y + Math.sin(edge) * ATTACK_RANGE);
    this.gfx.strokePath();
  }

  /** Releases the VFX graphics object. */
  destroy(): void {
    this.gfx.destroy();
  }
}
