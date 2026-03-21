import Phaser from 'phaser';
import { CombatManager } from './CombatManager';
import { Door } from '../entities/Door';

/** Duration of slow-mo reward on room clear (real ms). */
const SLOWMO_REAL_MS = 800;
/** Extra delay after slow-mo before door reveal (real ms). */
const DOOR_REVEAL_DELAY_MS = 200;

/**
 * Monitors enemy count and triggers a reward sequence when all are dead.
 * Slow-mo, camera flash, "ROOM CLEAR" text, clear enemy projectiles,
 * then reveal the exit door.
 */
export class RoomClearManager {
  private scene: Phaser.Scene;
  private combatManager: CombatManager;
  private door: Door | null;
  private cleared = false;

  constructor(
    scene: Phaser.Scene,
    combatManager: CombatManager,
    door: Door | null = null
  ) {
    this.scene = scene;
    this.combatManager = combatManager;
    this.door = door;
  }

  /** Must be called every frame from scene update. */
  update(): void {
    if (this.cleared) return;

    if (this.combatManager.getAliveCount() === 0) {
      this.cleared = true;
      this.triggerClear();
    }
  }

  /** Room clear reward sequence. */
  private triggerClear(): void {
    // Clear enemy projectiles
    this.combatManager.getEnemyProjectilePool().clearAll();

    // Slow-mo (using window.setTimeout to avoid timeScale bug)
    this.scene.time.timeScale = 0.2;
    window.setTimeout(() => {
      if (this.scene && this.scene.time) {
        this.scene.time.timeScale = 1;
      }
    }, SLOWMO_REAL_MS);

    // Camera white flash
    this.scene.cameras.main.flash(300, 255, 255, 255);

    // "ROOM CLEAR" text with bounce
    const cx = this.scene.cameras.main.width / 2;
    const cy = this.scene.cameras.main.height / 2 - 40;

    const text = this.scene.add.text(cx, cy, 'ROOM CLEAR', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#ffcc22',
      stroke: '#442200',
      strokeThickness: 6,
    });
    text.setOrigin(0.5);
    text.setScrollFactor(0);
    text.setDepth(150);
    text.setScale(0);
    text.setAlpha(0);

    // Scale-in with bounce
    this.scene.tweens.add({
      targets: text,
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      duration: 400,
      ease: 'Back.easeOut',
    });

    // Fade out after a pause
    this.scene.tweens.add({
      targets: text,
      alpha: 0,
      y: cy - 20,
      delay: 2000,
      duration: 600,
      onComplete: () => text.destroy(),
    });

    // Reveal exit door after slow-mo ends
    window.setTimeout(() => {
      if (this.door && this.scene) {
        this.door.reveal();
      }
      if (this.scene) {
        this.scene.events.emit('room-cleared');
      }
    }, SLOWMO_REAL_MS + DOOR_REVEAL_DELAY_MS);
  }
}
