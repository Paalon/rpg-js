// PopUpWindow.js
// Copyright 2016 Paalon
//
// class PopUpWindow
//

let PIXI = require('pixi.js/bin/pixi.js');

let Window = require('./Window.js');
let WindowStyle = require('./WindowStyle.js');

module.exports = class PopUpWindow extends Window {
  constructor(styleObj) {
    let style = new WindowStyle(styleObj); // styleObj解析
    super();
    let pixi = this.pixi = new PIXI.Graphics();
    pixi.beginFill(style.main_color, style.main_alpha);
    pixi.lineStyle(style.frame_width, style.frame_color, style.frame_alpha);
    pixi.drawRect(style.x, style.y, style.width, style.height);
    this.contents = {}; // 並べる要素を指定するオブジェクト
    this.style = style;
  }
};
