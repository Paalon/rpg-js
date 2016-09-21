// Title.js
// Copyright 2016 Paalon
//
// class Title
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let WINDOW = require('../WindowSetting.js');
let Scene = require('./Scene.js');
let Keyboard = require('../Keyboard.js');
let sco = require('./SceneChangeOption.js');

module.exports = class Title extends Scene {
  constructor(info) {
    super(info);
  }
  init() {
    // textTitle
    let textTitle = this.textTitle = new PIXI.Text('てきとうRPG', {fontFamily: 'mplus', fontSize: 12, fill : 0xffffff, align : 'center'});
    textTitle.anchor.set(0.5, 0.5);
    textTitle.position.set(WINDOW.WIDTH * 0.5, WINDOW.HEIGHT * 0.4);
    textTitle.on('click', () => {
      this.sound.fx.collision.play();
    });
    this.addChild(textTitle);

    // buttonStart
    let buttonStart = this.buttonStart = new PIXI.Text('PRESS ENTER', {fontFamily: 'mplus', fontSize: 12, fill: 0xffffff, align: 'center'});
    buttonStart.anchor.set(0.5, 0.5);
    buttonStart.position.set(WINDOW.WIDTH * 0.5, WINDOW.HEIGHT * 0.6);
    buttonStart.on('click', () => { // fieldMapシーンへ遷移
      this.changeScene([new sco('transit', 'Field')]);
    });
    this.addChild(buttonStart);

    // keyboard
    this.keyboard.enter = new Keyboard('enter', () => {
      this.changeScene([new sco('transit', 'Field')]);
    }, () => {});
    this.keyboard.down = new Keyboard('down', () => {}, () => {});
    this.keyboard.up = new Keyboard('up', () => {}, () => {});
    this.keyboard.right = new Keyboard('right', () => {}, () => {});
    this.keyboard.left = new Keyboard('left', () => {}, () => {});
  }
  update() {
    if (this.keyboard.down.isDown) {
      this.textTitle.position.y += 1;
    }
    if (this.keyboard.up.isDown) {
      this.textTitle.position.y -= 1;
    }
    if (this.keyboard.left.isDown) {
      this.textTitle.position.x -= 1;
    }
    if (this.keyboard.right.isDown) {
      this.textTitle.position.x += 1;
    }
  }
  play() {
    this.textTitle.interactive = true;
    this.buttonStart.interactive = true;
    for (let key in this.keyboard) {
      this.keyboard[key].bind();
    }
  }
  stop() {
    this.textTitle.interactive = false;
    this.buttonStart.interactive = false;
    for (let key in this.keyboard) {
      this.keyboard[key].unbind();
    }
  }
  pause() {
    this.textTitle.interactive = false;
    this.buttonStart.interactive = false;
    for (let key in this.keyboard) {
      this.keyboard[key].unbind();
    }
  }
};
