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
let PopUpWindow = require('./PopUpWindow.js');
let Choice = require('./Choice.js');
let Window = require('./Window.js');

let ChoiceWindow = require('./ChoiceWindow.js');

module.exports = class Title extends Scene {
  constructor(lib) {
    super(lib);
  }
  init() {
    let root = this.root_window;
    this.addWindow(root);

    { // textTitle
      let textTitle = root.textTitle = new PIXI.Text('RPG-js', {fontFamily: 'mplus', fontSize: 12, fill : 0xffffff, align : 'center'});
      textTitle.anchor.set(0.5, 0.5);
      textTitle.position = new WindowPoint(0.5, 0.4);
      textTitle.on('click', () => {
        this.sound.fx.collision.play();
      });
      root.addInteractor(textTitle);
      root.addChild(textTitle);
    }

    { // buttonStart
      let buttonStart = root.buttonStart = new PIXI.Text('PRESS Z', {fontFamily: 'mplus', fontSize: 12, fill: 0xffffff, align: 'center'});
      buttonStart.anchor.set(0.5, 0.5);
      buttonStart.position = new WindowPoint(0.5, 0.6);
      root.addInteractor(buttonStart);
      root.addChild(buttonStart);
    }

    { // keyboard
      root.addKeyboard('z', () => {
        this.sound.fx.gun_fire.play();
        let pw = new PopUpWindow({}, this.lib);
        this.addWindow(pw);
        /*
        let cw = new ChoiceWindow(
          [
            new Choice('はじめから', {fontSize: 10}, () => {
              this.changeScene([new sco('transit', 'Field')]);
            }),
            new Choice('もどる', {fontSize: 10}, () => {
              this.removeWindow();
            })
          ],
          new WindowStyle(),
          this.lib
        );
        root.addWindow(cw);
        */
      }, () => {});
      root.addKeyboard('down', () => {}, () => {});
      root.addKeyboard('up', () => {}, () => {});
      root.addKeyboard('right', () => {}, () => {});
      root.addKeyboard('left', () => {}, () => {});
    }
    root.updateLocal = () => {
      if (root.keyboard.left.isDown) {
        root.textTitle.position.x--;
      }
      if (root.keyboard.right.isDown) {
        root.textTitle.position.x++;
      }
      if (root.keyboard.up.isDown) {
        root.textTitle.position.y--;
      }
      if (root.keyboard.down.isDown) {
        root.textTitle.position.y++;
      }
    };
  }

};
