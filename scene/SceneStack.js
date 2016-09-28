// SceneStack.js
// Copyright 2016 Paalon
//
// class SceneStack
//

'use strict';

let Scene = require('./Scene.js');

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
    this._stack = [root]; // シーンスタック
    this.lib = lib;
  }
  // 一番最初のシーンを加える
  init() {
    let root = this.top();
    let first_scene = new Scenes.Title(this.lib);
    this._stack.push(first_scene);
    root.addChild(first_scene.pixi);
    first_scene.init();
    first_scene.play();
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
