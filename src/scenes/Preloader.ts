import { SceneKeys, TextureKeys } from '~/consts/index'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.PRELOAD)
  }

  preload() {
    this.load.image(TextureKeys.BACKGROUND, 'assets/bg_layer1.png')
    this.load.image(TextureKeys.PLATFORM, 'assets/ground_grass.png')
    this.load.image(TextureKeys.BUNNY_STAND, 'assets/bunny1_stand.png')
    this.load.image(TextureKeys.BUNNY_JUMP, 'assets/bunny1_jump.png')
    this.load.image(TextureKeys.CARROT, 'assets/carrot.png')

    this.load.audio(TextureKeys.JUMP, 'assets/sfx/phaseJump1.wav')
  }

  create() {
    this.scene.start(SceneKeys.GAME)
  }
}
