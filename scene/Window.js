// Window.js
// Copyright 2016 Paalon
//
// class Window
//
// ただのコンテナのウィンドウを生成する。

let PIXI = require('pixi.js/bin/pixi.js');

let Keyboard = require('./Keyboard.js');

module.exports = class Window {
  constructor(lib) {
    if (lib == undefined) throw new Error('Windowのlibが定義されてないぜ。');
    this.pixi = new PIXI.Container();
    this.lib = lib;
    this.keyboard = {}; // キーボード操作
    this.interactor = []; // 止めたり再生したりするもの
    this._state = 'load'; // ウィンドウの状態を保持する
  }
  addChild(child) {
    this.pixi.addChild(child);
  }
  init() {
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
  addInteractor(interactor) {
    this.interactor.push(interactor);
  }
  activate() { // activate interactors
    this.interactor.map((interactor) => {interactor.interactive = true;} );
  }
  inactivate() { // inactivate interactors
    this.interactor.map((interactor) => {interactor.interactive = false;} );
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
