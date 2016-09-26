// WindowMixin.js
// Copyright 2016 Paalon
//
// Mixin Window
//

//let Keyboard = require('../Keyboard.js');

let Window = Base => class extends Base {
  construct(lib) {
    //super();
    this._state = 'load';
    this.keyboard = {};
    this.interactor = [];
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
  /*
  addKeyboard(keyName, pressed, released) {
    // todo: keyboardjsに合わせてkeyNameを解析してfixしたほうがいいかも + Keyboard.jsも
    this.keyboard[keyName] = new Keyboard(keyName, pressed, released);
  }*/
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

module.exports = Window;
