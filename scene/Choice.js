// Choice.js
// Copyright 2016 Paalon
//
// class Choice
//

let PIXI = require('pixi.js/bin/pixi.js');

module.exports = class Choice extends PIXI.Text {
  constructor(text, style, done) {
    super(text, style);
    this.done = done;
  }
};
