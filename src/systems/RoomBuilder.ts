import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Projectile } from '../entities/Projectile';
import { Door } from '../entities/Door';
import { DungeonGenerator, RoomData } from './DungeonGenerator';
import { PropManager } from './PropManager';
import { ProjectilePool } from './ProjectilePool';
import { CombatManager } from './CombatManager';
import { RoomClearManager } from './RoomClearManager';
import { RunState, WallSide, oppositeSide } from './RunState';
import { HUD } from '../ui/HUD';
import { spawnWallImpact } from '../effects/Impact';
import { createAmbientParticles, createVignette } from '../effects/Atmosphere';
import { showRoomIndicator } from '../ui/RoomBanners';

/** Persistent objects a room needs at build time (they outlive each room). */
export interface RoomDeps {
  player: Player;
  projectilePool: ProjectilePool;
  runState: RunState;
  hud: HUD;
}

/** All per-room objects created by a build, destroyed together on teardown. */
export interface RoomState {
  room: RoomData;
  combatManager: CombatManager;
  roomClearManager: RoomClearManager;
  exitDoor: Door | null;
  roomProps: Phaser.GameObjects.GameObject[];
  roomColliders: Phaser.Physics.Arcade.Collider[];
  ambientEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null;
  vignetteGfx: Phaser.GameObjects.Graphics | null;
}

/**
 * Builds and tears down the concrete objects that make up one room —
 * geometry, props, collisions, the enemy wave, the exit door and atmosphere.
 * Stateless: the caller ({@link RoomDirector}) owns the returned {@link RoomState}.
 */
export class RoomBuilder {
  /**
   * Generates a room and wires all per-room collisions and atmosphere.
   * @param isTransitioning Guards the door overlap so it can't fire mid-fade.
   */
  static build(scene: Phaser.Scene, deps: RoomDeps, isTransitioning: () => boolean): RoomState {
    const { player, projectilePool, runState, hud } = deps;
    const roomNum = runState.roomNumber;
    const entrySide = runState.lastExitSide ? oppositeSide(runState.lastExitSide) : null;
    const exitSide = RoomBuilder.pickExitSide(entrySide);

    const room = DungeonGenerator.createRoom(scene, {
      entrySide,
      exitSide,
      proceduralObstacles: true,
      roomNumber: roomNum,
    });

    const roomColliders: Phaser.Physics.Arcade.Collider[] = [];

    // Player-wall collision
    roomColliders.push(scene.physics.add.collider(player, room.wallLayer));

    // Props
    const roomProps = PropManager.placeAll(scene);

    // Projectile-wall collision
    roomColliders.push(
      scene.physics.add.collider(projectilePool.getGroup(), room.wallLayer, (_proj) => {
        const p = _proj as Projectile;
        spawnWallImpact(scene, p.x, p.y);
        p.deactivate();
      })
    );

    // Combat system
    const combatManager = new CombatManager(
      scene,
      player,
      projectilePool,
      room.wallLayer,
      runState.playerHP
    );
    combatManager.spawnWave(roomNum);

    // Exit door (hidden until room clear)
    const exitDoor = new Door(scene, exitSide);

    // Door overlap with player (argument swap protection)
    roomColliders.push(
      scene.physics.add.overlap(player, exitDoor, (objA, objB) => {
        if (isTransitioning()) return;
        const door = (objA === player ? objB : objA) as Door;
        if (door && door.active) door.playerEntered();
      })
    );

    const roomClearManager = new RoomClearManager(scene, combatManager, exitDoor);

    // Camera
    scene.cameras.main.startFollow(player, true, 0.08, 0.08);
    scene.cameras.main.setBounds(0, 0, room.widthPx, room.heightPx);

    // Atmosphere
    const ambientEmitter = createAmbientParticles(scene);
    const vignetteGfx = createVignette(scene, room.widthPx, room.heightPx);

    // Room indicator + HUD sync
    showRoomIndicator(scene, roomNum, runState.isBossRoom());
    hud.setRoomNumber(roomNum, runState.totalRooms);
    hud.setHP(runState.playerHP);

    return {
      room,
      combatManager,
      roomClearManager,
      exitDoor,
      roomProps,
      roomColliders,
      ambientEmitter,
      vignetteGfx,
    };
  }

  /** Tears down all per-room objects, preserving persistent ones. */
  static teardown(scene: Phaser.Scene, state: RoomState, projectilePool: ProjectilePool): void {
    // Safety: reset timeScale in case enemy death freeze-frame is active
    scene.time.timeScale = 1;

    // Remove per-room event listeners
    scene.events.off('room-cleared');

    // Combat cleanup (enemies, colliders, projectiles, listeners)
    state.combatManager.cleanup();

    // Clear player projectiles
    projectilePool.clearAll();

    // Destroy door
    if (state.exitDoor) {
      state.exitDoor.destroy();
      state.exitDoor = null;
    }

    // Destroy props
    PropManager.destroyAll(state.roomProps);
    state.roomProps = [];

    // Destroy room geometry
    DungeonGenerator.destroyRoom(state.room);

    // Destroy atmosphere
    if (state.ambientEmitter) {
      state.ambientEmitter.destroy();
      state.ambientEmitter = null;
    }
    if (state.vignetteGfx) {
      state.vignetteGfx.destroy();
      state.vignetteGfx = null;
    }

    // Destroy per-room colliders (player-wall, projectile-wall, door overlap)
    for (const c of state.roomColliders) {
      c.destroy();
    }
    state.roomColliders = [];
  }

  /** Picks a random exit side different from the entry side. */
  private static pickExitSide(entrySide: WallSide | null): WallSide {
    const sides: WallSide[] = ['top', 'bottom', 'left', 'right'];
    const available = entrySide ? sides.filter((s) => s !== entrySide) : sides;
    return available[Phaser.Math.Between(0, available.length - 1)];
  }
}
