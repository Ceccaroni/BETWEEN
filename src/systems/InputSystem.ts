import Phaser from 'phaser';

/** Handles WASD + Arrow key input for movement, firing, and dash. */
export class InputSystem {
  private scene: Phaser.Scene;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private spaceKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const kb = scene.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.wasd = {
      W: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.spaceKey = kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  /** Returns normalized direction vector { x, y } from current input. */
  getDirection(): { x: number; y: number } {
    let x = 0;
    let y = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) x -= 1;
    if (this.cursors.right.isDown || this.wasd.D.isDown) x += 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) y -= 1;
    if (this.cursors.down.isDown || this.wasd.S.isDown) y += 1;

    return { x, y };
  }

  /** Returns true while the fire button (left mouse) is held. */
  isFireDown(): boolean {
    return this.scene.input.activePointer.isDown;
  }

  /** Returns true on the frame space bar is first pressed. */
  isDashPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.spaceKey);
  }

  /** Returns pointer position in world space. */
  getPointerWorld(): Phaser.Math.Vector2 {
    const p = this.scene.input.activePointer;
    return this.scene.cameras.main.getWorldPoint(p.x, p.y);
  }
}
