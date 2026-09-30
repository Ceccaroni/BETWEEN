import { defineConfig } from 'vitest/config';

/**
 * Vitest config for Between's pure-logic unit tests.
 *
 * Runs in the `node` environment on purpose: these suites cover deterministic
 * game logic only (no Phaser scenes, no rendering, no DOM). Phaser itself is
 * mocked in the suites that import a Phaser-touching module, so the real engine
 * — which needs a browser/canvas — is never loaded.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
