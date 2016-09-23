// SceneStack.js
// Copyright 2016 Paalon
//
// class SceneStack
//

'use strict';

module.exports = class SceneStack {
  constructor(root, lib) { // PIXIの描写ルートとlib
    this._stack = [root]; // シーンスタック
    this.lib = lib;
  }
  // 一番最初のシーンを加える
  init(first_scene) {
    first_scene.init();
    first_scene.play();
    let root = this.top();
    root.addChild(first_scene);
    this._stack.push(first_scene);
  }
  // シーンを終了して次のシーンへ転換する
  transit(next_scene) {
    let scene = this._stack.pop(); // 今のシーンをポップ
    let parent_scene = this.top(); // 親シーンを取得
    scene.finish(); // シーンの転換に必要な処理
    scene.removeChildren(); // シーンの上に載ってるスプライトをremove
    parent_scene.removeChild(scene); // 親シーンから今のシーンをremove
    this._stack.push(next_scene); // 次のシーンをスタック
    parent_scene.addChild(next_scene); // 親シーンに次のシーンをadd
    next_scene.init(); // 次のシーンの初期化
    next_scene.play();
    scene.change.isDoing = false; // 今のシーンの変化終了
  }
  // シーンを冷凍して次のシーンをプッシュする
  freeze(next_scene) {
    let scene = this.top();
    scene.pause(); // 停止処理
    //scene.freeze();
    this._stack.push(next_scene);
    scene.addChild(next_scene);
    next_scene.init();
    next_scene.play();
    scene.change.isDoing = false;
  }
  // シーンを終了して前のシーンを解凍する
  unfreeze() {
    let scene = this._stack.pop();
    let next_scene = this.top();
    scene.finish();
    next_scene.removeChild(scene);
    scene.removeChildren();
    next_scene.play();
    scene.change.isDoing = false;
  }
  top() {
    return this._stack[this._stack.length - 1];
  }
};
