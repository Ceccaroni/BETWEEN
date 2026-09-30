import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Door } from '../entities/Door';
import { ProjectilePool } from './ProjectilePool';
import { CombatManager } from './CombatManager';
import { RoomClearManager } from './RoomClearManager';
import { RunState, WallSide } from './RunState';
import { HUD } from '../ui/HUD';
import { rollBoons, Boon } from './Boon';
import { showBoonAcquired } from '../ui/RoomBanners';
import { RoomBuilder, RoomState } from './RoomBuilder';

/**
 * Orchestrates the per-room lifecycle for {@link GameScene}: builds the first
 * room, drives the fade transition between rooms, and offers a boon on clear.
 * Construction/teardown of the concrete room objects is delegated to
 * {@link RoomBuilder}; this class owns the live {@link RoomState} and the
 * transition flag.
 */
export class RoomDirector {
  private state!: RoomState;
  private transitioning = false;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly player: Player,
    private readonly projectilePool: ProjectilePool,
    private readonly runState: RunState,
    private readonly hud: HUD
  ) {}

  /** The active room's combat system (rebuilt each room). */
  get combatManager(): CombatManager {
    return this.state.combatManager;
  }

  /** The active room's clear-detection manager (rebuilt each room). */
  get roomClearManager(): RoomClearManager {
    return this.state.roomClearManager;
  }

  /** True while a room-to-room fade transition is in progress. */
  get isTransitioning(): boolean {
    return this.transitioning;
  }

  /** Wires the door-transition listener and builds the first room. */
  start(): void {
    this.scene.events.on('door-entered', (exitSide: WallSide) => {
      this.transitionToNext(exitSide);
    });
    this.build();
  }

  /** Builds the current room and arms the on-clear boon offer. */
  private build(): void {
    this.state = RoomBuilder.build(
      this.scene,
      { player: this.player, projectilePool: this.projectilePool, runState: this.runState, hud: this.hud },
      () => this.transitioning
    );
    // Offer a boon once this room is cleared (skipped after the boss room).
    this.scene.events.once('room-cleared', () => this.offerBoon());
  }

  /** Handles the transition from current room to the next. */
  private transitionToNext(exitSide: WallSide): void {
    if (this.transitioning) return;
    this.transitioning = true;

    // Save player HP
    this.runState.playerHP = this.state.combatManager.getPlayerHP();

    // Advance run state
    const entrySide = this.runState.advanceRoom(exitSide);

    // Check if run is complete
    if (this.runState.isRunComplete()) {
      this.scene.cameras.main.fade(800, 255, 255, 255, false, (_cam: Phaser.Cameras.Scene2D.Camera, progress: number) => {
        if (progress >= 1) {
          this.scene.scene.start('VictoryScene');
        }
      });
      return;
    }

    // Fade to black
    this.scene.cameras.main.fade(400, 0, 0, 0, false, (_cam: Phaser.Cameras.Scene2D.Camera, progress: number) => {
      if (progress >= 1) {
        // Teardown old room
        RoomBuilder.teardown(this.scene, this.state, this.projectilePool);

        // Cancel any active dash/iframes
        this.player.cancelDash();

        // Reposition player at entry point
        const entryPos = Door.getEntryPosition(entrySide);
        this.player.setPosition(entryPos.x, entryPos.y);
        this.player.setVelocity(0, 0);

        // Build new room
        this.build();

        // Brief invulnerability on room entry
        this.player.startIFrames();

        // Fade in
        this.scene.cameras.main.fadeIn(400);
        this.transitioning = false;
      }
    });
  }

  /** Opens the boon selection overlay after a room clear (not after the boss). */
  private offerBoon(): void {
    if (this.transitioning || this.runState.isBossRoom()) return;

    const choices = rollBoons(3);
    this.scene.scene.pause();
    this.scene.scene.launch('BoonSelectScene', {
      choices,
      onPick: (boon: Boon) => {
        boon.apply(this.runState.stats);
        this.runState.boons.push(boon);
        this.scene.scene.resume();
        showBoonAcquired(this.scene, boon.name);
      },
    });
  }
}
