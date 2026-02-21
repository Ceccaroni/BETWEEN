import Phaser from 'phaser';
import { TILE_SIZE } from '../utils/Constants';

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
  BOT: ti(4, 6),     // 226 — bottom edge
  BLOCK: ti(3, 0),   // 3   — solid grey block (safe fallback for corners/pillars)
};

/** Room dimensions in tiles (20×11 fills 1280×704 at scale 2). */
const ROOM_WIDTH = 20;
const ROOM_HEIGHT = 11;

/** Interior pillar positions for dungeon structure. */
const PILLARS: Array<[number, number]> = [
  [5, 3], [14, 3],
  [5, 7], [14, 7],
];

/** Effective tile size in world space after scale. */
const WTS = TILE_SIZE * DISPLAY_SCALE; // 64

/** Result from room generation. */
export interface RoomData {
  wallLayer: Phaser.Tilemaps.TilemapLayer;
  spawnX: number;
  spawnY: number;
  widthPx: number;
  heightPx: number;
}

/** Generates a single static room with Pupkin Tech Dungeon tiles. */
export class DungeonGenerator {
  /** Creates a room that fills the screen via scaled tilemap layer. */
  static createRoom(scene: Phaser.Scene): RoomData {
    const widthPx = ROOM_WIDTH * WTS;   // 1280
    const heightPx = ROOM_HEIGHT * WTS;  // 704

    // Solid dark floor rectangle (interior between walls)
    scene.add.rectangle(
      widthPx / 2, heightPx / 2,
      (ROOM_WIDTH - 2) * WTS,
      (ROOM_HEIGHT - 2) * WTS,
      0x12121e
    ).setDepth(0);

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

    const wallLayer = map.createBlankLayer('walls', tileset)!;
    DungeonGenerator.placeWalls(wallLayer);
    DungeonGenerator.placePillars(wallLayer);
    wallLayer.setScale(DISPLAY_SCALE);
    wallLayer.setCollisionByExclusion([-1]);
    wallLayer.setDepth(1);

    return {
      wallLayer,
      spawnX: widthPx / 2,
      spawnY: heightPx / 2,
      widthPx,
      heightPx,
    };
  }

  /** Places wall tiles with distinct edges and corner blocks. */
  private static placeWalls(layer: Phaser.Tilemaps.TilemapLayer): void {
    const w = ROOM_WIDTH;
    const h = ROOM_HEIGHT;

    // Four corners (safe grey block)
    layer.putTileAt(WALL.BLOCK, 0, 0);
    layer.putTileAt(WALL.BLOCK, w - 1, 0);
    layer.putTileAt(WALL.BLOCK, 0, h - 1);
    layer.putTileAt(WALL.BLOCK, w - 1, h - 1);

    // Top and bottom edges
    for (let x = 1; x < w - 1; x++) {
      layer.putTileAt(WALL.TOP, x, 0);
      layer.putTileAt(WALL.BLOCK, x, h - 1); // BOT tile empty, use BLOCK fallback
    }

    // Left and right edges
    for (let y = 1; y < h - 1; y++) {
      layer.putTileAt(WALL.LEFT, 0, y);
      layer.putTileAt(WALL.RIGHT, w - 1, y);
    }
  }

  /** Places interior pillars using the safe grey block tile. */
  private static placePillars(layer: Phaser.Tilemaps.TilemapLayer): void {
    for (const [x, y] of PILLARS) {
      layer.putTileAt(WALL.BLOCK, x, y);
    }
  }
}
