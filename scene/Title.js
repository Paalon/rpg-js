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
let WindowStyle = require('./WindowStyle.js');
let Choice = require('./Choice.js');
let Window = require('./Window.js');

let ChoiceWindow = require('./ChoiceWindow.js');

module.exports = class Title extends Scene {
  constructor(lib) {
    super(lib);
  }
  init() {
    { // textTitle
      let textTitle = this.textTitle = new PIXI.Text('RPG-js', {fontFamily: 'mplus', fontSize: 12, fill : 0xffffff, align : 'center'});
      textTitle.anchor.set(0.5, 0.5);
      textTitle.position = new WindowPoint(0.5, 0.4);
      textTitle.on('click', () => {
        this.sound.fx.collision.play();
      });
      this.addInteractor(textTitle);
      this.addChild(textTitle);
    }

    { // buttonStart
      let buttonStart = this.buttonStart = new PIXI.Text('PRESS Z', {fontFamily: 'mplus', fontSize: 12, fill: 0xffffff, align: 'center'});
      buttonStart.anchor.set(0.5, 0.5);
      buttonStart.position = new WindowPoint(0.5, 0.6);
      this.addInteractor(buttonStart);
      this.addChild(buttonStart);
    }

    { // keyboard
      this.addKeyboard('z', () => {
        this.sound.fx.gun_fire.play();
        let cw = new ChoiceWindow(
          [
            new Choice('はじめから', {fontSize: 10}, () => {
              //this.removeWindow();
              this.changeScene([new sco('transit', 'Field')]);
            }),
            new Choice('もどる', {fontSize: 10}, () => {
              this.removeWindow();
            })
          ],
          new WindowStyle({x: 50, y: 50, unselected_style: {fontSize: 10, fill: 0xffffff}}),
          this.lib
        );
        this.addWindow(cw);
      }, () => {});
      this.addKeyboard('down', () => {}, () => {});
      this.addKeyboard('up', () => {}, () => {});
      this.addKeyboard('right', () => {}, () => {});
      this.addKeyboard('left', () => {}, () => {});
    }
    this.bindAllKeys();
    this.activate();
  }
  finish() {
    this.inactivate();
    this.unbindAllKeys();
  }
  play() {
    this.activate();
    this.bindAllKeys();
  }
  pause() {
    this.inactivate();
    this.unbindAllKeys();
  }
  updateLocal() {
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
  updateGlobal() {
  }
};
