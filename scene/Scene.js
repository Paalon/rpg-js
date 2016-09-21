// Scene.js
// Copyright 2016 Paalon
//
// class Scene
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let WindowStack = require('./WindowStack.js');
let Keyboard = require('../Keyboard.js');

module.exports = class Scene extends PIXI.Container { // gstateに依存
  constructor(info) {
    super(); // PIXI.Container
    this.change = {
      isDoing: false, // シーンの変化をするかどうか
      options: [],
      info: null // 次のシーンの生成情報
    };
    this.fade = {};
    this.interactor = []; // 止めたり再生したりするもの
    this.next_scene;
    this.next_info;
    this.info = info;
    this.sound = undefined;
    this.status = undefined;
    this.keyboard = {}; // キーボード
    this.window = new WindowStack(this); // Winowスタック
    this.lifetimed = [];
  }
  init() { // 初期化処理
  }
  update() { // 更新処理
  }
  updateLifeTimed() {
    this.lifetimed.map(n => --n);
  }
  addLifeTimed(lifetimed) {
    this.lifetimed.push(lifetimed);
  }
  stop() { // 終了処理（bgm）

  }
  play() { // 再生処理（bgm）

  }
  pause() { // 停止処理（bgm）

  }
  addInteractor(interactor) { // インタラクタに追加する。
    this.interactor.push(interactor);
  }
  activate() { // activate interactors
    this.interactor.map((interactor) => {interactor.interactive = true;} );
  }
  inactivate() { // inactivate interactors
    this.interactor.map((interactor) => {interactor.interactive = false;} );
  }
  changeScene(options) { // シーン遷移
    this.change.isDoing = true;
    this.change.options = options;
  }
  /*
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
  }*/

  addKeyboard(keyName, pressed, released) {
    this.keyboard[keyName] = new Keyboard(keyName, pressed, released);
  }
  bindAllKeys() { // すべてのキーボードをバインドする。
    for (let key in this.keyboard) {
      this.keyboard[key].bind();
    }
  }
  unbindAllKeys() { // すべてのキーボードをアンバインドする。
    for (let key in this.keyboard) {
      this.keyboard[key].unbind();
    }
  }
};
