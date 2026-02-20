import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './utils/Constants';
import { BootScene } from './scenes/BootScene';
import { SplashScene } from './scenes/SplashScene';
import { TitleScene } from './scenes/TitleScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import { TestScene } from './scenes/TestScene';

/** Phaser game configuration and entry point. */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#000000',
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, SplashScene, TitleScene, GameScene, GameOverScene, TestScene],
};

new Phaser.Game(config);
