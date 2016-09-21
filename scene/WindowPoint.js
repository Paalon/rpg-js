// WindowPoint.js
// Copyright 2016 Paalon
//
// class WindowPoint
//

let PIXI = require('pixi.js/bin/pixi.js');

let WindowSetting = require('../WindowsSetting.js');

module.exports = class WindowPoint extends PIXI.Point {
  constructor(x, y) {
    super(WindowSetting.WIDTH * x, WindowSetting.HEIGHT * y);
  }
};
