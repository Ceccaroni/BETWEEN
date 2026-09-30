import { describe, it, expect } from 'vitest';
import { RunState, oppositeSide, type WallSide } from '../RunState';
import { CombatStats } from '../CombatStats';
import { PLAYER_HP, ROOMS_PER_RUN } from '../../utils/Constants';

const ALL_SIDES: WallSide[] = ['top', 'bottom', 'left', 'right'];

describe('oppositeSide', () => {
  it('maps each side to its mirror', () => {
    expect(oppositeSide('top')).toBe('bottom');
    expect(oppositeSide('bottom')).toBe('top');
    expect(oppositeSide('left')).toBe('right');
    expect(oppositeSide('right')).toBe('left');
  });

  it('is an involution (opposite of opposite is identity)', () => {
    for (const side of ALL_SIDES) {
      expect(oppositeSide(oppositeSide(side))).toBe(side);
    }
  });
});

describe('RunState defaults', () => {
  it('starts at room 1 with full HP and no prior exit', () => {
    const run = new RunState();
    expect(run.roomNumber).toBe(1);
    expect(run.playerHP).toBe(PLAYER_HP);
    expect(run.lastExitSide).toBeNull();
    expect(run.totalRooms).toBe(ROOMS_PER_RUN);
  });

  it('owns a fresh CombatStats and an empty boon list', () => {
    const run = new RunState();
    expect(run.stats).toBeInstanceOf(CombatStats);
    expect(run.boons).toEqual([]);
  });
});

describe('RunState.advanceRoom', () => {
  it('records the exit side, increments the room, and returns the entry side', () => {
    const run = new RunState();
    const entry = run.advanceRoom('right');
    expect(run.lastExitSide).toBe('right');
    expect(run.roomNumber).toBe(2);
    expect(entry).toBe('left');
  });

  it('always enters from the side opposite the exit', () => {
    for (const exit of ALL_SIDES) {
      const run = new RunState();
      expect(run.advanceRoom(exit)).toBe(oppositeSide(exit));
    }
  });

  it('advances sequentially across a full run', () => {
    const run = new RunState();
    for (let expected = 2; expected <= ROOMS_PER_RUN; expected++) {
      run.advanceRoom('top');
      expect(run.roomNumber).toBe(expected);
    }
  });
});

describe('RunState HP persistence', () => {
  it('keeps mutated HP across room transitions', () => {
    const run = new RunState();
    run.playerHP = 4;
    run.advanceRoom('bottom');
    expect(run.playerHP).toBe(4);
    run.advanceRoom('left');
    expect(run.playerHP).toBe(4);
  });

  it('shares the same stats and boons references across rooms', () => {
    const run = new RunState();
    const stats = run.stats;
    const boons = run.boons;
    run.advanceRoom('top');
    expect(run.stats).toBe(stats);
    expect(run.boons).toBe(boons);
  });
});

describe('RunState room progression flags', () => {
  it('flags the boss room only at (and beyond) the final room', () => {
    const run = new RunState();
    for (let room = 1; room < ROOMS_PER_RUN; room++) {
      run.roomNumber = room;
      expect(run.isBossRoom()).toBe(false);
    }
    run.roomNumber = ROOMS_PER_RUN;
    expect(run.isBossRoom()).toBe(true);
    run.roomNumber = ROOMS_PER_RUN + 1;
    expect(run.isBossRoom()).toBe(true);
  });

  it('reports run completion only once past the final room', () => {
    const run = new RunState();
    run.roomNumber = ROOMS_PER_RUN;
    expect(run.isRunComplete()).toBe(false);
    run.roomNumber = ROOMS_PER_RUN + 1;
    expect(run.isRunComplete()).toBe(true);
  });
});
