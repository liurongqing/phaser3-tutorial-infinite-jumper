import { SceneKeys, TextureKeys } from '~/consts/index'
import Carrot from '~/sprites/Carrot'

export default class Game extends Phaser.Scene {
  private platforms: Phaser.Physics.Arcade.StaticGroup
  private player: Phaser.Physics.Arcade.Sprite
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private carrots: Phaser.Physics.Arcade.Group
  private carrotsCollected: number
  private carrotsCollectedText: Phaser.GameObjects.Text

  constructor() {
    super(SceneKeys.GAME)
  }

  init() {
    this.carrotsCollected = 0
  }
  create() {
    const { width, height } = this.scale
    this.add.image(width * 0.5, height * 0.5, TextureKeys.BACKGROUND)
      .setScrollFactor(1, 0)

    this.platforms = this.physics.add.staticGroup()
    this.createPlatforms()

    this.player = this.physics.add.sprite(width * 0.5, height * 0.5, TextureKeys.BUNNY_STAND)
      .setScale(0.5)
      .setBounce(1)

    this.physics.add.collider(this.platforms, this.player)
    this.player.body.checkCollision.up = false
    this.player.body.checkCollision.left = false
    this.player.body.checkCollision.right = false

    this.cameras.main.startFollow(this.player)
    this.cursors = this.input.keyboard.createCursorKeys()
    this.cameras.main.setDeadzone(width * 1.5)

    this.carrots = this.physics.add.group({
      classType: Carrot
    })

    this.physics.add.collider(this.platforms, this.carrots)
    this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this)

    this.carrotsCollectedText = this.add.text(width * 0.5, 10, 'Carrots: 0', {
      color: '#000000',
      fontSize: 24
    })
      .setScrollFactor(0)
      .setOrigin(0.5, 0)

  }

  update() {
    const touchingDown = this.player.body.touching.down
    if (touchingDown) {
      this.player.setVelocityY(-300)
      this.player.setTexture(TextureKeys.BUNNY_JUMP)
      this.sound.play(TextureKeys.JUMP)
    }

    const vy = this.player.body.velocity.y
    if (vy > 0 && this.player.texture.key !== TextureKeys.BUNNY_STAND) {
      this.player.setTexture(TextureKeys.BUNNY_STAND)
    }

    this.platforms.children.iterate(child => {
      const platform = child as Phaser.Physics.Arcade.Sprite
      const scrollY = this.cameras.main.scrollY
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100)
        platform.body.updateFromGameObject()
        this.addCarrotAbove(platform)
      }
    })

    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200)
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200)
    } else {
      this.player.setVelocityX(0)
    }

    this.horizontalWrap(this.player)

    const bottomPlatform = this.findBottomMostPlatform()
    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.start(SceneKeys.GAME_OVER)
    }

  }

  createPlatforms() {

    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(80, 400)
      const y = 150 * i
      const platform: Phaser.Physics.Arcade.Sprite = this.platforms.create(x, y, TextureKeys.PLATFORM)
      platform.setScale(0.5)
      const body = platform.body as Phaser.Physics.Arcade.StaticBody
      body.updateFromGameObject()
    }
  }

  createCarrots() {
    this.carrots = this.physics.add.group({
      classType: Carrot
    })
    this.carrots.get(240, 320, TextureKeys.CARROT)
  }

  horizontalWrap(sprite: Phaser.Physics.Arcade.Sprite) {
    const halfWidth = sprite.displayWidth * 0.5
    const gameWidth = this.scale.width
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth
    }
  }

  addCarrotAbove(sprite: Phaser.Physics.Arcade.Sprite) {
    const y = sprite.y - sprite.displayHeight
    const carrot: Phaser.Physics.Arcade.Sprite = this.carrots.get(sprite.x, y, TextureKeys.CARROT)
    carrot.setActive(true)
    carrot.setVisible(true)
    this.add.existing(carrot)
    carrot.body.setSize(carrot.width, carrot.height)
    this.physics.world.enable(carrot)
    return carrot
  }

  handleCollectCarrot(player, carrot) {
    this.carrots.killAndHide(carrot)
    this.physics.world.disableBody(carrot.body)
    this.carrotsCollected++
    this.carrotsCollectedText.setText(`Carrots: ${this.carrotsCollected}`)
  }

  findBottomMostPlatform() {
    const platforms = this.platforms.getChildren()
    let bottomPlatform = platforms[0] as Phaser.Physics.Arcade.Sprite
    for (let i = 1; i < platforms.length; ++i) {
      const platform = platforms[i] as Phaser.Physics.Arcade.Sprite
      if (platform.y < bottomPlatform.y) {
        continue
      }
      bottomPlatform = platform
    }
    return bottomPlatform
  }
}
