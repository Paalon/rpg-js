// Scene.js
// Copyright 2016 Paalon
//
// class Scene
//

// シーンを終了するときはすべてのウィンドウを閉じなければならない。

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let WindowStack = require('./WindowStack.js');
let Keyboard = require('../Keyboard.js');

module.exports = class Scene extends PIXI.Container { // gstateに依存
  constructor(lib) {
    if (lib == undefined) throw new Error('lib is not defined');
    super(); // PIXI.Container
    this.change = { // シーンの変化を扱う
      isDoing: false, // シーンの変化をするかどうか
      options: []
    };
    this.lib = lib; // ロードしたものを参照しておく
    this.sound = lib.sound;
    this.status = lib.status;

    this.interactor = []; // 止めたり再生したりするもの
    this.keyboard = {}; // キーボード
    this.window_stack = new WindowStack(this); // Windowスタック
    this.lifetimed = [];
    this.animated = [];
    this.fade = {};
  }
  init() { // 初期化処理
    this.bindAllKeys();
    this.activate();
  }
  finish() {
    this.removeAllWindows();
    this.unbindAllKeys();
    this.inactivate();
  }
  play() {
    this.window_stack.pause();
    this.bindAllKeys();
    this.activate();
  }
  pause() {
    this.pauseAllWindows();
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
    if (options[0].name == 'transit' || options[0].name == 'unfreeze') {
      console.log('シーン遷移したのでリムーブオールウィンドウズ');
      this.removeAllWindows();
    }
  }

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
  removeWindow() { // ウィンドウを取り除く
    this.removeChild(this.window_stack.top());
    console.log('remove window');
    this.window_stack.unfreeze();
  }
  removeAllWindows() {
    while (this.window_stack.length() > 1)  {
      this.removeWindow();
    }
  }
};
