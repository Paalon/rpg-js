// Window.js
// Copyright 2016 Paalon
//
// class Window
//
// ただのコンテナのウィンドウを生成する。

let PIXI = require('pixi.js/bin/pixi.js');

let Keyboard = require('./Keyboard.js');

module.exports = class Window {
  constructor() {
    // PIXI.Container
    this.pixi = new PIXI.Container();
    // Global library
    this.lib = undefined; // addWindowの際に決定される
    // parent
    this.parent = undefined; // addWindowの際に決定される
    // Keyboard management
    this.keyboard = {}; // キーボード操作
    // Interactor management
    this.interactor = []; // 止めたり再生したりするもの
    // Window state
    this.state = 'init'; // ウィンドウの状態を保持する

    this.updateG = {
      init: () => {},
      fadeIn: () => {},
      fadeOut: () => {},
      play: () => {},
      pause: () => {},
      messageShowing: () => {},
      messageWaiting: () => {},
      finished: () => {}
    };
    this.updateL = {
      init: () => {},
      fadeIn: () => {},
      fadeOut: () => {},
      play: () => {},
      pause: () => {},
      messageShowing: () => {},
      messageWaiting: () => {},
      finished: () => {}
    };
  }
  addChild(child) {
    this.pixi.addChild(child);
  }
  removeChild(child) {
    this.pixi.removeChild(child);
  }
  removeChildren() {
    this.pixi.removeChildren();
  }
  init() {
    this.bindAllKeys();
    this.activate();
    this.state = 'play';
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
    this.updateG[this.state]();
  }
  updateLocal() {
    this.updateL[this.state]();
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
  addKeyboardNormal() { // 通常のキーボード設定を加える
    this.addKeyboard('z', () => {
      this.parent.sound.fx.done.play();
    }, () => {});
    this.addKeyboard('x', () => {
      this.parent.sound.fx.cancel.play();
      this.parent.removeWindow();
    }, () => {});
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
};
