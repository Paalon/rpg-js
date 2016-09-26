// TextChoice.js
// Copyright 2016 Paalon
//
// class TextChoice
//

let PIXI = require('pixi.js/bin/pixi.js');

module.exports = class Choice extends PIXI.Sprite {
  constructor(sprite, done) {
    if (done == undefined) throw new Error('完了したときの動作は書いとけよ。');
    super();
    this._sprite = sprite;
    this._done = done;
  }
  done() {
    this._done();
  }
};
