/**
 * Pure enemy-wave and spawn-placement helpers.
 *
 * Kept free of Phaser so the wave scaling and spawn-placement rules can be
 * unit-tested directly. {@link CombatManager} supplies the live wall lookup and
 * RNG; everything here is deterministic given its inputs.
 */

/** Enemy counts that make up one room's wave. */
export interface WaveConfig {
  drones: number;
  turrets: number;
}

/** Wave sizes per room number (1-based). */
const WAVE_CONFIG: Record<number, WaveConfig> = {
  1: { drones: 3, turrets: 1 },
  2: { drones: 4, turrets: 2 },
  3: { drones: 5, turrets: 2 },
  4: { drones: 5, turrets: 3 },
  5: { drones: 6, turrets: 3 },
  6: { drones: 8, turrets: 4 },
};

/** Fallback for room numbers outside the configured range. */
const DEFAULT_WAVE: WaveConfig = { drones: 3, turrets: 2 };

/** Returns the wave config for a room number, or a sane default. */
export function getWaveConfig(roomNumber: number): WaveConfig {
  return WAVE_CONFIG[roomNumber] ?? DEFAULT_WAVE;
}

/** Rectangular spawn area in world pixels (inclusive bounds). */
export interface SpawnBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/** Inputs for {@link planSpawnPoint}. */
export interface SpawnPlanOptions {
  bounds: SpawnBounds;
  /** True when a world point is blocked by a wall or obstacle. */
  isBlocked: (x: number, y: number) => boolean;
  playerX: number;
  playerY: number;
  /** Keep spawns at least this far from the player (px). */
  minPlayerDist: number;
  /** Random source in [0, 1). */
  rng: () => number;
  /** Candidate tries before falling back (default 30). */
  maxAttempts?: number;
}

/** Clamps `v` into the inclusive range [min, max]. */
function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/**
 * Picks a spawn point inside `bounds` that is clear of obstacles and not too
 * close to the player. If no clear point is found within `maxAttempts`, falls
 * back to a point pushed away from the player and clamped into bounds — so a
 * valid position is always returned and the caller never loops forever.
 */
export function planSpawnPoint(opts: SpawnPlanOptions): { x: number; y: number } {
  const { bounds, isBlocked, playerX, playerY, minPlayerDist, rng } = opts;
  const maxAttempts = opts.maxAttempts ?? 30;

  let last = { x: bounds.minX, y: bounds.minY };
  for (let i = 0; i < maxAttempts; i++) {
    const x = bounds.minX + rng() * (bounds.maxX - bounds.minX);
    const y = bounds.minY + rng() * (bounds.maxY - bounds.minY);
    last = { x, y };
    if (isBlocked(x, y)) continue;
    if (Math.hypot(x - playerX, y - playerY) < minPlayerDist) continue;
    return { x, y };
  }

  // Fallback: shove the last candidate away from the player, clamped to bounds.
  const angle = Math.atan2(last.y - playerY, last.x - playerX);
  return {
    x: clamp(playerX + Math.cos(angle) * minPlayerDist * 1.5, bounds.minX, bounds.maxX),
    y: clamp(playerY + Math.sin(angle) * minPlayerDist * 1.5, bounds.minY, bounds.maxY),
  };
}
