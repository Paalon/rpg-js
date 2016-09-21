// WindowsStack.js
// Copyright 2016 Paalon
//
// class WindowsStack
//

// 途中

let PIXI = require('pixi.js/bin/pixi.js');

module.exports = class WindowsStack {
  constructor(root_scene) {
    this._stack = [root_scene];
  }
  freeze(window) {
    this._stack.top().pause();
    this._stack.push(window);
    this._stack.top().init();
  }
  unfreeze() {
    if (this._stack.length == 0) {
      throw new Error("解凍するウィンドウがないよ。");
    } else {
      let window = this._stack.pop();
    }
  }
  transit() {
    if (this._stack.length == 0) {
      throw new Error('解凍するウィンドウがないよ。');
    } else {
      this._stack.pop();
    }
  }
  top() {
    return this._stack[this._stack.length - 1];
  }
};
