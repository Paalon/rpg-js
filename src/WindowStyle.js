// WindowStyle.js
// Copyright 2016 Paalon
//
// class WindowStyle
//

let PIXI = require('pixi.js/bin/pixi.js');

let WINDOW = require('../WindowSetting.js');

module.exports = class WindowStyle {
  constructor(options) {
    if (options == undefined) options = {};
    if (options.x == undefined) this.x = WINDOW.WIDTH * 0.2;
    else this.x = options.x;
    if (options.y == undefined) this.y = WINDOW.HEIGHT * 0.2;
    else this.y = options.y;
    if (options.width == undefined) this.width = WINDOW.WIDTH * 0.6;
    else this.width = options.width;
    if (options.height == undefined) this.height = WINDOW.HEIGHT * 0.6;
    else this.height = options.height;
    if (options.main_color == undefined) this.main_color = 0x5f9ea0;
    else this.main_color = options.main_color;
    if (this.main_alpha == undefined) this.main_alpha = 0.8;
    else this.main_alpha = options.main_alpha;
    if (this.frame_width == undefined) this.frame_width = 2;
    else this.frame_width = options.frame_width;
    if (this.frame_color == undefined) this.frame_color = 0x444444;
    else this.frame_color = options.frame_color;
    if (this.frame_alpha == undefined) this.frame_alpha = 0.8;
    else this.frame_alpha = options.frame_alpha;
    //this.selected_style = new PIXI.TextStyle(options.selected_style);
    if (this.unselected_style == undefined) this.unselected_style = new PIXI.TextStyle({fontFamily: 'mplus-2c-light', fontSize: 10, fill: 0xffffff});
    else this.unselected_style = new PIXI.TextStyle(options.unselected_style);
  }
};
