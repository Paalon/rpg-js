// StyledWindow.js
// Copyright 2016 Paalon
//
// class StyledWindow
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let Window = require('./Window.js');
let WindowStyle = require('./WindowStyle.js');

module.exports = class StyledWindow extends Window {
  constructor(styleObj) {
    super();
    let style = new WindowStyle(styleObj); // styleObj解析
    this.pixi = new PIXI.Graphics();
    this.pixi.beginFill(style.main_color, style.main_alpha);
    this.pixi.lineStyle(style.frame_width, style.frame_color, style.frame_alpha);
    this.pixi.drawRect(style.x, style.y, style.width, style.height);
    this.style = style;
  }
  addChild(child) {
    this.pixi.addChild(child);
  }
  removeChild(child) {
    this.pixi.removeChild(child);
  }
  removeChildren() {
    this.pixi.removeChildren();
  }
};
