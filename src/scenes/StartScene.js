import Phaser from "phaser";
export default class StartScene extends Phaser.Scene {
  constructor() {
    super("start-scene");
  }
  init(data) {
    this.replayButton = undefined;
  }
  preload() {
    this.load.image("background", "images/bg_layer1.png");
    this.load.image("play-button", "images/pleybaton.png");
  }
  create() {
    this.add.image(200, 320, "background");
    this.add.text(15, 200, "CORONA BUSTER", {
      fontSize: "48px",
      fill: "black",
    });
    this.add.text(80, 300, "Press To Play", {
      fontSize: "32px",
      fill: "black",
    });
    this.playButton = this.add
      .image(200, 450, "play-button")
      .setInteractive()
      .setScale(0.15);
    this.playButton.once(
      "pointerup",
      () => {
        this.scene.start("corona-buster-scene");
      },
      this
    );
  }
}
