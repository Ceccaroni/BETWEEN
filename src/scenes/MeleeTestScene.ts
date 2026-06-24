import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Drone } from '../entities/enemies/Drone';
import { InputSystem } from '../systems/InputSystem';
import { MeleeWeapon } from '../systems/MeleeWeapon';
import { CombatStats } from '../systems/CombatStats';
import { rollBoons, Boon } from '../systems/Boon';
import type { Enemy } from '../entities/Enemy';

/** Play-area size for the melee sandbox, in world pixels. */
const WORLD_W = 1600;
const WORLD_H = 1000;
/** Target number of live enemies to keep the loop busy. */
const TARGET_ENEMIES = 5;
/** Delay between auto-spawns in ms. */
const SPAWN_INTERVAL_MS = 900;

/**
 * Sandbox scene for prototyping the melee (sword) combat in isolation.
 * Reachable via ?scene=melee. Not part of the main run — pure feel test.
 */
export class MeleeTestScene extends Phaser.Scene {
  private player!: Player;
  private controls!: InputSystem;
  private weapon!: MeleeWeapon;
  private stats!: CombatStats;
  private statsText!: Phaser.GameObjects.Text;
  private enemies!: Phaser.Physics.Arcade.Group;
  private spawnTimer = 0;

  constructor() {
    super({ key: 'MeleeTestScene' });
  }

  create(): void {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.drawFloor();

    this.player = new Player(this, WORLD_W / 2, WORLD_H / 2);
    this.player.setCollideWorldBounds(true);

    this.controls = new InputSystem(this);
    this.stats = new CombatStats();
    this.weapon = new MeleeWeapon(this, this.player, this.stats);
    this.enemies = this.physics.add.group();

    // Test hook: B opens a boon selection that mutates the live stats.
    this.input.keyboard!.on('keydown-B', () => this.openBoons());

    // Light contact knockback so enemies feel threatening (no death in sandbox).
    this.physics.add.overlap(this.player, this.enemies, this.onContact, undefined, this);

    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setZoom(1.4);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    for (let i = 0; i < TARGET_ENEMIES; i++) this.spawnEnemy();

    this.drawHud();
  }

  override update(_time: number, delta: number): void {
    const dir = this.controls.getDirection();
    const cursor = this.controls.getPointerWorld();
    const aim = Phaser.Math.Angle.Between(this.player.x, this.player.y, cursor.x, cursor.y);

    // Attack (hold to chain swings); the lunge drives movement during a swing.
    if (this.controls.isFireDown() && this.weapon.canAttack()) {
      this.weapon.tryAttack(aim);
    }

    if (this.controls.isDashPressed()) {
      this.player.dash(dir.x, dir.y);
    }

    if (!this.weapon.isActive()) {
      this.player.move(dir.x, dir.y);
      this.player.faceMouse(cursor.x, cursor.y);
      this.driveBaseAnimation(dir);
    }

    this.player.updateTimers(delta);
    this.weapon.update(delta, this.enemies.getChildren() as Enemy[]);

    for (const child of this.enemies.getChildren()) {
      (child as Enemy).updateEnemy(this.player, delta);
    }

    this.maintainEnemies(delta);
  }

  /** Plays idle/run based on movement, never overriding the attack swing. */
  private driveBaseAnimation(dir: { x: number; y: number }): void {
    const moving = dir.x !== 0 || dir.y !== 0;
    const key = this.player.getIsDashing() || moving ? 'player-run' : 'player-idle';
    if (this.player.anims.currentAnim?.key !== key || !this.player.anims.isPlaying) {
      this.player.play(key, true);
    }
  }

  /** Pushes the player away from a touching enemy and grants brief i-frames. */
  private onContact: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    playerObj,
    enemyObj
  ) => {
    const player = playerObj as unknown as Player;
    const enemy = enemyObj as unknown as Enemy;
    if (!enemy.active || player.getIsInvulnerable()) return;

    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
    (player.body as Phaser.Physics.Arcade.Body).setVelocity(
      Math.cos(angle) * 250,
      Math.sin(angle) * 250
    );
    player.startIFrames();
    this.cameras.main.shake(120, 0.008);
  };

  /** Keeps the arena populated, spawning up to the target on an interval. */
  private maintainEnemies(delta: number): void {
    const alive = this.enemies.getChildren().filter((e) => (e as Enemy).active).length;
    if (alive >= TARGET_ENEMIES) return;

    this.spawnTimer -= delta;
    if (this.spawnTimer <= 0) {
      this.spawnEnemy();
      this.spawnTimer = SPAWN_INTERVAL_MS;
    }
  }

  /** Spawns one chasing drone on a ring around the player, inside the bounds. */
  private spawnEnemy(): void {
    const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const x = Phaser.Math.Clamp(this.player.x + Math.cos(a) * 420, 60, WORLD_W - 60);
    const y = Phaser.Math.Clamp(this.player.y + Math.sin(a) * 420, 60, WORLD_H - 60);
    this.enemies.add(new Drone(this, x, y));
  }

  /** Dark floor with a faint grid for spatial reference. */
  private drawFloor(): void {
    this.cameras.main.setBackgroundColor('#0d0f14');
    const g = this.add.graphics();
    g.fillStyle(0x12151c, 1);
    g.fillRect(0, 0, WORLD_W, WORLD_H);
    g.lineStyle(1, 0x1c2230, 0.8);
    for (let x = 0; x <= WORLD_W; x += 64) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, WORLD_H);
      g.strokePath();
    }
    for (let y = 0; y <= WORLD_H; y += 64) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(WORLD_W, y);
      g.strokePath();
    }
    g.lineStyle(3, 0x2a3346, 1);
    g.strokeRect(0, 0, WORLD_W, WORLD_H);
    g.setDepth(0);
  }

  /** Fixed control hints + sandbox label, pinned to the camera despite zoom. */
  private drawHud(): void {
    const hint =
      'WASD bewegen   •   MAUS zielen   •   LINKSKLICK Schwert   •   LEERTASTE Dash   •   B Boon (Test)';
    const hintText = this.add
      .text(0, 0, hint, {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#cdd6e6',
        backgroundColor: '#00000088',
        padding: { x: 12, y: 6 },
      })
      .setOrigin(0.5)
      .setDepth(100);
    this.pinToCamera(hintText, this.cameras.main.width / 2, this.cameras.main.height - 28);

    const label = this.add
      .text(0, 0, 'SANDBOX · Melee + Boons (Phase B)', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#6b7689',
      })
      .setOrigin(0, 0)
      .setDepth(100);
    this.pinToCamera(label, 16, 14);

    this.statsText = this.add
      .text(0, 0, '', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#9fb0cc',
        lineSpacing: 4,
      })
      .setOrigin(0, 0)
      .setDepth(100);
    this.pinToCamera(this.statsText, 16, 40);
    this.refreshStatsText();
  }

  /** Live readout of the current combat stats (verifies boons apply). */
  private refreshStatsText(): void {
    const s = this.stats;
    this.statsText.setText([
      `dmg        ${s.damage}`,
      `cooldown   ${s.cooldownMs} ms`,
      `range      ${s.rangePx}`,
      `arc        ${s.arcDeg}°`,
      `lunge      ${s.lungeSpeed}`,
      `lifesteal  ${s.lifesteal}`,
      `crit       ${Math.round(s.critChance * 100)}%`,
      `whirlwind  ${s.whirlwindEvery === 0 ? '—' : `jeder ${s.whirlwindEvery}.`}`,
    ].join('\n'));
  }

  /** Pauses the sandbox and opens a boon selection that mutates the stats. */
  private openBoons(): void {
    this.scene.pause();
    this.scene.launch('BoonSelectScene', {
      choices: rollBoons(3),
      onPick: (boon: Boon) => {
        boon.apply(this.stats);
        this.scene.resume();
        this.refreshStatsText();
      },
    });
  }

  /**
   * Pins a fixed object to a screen position, compensating for camera zoom
   * (zoom scales scrollFactor-0 objects around the camera midpoint).
   */
  private pinToCamera(obj: Phaser.GameObjects.Text, screenX: number, screenY: number): void {
    const cam = this.cameras.main;
    const z = cam.zoom;
    obj.setScrollFactor(0);
    obj.setScale(1 / z);
    obj.setPosition(
      (screenX - cam.width / 2) / z + cam.width / 2,
      (screenY - cam.height / 2) / z + cam.height / 2
    );
  }
}
