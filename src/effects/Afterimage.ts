import Phaser from 'phaser';

/**
 * Spawns a semi-transparent ghost copy of a sprite that fades out.
 * Used during dash to create a trailing afterimage effect.
 */
export function createAfterimage(
  scene: Phaser.Scene,
  source: Phaser.Physics.Arcade.Sprite,
  tint: number = 0x4488ff
): void {
  const ghost = scene.add.sprite(source.x, source.y, source.texture.key, source.frame.name);
  ghost.setFlipX(source.flipX);
  ghost.setDepth(source.depth - 1);
  ghost.setAlpha(0.5);
  ghost.setTintFill(tint);

  scene.tweens.add({
    targets: ghost,
    alpha: 0,
    duration: 200,
    onComplete: () => ghost.destroy(),
  });
}
