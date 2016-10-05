// Title.js
// Copyright 2016 Paalon
//
// class Title
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let FileUtil = require('../FileUtil.js');

let Scene = require('./Scene.js');
let WindowPoint = require('./WindowPoint.js');
let WindowStyle = require('./WindowStyle.js');

let ChoiceText = require('./ChoiceText.js');
let ChoiceWindow = require('./ChoiceWindow.js');
let MessageWindow = require('./MessageWindow.js');

module.exports = class Title extends Scene {
  constructor() {
    super();
  }
  init() {
    let root = this.root_window;
    this.bgm = this.lib.sound.bgm.lake_in_the_morning_mist;

    { // textTitle
      let textTitle = root.textTitle = new PIXI.Text('RPG-js', {fontFamily: 'PixelMplus10-Regular', fontSize: 20, fill : 0xffffff, align : 'center'});
      textTitle.anchor.set(0.5, 0.5);
      textTitle.position = new WindowPoint(0.5, 0.4);
      textTitle.on('click', () => {
        this.sound.fx.collision.play();
      });
      root.addInteractor(textTitle);
      root.addChild(textTitle);
    }

    { // buttonStart
      let buttonStart = root.buttonStart = new PIXI.Text('PRESS Z', {fontFamily: 'PixelMplus10-Regular', fontSize: 10, fill: 0xffffff, align: 'center'});
      buttonStart.anchor.set(0.5, 0.5);
      buttonStart.position = new WindowPoint(0.5, 0.6);
      root.addInteractor(buttonStart);
      root.addChild(buttonStart);
    }

    { // keyboard
      root.addKeyboard('z', () => {
        this.sound.fx.done.play();
        /*
        let pw = new StyledWindow({});
        pw.addKeyboardNormal();
        this.addWindow(pw);*/

        let cw = new ChoiceWindow(
          [
            new ChoiceText('はじめから', () => {
              this.lib.sound.fx.start.play();
              this.change.transit('Field');
            }),
            new ChoiceText('めっせーじてすと', () => {
              this.lib.sound.fx.done.play();
              let file = FileUtil.loadFile('./message/test.message');
              let mw = new MessageWindow(file);
              this.addWindow(mw);
            }),
            new ChoiceText('メッセージテスト', () => {
              this.lib.sound.fx.done.play();
              let mw = new MessageWindow('まじかよー#line#またねー#wait#ははは#end#');
              this.addWindow(mw);
            }),
            new ChoiceText('もどる', () => {
              cw.cancel();
            })
          ],
          new WindowStyle()
        );
        this.addWindow(cw);

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
