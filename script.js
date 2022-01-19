let game;
const gameState = {}
gameState.coinCount = 0;

// global game options
let gameOptions = {

  // platform speed range, in pixels per second
  platformSpeedRange: [300, 300],

  // spawn range, how far should be the rightmost platform from the right edge
  // before next platform spawns, in pixels
  spawnRange: [80, 300],

  // platform width range, in pixels
  platformSizeRange: [90, 300],

  // a height range between rightmost platform and next platform to be spawned
  platformHeightRange: [-5, 5],

  // a scale to be multiplied by platformHeightRange
  platformHeighScale: 20,

  // platform max and min height, as screen height ratio
  platformVerticalLimit: [0.4, 0.8],

  // player gravity
  playerGravity: 900,

  // player jump force
  jumpForce: 350,

  // player starting X position
  playerStartPosition: 200,

  // consecutive jumps allowed
  jumps: 5,//5

  // % of probability a coin appears on the platform
  coinPercent: 100
}
window.onload = function () {

  // object containing configuration options
  let gameConfig = {
    type: Phaser.AUTO,
    width: 1334,
    height: 750,
    scene: [Morrow, preloadGame, playGame, Ded, Win, doodoo],
    backgroundColor: 0x0c88c7,

    // physics settings
    physics: {
      default: "arcade",
      arcade: {
        enableBody: true,
        debug: false,

      }
    }
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
  resize();
  window.addEventListener("resize", resize, false);
}
class Morrow extends Phaser.Scene {
  constructor() {
    super("Morrow");
  }
  preload() {
    this.load.image('Z', 'ZED.png');
    this.load.image('O', 'CATACLYSM.png');
    this.load.image("Pembrose", "pembrosetriangle.png");
    this.load.image("briks", "pixil-frame-0-11 copy 4.png");
    this.load.image("info", "info.png");
    this.load.audio('music', ['cytadel.mp3', 'cytadel.ogg'])
  }//\n

  create() {
    gameState.briks = this.add.sprite(1050, 510, 'briks').setScale(4.5)
    this.add.text(20, 50, 'Vertigo', { fontSize: '300px', fill: '#ffc800' });
    gameState.Circle = this.add.sprite(1190, 218, 'O').setScale(1)
    this.add.text(150, 300, 'By Talus', { fontSize: '200px', fill: '#ffc800' });
    this.add.text(170, 480, 'With extra sociopathic\n help by b00kNerd', { fontSize: '80px', fill: '#ffc800' });
    this.add.text(400, 680, 'Click to start', { fontSize: '50px', fill: '#ffc800' });
    gameState.z = this.add.sprite(1050, 410, 'Z').setScale(2).setAlpha(1000000)//20, 100
    this.input.on('pointerup', () => {
      // Add your code below:
      this.scene.stop('Morrow')
      this.scene.start('PreloadGame')
    });
    const musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }
    gameState.music = this.sound.add('music', musicConfig);
    gameState.music.play();
    gameState.arkhalis = this.add.rectangle(50, 50, 50, 50, 0x03fc45);
    gameState.arkhalis.setInteractive();
    this.add.sprite(50, 50, 'info').setScale(0.6)
    gameState.arkhalis.on('pointerdown', () => {
      this.scene.stop('Morrow');
      this.scene.start('doodoo');
    });
  }


}
// preloadGame scene
class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {
    this.load.image("platform", "platform.png");
    this.load.image("Pembrose", "pembrosetriangle.png");
    this.load.image("briks", "pixil-frame-0-11 copy 4.png");
    this.load.image("O", "CATACLYSM.png");
    // player is a sprite sheet made by 24x48 pixels
    this.load.spritesheet('player', 'player.png', { frameWidth: 16, frameHeight: 16 });

    // the coin is a sprite sheet made by 20x20 pixels
    this.load.image("coin", "coin.png")

  }
  create() {

    // setting player animation
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
      frameRate: 30,
      repeat: -1
    });


    // setting coin animation
    /*this.anims.create({
      key: "rotate",
      frames: this.anims.generateFrameNumbers("coin", {
        start: 0,
        end: 5
      }),
      frameRate: 15,
      yoyo: true,
      repeat: -1
    });*/
    this.scene.start("PlayGame");
  }
}

// playGame scene
class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  create() {
    gameState.briks = this.physics.add.image(0, 0, 'briks').setOrigin(0, 0).setScale(2.7)
    gameState.briks2 = this.physics.add.image(0, 0, 'briks').setOrigin(0, 0).setScale(2.7)
    gameState.briks3 = this.physics.add.image(0, 0, 'briks').setOrigin(0, 0).setScale(2.7)
    gameState.briks4 = this.physics.add.image(-900, 0, 'briks').setOrigin(0, 0).setScale(2.7)
    gameState.briks5 = this.physics.add.image(-900, 0, 'briks').setOrigin(0, 0).setScale(2.7)

    gameState.briks.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0] - 300, 0));
    gameState.briks2.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0] - 300, gameOptions.platformSpeedRange[1]) - 1);
    gameState.briks3.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0] - 200, -(gameOptions.platformSpeedRange[1])) - 1);
    gameState.briks4.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0] - 300, -(gameOptions.platformSpeedRange[1])) - 1);
    gameState.briks5.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0] - 700, gameOptions.platformSpeedRange[1]) - 1);
    gameState.this = this;
    gameState.coinscountlog = this.add.text(25, 25, ``, { fontSize: '20px', fill: '#ffc800' });

    gameState.jeffery = function (x) {
      let timer = gameState.this.time.addEvent({
        delay: x,
        callback: () => {
          console.log('Reseting Vertigo    -Talus')
          gameState.briks.x = 0;
          gameState.briks2.x = 0;
          gameState.briks3.x = 0;
          gameState.briks4.x = -900;
          gameState.briks5.x = -900;
        }
      })
    }
    for (let i = 0; i < 1000000; i += 10000) {
      gameState.jeffery(10000 + i)
    }
    // keeping track of added platforms
    this.addedPlatforms = 0;

    // group with all active platforms.
    this.platformGroup = this.add.group({

      // once a platform is removed, it's added to the pool
      removeCallback: function (platform) {
        platform.scene.platformPool.add(platform)
      }
    });
    // platform pool
    this.platformPool = this.add.group({

      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback: function (platform) {
        platform.scene.platformGroup.add(platform)
      }
    });

    // group with all active coins.
    this.coinGroup = this.add.group({

      // once a coin is removed, it's added to the pool
      removeCallback: function (coin) {
        coin.scene.coinPool.add(coin)
      }
    });
    //this.coinGroup.setAngularVelocity(200)
    // coin pool
    this.coinPool = this.add.group({

      // once a coin is removed from the pool, it's added to the active coins group
      removeCallback: function (coin) {
        coin.scene.coinGroup.add(coin)
      }
    });

    // number of consecutive jumps made by the player so far
    gameState.playerJumps = 0;

    // adding a platform to the game, the arguments are platform width, x position and y position
    this.addPlatform(game.config.width, game.config.width / 2, game.config.height * gameOptions.platformVerticalLimit[1]);

    // adding the player;
    gameState.player = this.physics.add.sprite(gameOptions.playerStartPosition, game.config.height / 2, "player").setScale(1.7);

    //adding pembrose
    gameState.triangle = this.physics.add.sprite(1374, -(Math.random() * 100) + 400, "Pembrose")
    gameState.triangle.setVelocityX(-300)
    gameState.triangle.setAngularVelocity(200)
    gameState.triangle2 = this.physics.add.sprite(1574, -(Math.random() * 100) + 600, "Pembrose")
    gameState.triangle2.setVelocityX(-300)
    gameState.triangle2.setAngularVelocity(200)
    gameState.triangle3 = this.physics.add.sprite(1474, -(Math.random() * 100) + 200, "Pembrose")
    gameState.triangle3.setVelocityX(-300)
    gameState.triangle3.setAngularVelocity(200)//      this.scene.start("PlayGame");
    this.physics.add.collider(gameState.player, gameState.triangle, function () {
      gameState.this.scene.stop('playGame')

      gameState.this.scene.start('Ded')


    })
    this.physics.add.collider(gameState.player, gameState.triangle2, function () {
      gameState.this.scene.stop('playGame')

      gameState.this.scene.start('Ded')

    })
    this.physics.add.collider(gameState.player, gameState.triangle3, function () {
      gameState.this.scene.stop('playGame')

      gameState.this.scene.start('Ded')

    })
    gameState.triangle4 = this.physics.add.sprite(1000, -(Math.random() * 100) + 400, "Pembrose")
    gameState.triangle4.setVelocityX(-300)
    gameState.triangle4.setAngularVelocity(200)
    gameState.triangle5 = this.physics.add.sprite(1100, -(Math.random() * 100) + 600, "Pembrose")
    gameState.triangle5.setVelocityX(-300)
    gameState.triangle5.setAngularVelocity(200)
    gameState.triangle6 = this.physics.add.sprite(900, -(Math.random() * 100) + 200, "Pembrose")
    gameState.triangle6.setVelocityX(-300)
    gameState.triangle6.setAngularVelocity(200)//      this.scene.start("PlayGame");
    this.physics.add.collider(gameState.player, gameState.triangle4, function () {
      gameState.this.scene.stop('playGame')

      gameState.this.scene.start('Ded')
      //          console.log(gameState.progress)
    })
    this.physics.add.collider(gameState.player, gameState.triangle5, function () {
      gameState.this.scene.stop('playGame')

      gameState.this.scene.start('Ded')

    })
    this.physics.add.collider(gameState.player, gameState.triangle6, function () {
      gameState.this.scene.stop('playGame')

      gameState.this.scene.start('Ded')

    })



    /*this.physics.add.group({
      key: 'spikedball',
      frameQuantity: 6,
      setXY: { x: 0, y: 625, stepX: 150 },
      angularVelocity: 60
    });*/
    /*width: 1334,
    height: 750*/
    gameState.player.setGravityY(gameOptions.playerGravity);

    // setting collisions between the player and the platform group
    this.physics.add.collider(gameState.player, this.platformGroup, function () {

      // play "run" animation if the player is on a platform
      if (!gameState.player.anims.isPlaying) {
        gameState.player.anims.play("run");
      }
    }, null, this);
    gameState.reset = function () {
      gameState.progress = 0;
    }
    gameState.jeff = this.physics.add.sprite(2000, 400, 'O').setAngularVelocity(100).setScale(5)
    this.physics.add.overlap(gameState.player, gameState.jeff, function (player, coin) {
      this.scene.stop('playGame')

      this.scene.start('Win')
    }, null, this);

    gameState.jeff.body.setSize(gameState.jeff.width - 80, gameState.jeff.height - 50).setOffset(40, 50);
    // setting collisions between the player and the coin group
    this.physics.add.overlap(gameState.player, this.coinGroup, function (player, coin) {
      this.tweens.add({
        targets: coin,
        y: coin.y - 100,
        alpha: 0,
        duration: 801,
        ease: "Cubic.easeOut",
        callbackScope: this,
        onComplete: function () {
          this.coinGroup.killAndHide(coin);
          this.coinGroup.remove(coin);
          gameState.reset()
          this.cameras.main.fadeIn(300, 0, 0, 0);

        }
      });
    }, null, this);
    // checking for input
    //console.log(gameState.coinCount)
    this.cameras.main.fadeOut(7000, 0, 0, 0);
    this.input.on("pointerdown", this.jump, this);
    gameState.greg = function (x) {
      let timer2 = gameState.this.time.addEvent({
        delay: x,
        callback: () => {
          console.log('Reseting blood')
          gameState.this.cameras.main.fadeOut(7000, 0, 0, 0);
        }
      })
    }
    for (let Talus = 0; Talus < 1000000; Talus += 10000) {
      gameState.greg(7000 + Talus)
    }
    this.cameras.main.once('camerafadeoutcomplete', function (camera) {
      gameState.this.scene.stop('playGame')

      gameState.this.scene.start('Ded')
    }, this);
    gameState.distance = 0;
    gameState.timer3func = function (x) {
      let timer3 = gameState.this.time.addEvent({
        delay: x,
        callback: () => {
          console.log('doggo')
          gameState.distance++
        }
      })
    }
    for (let doggo = 0; doggo < 1000000; doggo += 10000) {
      gameState.timer3func(7000 + doggo)
    }

  }


  // the core of the script: platform are added from the pool or created on the fly
  addPlatform(platformWidth, posX, posY) {
    this.addedPlatforms++;
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.y = posY;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
      let newRatio = platformWidth / platform.displayWidth;
      platform.displayWidth = platformWidth;
      platform.tileScaleX = 1 / platform.scaleX;
    }
    else {
      platform = this.add.tileSprite(posX, posY, platformWidth, 32, "platform");
      this.physics.add.existing(platform);
      platform.body.setImmovable(true);
      platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
      this.platformGroup.add(platform);
    }
    this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);

    // is there a coin over the platform?
    if (this.addedPlatforms > 1) {
      if (Phaser.Math.Between(1, 100) <= gameOptions.coinPercent) {
        if (this.coinPool.getLength()) {
          let coin = this.coinPool.getFirst();
          coin.x = posX;
          coin.y = posY - 96;
          coin.alpha = 1;
          coin.active = true;
          coin.visible = true;
          this.coinPool.remove(coin);
        }
        else {
          let coin = this.physics.add.sprite(posX, posY - 96, "coin")
          coin.setImmovable(true);
          coin.setVelocityX(platform.body.velocity.x);
          //coin.anims.play("rotate");
          this.coinGroup.add(coin);
        }
      }
    }
  }

  // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
  jump() {

    if (gameState.player.body.touching.down || (gameState.playerJumps > 0 && gameState.playerJumps < gameOptions.jumps)) {
      if (gameState.player.body.touching.down) {
        gameState.playerJumps = 0;
      }
      gameState.player.setVelocityY(gameOptions.jumpForce * -1);
      gameState.playerJumps++;

      // stops animation
      gameState.player.anims.stop();
    }
  }
  update() {
    if (gameState.distance === 10) {
      gameState.jeff.setVelocityX(-200)
    }
    gameState.coinscountlog.setText(`Distance Travled : ${gameState.distance} miles`)
    if (gameState.triangle.x <= 0) {
      gameState.triangle.x = 1374
      gameState.triangle.y = -(Math.random() * 100) + 400
    }
    if (gameState.triangle2.x <= 0) {
      gameState.triangle2.x = 1574
      gameState.triangle2.y = -(Math.random() * 100) + 600
    }
    if (gameState.triangle3.x <= 0) {
      gameState.triangle3.x = 1674
      gameState.triangle3.y = -(Math.random() * 100) + 200
    }
    if (gameState.triangle4.x <= 0) {
      gameState.triangle4.x = 1374
      gameState.triangle4.y = -(Math.random() * 100) + 400
    }
    if (gameState.triangle5.x <= 0) {
      gameState.triangle5.x = 1574
      gameState.triangle5.y = -(Math.random() * 100) + 600
    }
    if (gameState.triangle6.x <= 0) {
      gameState.triangle6.x = 1674
      gameState.triangle6.y = -(Math.random() * 100) + 200
    }
    // game over
    if (gameState.player.y > game.config.height) {
      gameState.this.scene.stop('playGame')

      gameState.this.scene.start('Ded')

    }
    gameState.player.x = gameOptions.playerStartPosition;

    // recycling platforms
    let minDistance = game.config.width;
    let rightmostPlatformHeight = 0;
    this.platformGroup.getChildren().forEach(function (platform) {
      let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
      if (platformDistance < minDistance) {
        minDistance = platformDistance;
        rightmostPlatformHeight = platform.y;
      }
      if (platform.x < - platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    // recycling coins
    this.coinGroup.getChildren().forEach(function (coin) {
      coin.setAngularVelocity(-500)
      //coin.setScale(1)
      if (coin.x < - coin.displayWidth / 2) {
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
      let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
      let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      let minPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[0];
      let maxPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[1];
      let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
      this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
    }
  }
};
function resize() {
  let canvas = document.querySelector("canvas");
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let windowRatio = windowWidth / windowHeight;
  let gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = (windowWidth / gameRatio) + "px";
  }
  else {
    canvas.style.width = (windowHeight * gameRatio) + "px";
    canvas.style.height = windowHeight + "px";
  }
}
class Ded extends Phaser.Scene {
  constructor() {
    super("Ded");
  }
  preload() {
    this.load.image("Pembrose", "pembrosetriangle.png");
    this.load.image("briks", "pixil-frame-0-11 copy 4.png");
  }//\n

  create() {
    function chooseDeathString() {
      let bingo = Math.floor(Math.random() * 6)
      let stringArray = ['You suddenly feel a pain in your head,\nyou look at the moving walls and than the\nworld goes black', 'Your brain, due to the effects of vertigo,\nceased to function', 'You suffered a catastrophic brain aneurysm\nresulting in death', 'The reversal, so close yet so far, faded\n away as the world went black', 'as you attempted to escape from the vertigo,\nthe earth spun, you vaugly noticed spots of\nblood on your yellow shirt, than, everything\nfaded away.', 'As the world spun, blood began gushing from\nyour ears, eyes, and mouth, than you went\nstill.']
      return stringArray[bingo]
    } gameState.briks = this.add.sprite(1050, 510, 'briks').setScale(4.5)
    this.add.text(20, 50, chooseDeathString(), { fontSize: '50px', fill: '#ffc800' });
    this.add.text(200, 600, 'Click to try again', { fontSize: '90px', fill: '#ffc800' });
    const pembrose = this.physics.add.sprite(700, 450, 'Pembrose').setScale(5).setAngularVelocity(600)
    this.input.on('pointerup', () => {
      // Add your code below:
      this.scene.stop('Ded')
      this.scene.start('PreloadGame')
    });

  }

}
class Win extends Phaser.Scene {
  constructor() {
    super("Win");
  }
  preload() {
    this.load.image("briks", "pixil-frame-0-11 copy 4.png");
  }//\n

  create() {
    gameState.briks = this.add.sprite(1050, 510, 'briks').setScale(4.5)
    this.add.text(0, 50, "You escaped the\n   vertigo", { fontSize: '150px', fill: '#ffc800' });
    this.add.text(100, 400, "Take a screenshot for full\n    bragging rights!", { fontSize: '70px', fill: '#ffc800' });
    this.add.text(200, 600, 'Click to go again', { fontSize: '90px', fill: '#ffc800' });
    let timer = gameState.this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.input.on('pointerup', () => {
          // Add your code below:
          this.scene.stop('Win')
          this.scene.start('Morrow')
        });
      }
    })
  }


}
class doodoo extends Phaser.Scene {
  constructor() {
    super("doodoo");
  }
  preload() {
    this.load.image("briks", "pixil-frame-0-11 copy 4.png");
    this.load.image("house", "house.png");

  }//\n

  create() {
    gameState.briks = this.add.sprite(1050, 510, 'briks').setScale(4.5)
    this.add.text(0, 50, "Try to escape from the vertigo\ncollect reversals to prevent the\nworld from going dark.\nfind the portal and escape!\nclick to jump.", { fontSize: '70px', fill: '#ffc800' });
    this.add.text(20, 600, 'Click the button to go to game', { fontSize: '70px', fill: '#ffc800' });
    gameState.arkhalis = this.add.rectangle(50, 35, 50, 50, 0x03fc45);
    gameState.arkhalis.setInteractive();
    this.add.sprite(50, 35, 'house').setScale(0.6)
    gameState.arkhalis.on('pointerdown', () => {
      this.scene.stop('doodoo')
      this.scene.start('Morrow')
    });
  }
}