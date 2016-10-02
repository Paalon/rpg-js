// ChoiceText.js
// Copyright 2016 Paalon
//
// class ChoiceText
//

let PIXI = require('pixi.js/bin/pixi.js');

module.exports = class ChoiceText {
  constructor(text, done) {
    if (done == undefined) throw new Error('完了したときの動作は書いとけよ。');
    this.text = new PIXI.Text(text);
    this._done = done;
    this.position = this.text.position;
    this.style = this.text.style;
    this.anchor = this.text.anchor;
  }
  done() {
    this._done();
  }
};
