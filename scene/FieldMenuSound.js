// FieldMenuSound.js
// Copyright 2016 Paalon
//
// window FieldMenuSound
//

let PIXI = require('pixi.js/bin/pixi.js');

let WINDOW = require('../WindowSetting.js');
let Scene = require('./Scene.js');
let Keyboard = require('../Keyboard.js');
let Choice = require('./Choice.js');
let ChoiceWindow = require('./ChoiceWindow.js');
let sco = require('./SceneChangeOption.js');

module.exports = class FieldMenuSound extends Scene {
  constructor(info) {
    super(info);
  }
  init() {
    // text style
    let selected_style = new PIXI.TextStyle({fontSize: 10, fill: 0x990099});
    let unselected_style = new PIXI.TextStyle({fontSize: 10, fill: 0x444444});

    // choices
    let ageru = new Choice('音量を上げる', selected_style, unselected_style, () => {
      this.sound.BGM_VOLUME += 0.1;
      if (this.sound.BGM_VOLUME > 1) this.sound.BGM_VOLUME = 1;
      for (let key in this.sound.bgm) {
        this.sound.bgm[key].volume(this.sound.BGM_VOLUME);
      }
    });
    let sageru = new Choice('音量を下げる', selected_style, unselected_style, () => {
      this.sound.BGM_VOLUME -= 0.1;
      if (this.sound.BGM_VOLUME < 0) this.sound.BGM_VOLUME = 0;
      for (let key in this.sound.bgm) {
        this.sound.bgm[key].volume(this.sound.BGM_VOLUME);
      }
    });
    let modoru = new Choice('戻る', selected_style, unselected_style, () => {
      this.changeScene([new sco('unfreeze', null)]);
    });
    // sentakushi
    this.sentakushi = new ChoiceWindow(
      [ageru, sageru, modoru],
      selected_style, unselected_style,
      {
        x: WINDOW.WIDTH * 0.55,
        y: WINDOW.HEIGHT * 0.01,
        width: WINDOW.WIDTH * 0.44,
        height: WINDOW.HEIGHT * 0.5
      }
    );
    this.addChild(this.sentakushi);
    // keyboard
    this.keyboard.down = new Keyboard(
      'down',
      () => {
        this.sentakushi.next();
        this.sound.fx.gun_fire.play();
      },
      () => {});
    this.keyboard.up = new Keyboard(
      'up',
      () => {
        this.sentakushi.back();
        this.sound.fx.gun_fire.play();
      },
      () => {}
    );
    this.keyboard.right = new Keyboard(
      'right',
      () => {},
      () => {}
    );
    this.keyboard.left = new Keyboard(
      'left',
      () => {},
      () => {}
    );
    this.keyboard.enter = new Keyboard(
      'enter',
      () => {
        this.sentakushi.selected.done();
        this.sound.fx.gun_fire.play();
      },
      () => {}
    );
    this.keyboard.esc = new Keyboard('esc', () => {
      this.changeScene([new sco('unfreeze', null)]);
      this.sound.fx.gun_fire.play();
    }, () => {});
    this.keyboard.z = new Keyboard(
      'z',
      () => {
        this.sentakushi.selected.done();
        this.sound.fx.gun_fire.play();
      },
      () => {}
    );
    this.keyboard.x = new Keyboard(
      'x',
      () => {
        this.changeScene([new sco('unfreeze', null)]);
        this.sound.fx.gun_fire.play();
      },
      () => {}
    );
  }
  update() {
  }
  play() {
    for (let key in this.keyboard) {
      this.keyboard[key].bind();
    }
    this.activate();
    this.sound.bgm.main.play();
  }
  finish() {
    for (let key in this.keyboard) {
      this.keyboard[key].unbind();
    }
    this.inactivate();
    this.sound.bgm.main.pause();
  }
  pause() {
    for (let key in this.keyboard) {
      this.keyboard[key].unbind();
    }
    this.inactivate();
    this.sound.bgm.main.pause();
  }
};
