// FieldMenu.js
// Copyright 2016 Paalon
//
// class FieldMenu
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let WINDOW = require('../WindowSetting.js');
let Scene = require('./Scene.js');
let sco = require('./SceneChangeOption.js');
let Choice = require('../Choice.js');
let ChoiceWindow = require('../ChoiceWindow.js');

module.exports = class FieldMenu extends Scene { // gstateに依存
  constructor(info) {
    super(info);
  }
  init() { // 初期化処理
    let selected_style = new PIXI.TextStyle({fontSize: 10, fill: 0x990099});
    let unselected_style = new PIXI.TextStyle({fontSize: 10, fill: 0x444444});

    let mahou = new Choice('魔法', selected_style, unselected_style, () => {
      this.changeScene([new sco('freeze', 'FieldMenuMahou')]);
    });
    let modoru = new Choice('メニューを閉じる', selected_style, unselected_style, () => {
      this.changeScene([new sco('unfreeze', null)]);
      this.sound.fx.gun_fire.play();
    });

    let shuuryou = new Choice('ゲームを終了', selected_style, unselected_style, () => {
      this.changeScene([
        new sco('unfreeze', null),
        new sco('transit', 'Title')
      ]);
      this.sound.fx.gun_fire.play();
    });

    let sound = new Choice('サウンド設定', selected_style, unselected_style, () => {
      this.changeScene([
        new sco('freeze', 'FieldMenuSound')
      ]);
    });

    let tatakau = new Choice('敵と戦う（デバッグ用）', selected_style, unselected_style, () => {
      this.changeScene([
        new sco('unfreeze', null),
        new sco('freeze', 'Battle')
      ]);
    });

    let kaifuku = new Choice('回復する（デバッグ用）', selected_style, unselected_style, () => {
      this.status.player.hp = this.status.player.def_hp;
      this.status.player.mp = this.status.player.def_mp;
      this.text.playerStatus.text = 'ステータス\n' + 'HP: ' + this.status.player.hp + ' / ' + this.status.player.def_hp + '\n' + "MP: " + this.status.player.mp + ' / ' + this.status.player.def_mp;
      this.sound.fx.gun_fire.play();
    });

    // 選択肢
    this.sentakushi = new ChoiceWindow(
      [mahou, modoru, shuuryou, sound, tatakau, kaifuku],
      selected_style,
      unselected_style,
      {
        x: WINDOW.WIDTH * 0.55,
        y: WINDOW.HEIGHT * 0.01,
        width: WINDOW.WIDTH * 0.44,
        height: WINDOW.HEIGHT * 0.5
      }
    );
    this.addChild(this.sentakushi);

    // text
    this.text = new PIXI.Container();
    this.addChild(this.text);

    // text player status
    this.text.playerStatus = new PIXI.Text('ステータス\n' + 'HP: ' + this.status.player.hp + ' / ' + this.status.player.def_hp + '\n' + "MP: " + this.status.player.mp + ' / ' + this.status.player.def_mp);
    this.text.playerStatus.style = new PIXI.TextStyle({fontSize: 10});
    this.text.playerStatus.anchor.set(0, 0);
    this.text.playerStatus.position.set(WINDOW.WIDTH * 0, WINDOW.HEIGHT * 0);
    this.text.addChild(this.text.playerStatus);

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
    this.addKeyboard('enter', () => {this.sentakushi.selected.done();}, () => {});
    this.addKeyboard('esc', () => {
      this.changeScene([new sco('unfreeze', null)]);
      this.sound.fx.gun_fire.play();
    }, () => {});
    this.addKeyboard('e', () => {
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
    this.sound.bgm.main.play();
  }
  stop() {
    this.unbindAllKeys();
    this.inactivate();
    this.sound.bgm.main.pause();
  }
  pause() {
    this.bindAllKeys();
    this.inactivate();
    this.sound.bgm.main.pause();
  }
};
