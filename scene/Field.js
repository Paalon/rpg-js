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
let SCO = require('./SceneChangeOption.js');

module.exports = class Field extends Scene {
  constructor(info) {
    super(info);
    this.isFade = 'in';
    this.texture = {}; // テクスチャ保管
    this.PLAYER_WALKING_SPEED = 1;
  }
  init() {
    //console.log(this.info);
    // マップ読み込み
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
    let containerMap = this.containerMap = new PIXI.Container();
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
            containerMap.addChild(spritesMap[x][y]);
          }
        }
      }
    }

    // containerMap <- player
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
    player.grid.x = this.status.player.grid.x;
    player.grid.y = this.status.player.grid.y;
    player.isMoving = false;
    player.position.set(WINDOW.TILE_SIZE * player.grid.x, WINDOW.TILE_SIZE * player.grid.y);
    containerMap.addChild(player);

    // kimopen
    let kimopen = this.kimopen = new Human(this.texture.kimopen);
    kimopen.animationSpeed = 0.24;
    kimopen.grid = {};
    kimopen.grid.x = 9;
    kimopen.grid.y = 22;
    kimopen.isMoving = false;
    kimopen.position.set(WINDOW.TILE_SIZE * kimopen.grid.x, WINDOW.TILE_SIZE * kimopen.grid.y);
    containerMap.addChild(kimopen);
    kimopen.play();

    // containerMap -> fieldMap
    this.addChild(containerMap);

    // text
    let text = this.text = new PIXI.Container();
    this.addChild(text);

    // debug
    this.debug = new PIXI.Container();
    //this.addChild(this.debug);
    this.debug.battle = new PIXI.Text('Battle');
    this.debug.addChild(this.debug.battle);
    this.debug.position.set(WINDOW.WIDTH * 0.5, WINDOW.HEIGHT * 0);
    this.addInteractor(this.debug.battle);
    this.debug.battle.on('click', () => {
      this.changeScene([new SCO('freeze', 'Battle')]);
      //this.freeze('Battle', null);
    });

    // fade
    this.fade = new PIXI.Graphics();
    this.fade.beginFill(0x000000);
    this.fade.drawPolygon([0, 0, WINDOW.WIDTH, 0, WINDOW.WIDTH, WINDOW.HEIGHT, 0, WINDOW.HEIGHT]);
    this.fade.endFill();
    this.fade.alpha = 1;
    this.addChild(this.fade);

    // keyboard
    this.addKeyboard('down', () => {}, () => {});
    this.addKeyboard('up', () => {}, () => {});
    this.addKeyboard('right', () => {}, () => {});
    this.addKeyboard('left', () => {}, () => {});
    this.addKeyboard('esc', () => {
      this.changeScene([new SCO('freeze', 'FieldMenu')]);
      this.sound.fx.gun_hit.play();
    }, () => {});
    this.addKeyboard('e', () => {
      this.changeScene([new SCO('freeze', 'FieldMenu')]);
      this.sound.fx.gun_hit.play();
    }, () => {});
    this.addKeyboard('enter', () => {}, () => {});
    this.addKeyboard('z', () => {}, () => {});
    this.addKeyboard('x', () => {}, () => {});
  }
  finish() {
    this.unbindAllKeys();
    this.inactivate();
    this.sound.bgm.main.stop();
  }
  play() {
    this.fadeIn();
    this.bindAllKeys();
    this.activate();
    this.sound.bgm.main.play();
  }

  pause() {
    this.unbindAllKeys();
    this.inactivate();
    this.sound.bgm.main.pause();
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
          this.changeScene([new SCO('freeze', this.next_scene)]);
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
