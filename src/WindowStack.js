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
  init(next_window) {
    this._stack.push(next_window);
    this.top().init();
  }
  play() {
    this.top().play();
  }
  update() { // ウィンドウ描写
    for (let win of this._stack) {
      win.updateGlobal(); // グローバルは全部描写
    }
    this.top().updateLocal(); // ローカルはトップだけ描写
  }
  freeze(next_window) { // 一番上にウィンドウを追加する
    if (this.length() == 0) {
      this._stack.push(next_window);
    } else {
      this.top().pause();
      this._stack.push(next_window);
      this.top().init();
    }
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
    if (this._stack.length == 0) throw new Error('ウィンドウスタックに何も入ってないよ。');
    return this._stack[this._stack.length - 1];
  }
  finish() { // スタックに入っているすべてのwindowを取り除く
    for (let i = 0; i < this._stack.length - 1; i++) {
      this.unfreeze();
    }
    this.top().finish();
    console.log('WindowStackの_stackは ' + this._stack);
  }
  pause() { // スタックに入っているすべてのwindowのkeyboardをunbindする 未実装
  }
  length() {
    return this._stack.length;
  }
};
