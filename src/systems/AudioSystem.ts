import Phaser from 'phaser';

/** Central audio manager for music and SFX. */
export class AudioSystem {
  private scene: Phaser.Scene;
  private currentMusic: Phaser.Sound.BaseSound | null = null;

  private static readonly MUSIC_VOLUME = 0.4;
  private static readonly SFX_VOLUME = 0.6;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /** Starts background music with fade-in and loop. */
  playMusic(key: string, fadeMs = 2000): void {
    if (!this.scene.cache.audio.exists(key)) return;

    this.currentMusic = this.scene.sound.add(key, {
      volume: 0,
      loop: true,
    });
    this.currentMusic.play();

    this.scene.tweens.add({
      targets: this.currentMusic,
      volume: AudioSystem.MUSIC_VOLUME,
      duration: fadeMs,
      ease: 'Linear',
    });
  }

  /** Stops current music with fade-out. */
  stopMusic(fadeMs = 1000): void {
    if (!this.currentMusic || !this.currentMusic.isPlaying) return;

    this.scene.tweens.add({
      targets: this.currentMusic,
      volume: 0,
      duration: fadeMs,
      ease: 'Linear',
      onComplete: () => {
        this.currentMusic?.stop();
        this.currentMusic = null;
      },
    });
  }

  /** Plays a one-shot sound effect. */
  playSFX(key: string): void {
    if (!this.scene.cache.audio.exists(key)) return;
    this.scene.sound.play(key, { volume: AudioSystem.SFX_VOLUME });
  }
}
