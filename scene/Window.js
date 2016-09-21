// Window.js
// Copyright 2016 Paalon
//
// class Window
//

let PIXI = require('pixi.js/bin/pixi.js');

module.exports = class Window extends PIXI.Container {
  constructor(options) {
    super();
    this.keyboard = options.keyboard; // キーボード操作
    this.content = options.content;
    this.style = options.style;
  }
  init() {
  }
  stop() {
  }
  pause() {
  }
  play() {
  }
};
