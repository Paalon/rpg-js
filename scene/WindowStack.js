// WindowsStack.js
// Copyright 2016 Paalon
//
// class WindowsStack
//

module.exports = class WindowsStack {
  constructor(root_scene) {
    this._stack = [root_scene];
  }
  update() { // ウィンドウ描写
    for (let win of this._stack) {
      win.updateGlobal(); // グローバルは全部描写
    }
    this.top().updateLocal(); // ローカルはトップだけ描写
  }
  freeze(next_window) {
    this.top().pause();
    this._stack.push(next_window);
    this.top().init();
  }
  unfreeze() {
    if (this._stack.length == 0) {
      throw new Error("解凍するウィンドウがないよ。");
    } else {
      let old_window = this._stack.pop();
      old_window.finish();
      this.top().play();
    }
  }
  transit(next_window) {
    if (this._stack.length == 0) {
      throw new Error('解凍するウィンドウがないよ。');
    } else {
      let old_window = this._stack.pop();
      old_window.finish();
      this._stack.push(next_window);
      this.top().init();
    }
  }
  top() {
    return this._stack[this._stack.length - 1];
  }
};
