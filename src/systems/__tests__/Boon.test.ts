import { describe, it, expect, vi, afterEach } from 'vitest';
import { BOONS, rollBoons } from '../Boon';
import { CombatStats } from '../CombatStats';

// rollBoons() delegates the randomness to Phaser.Utils.Array.Shuffle. Mock it
// with a real in-place Fisher–Yates that reads Math.random, so seeding
// Math.random below makes the rolls deterministic without loading real Phaser.
vi.mock('phaser', () => {
  const Shuffle = <T>(arr: T[]): T[] => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const Clamp = (v: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, v));
  return { default: { Utils: { Array: { Shuffle } }, Math: { Clamp } } };
});

/** Deterministic PRNG so a failing roll is reproducible from its seed. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('BOONS pool', () => {
  it('has distinct ids and a valid shape', () => {
    const ids = BOONS.map((b) => b.id);
    expect(new Set(ids).size).toBe(BOONS.length);
    for (const b of BOONS) {
      expect(typeof b.id).toBe('string');
      expect(typeof b.name).toBe('string');
      expect(typeof b.desc).toBe('string');
      expect(typeof b.apply).toBe('function');
    }
  });
});

describe('rollBoons', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 3 distinct boons drawn from the pool, across many seeds', () => {
    const poolIds = new Set(BOONS.map((b) => b.id));
    for (let seed = 0; seed < 500; seed++) {
      vi.spyOn(Math, 'random').mockImplementation(mulberry32(seed));
      const rolled = rollBoons(3);
      expect(rolled).toHaveLength(3);
      const ids = rolled.map((b) => b.id);
      expect(new Set(ids).size, `seed ${seed} produced a duplicate`).toBe(3);
      for (const b of rolled) {
        expect(poolIds.has(b.id), `seed ${seed} rolled unknown boon`).toBe(true);
      }
    }
  });

  it('honours the requested count at the edges', () => {
    expect(rollBoons(0)).toEqual([]);
    expect(rollBoons(1)).toHaveLength(1);
    expect(rollBoons(BOONS.length)).toHaveLength(BOONS.length);
  });

  it('returns the whole pool (distinct) when asked for every boon', () => {
    const rolled = rollBoons(BOONS.length);
    expect(new Set(rolled.map((b) => b.id)).size).toBe(BOONS.length);
  });

  it('does not mutate or consume the source pool', () => {
    const before = BOONS.map((b) => b.id);
    rollBoons(3);
    expect(BOONS.map((b) => b.id)).toEqual(before);
    expect(BOONS.length).toBe(before.length);
  });

  it('returns boons whose apply still mutates stats', () => {
    const rolled = rollBoons(3);
    for (const b of rolled) {
      const a = new CombatStats();
      const snapshot = JSON.stringify(a);
      b.apply(a);
      expect(JSON.stringify(a), `${b.id} changed nothing`).not.toBe(snapshot);
    }
  });
});
