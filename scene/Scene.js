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

module.exports = class Scene { // gstateに依存
  constructor(lib) {
    if (lib == undefined) throw new Error('ライブラリが与えられてないぜ。');
    this.pixi = new PIXI.Container();
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
    this.state = 'load'; // シーンの状態を保持
    this.STATE = { // シーンの状態
      load: 'load',
      fadeIn: 'fadeIn',
      fadeOut: 'fadeOut',
      message: 'message',
      change: 'change'
    };
    this.changeOption = null;
  }
  changeScene(options) { // シーン遷移
    this.state = 'change';
    this.changeOptions = options;
    if (options[0].name == 'transit' || options[0].name == 'unfreeze') {
      this.removeAllWindows();
    }
  }
  // pixiの引き継ぎ
  addChild(child) {
    this.pixi.addChild(child);
  }
  removeChild(child) {
    this.pixi.removeChild(child);
  }
  removeChildren() {
    this.pixi.removeChildren();
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
    this.addChild(window.pixi);
    this.window_stack.freeze(window);
  }
  removeWindow() { // ウィンドウを取り除く
    this.pixi.removeChild(this.window_stack.top().pixi);
    this.window_stack.unfreeze();
  }
  removeAllWindows() { // すべてのウィンドウを取り除く
    while (this.window_stack.length() > 1)  {
      this.removeWindow();
    }
  }
};
