import { describe, it, expect, vi, afterEach } from 'vitest';
import type Phaser from 'phaser';
import { DungeonGenerator, type RoomConfig } from '../DungeonGenerator';
import { oppositeSide, type WallSide } from '../RunState';

// DungeonGenerator uses Phaser only for two pure helpers (Array.Shuffle and
// Math.Clamp). Mock them so the real (browser-only) engine is never loaded and
// so seeding Math.random makes generation deterministic.
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

// Generator's internal room dimensions (mirrored here to size the fake grid and
// to compute gap/interior cells independently of the code under test).
const ROOM_WIDTH = 20;
const ROOM_HEIGHT = 11;
const EMPTY = -1;

/**
 * A fake TilemapLayer backed by a real 2D grid. It faithfully implements the
 * handful of methods the generator touches (putTileAt / removeTileAt /
 * getTileAt and the fluent no-ops), so the produced wall layout can be
 * inspected and verified by an independent flood fill.
 */
interface MockLayer {
  grid: number[][];
  putTileAt(index: number, x: number, y: number): { index: number };
  removeTileAt(x: number, y: number): null;
  getTileAt(x: number, y: number): { index: number } | null;
  setScale(): MockLayer;
  setCollisionByExclusion(): MockLayer;
  setDepth(): MockLayer;
}

function makeMockLayer(w: number, h: number): MockLayer {
  const grid: number[][] = Array.from({ length: h }, () =>
    new Array<number>(w).fill(EMPTY)
  );
  const layer: MockLayer = {
    grid,
    putTileAt(index, x, y) {
      grid[y][x] = index;
      return { index };
    },
    removeTileAt(x, y) {
      grid[y][x] = EMPTY;
      return null;
    },
    getTileAt(x, y) {
      if (x < 0 || x >= w || y < 0 || y >= h) return null;
      return { index: grid[y][x] };
    },
    setScale() {
      return layer;
    },
    setCollisionByExclusion() {
      return layer;
    },
    setDepth() {
      return layer;
    },
  };
  return layer;
}

/** Minimal Scene stub: just enough for DungeonGenerator.createRoom. */
function makeMockScene(): { scene: Phaser.Scene; layers: MockLayer[] } {
  const layers: MockLayer[] = [];
  const gfx = {
    lineStyle: () => gfx,
    lineBetween: () => gfx,
    setDepth: () => gfx,
  };
  const scene = {
    add: {
      rectangle: () => ({ setDepth: () => undefined }),
      graphics: () => gfx,
    },
    make: {
      tilemap: (cfg: { width: number; height: number }) => ({
        addTilesetImage: () => ({}),
        createBlankLayer: () => {
          const layer = makeMockLayer(cfg.width, cfg.height);
          layers.push(layer);
          return layer;
        },
        destroy: () => undefined,
      }),
    },
  };
  return { scene: scene as unknown as Phaser.Scene, layers };
}

/** Deterministic PRNG so a failing room is reproducible from its seed. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The 2 gap tiles the generator carves into the given wall (mirrors its logic). */
function gapTiles(side: WallSide): Array<[number, number]> {
  const midX = Math.floor(ROOM_WIDTH / 2);
  const midY = Math.floor(ROOM_HEIGHT / 2);
  switch (side) {
    case 'top':
      return [[midX, 0], [midX - 1, 0]];
    case 'bottom':
      return [[midX, ROOM_HEIGHT - 1], [midX - 1, ROOM_HEIGHT - 1]];
    case 'left':
      return [[0, midY], [0, midY - 1]];
    case 'right':
      return [[ROOM_WIDTH - 1, midY], [ROOM_WIDTH - 1, midY - 1]];
  }
}

/** The interior floor tile just inside a gap (mirrors the generator's mapping). */
function interiorOf([gx, gy]: [number, number]): [number, number] {
  let ix = gx;
  let iy = gy;
  if (gx === 0) ix = 1;
  else if (gx === ROOM_WIDTH - 1) ix = ROOM_WIDTH - 2;
  if (gy === 0) iy = 1;
  else if (gy === ROOM_HEIGHT - 1) iy = ROOM_HEIGHT - 2;
  return [ix, iy];
}

/** Independent 4-connected flood fill over empty (walkable) tiles. */
function reachableFrom(grid: number[][], start: [number, number]): Set<string> {
  const h = grid.length;
  const w = grid[0].length;
  const seen = new Set<string>([start.join(',')]);
  const queue: Array<[number, number]> = [start];
  const steps: Array<[number, number]> = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (queue.length > 0) {
    const [x, y] = queue.shift() as [number, number];
    for (const [dx, dy] of steps) {
      const nx = x + dx;
      const ny = y + dy;
      const key = `${nx},${ny}`;
      if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
      if (seen.has(key)) continue;
      if (grid[ny][nx] !== EMPTY) continue;
      seen.add(key);
      queue.push([nx, ny]);
    }
  }
  return seen;
}

const SIDES: WallSide[] = ['top', 'bottom', 'left', 'right'];
const CENTER: [number, number] = [
  Math.floor(ROOM_WIDTH / 2),
  Math.floor(ROOM_HEIGHT / 2),
];

describe('DungeonGenerator procedural rooms are always solvable', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps every gap reachable and the entrance reachable to the exit, across many seeds', () => {
    const SEEDS = 200;
    const ROOM_NUMBERS = [1, 3, 6];
    let roomsChecked = 0;

    for (let seed = 0; seed < SEEDS; seed++) {
      vi.spyOn(Math, 'random').mockImplementation(mulberry32(seed));

      for (const roomNumber of ROOM_NUMBERS) {
        for (const exitSide of SIDES) {
          // Room 1 has no entry; later rooms enter opposite their predecessor's exit.
          for (const entrySide of [null, oppositeSide(exitSide)] as Array<WallSide | null>) {
            const config: RoomConfig = {
              entrySide,
              exitSide,
              proceduralObstacles: true,
              roomNumber,
            };

            const { scene, layers } = makeMockScene();
            DungeonGenerator.createRoom(scene, config);
            expect(layers).toHaveLength(1);
            const grid = layers[0].grid;

            const where = `seed=${seed} room=${roomNumber} entry=${entrySide} exit=${exitSide}`;
            const fromCenter = reachableFrom(grid, CENTER);

            // Every carved gap's interior tile must be reachable from spawn.
            const activeSides: WallSide[] = entrySide
              ? [entrySide, exitSide]
              : [exitSide];
            for (const side of activeSides) {
              for (const gap of gapTiles(side)) {
                const [ix, iy] = interiorOf(gap);
                expect(
                  fromCenter.has(`${ix},${iy}`),
                  `${where}: gap interior (${ix},${iy}) unreachable from spawn`
                ).toBe(true);
              }
            }

            // Entrance must be able to reach the exit (true "solvable" check).
            if (entrySide) {
              const entryInterior = interiorOf(gapTiles(entrySide)[0]);
              const exitInterior = interiorOf(gapTiles(exitSide)[0]);
              const fromEntry = reachableFrom(grid, entryInterior);
              expect(
                fromEntry.has(`${exitInterior[0]},${exitInterior[1]}`),
                `${where}: exit unreachable from entrance`
              ).toBe(true);
            }

            roomsChecked++;
          }
        }
      }
    }

    // Guard against the loop silently degenerating to zero iterations.
    expect(roomsChecked).toBe(SEEDS * ROOM_NUMBERS.length * SIDES.length * 2);
  });

  it('carves the entry and exit wall gaps (not solid walls)', () => {
    vi.spyOn(Math, 'random').mockImplementation(mulberry32(42));
    const { scene, layers } = makeMockScene();
    DungeonGenerator.createRoom(scene, {
      entrySide: 'left',
      exitSide: 'right',
      proceduralObstacles: true,
      roomNumber: 2,
    });
    const grid = layers[0].grid;
    for (const side of ['left', 'right'] as WallSide[]) {
      for (const [gx, gy] of gapTiles(side)) {
        expect(grid[gy][gx], `gap (${gx},${gy}) should be empty`).toBe(EMPTY);
      }
    }
  });

  it('encloses the room perimeter except at the gaps', () => {
    vi.spyOn(Math, 'random').mockImplementation(mulberry32(7));
    const { scene, layers } = makeMockScene();
    DungeonGenerator.createRoom(scene, {
      entrySide: null,
      exitSide: 'top',
      proceduralObstacles: true,
      roomNumber: 1,
    });
    const grid = layers[0].grid;
    const gapKeys = new Set(gapTiles('top').map(([x, y]) => `${x},${y}`));
    for (let x = 0; x < ROOM_WIDTH; x++) {
      if (!gapKeys.has(`${x},0`)) {
        expect(grid[0][x], `top wall (${x},0) should be solid`).not.toBe(EMPTY);
      }
      expect(grid[ROOM_HEIGHT - 1][x]).not.toBe(EMPTY);
    }
    for (let y = 0; y < ROOM_HEIGHT; y++) {
      expect(grid[y][0]).not.toBe(EMPTY);
      expect(grid[y][ROOM_WIDTH - 1]).not.toBe(EMPTY);
    }
  });
});
