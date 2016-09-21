// ゲームのプログラム
// Copyright 2016 Paalon
//
// main.js
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');
let SceneStack = require('./SceneStack.js');
let Scene = {
  Title: require('./scene/Title.js'),
  Field: require('./scene/Field.js'),
  FieldMenu: require('./scene/FieldMenu.js'),
  FieldMenuMahou: require('./scene/FieldMenuMahou'),
  FieldMenuSound: require('./scene/FieldMenuSound.js'),
  Battle: require('./scene/Battle.js'),
  BattleMahou: require('./scene/BattleMahou.js'),
  GameOver: require('./scene/GameOver.js')
};
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

// renderのroot
let stage = new PIXI.Container();
// ゲームの状態を保持しているオブジェクトたち
// scene stack
let sceneStack = new SceneStack(stage);

// library
let lib = {
  sound: undefined,
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
lib.sound = loadSound(lib.sound);

// アセットが読み込まれた時に実行される関数
function pixiAssetsLoaded() {
  let first_scene = new Scene.Title(null);
  first_scene.sound = lib.sound;
  first_scene.status = lib.status;
  sceneStack.init(first_scene);
  animate();
}

// フレームの更新
function animate() {
  update();
  requestAnimationFrame(animate);
}

// 描画関数
function update() {
  let scene = sceneStack.top();
  scene.update();   // 一番上に積まれてるシーンをアップデート
  if (scene.change.isDoing) { // シーン遷移
    let options = scene.change.options;
    let info = scene.change.info;
    for (let option of options) {
      let next_scene = null;
      if (option.name !== 'unfreeze') {
        next_scene = new Scene[option.to](info);
        next_scene.sound = lib.sound;
        next_scene.status = lib.status;
      }
      sceneStack[option.name](next_scene);
    }
  }
  renderer.render(stage); // 描画
}

// ロードして実行

// 画像データのあるディレクトリを指定
let dir_paths = ['./img', './map/tile'];
let img_paths = [];
for (let path of dir_paths) {
  let new_paths = FileUtil.loadJSON(path + '/img.json');
  new_paths = new_paths.map((str) => path + '/' + str);
  Array.prototype.push.apply(img_paths, new_paths);
}
let img_number = img_paths.length;

for (let path of img_paths) {
  PIXI.loader.add(path).load(() => {
    img_number--;
    if (img_number == 0) pixiAssetsLoaded();
  });
}
