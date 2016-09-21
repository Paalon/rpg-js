// WindowStyle.js
// Copyright 2016 Paalon
//
// class WindowStyle
//

let WINDOW = require('../WindowSetting.js');

module.exports = class WindowStyle {
  constructor(options) {
    if (options.x == undefined) this.x = 0;
    else this.x = options.x;
    if (options.y == undefined) this.y = 0;
    else this.y = options.y;
    if (options.width == undefined) this.width = WINDOW.WIDTH * 0.5;
    else this.width = options.width;
    if (options.height == undefined) this.height = WINDOW.HEIGHT * 0.5;
    else this.height = options.height;
    if (options.main_color == undefined) this.main_color = 0xcc77aa;
    else this.main_color = options.main_color;
    if (this.main_alpha == undefined) this.main_alpha = 0.8;
    else this.main_alpha = options.main_alpha;
    if (this.frame_width == undefined) this.frame_width = 2;
    else this.frame_width = options.frame_width;
    if (this.frame_color == undefined) this.frame_color = 0x444444;
    else this.frame_color = options.frame_color;
    if (this.frame_alpha == undefined) this.frame_alpha = 0.8;
    else this.frame_alpha = options.frame_alpha;
  }
};
