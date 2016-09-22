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
    this.window_stack = new WindowStack(this); // Windowスタック
    this.lifetimed = [];
    this.animated = [];
  }
  init() { // 初期化処理
    this.bindAllKeys();
    this.activate();
  }
  finish() {
    this.unbindAllKeys();
    this.inactivate();
  }
  play() {
    this.bindAllKeys();
    this.activate();
  }
  pause() {
    this.unbindAllKeys();
    this.inactivate();
  }
  update() { // 更新処理
    this.window_stack.update();
  }
  updateLocal() {
  }
  updateGlobal() {
  }
  updateLifeTimed() {
    this.lifetimed.map((n) => {
      if (n > 0) {
        n--;
        if (n <= 0) {
          this.lifetimed.stop();
        }
      }
      return n;
    });
  }
  addLifeTimed(lifetimed) {
    this.lifetimed.push(lifetimed);
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
    // todo: keyboardjsに合わせてkeyNameを解析してfixしたほうがいいかも + Keyboard.jsも
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
  addWindow(window) { // ウィンドウを追加する。
    if (window == undefined) throw new Error('ウィンドウが引数に入ってないよ。');
    this.addChild(window);
    this.window_stack.freeze(window);
  }
  removeWindow() {
    this.removeChild(this.window_stack.top());
    this.window_stack.unfreeze();
  }
  removeWindows() {
    while (this.window_stack.length > 1)  {
      this.removeChild(this.window_stack.top());
      this.window_stack.unfreeze();
    }
  }
};
