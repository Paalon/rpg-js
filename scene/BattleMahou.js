// BattleMahou.js
// Copyright 2016 Paalon
//
// class BattleMahou
//

let PIXI = require('pixi.js/bin/pixi.js');

let WINDOW = require('../WindowSetting.js');
let Scene = require('./Scene.js');
let Keyboard = require('../Keyboard.js');
let Choice = require('../Choice.js');
let ChoiceWindow = require('../ChoiceWindow.js');
let sco = require('./SceneChangeOption.js');

module.exports = class BattleMahou extends Scene {
  constructor(info) {
    super(info);
  }
  init() {
    // text style
    let selected_style = new PIXI.TextStyle({fontSize: 10, fill: 0x990099});
    let unselected_style = new PIXI.TextStyle({fontSize: 10, fill: 0x444444});

    // choices
    let shifo = new Choice('シフォ', selected_style, unselected_style, () => {
      this.sound.fx.collision.play();
      this.status.player.hp += 200;
      if (this.status.player.hp > this.status.player.def_hp) this.status.player.hp = this.status.player.def_hp;
      this.changeScene([new sco('unfreeze', null), new sco('unfreeze', null)]);
    });
    let olov = new Choice('オロフ', selected_style, unselected_style, () => {
      this.changeScene([new sco('unfreeze', null), new sco('unfreeze', null)]);
    });
    let modoru = new Choice('戻る', selected_style, unselected_style, () => {
      this.changeScene([new sco('unfreeze', null)]);
    });
    // sentakushi
    this.sentakushi = new ChoiceWindow(
      [shifo, olov, modoru],
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
    this.addKeyboard('down', () => {
      this.sentakushi.next();
      this.sound.fx.gun_fire.play();
    }, () => {});
    this.addKeyboard('up', () => {
      this.sentakushi.back();
      this.sound.fx.gun_fire.play();
    }, () => {});
    this.addKeyboard('right', () => {}, () => {});
    this.addKeyboard('left', () => {}, () => {});
    this.addKeyboard('enter', () => {
      this.sentakushi.selected.done();
      this.sound.fx.gun_fire.play();
    }, () => {});
    this.addKeyboard('esc', () => {
      this.changeScene([new sco('unfreeze', null)]);
      this.sound.fx.gun_fire.play();
    }, () => {});
    this.addKeyboard('z', () => {
      this.sentakushi.selected.done();
      this.sound.fx.gun_fire.play();
    }, () => {});
    this.addKeyboard('x', () => {
      this.changeScene([new sco('unfreeze', null)]);
      this.sound.fx.gun_fire.play();
    }, () => {});
  }
  update() {
  }
  play() {
    this.bindAllKeys();
    this.activate();
    this.sound.bgm.lake_in_the_morning_mist.play();
  }
  finish() {
    this.unbindAllKeys();
    this.inactivate();
    this.sound.bgm.lake_in_the_morning_mist.pause();
  }
  pause() {
    this.unbindAllKeys();
    this.inactivate();
    this.sound.bgm.lake_in_the_morning_mist.pause();
  }
};
