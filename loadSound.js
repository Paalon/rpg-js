// loadSound.js
// Copyright 2016 Paalon
//
// function loadSound
//

'use strict';

let Howler = require('howler');

module.exports = function loadSound() {
  let sound = {
    bgm: {},
    fx: {},
    fxNumber: 0,
    FX_MAX_NUMBER: 12,
    BGM_VOLUME: 0.2,
    FX_VOLUME: 0.5,
    DEFAULT_BGM_VOLUME: 0.2,
    DEFAULT_FX_VOLUME: 0.5
  };
  sound.bgm.main = new Howler.Howl(
    {
      src: ['./sound/main.mp3'],
      preload: true,
      loop: true,
      volume: sound.DEFAULT_BGM_VOLUME
      //onload: loaded_number++
    }
  );
  sound.bgm.lake_in_the_morning_mist = new Howler.Howl(
    {
      src: ['./sound/Lake in the Morning Mist.mp3'],
      preload: true,
      loop: true,
      volume: sound.DEFAULT_BGM_VOLUME
    }
  );
  sound.fx.collision = new Howler.Howl({
    src: ['./sound/collision.mp3'],
    preload: true
  });
  sound.fx.gun_fire = new Howler.Howl({
    src: ['./sound/gun_fire.mp3'],
    preload: true
  });
  sound.fx.gun_hit = new Howler.Howl({
    src: ['./sound/gun_hit.mp3'],
    preload: true
  });
  sound.fx.done = new Howler.Howl({
    src: ['./sound/done.mp3'],
    preload: true
  });
  sound.fx.cancel = new Howler.Howl({
    src: ['./sound/cancel.mp3'],
    preload: true
  });
  sound.fx.start = new Howler.Howl({
    src: ['./sound/start.mp3'],
    preload: true
  });
  // fxの共通の設定
  for (let key in sound.fx) {
    sound.fx[key].on('play', () => {sound.fxNumber++;});
    sound.fx[key].on('end', () => {sound.fxNumber--;});
  }
  return sound;
};
