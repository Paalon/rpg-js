// BaseWindow.js
// Copyright 2016 Paalon
//
// class BaseWindow
//

let PIXI = require('pixi.js/bin/pixi.js');

let Keyboard = require('./Keyboard.js');

module.exports = class BaseWindow extends PIXI.Container {
  constructor(lib) {
    if (lib == undefined) throw new Error('Windowのlibが定義されてないぜ。');
    super();
    // ウィンドウの状態
    this._state = 'load'; // ウィンドウの状態を保持する
    // 入力
    this.keyboard = {}; // キーボード操作
    this.interactor = []; // 止めたり再生したりするもの
    // 出力
    this.lib = lib;
  }
  init() {
    this.bindAllKeys();
  }
  finish() {
    this.unbindAllKeys();
  }
  play() {
    this.bindAllKeys();
  }
  pause() {
    this.unbindAllKeys();
  }
  updateGlobal() {
  }
  updateLocal() {
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
  activate() { // activate interactors
    this.interactor.map((interactor) => {interactor.interactive = true;} );
  }
  inactivate() { // inactivate interactors
    this.interactor.map((interactor) => {interactor.interactive = false;} );
  }
  addInteractor(interactor) {
    this.interactor.push(interactor);
  }
  setState(state) {
    let hit = false;
    for (let s of STATE) { // enum的な型チェック
      if (state == s) {
        this._state = state;
        hit = true;
      }
    }
    if (hit) throw new Error('指定したstateが変だよ。');
  }
  getState() {
    return this._state;
  }
};

let STATE = { // enum State
  load: 'load',
  fadeIn: 'fadeIn',
  fadeOut: 'fadeOut',
  message: 'message',
  select: 'select'
};
