import Phaser from 'phaser';

/**
 * Transient on-screen banners for the gameplay scene: the room/boss indicator
 * shown on entry, and the toast confirming an acquired boon. Both are
 * screen-fixed, tween in and out, and self-destroy on completion.
 */

/** Flashes "ROOM n" (or "BOSS ROOM") near the top on room entry. */
export function showRoomIndicator(
  scene: Phaser.Scene,
  roomNum: number,
  isBoss: boolean
): void {
  const label = isBoss ? 'BOSS ROOM' : `ROOM ${roomNum}`;
  const color = isBoss ? '#ff4444' : '#aaaaaa';

  const text = scene.add.text(
    scene.cameras.main.width / 2,
    scene.cameras.main.height / 2 - 80,
    label,
    {
      fontFamily: 'monospace',
      fontSize: '32px',
      color,
      stroke: '#000000',
      strokeThickness: 4,
    }
  );
  text.setOrigin(0.5).setScrollFactor(0).setDepth(150).setAlpha(0);

  scene.tweens.add({
    targets: text,
    alpha: 1,
    duration: 300,
    yoyo: true,
    hold: 1000,
    onComplete: () => {
      if (text && text.scene) text.destroy();
    },
  });
}

/** Brief gold toast confirming the boon the player just picked. */
export function showBoonAcquired(scene: Phaser.Scene, boonName: string): void {
  const t = scene.add.text(scene.cameras.main.width / 2, 72, `BOON  ·  ${boonName}`, {
    fontFamily: 'monospace',
    fontSize: '20px',
    color: '#ffd84a',
    stroke: '#000000',
    strokeThickness: 4,
  });
  t.setOrigin(0.5).setScrollFactor(0).setDepth(160).setAlpha(0);
  scene.tweens.add({
    targets: t,
    alpha: 1,
    y: 84,
    duration: 250,
    yoyo: true,
    hold: 1300,
    onComplete: () => {
      if (t && t.scene) t.destroy();
    },
  });
}
