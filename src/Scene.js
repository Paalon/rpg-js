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
  constructor() {
    this.parent = undefined;
    this.lib = undefined; // ロードしたものを参照しておく
    this.sound = undefined;
    this.bgm = undefined; // 今流しているbgm
    this.pixi = new PIXI.Container();
    this.keyboard = {}; // キーボード
    this.interactor = []; // 止めたり再生したりするもの
    this.root_window = new Window();
    this.window_stack = new WindowStack();
    this.addWindow(this.root_window);
    /*
    this.change = { // シーンの変化を扱う
      isDoing: false, // シーンの変化をするかどうか
      options: []
    };
    */
    this.state = 'load'; // シーンの状態を保持
    this.changeOption = null;

    this.change = {
      transit: (scene) => {
        this.finish();
        this.parent.transit(scene);
      },
      freeze: (scene) => {
        this.parent.freeze(scene);
      },
      unfreeze: () => {
        this.parent.unfreeze();
      }
    };
  }

  changeScene(options) { // シーン遷移 deprecated
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

  }
  finish() { // 終了処理
    this.window_stack.finish();
    this.stopBGM();
  }
  play() { // 再開処理
    this.window_stack.play();
    this.playBGM();
  }
  pause() { // 停止処理
    this.window_stack.pause();
    this.pauseBGM();
  }
  update() { // 更新処理
    this.window_stack.update(); // window_stackを更新する
  }
  addWindow(window) { // ウィンドウを追加する。
    if (window == undefined) throw new Error('ウィンドウが引数に入ってないよ。');
    window.parent = this;
    window.lib = this.lib;
    this.addChild(window.pixi);
    this.window_stack.freeze(window);
  }
  removeWindow() { // ウィンドウを取り除く
    this.window_stack.top().parent = undefined;
    this.pixi.removeChild(this.window_stack.top().pixi);
    this.window_stack.unfreeze();
  }
  removeAllWindows() { // すべてのウィンドウを取り除く
    while (this.window_stack.length() > 1)  {
      this.removeWindow();
    }
  }
  playBGM() { // セットされたbgmを再生
    if (this.bgm !== undefined) {
      this.bgm.play();
    }
  }
  pauseBGM() {
    if (this.bgm !== undefined) {
      this.bgm.pause();
    }
  }
  stopBGM() {
    if (this.bgm !== undefined) {
      this.bgm.stop();
    }
  }
  setBGM(bgm) {
    if (this.bgm !== undefined) {
      this.stopBGM();
    }
    this.bgm = bgm;
  }
};
