import { Physics } from 'phaser'
import { SceneKeys } from '~/consts/index'

export default class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKeys.GAME_OVER)
  }

  create() {
    const { width, height } = this.scale
    this.add.text(width * 0.5, height * 0.5, 'Game Over', {
      fontSize: 48
    })
      .setOrigin(0.5)

    this.input.keyboard.once('keydown_SPACE', () => {
      this.scene.start('game')
    })
  }
}
