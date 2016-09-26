// Scene.js
// Copyright 2016 Paalon
//
// class Scene
//

// シーンを終了するときはすべてのウィンドウを閉じなければならない。

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let BaseWindow = require('./BaseWindow.js');
let WindowStack = require('./WindowStack.js');
let Keyboard = require('../Keyboard.js');

module.exports = class Scene extends PIXI.Container { // gstateに依存
  constructor(lib) {
    if (lib == undefined) throw new Error('lib is not defined');
    super(); // PIXI.Container
    this.lib = lib; // ロードしたものを参照しておく
    this.sound = lib.sound;

    this.keyboard = {}; // キーボード
    this.interactor = []; // 止めたり再生したりするもの

    this.root_window = new Window(lib);
    this.window_stack = new WindowStack(lib);
    this.addWindow(this.root_window);

    this.change = { // シーンの変化を扱う
      isDoing: false, // シーンの変化をするかどうか
      options: []
    };
    this.state = 'load';
    this.STATE = {
      load: 'load',
      fadeIn: 'fadeIn',
      fadeOut: 'fadeOut',
      message: 'message'
    };
  }
  changeScene(options) { // シーン遷移
    this.change.isDoing = true;
    this.change.options = options;
    if (options[0].name == 'transit' || options[0].name == 'unfreeze') {
      this.removeAllWindows();
    }
  }
  init() { // 初期化処理
    this.root_window.bindAllKeys();
    this.root_window.activate();
  }
  finish() {
    this.removeAllWindows();
    this.root_window.unbindAllKeys();
    this.base_window.inactivate();
  }
  play() {
    this.window_stack.pause();
    this.base_window.bindAllKeys();
    this.base_window.activate();
  }
  pause() {
    this.pauseAllWindows();
    this.base_window.unbindAllKeys();
    this.base_window.inactivate();
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
    this.base_window.interactor.push(interactor);
  }
  activate() { // activate interactors
    this.base_window.interactor.map((interactor) => {interactor.interactive = true;} );
  }
  inactivate() { // inactivate interactors
    this.base_window.interactor.map((interactor) => {interactor.interactive = false;} );
  }


  addKeyboard(keyName, pressed, released) {
    // todo: keyboardjsに合わせてkeyNameを解析してfixしたほうがいいかも + Keyboard.jsも
    this.base_window.keyboard[keyName] = new Keyboard(keyName, pressed, released);
  }
  bindAllKeys() { // すべてのキーボードをバインドする。
    for (let key in this.base_window.keyboard) {
      this.base_window.keyboard[key].bind();
    }
  }
  unbindAllKeys() { // すべてのキーボードをアンバインドする。
    for (let key in this.base_window.keyboard) {
      this.base_window.keyboard[key].unbind();
    }
  }
  addWindow(window) { // ウィンドウを追加する。
    if (window == undefined) throw new Error('ウィンドウが引数に入ってないよ。');
    this.addChild(window);
    this.window_stack.freeze(window);
  }
  removeWindow() { // ウィンドウを取り除く
    this.removeChild(this.window_stack.top());
    this.window_stack.unfreeze();
  }
  removeAllWindows() { // すべてのウィンドウを取り除く
    while (this.window_stack.length() > 1)  {
      this.removeWindow();
    }
  }
};
