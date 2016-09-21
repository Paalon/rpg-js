// GameOver.js
// Copyright 2016 Paalon
//
// scene GameOver
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let Scene = require('./Scene.js');
let WINDOW = require('../WindowSetting.js');
let Keyboard = require('../Keyboard.js');
let sco = require('./SceneChangeOption.js');

module.exports = class GameOver extends Scene {
  constructor(info) {
    super(info);
  }
  init() {
    this.background = new PIXI.Graphics();
    this.addChild(this.background);
    this.background.beginFill();
    this.background.drawRect(0, 0, WINDOW.WIDTH, WINDOW.HEIGHT);

    this.gameover = new PIXI.Text('Game Over', {fontSize: 20, fill: 0xffffff});
    this.addChild(this.gameover);
    this.gameover.anchor.set(0.5, 0.5);
    this.gameover.position.set(WINDOW.WIDTH * 0.5, WINDOW.HEIGHT * 0.5);

    this.keyboard.enter = new Keyboard('enter', () => {
      this.changeScene([new sco('transit', 'Title')]);
      this.status.player.hp = 100;
      this.sound.fx.gameover.play();
    }, () => {});
  }
  play() {
    for (let key in this.keyboard) {
      this.keyboard[key].bind();
    }
    this.activate();
  }
  stop() {
    for (let key in this.keyboard) {
      this.keyboard[key].unbind();
    }
    this.inactivate();
  }
  pause() {
    for (let key in this.keyboard) {
      this.keyboard[key].unbind();
    }
    this.inactivate();
  }
};