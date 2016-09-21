// Choice.js
// Copyright 2016 Paalon
//
// class Choice
//

let PIXI = require('pixi.js/bin/pixi.js');

module.exports = class Choice extends PIXI.Text {
  constructor(text, selected_style, unselected_style, done) {
    super(text, selected_style);
    this._selected_style = selected_style;
    this._unselected_style = unselected_style;
    this.done = done;
  }
  selected() {
    // this.sound.
    this.style = this._selected_style;
  }
  unselected() {
    this.style = this._unselected_style;
  }
};
