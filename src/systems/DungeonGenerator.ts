import Phaser from 'phaser';
import { TILE_SIZE } from '../utils/Constants';
import { WallSide } from './RunState';

/**
 * Tileset grid: 37 cols × 23 rows at 32×32.
 * ASSET-REGISTRY: tileset x1.png, 1184×736, 32×32 tiles, 37×23 grid
 *
 * Tiles are loaded at 32×32 and the layer is scaled 2× so each tile
 * renders at 64×64 in world space. Room fills 1280×704 of the 1280×720 game.
 */
const COLS = 37;
const DISPLAY_SCALE = 2;

/** Tile index helper: (col, row) → frame index. */
function ti(col: number, row: number): number {
  return row * COLS + col;
}

// --- Confirmed working tile indices ---
const WALL = {
  TOP: ti(4, 0),     // 4   — top edge (confirmed visible)
  LEFT: ti(1, 3),    // 112 — left edge (confirmed visible)
  RIGHT: ti(9, 4),   // 157 — right edge (confirmed visible)
  BOT: ti(4, 7),     // 263 — bottom edge (row 7, not row 6 which is empty)
  BLOCK: ti(3, 0),   // 3   — solid grey block (safe fallback for corners/pillars)
};

/** Room dimensions in tiles (20×11 fills 1280×704 at scale 2). */
const ROOM_WIDTH = 20;
const ROOM_HEIGHT = 11;

/** Effective tile size in world space after scale. */
const WTS = TILE_SIZE * DISPLAY_SCALE; // 64

/** Configuration for procedural room generation. */
export interface RoomConfig {
  /** Which wall side the player enters from (null for first room). */
  entrySide: WallSide | null;
  /** Which wall side gets the exit door gap. */
  exitSide: WallSide;
  /** Whether to use random obstacle placement. */
  proceduralObstacles: boolean;
  /** Current room number (affects obstacle count). */
  roomNumber: number;
}

/** Result from room generation. */
export interface RoomData {
  wallLayer: Phaser.Tilemaps.TilemapLayer;
  map: Phaser.Tilemaps.Tilemap;
  floorRect: Phaser.GameObjects.Rectangle;
  floorGrid: Phaser.GameObjects.Graphics;
  spawnX: number;
  spawnY: number;
  widthPx: number;
  heightPx: number;
}

/** Generates rooms with Pupkin Tech Dungeon tiles. */
export class DungeonGenerator {
  /** Room counter for unique tilemap layer names. */
  private static roomCounter = 0;

  /** Creates a room, optionally with wall gaps and procedural obstacles. */
  static createRoom(scene: Phaser.Scene, config?: RoomConfig): RoomData {
    DungeonGenerator.roomCounter++;
    const widthPx = ROOM_WIDTH * WTS;   // 1280
    const heightPx = ROOM_HEIGHT * WTS;  // 704

    // Solid dark floor rectangle (interior between walls)
    const floorRect = scene.add.rectangle(
      widthPx / 2, heightPx / 2,
      (ROOM_WIDTH - 2) * WTS,
      (ROOM_HEIGHT - 2) * WTS,
      0x12121e
    );
    floorRect.setDepth(0);

    // Subtle tech-grid overlay on floor
    const floorGrid = DungeonGenerator.createFloorGrid(scene);

    // Build set of gap tile positions
    const gaps = new Set<string>();
    if (config) {
      if (config.entrySide) {
        for (const pos of DungeonGenerator.getGapTiles(config.entrySide)) {
          gaps.add(`${pos[0]},${pos[1]}`);
        }
      }
      for (const pos of DungeonGenerator.getGapTiles(config.exitSide)) {
        gaps.add(`${pos[0]},${pos[1]}`);
      }
    }

    // Tilemap (internal 32×32, displayed at 64×64 via layer scale)
    const map = scene.make.tilemap({
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
      width: ROOM_WIDTH,
      height: ROOM_HEIGHT,
    });

    const tileset = map.addTilesetImage(
      'machine-tileset', 'machine-tileset', TILE_SIZE, TILE_SIZE
    )!;

    const layerName = `walls-${DungeonGenerator.roomCounter}`;
    const wallLayer = map.createBlankLayer(layerName, tileset)!;
    DungeonGenerator.placeWalls(wallLayer, gaps);

    if (config?.proceduralObstacles) {
      DungeonGenerator.placeProceduralObstacles(wallLayer, config, gaps);
    } else {
      DungeonGenerator.placePillars(wallLayer);
    }

    wallLayer.setScale(DISPLAY_SCALE);
    wallLayer.setCollisionByExclusion([-1]);
    wallLayer.setDepth(1);

    return {
      wallLayer,
      map,
      floorRect,
      floorGrid,
      spawnX: widthPx / 2,
      spawnY: heightPx / 2,
      widthPx,
      heightPx,
    };
  }

  /** Destroys all room geometry objects. */
  static destroyRoom(roomData: RoomData): void {
    roomData.wallLayer.destroy();
    roomData.map.destroy();
    roomData.floorRect.destroy();
    roomData.floorGrid.destroy();
  }

  /** Returns 2 tile positions that form a gap in the given wall side. */
  private static getGapTiles(side: WallSide): Array<[number, number]> {
    const midX = Math.floor(ROOM_WIDTH / 2);   // 10
    const midY = Math.floor(ROOM_HEIGHT / 2);   // 5
    switch (side) {
      case 'top':    return [[midX, 0], [midX - 1, 0]];
      case 'bottom': return [[midX, ROOM_HEIGHT - 1], [midX - 1, ROOM_HEIGHT - 1]];
      case 'left':   return [[0, midY], [0, midY - 1]];
      case 'right':  return [[ROOM_WIDTH - 1, midY], [ROOM_WIDTH - 1, midY - 1]];
    }
  }

  /** Places wall tiles, skipping positions in the gaps set. */
  private static placeWalls(
    layer: Phaser.Tilemaps.TilemapLayer,
    gaps: Set<string>
  ): void {
    const w = ROOM_WIDTH;
    const h = ROOM_HEIGHT;

    // Four corners (safe grey block) — only if not in gap
    const corners: Array<[number, number]> = [
      [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
    ];
    for (const [cx, cy] of corners) {
      if (!gaps.has(`${cx},${cy}`)) {
        layer.putTileAt(WALL.BLOCK, cx, cy);
      }
    }

    // Top and bottom edges
    for (let x = 1; x < w - 1; x++) {
      if (!gaps.has(`${x},0`)) layer.putTileAt(WALL.TOP, x, 0);
      if (!gaps.has(`${x},${h - 1}`)) layer.putTileAt(WALL.BOT, x, h - 1);
    }

    // Left and right edges
    for (let y = 1; y < h - 1; y++) {
      if (!gaps.has(`0,${y}`)) layer.putTileAt(WALL.LEFT, 0, y);
      if (!gaps.has(`${w - 1},${y}`)) layer.putTileAt(WALL.RIGHT, w - 1, y);
    }
  }

  /** Places interior pillars at fixed positions (legacy). */
  private static placePillars(layer: Phaser.Tilemaps.TilemapLayer): void {
    const pillars: Array<[number, number]> = [
      [5, 3], [14, 3], [5, 7], [14, 7],
    ];
    for (const [x, y] of pillars) {
      layer.putTileAt(WALL.BLOCK, x, y);
    }
  }

  /** Places random obstacles, ensuring all gaps are reachable. */
  private static placeProceduralObstacles(
    layer: Phaser.Tilemaps.TilemapLayer,
    config: RoomConfig,
    gaps: Set<string>
  ): void {
    // Build safe zone: center spawn area + gap surroundings
    const safeZone = new Set<string>();

    // Center spawn safe area (3-tile radius)
    const cx = Math.floor(ROOM_WIDTH / 2);
    const cy = Math.floor(ROOM_HEIGHT / 2);
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        safeZone.add(`${cx + dx},${cy + dy}`);
      }
    }

    // Gap safe zones (2-tile radius around each gap tile)
    for (const gapKey of gaps) {
      const [gx, gy] = gapKey.split(',').map(Number);
      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
          safeZone.add(`${gx + dx},${gy + dy}`);
        }
      }
    }

    // Interior tiles available for obstacles (x: 2..17, y: 2..8)
    const candidates: Array<[number, number]> = [];
    for (let x = 2; x <= ROOM_WIDTH - 3; x++) {
      for (let y = 2; y <= ROOM_HEIGHT - 3; y++) {
        if (!safeZone.has(`${x},${y}`)) {
          candidates.push([x, y]);
        }
      }
    }

    // Shuffle candidates
    Phaser.Utils.Array.Shuffle(candidates);

    // Place 4-7 obstacles (more in later rooms)
    const count = Phaser.Math.Clamp(3 + Math.floor(config.roomNumber / 2), 4, 7);
    const placed: Array<[number, number]> = [];

    for (const [px, py] of candidates) {
      if (placed.length >= count) break;

      // Check minimum distance from other obstacles (at least 2 tiles apart)
      const tooClose = placed.some(
        ([ox, oy]) => Math.abs(px - ox) <= 1 && Math.abs(py - oy) <= 1
      );
      if (tooClose) continue;

      // Tentatively place and check pathability
      layer.putTileAt(WALL.BLOCK, px, py);

      if (DungeonGenerator.isPathable(layer, config, gaps)) {
        placed.push([px, py]);
      } else {
        // Remove if it blocks pathing
        layer.removeTileAt(px, py);
      }
    }
  }

  /** Flood-fill check: can the center reach all gap positions? */
  private static isPathable(
    layer: Phaser.Tilemaps.TilemapLayer,
    config: RoomConfig,
    gaps: Set<string>
  ): boolean {
    const cx = Math.floor(ROOM_WIDTH / 2);
    const cy = Math.floor(ROOM_HEIGHT / 2);

    // BFS from center
    const visited = new Set<string>();
    const queue: Array<[number, number]> = [[cx, cy]];
    visited.add(`${cx},${cy}`);

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx},${ny}`;
        if (nx < 0 || nx >= ROOM_WIDTH || ny < 0 || ny >= ROOM_HEIGHT) continue;
        if (visited.has(key)) continue;
        // Check if tile is empty (no wall/obstacle)
        const tile = layer.getTileAt(nx, ny);
        if (tile && tile.index !== -1) continue;
        visited.add(key);
        queue.push([nx, ny]);
      }
    }

    // Check that interior tiles adjacent to each gap are reachable
    for (const gapKey of gaps) {
      const [gx, gy] = gapKey.split(',').map(Number);
      // Check the interior tile adjacent to the gap
      let interiorX = gx;
      let interiorY = gy;
      if (gx === 0) interiorX = 1;
      else if (gx === ROOM_WIDTH - 1) interiorX = ROOM_WIDTH - 2;
      if (gy === 0) interiorY = 1;
      else if (gy === ROOM_HEIGHT - 1) interiorY = ROOM_HEIGHT - 2;

      if (!visited.has(`${interiorX},${interiorY}`)) return false;
    }

    return true;
  }

  /** Draws subtle tech-grid lines on the floor area between walls. */
  private static createFloorGrid(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
    const gfx = scene.add.graphics();
    gfx.lineStyle(1, 0x334466, 0.1);

    const startX = WTS;
    const endX = (ROOM_WIDTH - 1) * WTS;
    const startY = WTS;
    const endY = (ROOM_HEIGHT - 1) * WTS;

    for (let x = startX; x <= endX; x += WTS) {
      gfx.lineBetween(x, startY, x, endY);
    }
    for (let y = startY; y <= endY; y += WTS) {
      gfx.lineBetween(startX, y, endX, y);
    }

    gfx.setDepth(0.5);
    return gfx;
  }
}
