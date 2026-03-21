import { PLAYER_HP, ROOMS_PER_RUN } from '../utils/Constants';

/** Direction a wall faces (for door/entry placement). */
export type WallSide = 'top' | 'bottom' | 'left' | 'right';

/** Returns the opposite wall side. */
export function oppositeSide(side: WallSide): WallSide {
  const map: Record<WallSide, WallSide> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };
  return map[side];
}

/**
 * Tracks state that persists across room transitions within a single run.
 * Created once per run in GameScene.
 */
export class RunState {
  /** Current room number (1-based, 1 to ROOMS_PER_RUN). */
  roomNumber = 1;

  /** Player HP that persists between rooms. */
  playerHP: number = PLAYER_HP;

  /** Which wall the exit door was on in the previous room (null for room 1). */
  lastExitSide: WallSide | null = null;

  /** Total rooms in this run. */
  readonly totalRooms = ROOMS_PER_RUN;

  /** Returns true if current room is the boss room. */
  isBossRoom(): boolean {
    return this.roomNumber >= this.totalRooms;
  }

  /** Returns true if the run is complete (all rooms cleared). */
  isRunComplete(): boolean {
    return this.roomNumber > this.totalRooms;
  }

  /** Advances to next room. Returns the wall side the player enters from. */
  advanceRoom(exitSide: WallSide): WallSide {
    this.lastExitSide = exitSide;
    this.roomNumber++;
    return oppositeSide(exitSide);
  }
}
