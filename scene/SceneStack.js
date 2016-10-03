// SceneStack.js
// Copyright 2016 Paalon
//
// class SceneStack
//

'use strict';

let Scenes = {
  Title: require('./Title.js'),
  Field: require('./Field.js'),
  FieldMenu: require('./FieldMenu.js'),
  FieldMenuMahou: require('./FieldMenuMahou'),
  FieldMenuSound: require('./FieldMenuSound.js'),
  Battle: require('./Battle.js'),
  BattleMahou: require('./BattleMahou.js'),
  GameOver: require('./GameOver.js')
};

module.exports = class SceneStack {
  // PIXIのrenderer's root, lib
  constructor(root, lib) {
    this._stack = []; // シーンスタック
    this.root = root;
    this.lib = lib;
  }
  // 一番最初のシーンを加える
  init() {
    let first_scene = new Scenes.Title(this.lib);
    first_scene.parent = this;
    this._stack.push(first_scene);
    this.root.addChild(first_scene.pixi);
    first_scene.init();
    first_scene.play();
  }
  // シーンを終了して次のシーンへ転換する
  transit(next_scene) {
    let present_scene = this._stack.pop(); // 今のシーンをポップ
    present_scene.finish(); // シーンの転換に必要な処理
    present_scene.removeChildren(); // シーンの上に載ってるスプライトをremove
    this.root.removeChild(present_scene); // ルートから今のシーンをremove
    next_scene.parent = this; // 親プロパティを登録
    this._stack.push(next_scene); // 次のシーンをスタック
    this.root.addChild(next_scene); // ルートに次のシーンをadd
    next_scene.init(); // 次のシーンの初期化
    next_scene.play();
    present_scene.state = 'load'; // 今のシーンの変化終了
  }
  // シーンを冷凍して次のシーンをプッシュする
  freeze(next_scene) {
    let present_scene = this.top();
    present_scene.pause(); // 停止処理
    next_scene.parent = this; // 親プロパティを登録
    this._stack.push(next_scene);
    this.root.addChild(next_scene);
    next_scene.init();
    next_scene.play();
    present_scene.state = 'load';
  }
  // シーンを終了して前のシーンを解凍する
  unfreeze() {
    let present_scene = this._stack.pop();
    let next_scene = this.top();
    present_scene.finish();
    this.root.removeChild(present_scene);
    present_scene.removeChildren();
    next_scene.play();
    present_scene.state = 'load';
  }
  top() {
    if (this._stack.length == 0) throw new Error('スタックに何も入ってないよ。');
    return this._stack[this._stack.length - 1];
  }
  update() {
    let top_scene = this.top();
    // update
    top_scene.update();
    // シーン遷移
    if (top_scene.state == 'change') {
      top_scene.change();
    }
  }
  change() {
    let top_scene = this.top();
    let options = top_scene.changeOptions;
    for (let option of options) {
      let next_scene = null;
      if (option.name !== 'unfreeze') { // freeze or transit
        next_scene = new Scenes[option.to](this.lib);
      }
      this[option.name](next_scene);
    }
  }
};
