import Phaser from 'phaser';

/**
 * Spawns a short burst of amber spark particles at a point — used wherever a
 * projectile is stopped by a wall. Each spark fades and shrinks as it scatters,
 * and cleans itself up on completion.
 */
export function spawnWallImpact(scene: Phaser.Scene, x: number, y: number): void {
  for (let i = 0; i < 4; i++) {
    const spark = scene.add.circle(x, y, Phaser.Math.Between(2, 4), 0xffcc44, 1);
    spark.setDepth(20);
    scene.tweens.add({
      targets: spark,
      x: x + Phaser.Math.Between(-20, 20),
      y: y + Phaser.Math.Between(-20, 20),
      alpha: 0,
      scale: 0,
      duration: Phaser.Math.Between(100, 200),
      onComplete: () => {
        if (spark && spark.scene) spark.destroy();
      },
    });
  }
}
