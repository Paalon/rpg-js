// PopUpWindow.js
// Copyright 2016 Paalon
//
// class PopUpWindow
//

let PIXI = require('pixi.js/bin/pixi.js');

let WindowStyle = require('./WindowStyle.js');
let Keyboard = require('./Keyboard.js');

module.exports = class Window extends PIXI.Graphics {
  constructor(styleObj, lib) {
    if (lib == undefined) throw new Error('Windowのlibが定義されてないぜ。');
    let style = new WindowStyle(styleObj); // styleObj解析
    super();
    this.beginFill(style.main_color, style.main_alpha);
    this.lineStyle(style.frame_width, style.frame_color, style.frame_alpha);
    this.drawRect(style.x, style.y, style.width, style.height);
    this.keyboard = {}; // キーボード操作
    this.contents = {}; // 並べる要素を指定するオブジェクト
    this._state = 'load'; // ウィンドウの状態を保持する
    this.style = style;
    this.lib = lib;
    this.interactor = []; // 止めたり再生したりするもの
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
