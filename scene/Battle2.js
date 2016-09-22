// Battle2.js
// Copyright 2016 Paalon
//
// class Battle2
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let WINDOW = require('../WindowSetting.js');
let Scene = require('./Scene.js');
let Fighter = require('./Fighter.js');
let Choice = require('../Choice.js');
let ChoiceWindow = require('../ChoiceWindow.js');
let sco = require('./SceneChangeOption.js');
let FileUtil = require('../FileUtil.js');

module.exports = class Battle2 extends Scene { // gstateに依存
  constructor(info) {
    super(info);
    // 背景
    this.background = new PIXI.Graphics();
    this.background.beginFill(0x999999);
    this.background.drawPolygon([0, 0, WINDOW.WIDTH, 0, WINDOW.WIDTH, WINDOW.HEIGHT, 0, WINDOW.HEIGHT]);
    this.background.endFill();
    this.addChild(this.background);
    // テキスト
    this.text = new PIXI.Container();
    this.addChild(this.text);
    this.enemies = []; // 敵たち
    this.players = []; // 味方たち
    this.fighter = []; // 戦ってるやつ
  }
  init() { // 初期化処理
    this.player = new Fighter(this.status.player);
    this.fighter.push(this.player);

    // 敵
    this.enemy = new Fighter({
      hp: 1000,
      def_hp: 1000,
      mp: 10,
      def_mp: 10,
      atk: 5,
      def: 5
    });

    this.addChild(this.enemy);
    this.fighter.push(this.enemy);
    //this.enemy.anchor.set(0.5, 0.5);
    this.enemy.position.set(WINDOW.WIDTH * 0.5, WINDOW.HEIGHT * 0.5);
    this.enemy.sprite = new PIXI.Sprite.fromImage('./img/crow.png');
    this.enemy.addChild(this.enemy.sprite);
    this.enemy.sprite.anchor.set(0.5, 0.5);


    // コンソール
    this.text.console = new PIXI.Text('敵が現れた。', {fontSize: 10, fill: 0xffffff});
    this.text.console.anchor.set(0.5, 1);
    this.text.console.position.set(WINDOW.WIDTH * 0.5, WINDOW.HEIGHT);
    this.text.addChild(this.text.console);

    // player status
    this.text.playerHP = new PIXI.Text('HP: ' + this.player.hp, {fontSize: 10, fill: 0xffffff});
    this.text.playerHP.position.set(0, WINDOW.HEIGHT * 0.3);
    this.text.playerMP = new PIXI.Text('MP: ' + this.player.mp, {fontSize: 10, fill: 0xffffff});
    this.text.playerMP.position.set(0, WINDOW.HEIGHT * 0.1);
    this.text.addChild(this.text.playerHP);
    this.text.addChild(this.text.playerMP);

    // enemy status
    this.text.enemyHP = new PIXI.Text('HP: ' + this.enemy.hp, {fontSize: 10, fill: 0xffffff});
    this.text.enemyHP.position.set(WINDOW.WIDTH * 0.5, WINDOW.HEIGHT * 0.3);
    this.text.enemyMP = new PIXI.Text('MP: ' + this.enemy.mp, {fontSize: 10, fill: 0xffffff});
    this.text.enemyMP.position.set(WINDOW.WIDTH * 0.5, WINDOW.HEIGHT * 0.1);
    this.text.addChild(this.text.enemyHP);
    this.text.addChild(this.text.enemyMP);

    // sentakushi window
    let selected_style = new PIXI.TextStyle({fontSize: 10, fill: 0x990099});
    let unselected_style = new PIXI.TextStyle({fontSize: 10, fill: 0xffffff});

    let tatakau = new Choice(
      '戦う', selected_style, unselected_style,
      () => {
        this.sound.fx.gun_hit.play();
        let dmg_enemy = this.player.attack(this.enemy);
        let dmg_player = this.enemy.attack(this.player);
        this.status.player.hp = this.player.hp;
        this.status.player.mp = this.player.mp;
        this.text.console.text = '敵に' + dmg_enemy + 'のダメージ\n自分に' + dmg_player + 'のダメージ';
        if (this.player.hp <= 0) {
          this.changeScene([new sco('unfreeze', null), new sco('transit', 'GameOver')]);
        }
        if (this.enemy.hp <= 0) {
          this.changeScene([new sco('unfreeze', null)]);
        }
      }
    );
    let mahou = new Choice(
      '魔法', selected_style, unselected_style,
      () => {
        this.changeScene([new sco('freeze', 'BattleMahou')]);
      }
    );
    let nigeru = new Choice(
      '逃げる', selected_style, unselected_style,
      () => {
        this.changeScene([new sco('unfreeze', null)]);
      }
    );
    // 選択肢
    let sentakushi = new ChoiceWindow(
      [tatakau, mahou, nigeru],
      selected_style,
      unselected_style,
      {
        x: WINDOW.WIDTH * 0.7,
        y: WINDOW.HEIGHT * 0.6,
        width: WINDOW.WIDTH * 0.29,
        height: WINDOW.HEIGHT * 0.39
      }
    );
    this.addWindow(sentakushi);

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
    }, () => {});
    this.addKeyboard('z', () => {
      this.sentakushi.selected.done();
    }, () => {});
    this.addKeyboard('x', () => {}, () => {});
  }
  finish() {
    this.unbindAllKeys();
    this.inactivate();
    this.sound.bgm.lake_in_the_morning_mist.stop();
  }
  play() {
    this.bindAllKeys();
    this.activate();
    this.sound.bgm.lake_in_the_morning_mist.play();
  }

  pause() {
    this.unbindAllKeys();
    this.inactivate();
    this.sound.bgm.lake_in_the_morning_mist.pause();
  }
  update() {
    this.text.playerHP.text = 'HP: ' + this.player.hp + ' / ' + this.player.def_hp;
    this.text.playerMP.text = 'MP: ' + this.player.mp + ' / ' + this.player.def_mp;
    this.text.enemyHP.text = 'HP: ' + this.enemy.hp;
    this.text.enemyMP.text = 'MP: ' + this.enemy.mp;

    // ダメージ表示の生存時間操作
    for (let fighter of this.fighter) {
      if (fighter.damage.lifetime > 0) {
        fighter.damage.lifetime--;
        if (fighter.damage.lifetime <= 0) {
          for (let text of fighter.damage.texts) {
            fighter.damage.removeChild(text);
          }
          fighter.damage.visible = false;
        }
      }
    }
  }

  win() {
  }
  lose() {

  }
};
