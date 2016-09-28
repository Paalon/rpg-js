// ゲームのプログラム
// Copyright 2016 Paalon
//
// main.js
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');
let SceneStack = require('./scene/SceneStack.js');
let WINDOW = require('./WindowSetting.js');
let FileUtil = require('./FileUtil.js');
let loadSound = require('./loadSound.js');

// デフォルトのスケールモードを最近傍法にする
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

// rendererの設定
let renderer = PIXI.autoDetectRenderer(
  WINDOW.WIDTH, WINDOW.HEIGHT, {
    backgroundColor: 0x111111,
    resolution: WINDOW.RESOLUTION,
    antialias: false
  },
  false
);
// pixiview要素に描写する
document.getElementById("pixiview").appendChild(renderer.view);

// ゲーム内のグローバル変数
// library ゲームのすべてのパラメータを保持する
let lib = {
  sound: loadSound(),
  status: {
    player: {
      lv: 1,
      exp: 0,
      hp: 1000,
      def_hp: 1000,
      mp: 10,
      def_mp: 10,
      atk: 10,
      def: 10,
      mgc: 10,
      map: 'Field',
      grid: {
        x: 14,
        y: 11
      }
    }
  }
};

// renderのroot
let stage = new PIXI.Container();

// scene stack
let sceneStack = new SceneStack(stage, lib);

// ロード
// 画像データのあるディレクトリを指定
let dir_paths = ['./img', './map/tile'];
let img_paths = [];
for (let path of dir_paths) {
  let new_paths = FileUtil.loadJSON(path + '/img.json');
  new_paths = new_paths.map((str) => path + '/' + str);
  Array.prototype.push.apply(img_paths, new_paths);
}
let img_number = img_paths.length;

// ロードが完全に終わり次第実行
for (let path of img_paths) {
  PIXI.loader.add(path).load(() => {
    img_number--;
    if (img_number == 0) onAssetsLoaded();
  });
}

// アセットが読み込まれた時に実行される関数
let onAssetsLoaded = () => {
  sceneStack.init();
  animate();
};

// フレームの更新
let animate = () => {
  update();
  requestAnimationFrame(animate);
};

// 描画関数
let update = () => {
  sceneStack.update();
  renderer.render(stage);
};
