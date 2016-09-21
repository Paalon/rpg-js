// WindowsStack.js
// Copyright 2016 Paalon
//
// class WindowsStack
//

module.exports = class WindowsStack {
  constructor(root_scene) {
    this._stack = [root_scene];
  }
  update() {
    for (let win of this._stack) {
      win.updateGlobal();
    }
    this.top().updateLocal();
  }
  freeze(next_window) {
    this._stack.top().pause();
    this._stack.push(next_window);
    this._stack.top().init();
  }
  unfreeze() {
    if (this._stack.length == 0) {
      throw new Error("解凍するウィンドウがないよ。");
    } else {
      let old_window = this._stack.pop();
      old_window.finish();
      this._stack.top().play();
    }
  }
  transit(next_window) {
    if (this._stack.length == 0) {
      throw new Error('解凍するウィンドウがないよ。');
    } else {
      let old_window = this._stack.pop();
      old_window.finish();
      this._stack.push(next_window);
      this._stack.top().init();
    }
  }
  top() {
    return this._stack[this._stack.length - 1];
  }
};
