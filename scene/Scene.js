// Scene.js
// Copyright 2016 Paalon
//
// class Scene
//

// シーンを終了するときはすべてのウィンドウを閉じなければならない。

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let Window = require('./Window.js');
let WindowStack = require('./WindowStack.js');
let Keyboard = require('./Keyboard.js');

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
    this.addWindow(this.root_window);
  }
  finish() { // 終了処理
    this.removeAllWindows();
  }
  play() { // 再開処理
    this.window_stack.play();
  }
  pause() { // 停止処理
    this.pauseAllWindows();
  }
  update() { // 更新処理
    this.window_stack.update(); // window_stackを更新する
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
