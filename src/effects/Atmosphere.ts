import Phaser from 'phaser';
import { TILE_DISPLAY, ROOM_W_TILES, ROOM_H_TILES } from '../utils/Constants';

/**
 * Atmosphere factories for the gameplay scene: the running-dust emitter,
 * ambient floating motes, and the dark-edge vignette. Each returns its display
 * object so the scene owns the lifecycle (the dust emitter persists across
 * rooms; motes and vignette are rebuilt per room and destroyed on teardown).
 */

/** Persistent dust emitter kicked up as the player moves (emits on demand). */
export function createDustEmitter(
  scene: Phaser.Scene
): Phaser.GameObjects.Particles.ParticleEmitter {
  const gfx = scene.add.graphics();
  gfx.fillStyle(0x888888, 1);
  gfx.fillCircle(3, 3, 3);
  gfx.generateTexture('dust-particle', 6, 6);
  gfx.destroy();

  const emitter = scene.add.particles(0, 0, 'dust-particle', {
    speed: { min: 10, max: 30 },
    scale: { start: 0.8, end: 0 },
    alpha: { start: 0.5, end: 0 },
    lifespan: 400,
    gravityY: -20,
    emitting: false,
  });
  emitter.setDepth(11);
  return emitter;
}

/** Per-room ambient motes drifting across the room interior. */
export function createAmbientParticles(
  scene: Phaser.Scene
): Phaser.GameObjects.Particles.ParticleEmitter {
  const gfx = scene.add.graphics();
  gfx.fillStyle(0x556688, 1);
  gfx.fillCircle(2, 2, 2);
  gfx.generateTexture('ambient-mote', 4, 4);
  gfx.destroy();

  const emitter = scene.add.particles(0, 0, 'ambient-mote', {
    x: { min: TILE_DISPLAY, max: (ROOM_W_TILES - 1) * TILE_DISPLAY },
    y: { min: TILE_DISPLAY, max: (ROOM_H_TILES - 1) * TILE_DISPLAY },
    speed: { min: 3, max: 8 },
    scale: { start: 0.6, end: 0 },
    alpha: { start: 0.25, end: 0 },
    lifespan: { min: 3000, max: 6000 },
    gravityY: -5,
    frequency: 500,
    quantity: 1,
  });
  emitter.setDepth(12);
  return emitter;
}

/** Per-room dark-edge vignette overlay sized to the room. */
export function createVignette(
  scene: Phaser.Scene,
  width: number,
  height: number
): Phaser.GameObjects.Graphics {
  const gfx = scene.add.graphics();

  const steps = 8;
  for (let i = 0; i < steps; i++) {
    const ratio = i / steps;
    const alpha = 0.15 * (1 - ratio);
    const inset = ratio * Math.min(width, height) * 0.35;
    gfx.fillStyle(0x000000, alpha);
    gfx.fillRect(0, 0, width, inset);
    gfx.fillRect(0, height - inset, width, inset);
    gfx.fillRect(0, 0, inset, height);
    gfx.fillRect(width - inset, 0, inset, height);
  }

  gfx.setDepth(100);
  gfx.setScrollFactor(0);
  return gfx;
}
