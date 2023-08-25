import Phaser from "phaser";
import FallingObject from "../ui/FallingObject";
import Laser from "../ui/Laser";
export default class CoronaBusterScene extends Phaser.Scene {
  constructor() {
    super("corona-buster-scene");
  }
  init() {
    this.clouds = undefined;
    this.nav_left = false;
    this.nav_right = false;
    this.shoot = false;
    this.player = undefined;
    this.speed = 100;
    this.enemies = undefined;
    this.enemySpeed = 1000;
    this.lasers = undefined;
    this.lastFired = 10;
    this.scoreLabel = undefined;
    this.score = 0;
    this.lifeLabel = undefined;
    this.life = 3;
  }
  preload() {
    this.load.image("background", "images/bg_layer1.png");
    this.load.image("cloud", "images/cloud.png");
    this.load.image("right-btn", "images/right-btn.png");
    this.load.image("left-btn", "images/left-btn.png");
    this.load.image("shoot-btn", "images/shoot-btn.png");
    this.load.spritesheet("player", "images/ship.png", {
      frameWidth: 66,
      frameHeight: 66,
    });
    this.load.image("enemy", "images/enemy.png");
    this.load.spritesheet("laser", "images/laser-bolts.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }
  create() {
    const gameWidth = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;
    this.add.image(gameWidth, gameHeight, "background");
    this.clouds = this.physics.add.group({
      key: "cloud",
      repeat: 10,
    });
    Phaser.Actions.RandomRectangle(
      this.clouds.getChildren(),
      this.physics.world.bounds
    );
    // @ts-ignore
    this.createButton();
    // @ts-ignore
    this.player = this.createPlayer();
    this.enemies = this.physics.add.group({
      classType: FallingObject,
      maxSize: 10,
      runChildUpdate: true,
    });
    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 5000),
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
    this.lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 10,
      runChildUpdate: true,
    });
    this.physics.add.overlap(
      this.lasers,
      this.enemies,
      this.hitEnemy,
      undefined,
      this
    );
    // @ts-ignore
    this.scoreLabel = this.add
      .text(10, 10, "Score", {
        fontSize: "18px",
        fill: "black",
        backgroundColor: "white",
      })
      .setDepth(1);
    this.lifeLabel = this.add
      .text(10, 30, "Life", {
        fontSize: "18px",
        fill: "black",
        backgroundColor: "white",
      })
      .setDepth(1);
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.decreaseLife,
      null,
      this
    );
  }
  // @ts-ignore
  update(time) {
    // @ts-ignore
    this.clouds.children.iterate((child) => {
      // @ts-ignore
      child.setVelocityY(20);
      // @ts-ignore
      if (child.y > this.scale.height) {
        // @ts-ignore
        child.x = Phaser.Math.Between(10, 4);
        child.y = 0;
      }
    });
    this.movePlayer(this.player, time);
    this.scoreLabel.setText("Score : " + this.score);
    this.lifeLabel.setText("Life : " + this.life);
  }
  // @ts-ignore
  createButton() {
    // @ts-ignore
    this.input.addPointer(3);

    // @ts-ignore
    let shoot = this.add
      .image(320, 550, "shoot-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);

    // @ts-ignore
    let nav_left = this.add
      .image(50, 550, "left-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);

    // @ts-ignore
    let nav_right = this.add
      .image(nav_left.x + nav_left.displayWidth + 40, 550, "right-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);
    nav_left.on(
      "pointerdown",
      () => {
        // @ts-ignore
        this.nav_left = true;
      },
      this
    );
    nav_left.on(
      "pointerout",
      () => {
        // @ts-ignore
        this.nav_left = false;
      },
      this
    );
    nav_right.on(
      "pointerdown",
      () => {
        // @ts-ignore
        this.nav_right = true;
      },
      this
    );
    nav_right.on(
      "pointerout",
      () => {
        // @ts-ignore
        this.nav_right = false;
      },
      this
    );
    shoot.on(
      "pointerdown",
      () => {
        // @ts-ignore
        this.shoot = true;
      },
      this
    );
    shoot.on(
      "pointerout",
      () => {
        // @ts-ignore
        this.shoot = false;
      },
      this
    );
  }

  createPlayer() {
    const player = this.physics.add.sprite(200, 450, "player");
    player.setCollideWorldBounds(true);
    this.anims.create({
      key: "turn",
      frames: [
        {
          key: "player",
          frame: 0,
        },
      ],
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
    });
    return player;
  }
  movePlayer(player, time) {
    if (this.nav_left) {
      this.player.setVelocityX(this.speed * -1);
      this.player.anims.play("left", true);
      this.player.setFlipX(false);
    } else if (this.nav_right) {
      this.player.setVelocityX(this.speed);
      this.player.anims.play("right", true);
      this.player.setFlipX(true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }
    if (this.shoot && time > this.lastFired) {
      const laser = this.lasers.get(0, 0, "laser");
      if (laser) {
        laser.fire(this.player.x, this.player.y);
        this.lastFired = time + 300;
      }
    }
  } // @ts-ignore
  spawnEnemy() {
    const config = {
      speed: 30,
      rotation: 0.06,
    };
    const enemy = this.enemies.get(0, 0, "enemy", config);
    const positionX = Phaser.Math.Between(50, 350);
    if (enemy) {
      enemy.spawn(positionX);
    }
  }
  hitEnemy(laser, enemy) {
    laser.die();
    enemy.die();
    this.score += 100;
  }
  decreaseLife(player, enemy) {
    enemy.die();
    this.life--;
    if (this.life == 2) {
      player.setTint(0xff0000);
    } else if (this.life == 1) {
      player.setTint(0xff0000).setAlpha(0.2);
    } else if (this.life == 0) {
      this.scene.start("over-scene", { score: this.score });
    }
  }
}
