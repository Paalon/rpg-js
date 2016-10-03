// WindowPoint.js
// Copyright 2016 Paalon
//
// class WindowPoint
//

let PIXI = require('pixi.js/bin/pixi.js');

let WINDOW = require('../WindowSetting.js');

module.exports = class WindowPoint extends PIXI.Point {
  constructor(x, y) {
    super(WINDOW.WIDTH * x, WINDOW.HEIGHT * y);
  }
};
