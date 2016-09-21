// Scene.js
// Copyright 2016 Paalon
//
// class Scene
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let WindowStack = require('./WindowStack.js');

module.exports = class Scene extends PIXI.Container { // gstateに依存
  constructor(info) {
    super(); // PIXI.Container
    this.change = {
      isDoing: false, // シーンの変化をするかどうか
      options: [],
      info: null // 次のシーンの生成情報
    };
    this.fade = {};
    this.interactors = []; // 止めたり再生したりするもの
    this.next_scene;
    this.next_info;
    this.info = info;
    this.sound = undefined;
    this.status = undefined;
    this.keyboard = {}; // キーボード
    this.window = new WindowStack(this);
  }
  init() { // 初期化処理

  }
  update() { // 更新処理

  }
  stop() { // 終了処理（bgm）

  }
  play() { // 再生処理（bgm）

  }
  pause() { // 停止処理（bgm）

  }
  activate() {
    this.interactors.map((interactor) => {interactor.interactive = true;} );
  }
  inactivate() {
    this.interactors.map((interactor) => {interactor.interactive = false;} );
  }
  // シーン遷移
  changeScene(options) {
    this.change.isDoing = true;
    this.change.options = options;
  }
  transit(next_scene_name, info) { // 遷移処理
    this.change.isDoing = true;
    this.change.way = 'transit';
    this.change.to = next_scene_name;
    this.change.info = info;
  }
  freeze(next_scene_name, info) { // 冷凍処理
    this.change.isDoing = true;
    this.change.way = 'freeze';
    this.change.to = next_scene_name;
    this.change.info = info;
  }
  unfreeze(info) { // 解凍処理
    this.change.isDoing = true;
    this.change.way = 'unfreeze';
    this.change.info = info;
  }
};
