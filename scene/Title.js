// Title.js
// Copyright 2016 Paalon
//
// class Title
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let Scene = require('./Scene.js');
let sco = require('./SceneChangeOption.js');
let WindowPoint = require('./WindowPoint.js');

module.exports = class Title extends Scene {
  constructor(info) {
    super(info);
  }
  init() {
    // textTitle
    let textTitle = this.textTitle = new PIXI.Text('RPG-js', {fontFamily: 'mplus', fontSize: 12, fill : 0xffffff, align : 'center'});
    textTitle.anchor.set(0.5, 0.5);
    textTitle.position = new WindowPoint(0.5, 0.4);
    textTitle.on('click', () => {
      this.sound.fx.collision.play();
    });
    this.addInteractor(textTitle);
    this.addChild(textTitle);

    // buttonStart
    let buttonStart = this.buttonStart = new PIXI.Text('PRESS ENTER', {fontFamily: 'mplus', fontSize: 12, fill: 0xffffff, align: 'center'});
    buttonStart.anchor.set(0.5, 0.5);
    buttonStart.position = new WindowPoint(0.5, 0.6);
    buttonStart.on('click', () => { // fieldMapシーンへ遷移
      this.changeScene([new sco('transit', 'Field')]);
    });
    this.addInteractor(buttonStart);
    this.addChild(buttonStart);

    // keyboard
    this.addKeyboard('enter', () => {
      this.changeScene([new sco('transit', 'Field')]);
    }, () => {});
    this.addKeyboard('down', () => {}, () => {});
    this.addKeyboard('up', () => {}, () => {});
    this.addKeyboard('right', () => {}, () => {});
    this.addKeyboard('left', () => {}, () => {});
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
    this.activate();
    this.bindAllKeys();
  }
  stop() {
    this.inactivate();
    this.unbindAllKeys();
  }
  pause() {
    this.inactivate();
    this.unbindAllKeys();
  }
};
