import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.js";
import "./index.css";
import Phaser from "phaser";
import sky from "./assets/sky.png";
import ground from "./assets/platform.png";
import star from "./assets/ballot.png";
import bomb from "./assets/fraud.jpg";
import dude from "./assets/dude.png";
import trump from "./assets/ballot.png";
import don from "./assets/don.jpg";
import joe from "./assets/joe.jpg";
import joeWins from "./assets/joeWins.jpg";
import cele from "./assets/cele.png";
import saviorSearch from "./assets/saviorSearch.mp3";
import celebration from "./assets/celebration.mp3";

//Phaser config
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

//Creates a new game
const game = new Phaser.Game(config);
var timer;
var milliseconds = 0;
var seconds = 0;
var minutes = 0;

//our game global varibales
let player;
let platforms;
let cursors;
let stars;
let score = 0;
let score2 = 0;
let scoreText;
let scoreText2;
let bombs;
let trumps;

//Preload grabs the images for our game
function preload() {
  this.load.image("sky", sky);
  this.load.image("ground", ground);
  this.load.image("star", star);
  this.load.image("bomb", bomb);
  this.load.image("trump", trump);
  this.load.image("joe", joe);
  this.load.image("don", don);
  this.load.image("joeWins", joeWins);
  this.load.image("cele", cele);
  this.load.audio("saviorSearch", saviorSearch);
  this.load.audio("celebration", celebration);
  this.load.spritesheet("dude", dude, {
    frameWidth: 32,
    frameHeight: 48,
  });
}

//the create function creates the our game world
function create() {
  //the sky background, centered
  this.add.image(400, 300, "sky");
  let joeB = this.add.image(25, 25, "joe").setScale(0.5);
  this.add.image(25, 75, "don").setScale(0.5);
  let scene = this;
  let music = this.sound.add("saviorSearch", { loop: true });
  let celebration = this.sound.add("celebration", { loop: false });
  music.play();
  // //creates timer BROKEN
  // timer = this.add.text(250, 250, "00:00:00");

  //creates platforms as a static group, meaning they they'll stay put
  platforms = this.physics.add.staticGroup();

  //our ground, a platform scaled up, refresh body tells the phsyics to apply after scaling up
  platforms.create(400, 568, "ground").setScale(2).refreshBody();

  //our platforms
  platforms.create(600, 400, "ground");
  platforms.create(50, 250, "ground");
  platforms.create(750, 220, "ground");

  //creates our player
  player = this.physics.add.sprite(100, 450, "dude");

  //our player world interaction settings
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.body.setGravityY(300);

  //Player animation
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  //creates stars, places them around
  stars = this.physics.add.group({
    key: "star",
    repeat: 5,
    setXY: { x: 45, y: 0, stepX: 150 },
  });

  //sets some bouncing animation for all of the stars
  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  //creates trumps, places them around
  trumps = this.physics.add.group({
    key: "trump",
    repeat: 4,
    setXY: { x: 115, y: 0, stepX: 150 },
  });

  //sets some bouncing animation for all of the trumps
  trumps.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  //creates ability to use keyboard
  cursors = this.input.keyboard.createCursorKeys();

  //creates scoreboard
  scoreText = this.add.text(55, 13, "Biden: 0", {
    fontSize: "32px",
    fill: "#000",
  });

  scoreText2 = this.add.text(55, 55, "Trump: 0", {
    fontSize: "32px",
    fill: "#000",
  });

  bombs = this.physics.add.group();

  function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");
    gameOver = true;
  }

  function bidenWins(player) {
    celebration.play();
    music.pause();
    scene.add.image(400, 300, "joeWins").setScale(1.35);
    scene.add.image(150, 200, "cele").setScale(0.25);
    scene.add.image(300, 500, "cele").setScale(0.25);
    scene.add.image(600, 300, "cele").setScale(0.25);
  }

  //our object collision rules
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(trumps, platforms);
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, bombs, hitBomb, null, this);

  //world overlap rules
  this.physics.add.overlap(player, stars, collectStar, null, this);
  this.physics.add.overlap(player, trumps, collectTrump, null, this);

  function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText("Biden: " + score);
    if (score === 10) bidenWins();

    if (stars.countActive(true) === 0 && trumps.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      trumps.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  function collectTrump(player, trump) {
    trump.disableBody(true, true);
    score2 += 10;
    scoreText2.setText("Trump: " + score2);

    if (stars.countActive(true) === 0 && trumps.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      trumps.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-175, 175), 20);
    }
  }
}

//update is where set our controls
function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-550);
  }

  // this.tweens.add({
  //   targets: joeB,
  //   y: 450,
  //   duration: 2000,
  //   ease: "Power2",
  //   yoyo: true,
  //   loop: -1,
  // });
}

// function updateTimer() {
//   minutes = Math.floor(game.time.time / 60000) % 60;
//   seconds = Math.floor(game.time.time / 1000) % 60;
//   milliseconds = Math.floor(game.time.time) % 100;
// }

// updateTimer();
//}

ReactDOM.render(<App />, document.getElementById("app"));

// var game = new Phaser.Game(800, 600, Phaser.AUTO, { preload: preload, create: create, update: update });function preload() {    game.load.bitmapFont('desyrel', '/assets/fonts/desyrel.png', '/assets/fonts/desyrel.xml');}var textStyle = { font: '64px Desyrel', align: 'center'};var timer;var milliseconds = 0;var seconds = 0;var minutes = 0;function create() {    timer = game.add.bitmapText(250, 250, '00:00:00', textStyle);}function update() {    //Calling a different function to update the timer just cleans up the update loop if you have other code.
//       updateTimer();}function updateTimer() {    minutes = Math.floor(game.time.time / 60000) % 60;    seconds = Math.floor(game.time.time / 1000) % 60;    milliseconds = Math.floor(game.time.time) % 100;    //If any of the digits becomes a single digit number, pad it with a zero    if (milliseconds < 10)        milliseconds = '0' + milliseconds;    if (seconds < 10)        seconds = '0' + seconds;    if (minutes < 10)        minutes = '0' + minutes;    timer.setText(minutes + ':'+ seconds + ':' + milliseconds);}
