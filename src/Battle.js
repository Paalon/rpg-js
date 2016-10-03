// Battle.js
// Copyright 2016 Paalon
//
// class Battle
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let WINDOW = require('../WindowSetting.js');
let Scene = require('./Scene.js');
let Fighter = require('./Fighter.js');
let ChoiceText = require('./ChoiceText.js');
let ChoiceWindow = require('./ChoiceWindow.js');
let FileUtil = require('../FileUtil.js');
let WindowStyle = require('./WindowStyle.js');

module.exports = class Battle extends Scene { // gstateに依存
  constructor() {
    super();
  }
  init() { // 初期化処理
    this.bgm = this.lib.sound.bgm.lake_in_the_morning_mist;
    let root = this.root_window;
    // 背景
    root.background = new PIXI.Graphics();
    root.background.beginFill(0x999999);
    root.background.drawPolygon([0, 0, WINDOW.WIDTH, 0, WINDOW.WIDTH, WINDOW.HEIGHT, 0, WINDOW.HEIGHT]);
    root.background.endFill();
    root.addChild(root.background);
    // テキスト
    root.text = new PIXI.Container();
    root.addChild(root.text);
    root.enemies = []; // 敵たち
    root.players = []; // 味方たち
    root.fighter = []; // 戦ってるやつ
    root.player = new Fighter(this.lib.status.player);
    root.fighter.push(root.player);

    // 敵
    root.enemy = new Fighter({
      hp: 1000,
      def_hp: 1000,
      mp: 10,
      def_mp: 10,
      atk: 5,
      def: 5
    });

    root.addChild(root.enemy);
    root.fighter.push(root.enemy);
    //root.enemy.anchor.set(0.5, 0.5);
    root.enemy.position.set(WINDOW.WIDTH * 0.5, WINDOW.HEIGHT * 0.5);
    root.enemy.sprite = new PIXI.Sprite.fromImage('./img/crow.png');
    root.enemy.addChild(root.enemy.sprite);
    root.enemy.sprite.anchor.set(0.5, 0.5);


    // コンソール
    root.text.console = new PIXI.Text('敵が現れた。', {fontSize: 10, fill: 0xffffff});
    root.text.console.anchor.set(0.5, 1);
    root.text.console.position.set(WINDOW.WIDTH * 0.5, WINDOW.HEIGHT);
    root.text.addChild(root.text.console);

    // player status
    root.text.playerHP = new PIXI.Text('HP: ' + root.player.hp, {fontSize: 10, fill: 0xffffff});
    root.text.playerHP.position.set(0, WINDOW.HEIGHT * 0.3);
    root.text.playerMP = new PIXI.Text('MP: ' + root.player.mp, {fontSize: 10, fill: 0xffffff});
    root.text.playerMP.position.set(0, WINDOW.HEIGHT * 0.1);
    root.text.addChild(root.text.playerHP);
    root.text.addChild(root.text.playerMP);

    // enemy status
    root.text.enemyHP = new PIXI.Text('HP: ' + root.enemy.hp, {fontSize: 10, fill: 0xffffff});
    root.text.enemyHP.position.set(WINDOW.WIDTH * 0.5, WINDOW.HEIGHT * 0.3);
    root.text.enemyMP = new PIXI.Text('MP: ' + root.enemy.mp, {fontSize: 10, fill: 0xffffff});
    root.text.enemyMP.position.set(WINDOW.WIDTH * 0.5, WINDOW.HEIGHT * 0.1);
    root.text.addChild(root.text.enemyHP);
    root.text.addChild(root.text.enemyMP);

    //let selected_style = new PIXI.TextStyle({fontSize: 10, fill: 0x990099});
    //let unselected_style = new PIXI.TextStyle({fontSize: 10, fill: 0xffffff});

    let tatakau = new ChoiceText('戦う', () => {
        this.sound.fx.gun_hit.play();
        let dmg_enemy = root.player.attack(root.enemy);
        let dmg_player = root.enemy.attack(root.player);
        this.lib.status.player.hp = root.player.hp;
        this.lib.status.player.mp = root.player.mp;
        root.text.console.text = '敵に' + dmg_enemy + 'のダメージ\n自分に' + dmg_player + 'のダメージ';

        // 終了判定
        if (root.player.hp <= 0) {
          this.change.unfreeze();
          this.change.transit('GameOver');

          //this.changeScene([new sco('unfreeze', null), new sco('transit', 'GameOver')]);
        }
        if (root.enemy.hp <= 0) {
          this.change.unfreeze();
          //this.changeScene([new sco('unfreeze', null)]);
        }
      }
    );
    let mahou = new ChoiceText('魔法', () => {
        console.log('未実装');
        //this.changeScene([new sco('freeze', 'BattleMahou')]);
        /*
        this.sound.fx.gun_fire.play();
        let dmg_enemy = this.player.mahou(this.enemy);
        let dmg_player = this.enemy.attack(this.player);
        this.text.console.text = '敵に' + dmg_enemy + 'のダメージ\n自分に' + dmg_player +'のダメージ';
        if (this.player.hp <= 0) {
          this.changeScene([new sco('unfreeze', null), new sco('transit', 'GameOver')]);
        }
        if (this.enemy.hp <= 0) {
          this.changeScene([new sco('unfreeze', null)]);
        }
        */
      }
    );
    let nigeru = new ChoiceText('逃げる', () => {
        this.change.unfreeze();
      }
    );
    // 選択肢
    let sentakushi = new ChoiceWindow(
      [tatakau, mahou, nigeru],
      new WindowStyle({
        x: WINDOW.WIDTH * 0.6,
        y: WINDOW.HEIGHT * 0.4,
        width: WINDOW.WIDTH * 0.3,
        height: WINDOW.HEIGHT * 0.3,
        unselected_style: {fontSize: 10, fill: 0xffffff}
      })
    );

    this.addWindow(sentakushi);

    /* keyboard */ /*{
      root.addKeyboard('down', () => {}, () => {});
      root.addKeyboard('up', () => {}, () => {});
      root.addKeyboard('right', () => {}, () => {});
      root.addKeyboard('left', () => {}, () => {});
      root.addKeyboard('enter', () => {}, () => {});
      root.addKeyboard('z', () => {}, () => {});
      root.addKeyboard('x', () => {}, () => {});
    }*/
  }
  updateL() {
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
