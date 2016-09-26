// WindowsStack.js
// Copyright 2016 Paalon
//
// class WindowsStack
//

module.exports = class WindowsStack {
  constructor(lib) {
    this._stack = [];
    this.lib = lib;
  }
  update() { // ウィンドウ描写
    for (let win of this._stack) {
      win.updateGlobal(); // グローバルは全部描写
    }
    this.top().updateLocal(); // ローカルはトップだけ描写
  }
  freeze(next_window) { // 一番上にウィンドウを追加する
    this.top().pause();
    this._stack.push(next_window);
    this.top().init();
  }
  unfreeze() { // 一番上のウィンドウを解凍する
    if (this._stack.length == 0) {
      throw new Error("解凍するウィンドウがないよ。");
    } else {
      let old_window = this._stack.pop();
      old_window.finish();
      this.top().play();
    }
  }
  transit(next_window) { // ウィンドウを遷移する
    if (this._stack.length == 0) {
      throw new Error('解凍するウィンドウがないよ。');
    } else {
      let old_window = this._stack.pop();
      old_window.finish();
      this._stack.push(next_window);
      this.top().init();
    }
  }
  top() { // トップのウィンドウを返す
    return this._stack[this._stack.length - 1];
  }
  finish() { // スタックに入っているすべてのwindowを取り除く
    for (let i = 0; i < this._stack.length - 1; i++) {
      this.unfreeze();
    }
  }
  pause() { // スタックに入っているすべてのwindowのkeyboardをunbindする 未実装
  }
  length() {
    return this._stack.length;
  }
};
