// Choice.js
// Copyright 2016 Paalon
//
// class Choice
//

let PIXI = require('pixi.js/bin/pixi.js');

module.exports = class Choice extends PIXI.Text {
  constructor(text, style, done) {
    if (done == undefined) throw new Error('完了したときの動作は書いとけよ。');
    super(text, style);
    this._done = done;
  }
  done(option) {
    this._done(option);
  }
};
