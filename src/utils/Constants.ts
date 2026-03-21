/** Tile size in pixels */
export const TILE_SIZE = 32;

/** Game viewport width */
export const GAME_WIDTH = 1280;

/** Game viewport height */
export const GAME_HEIGHT = 720;

/** Player movement speed */
export const PLAYER_SPEED = 200;

/** Player max hit points (5 hearts × 2 HP each) */
export const PLAYER_HP = 10;

/** Projectile travel speed in px/s */
export const PROJECTILE_SPEED = 500;

/** Damage per player projectile hit */
export const PROJECTILE_DAMAGE = 3;

/** Minimum ms between player shots (250 = 4 shots/sec) */
export const FIRE_RATE_MS = 250;

/** Dash distance in pixels */
export const DASH_DISTANCE = 80;

/** Dash duration in ms */
export const DASH_DURATION_MS = 150;

/** Dash cooldown in ms */
export const DASH_COOLDOWN_MS = 800;

/** Invulnerability window after taking a hit, in ms */
export const IFRAME_DURATION_MS = 500;

/** Enemy projectile travel speed in px/s */
export const ENEMY_PROJECTILE_SPEED = 300;

/** Damage per enemy projectile hit */
export const ENEMY_PROJECTILE_DAMAGE = 2;

/** Turret enemy HP */
export const TURRET_HP = 9;

/** Turret fire interval in ms */
export const TURRET_FIRE_INTERVAL_MS = 2000;

/** Turret telegraph duration before firing in ms */
export const TURRET_TELEGRAPH_MS = 500;

/** Total rooms per run (5 combat + 1 boss). */
export const ROOMS_PER_RUN = 6;

/** Room dimensions in tiles. */
export const ROOM_W_TILES = 20;
export const ROOM_H_TILES = 11;

/** Display scale for tiles (32px tiles rendered at 64px). */
export const TILE_DISPLAY_SCALE = 2;

/** Effective tile display size in world pixels. */
export const TILE_DISPLAY = TILE_SIZE * TILE_DISPLAY_SCALE;
