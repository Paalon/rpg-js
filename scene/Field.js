// Field.js
// Copyright 2016 Paalon
//
// class Field
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let WINDOW = require('../WindowSetting.js');
let Scene = require('./Scene.js');
let DirectionalTextures = require('./DirectionalTextures.js');
let FileUtil = require('../FileUtil.js');
let Human = require('./Human.js');
let sco = require('./SceneChangeOption.js');
let ChoiceText = require('./ChoiceText.js');
let ChoiceWindow = require('./ChoiceWindow.js');
let WindowStyle = require('./WindowStyle.js');

module.exports = class Field extends Scene {
  constructor() {
    super();
    this.texture = {}; // テクスチャ保管
    this.map = undefined; // マップデータ
    this.PLAYER_WALKING_SPEED = 1;
  }
  init() {
    let root = this.root_window;
    this.bgm = this.lib.sound.bgm.main;

    { // マップ読み込み
      let map_file_name = "./map/sample.json";
      let map = this.map = FileUtil.loadMap(map_file_name);
      // タイルのテクスチャ生成
      let texturesMap = {};
      for (let key in map.tileId) {
        let spriteFrames = FileUtil.fromSpriteSheet("./map/tile", map.tileId[key]);
        texturesMap[key] = spriteFrames;
      }
      // タイルのスプライト生成 tiles -> containerMap
      let spritesMap = [];
      let mapContainer = this.mapContainer = new PIXI.Container();
      for (let x = 0; x < map.size.x; x++) {
        for (let y = 0; y < map.size.y; y++) {
          spritesMap[x] = [];
        }
      }
      for (let x = 0; x < map.size.x; x++) {
        for (let y = 0; y < map.size.y; y++) {
          for (let key in map.tileId) {
            if (map.tile.view[x][y] == key) {
              spritesMap[x][y] = new PIXI.extras.MovieClip(texturesMap[key]);
              spritesMap[x][y].position.set(x * WINDOW.TILE_SIZE, y * WINDOW.TILE_SIZE);
              spritesMap[x][y].animationSpeed = 0.2;
              spritesMap[x][y].play();
              mapContainer.addChild(spritesMap[x][y]);
            }
          }
        }
      }
      root.addChild(mapContainer);
    }
    {
      // people
      this.people = {
        kimopen: 'kimopen',
        player: 'player'
      };
      for (let name in this.people) {
        this.texture[name] = new DirectionalTextures('./img', this.people[name]);
      }
      let player = this.player = new Human(this.texture.player);
      player.animationSpeed = 0.12;
      player.grid = {};
      player.grid.x = this.lib.status.player.grid.x;
      player.grid.y = this.lib.status.player.grid.y;
      player.isMoving = false;
      player.position.set(WINDOW.TILE_SIZE * player.grid.x, WINDOW.TILE_SIZE * player.grid.y);
      this.mapContainer.addChild(player);

      // kimopen
      let kimopen = this.kimopen = new Human(this.texture.kimopen);
      kimopen.animationSpeed = 0.24;
      kimopen.grid = {};
      kimopen.grid.x = 9;
      kimopen.grid.y = 22;
      kimopen.isMoving = false;
      kimopen.position.set(WINDOW.TILE_SIZE * kimopen.grid.x, WINDOW.TILE_SIZE * kimopen.grid.y);
      this.mapContainer.addChild(kimopen);
      kimopen.play();
    }

    // text
    let text = this.text = new PIXI.Container();
    root.addChild(text);

    // debug
    this.debug = new PIXI.Container();
    //root.addChild(this.debug);
    this.debug.battle = new PIXI.Text('Battle');
    this.debug.addChild(this.debug.battle);
    this.debug.position.set(WINDOW.WIDTH * 0.5, WINDOW.HEIGHT * 0);
    root.addInteractor(this.debug.battle);
    this.debug.battle.on('click', () => {
      this.changeScene([new sco('freeze', 'Battle')]);
      //this.freeze('Battle', null);
    });

    // fade
    /*
    this.fade = new PIXI.Graphics();
    this.fade.beginFill(0x000000);
    this.fade.drawPolygon([0, 0, WINDOW.WIDTH, 0, WINDOW.WIDTH, WINDOW.HEIGHT, 0, WINDOW.HEIGHT]);
    this.fade.endFill();
    this.fade.alpha = 1;
    root.addChild(this.fade);
    */
    /* keyboard */ {
      root.addKeyboard('down', () => {}, () => {});
      root.addKeyboard('up', () => {}, () => {});
      root.addKeyboard('right', () => {}, () => {});
      root.addKeyboard('left', () => {}, () => {});
      root.addKeyboard('esc', () => {
        this.sound.fx.gun_hit.play();
        let sentakushi = new ChoiceWindow(
          [
            new ChoiceText('魔法', () => {
              this.addWindow();
            }),
            new ChoiceText('閉じる', () => {
              sentakushi.cancel();
            }),
            new ChoiceText('ゲームを終了', () => {
              this.change.transit('Title');
            }),
            new ChoiceText('サウンド設定', () => {
              this.addWindow();
            }),
            new ChoiceText('敵と戦う（デバッグ用）', () => {
              this.removeWindow();
              this.change.freeze('Battle');
            }),
            new ChoiceText('回復する（デバッグ用）', () => {
              this.lib.status.player.hp = this.lib.status.player.def_hp;
              this.lib.status.player.mp = this.lib.status.player.def_mp;
            })
          ],
          new WindowStyle({x: 50, y: 50, unselected_style: {fontSize: 10, fill: 0xffffff}})
        );
        this.addWindow(sentakushi);

        /*
        let sentakushi = new ChoiceWindow(
          [
            new Choice('魔法', unselected_style, () => {
              let shifo = new Choice('シフォ', unselected_style, () => {
                this.sound.fx.collision.play();
                this.lib.status.player.hp += 200;
                if (this.lib.status.player.hp > this.lib.status.player.def_hp) this.lib.status.player.hp = this.lib.status.player.def_hp;
                this.removeWindow();
                this.removeWindow();
              });
              let olov = new Choice('オロフ', unselected_style, () => {
                this.removeWindow();
                this.removeWindow();
              });
              let modoru = new Choice('戻る', unselected_style, () => {
                this.removeWindow();
              });
              let mahou = new ChoiceWindow(
                [shifo, olov, modoru],
                new WindowStyle({x: 50, y: 50, unselected_style: {fontSize: 10, fill: 0xffffff}}),
                this.lib
              );
              this.addWindow(mahou);
            }),
            new Choice('閉じる', unselected_style, () => {
              this.removeWindow();
              this.sound.fx.gun_fire.play();
            }),
            new Choice('ゲームを終了', unselected_style, () => {
              this.changeScene([new sco('transit', 'Title')]);
              this.sound.fx.gun_fire.play();
            }),
            new Choice('サウンド設定', unselected_style, () => {
            }),
            new Choice('敵と戦う（デバッグ用）', unselected_style, () => {
              this.removeWindow();
              this.changeScene([new sco('freeze', 'Battle')]);
            }),
            new Choice('回復する（デバッグ用）', unselected_style, () => {
              this.lib.status.player.hp = this.lib.status.player.def_hp;
              this.lib.status.player.mp = this.lib.status.player.def_mp;
            })
          ],
          new WindowStyle({x: 50, y: 50, unselected_style: {fontSize: 10, fill: 0xffffff}}),
          this.lib
        );
        this.addWindow(sentakushi);
        */
        //this.changeScene([new sco('freeze', 'FieldMenu')]);
        //this.sound.fx.gun_hit.play();
      }, () => {});
      root.addKeyboard('enter', () => {}, () => {});
      root.addKeyboard('z', () => {}, () => {});
      root.addKeyboard('x', () => {}, () => {});
    }
  }

  updateLocal() {
    switch (this.isFade) {
      case 'in': {
        this.fade.alpha -= 0.05;
        if (this.fade.alpha <= 0) {
          this.fade.alpha = 0;
          this.isFade = 'no';
        }
        break;
      }
      case 'out': {
        this.fade.alpha += 0.05;
        if (this.fade.alpha >= 1) {
          this.fade.alpha = 1;
          this.isFade = 'no';
          this.changeScene([new sco('freeze', this.next_scene)]);
          //this.freeze(this.next_scene, this.next_info);
        }
        break;
      }
      default: {
        // 移動先座標設定
        let player = this.player;
        let keyboard = this.keyboard;
        if (keyboard.left.isDown) { // 押されているとき
          if (!player.isMoving) { // 移動中でないとき
            player.setDirection('left'); // 左を向く
            if (this.map.tile.view[player.grid.x - 1][player.grid.y] !== "1") { // 衝突判定
              player.grid.x -= 1;
              player.isMoving = true;
              player.play();
            }
          }
        }
        if (keyboard.right.isDown) {
          if (!player.isMoving) {
            player.setDirection('right');
            if (this.map.tile.view[player.grid.x + 1][player.grid.y] !== "1") {
              player.grid.x += 1;
              player.isMoving = true;
              player.play();
            }
          }
          //player.position.x += 1;
        }
        if (keyboard.up.isDown) {
          if (!player.isMoving) {
            player.setDirection('back');
            if (this.map.tile.view[player.grid.x][player.grid.y - 1] !== "1") {
              player.grid.y -= 1;
              player.isMoving = true;
              player.play();
            }
          }
          //player.position.y -= 1;
        }
        if (keyboard.down.isDown) {
          if (!player.isMoving) {
            player.setDirection('front');
            if (this.map.tile.view[player.grid.x][player.grid.y + 1] !== "1") {
              player.grid.y += 1;
              player.isMoving = true;
              player.play();
            }
          }
          //player.position.y += 1;
        }
        // プレイヤー移動
        // 多分大丈夫だけどちょっと雑
        if (player.isMoving) {
          let vect = {x: 1, y: 0};
          vect.x = WINDOW.TILE_SIZE * player.grid.x - player.position.x;
          vect.y = WINDOW.TILE_SIZE * player.grid.y - player.position.y;
          let dist = Math.abs(vect.x) + Math.abs(vect.y);
          if (dist < 1) {
            player.position.set(WINDOW.TILE_SIZE * player.grid.x, WINDOW.TILE_SIZE * player.grid.y);
            player.isMoving = false;
            player.gotoAndStop(0);
          } else {
            // 規格化
            let norm = Math.sqrt(vect.x * vect.x + vect.y * vect.y);
            vect.x /= norm;
            vect.y /= norm;
            // 歩く速さを適用
            vect.x *= this.PLAYER_WALKING_SPEED;
            vect.y *= this.PLAYER_WALKING_SPEED;
            player.position.x += vect.x;
            player.position.y += vect.y;
            vect.x = WINDOW.TILE_SIZE * player.grid.x - player.position.x;
            vect.y = WINDOW.TILE_SIZE * player.grid.y - player.position.y;
            let next_dist = Math.abs(vect.x) + Math.abs(vect.y);
            if (dist < next_dist) {
              player.position.set(WINDOW.TILE_SIZE * player.grid.x, WINDOW.TILE_SIZE * player.grid.y);
              player.isMoving = false;
              player.gotoAndStop(0);
            }
          }
          if (player.isMoving == false) { // エンカウント判定
            if (Math.random() < 0.1) {
              this.fadeOut('Battle', null);
            }
          }
        }
        // 画面移動
        this.containerMap.position.set(WINDOW.WIDTH * 0.5 - player.position.x, WINDOW.HEIGHT * 0.5 - player.position.y);
        // 保存
        this.status.player.grid.x = this.player.grid.x;
        this.status.player.grid.y = this.player.grid.y;

        // kimopen
        if (Math.random() < 0.01) {
          this.kimopen.turnLeft();
        }
      }
    }
  }
  updateGlobal() {
  }
  fadeIn() {
    this.isFade = 'in';
  }
  fadeOut(scene, info) {
    this.isFade = 'out';
    this.next_scene = scene;
    this.next_info = info;
  }
};
