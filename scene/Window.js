// Window.js
// Copyright 2016 Paalon
//
// class Window
//

let PIXI = require('pixi.js/bin/pixi.js');

let WindowStyle = require('./WindowStyle.js');
let Keyboard = require('../Keyboard.js');

module.exports = class Window extends PIXI.Graphics {
  constructor(styleObj) {
    let style = new WindowStyle(styleObj); // styleObj解析
    super();
    this.beginFill(style.main_color, style.main_alpha);
    this.lineStyle(style.frame_width, style.frame_color, style.frame_alpha);
    this.drawRect(style.x, style.y, style.width, style.height);
    this.keyboard = {}; // キーボード操作
    this.contents = {}; // 並べる要素を指定するオブジェクト
    this.style = style;
  }
  init() {
  }
  finish() {
  }
  play() {
  }
  pause() {
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
};
