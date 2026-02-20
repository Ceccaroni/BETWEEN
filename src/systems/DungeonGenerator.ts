import Phaser from 'phaser';
import { TILE_SIZE } from '../utils/Constants';

/**
 * Tileset grid: 37 cols x 23 rows at 32x32.
 * Tile index = row * 37 + col.
 * Use TestScene to visually identify tile indices.
 */
const COLS = 37;

/** Tile index helper: (col, row) → frame index. */
function ti(col: number, row: number): number {
  return row * COLS + col;
}

// Known working wall tile from the top-cap section (grey block)
const WALL_TILE = ti(3, 0);

/** Room dimensions in tiles. */
const ROOM_WIDTH = 20;
const ROOM_HEIGHT = 15;

/** Result from room generation. */
export interface RoomData {
  wallLayer: Phaser.Tilemaps.TilemapLayer;
  spawnX: number;
  spawnY: number;
  widthPx: number;
  heightPx: number;
}

/** Generates a single static room. */
export class DungeonGenerator {
  /** Creates a rectangular room with walls and a visible floor. */
  static createRoom(scene: Phaser.Scene): RoomData {
    const widthPx = ROOM_WIDTH * TILE_SIZE;
    const heightPx = ROOM_HEIGHT * TILE_SIZE;

    // Dark floor background rectangle
    scene.add.rectangle(
      widthPx / 2, heightPx / 2,
      (ROOM_WIDTH - 2) * TILE_SIZE, (ROOM_HEIGHT - 2) * TILE_SIZE,
      0x12121e
    );

    // Subtle floor grid lines for tech feel
    const gfx = scene.add.graphics();
    gfx.lineStyle(1, 0x1a1a2e, 0.4);
    for (let x = 1; x < ROOM_WIDTH - 1; x++) {
      gfx.lineBetween(x * TILE_SIZE, TILE_SIZE, x * TILE_SIZE, (ROOM_HEIGHT - 1) * TILE_SIZE);
    }
    for (let y = 1; y < ROOM_HEIGHT - 1; y++) {
      gfx.lineBetween(TILE_SIZE, y * TILE_SIZE, (ROOM_WIDTH - 1) * TILE_SIZE, y * TILE_SIZE);
    }

    // Tilemap for walls (collision layer)
    const map = scene.make.tilemap({
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
      width: ROOM_WIDTH,
      height: ROOM_HEIGHT,
    });

    const tileset = map.addTilesetImage('machine-tileset', 'machine-tileset', TILE_SIZE, TILE_SIZE)!;
    const wallLayer = map.createBlankLayer('walls', tileset)!;

    // Place wall tiles around the border
    for (let x = 0; x < ROOM_WIDTH; x++) {
      for (let y = 0; y < ROOM_HEIGHT; y++) {
        const isBorder = x === 0 || x === ROOM_WIDTH - 1 || y === 0 || y === ROOM_HEIGHT - 1;
        if (isBorder) {
          wallLayer.putTileAt(WALL_TILE, x, y);
        }
      }
    }

    wallLayer.setCollisionByExclusion([-1]);

    return {
      wallLayer,
      spawnX: widthPx / 2,
      spawnY: heightPx / 2,
      widthPx,
      heightPx,
    };
  }
}
