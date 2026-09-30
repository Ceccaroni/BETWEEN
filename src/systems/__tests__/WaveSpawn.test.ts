import { describe, it, expect } from 'vitest';
import {
  getWaveConfig,
  planSpawnPoint,
  type SpawnBounds,
} from '../WaveSpawn';

/** Deterministic PRNG so a failing placement is reproducible from its seed. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BOUNDS: SpawnBounds = { minX: 128, maxX: 1152, minY: 128, maxY: 576 };

describe('getWaveConfig', () => {
  it('scales enemy counts monotonically across the 6 rooms', () => {
    const totals = [1, 2, 3, 4, 5, 6].map((r) => {
      const c = getWaveConfig(r);
      return c.drones + c.turrets;
    });
    for (let i = 1; i < totals.length; i++) {
      expect(totals[i]).toBeGreaterThanOrEqual(totals[i - 1]);
    }
    // Boss room is the largest wave.
    expect(totals[5]).toBe(Math.max(...totals));
  });

  it('returns a positive-count default for out-of-range room numbers', () => {
    for (const r of [0, 7, 99, -3]) {
      const c = getWaveConfig(r);
      expect(c.drones).toBeGreaterThan(0);
      expect(c.turrets).toBeGreaterThan(0);
    }
  });
});

describe('planSpawnPoint', () => {
  it('never returns a blocked tile when clear space exists, across many seeds', () => {
    // Block a central pillar region; plenty of clear space remains.
    const isBlocked = (x: number, y: number) =>
      x > 500 && x < 780 && y > 250 && y < 460;

    for (let seed = 0; seed < 400; seed++) {
      const p = planSpawnPoint({
        bounds: BOUNDS,
        isBlocked,
        playerX: 640,
        playerY: 352,
        minPlayerDist: 150,
        rng: mulberry32(seed),
      });
      expect(isBlocked(p.x, p.y), `seed ${seed} spawned on a blocked tile`).toBe(false);
      expect(p.x).toBeGreaterThanOrEqual(BOUNDS.minX);
      expect(p.x).toBeLessThanOrEqual(BOUNDS.maxX);
      expect(p.y).toBeGreaterThanOrEqual(BOUNDS.minY);
      expect(p.y).toBeLessThanOrEqual(BOUNDS.maxY);
    }
  });

  it('keeps spawns at least minPlayerDist from the player when space allows', () => {
    for (let seed = 0; seed < 400; seed++) {
      const p = planSpawnPoint({
        bounds: BOUNDS,
        isBlocked: () => false,
        playerX: 640,
        playerY: 352,
        minPlayerDist: 150,
        rng: mulberry32(seed),
      });
      expect(Math.hypot(p.x - 640, p.y - 352)).toBeGreaterThanOrEqual(150);
    }
  });

  it('always returns an in-bounds point even when every tile is blocked (fallback)', () => {
    const p = planSpawnPoint({
      bounds: BOUNDS,
      isBlocked: () => true,
      playerX: 640,
      playerY: 352,
      minPlayerDist: 150,
      rng: mulberry32(1),
      maxAttempts: 10,
    });
    expect(p.x).toBeGreaterThanOrEqual(BOUNDS.minX);
    expect(p.x).toBeLessThanOrEqual(BOUNDS.maxX);
    expect(p.y).toBeGreaterThanOrEqual(BOUNDS.minY);
    expect(p.y).toBeGreaterThanOrEqual(BOUNDS.minY);
    expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
  });

  it('is deterministic for a given seed', () => {
    const make = () =>
      planSpawnPoint({
        bounds: BOUNDS,
        isBlocked: () => false,
        playerX: 200,
        playerY: 200,
        minPlayerDist: 100,
        rng: mulberry32(123),
      });
    expect(make()).toEqual(make());
  });
});
