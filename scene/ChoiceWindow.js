// ChoiceWindow.js
// Copyright 2016 Paalon
//
// class ChoiceWindow
//

let PIXI = require('pixi.js/bin/pixi.js');

let Keyboard = require('./Keyboard.js');

module.exports = class ChoiceWindow extends PIXI.Graphics {
  constructor(choices, style, lib) {
    if (lib == undefined) throw new Error('libがないよ。');
    super(style, lib);
    this.choices = choices;
    this._selected_number = 0; // 選んでいるchoiceの番号
    this.selected = choices[this._selected_number];
    // choices配置
    let num = 0;
    let len = this.choices.length;
    for (let choice of this.choices) {
      choice.style = this.style.unselected_style;
      this.addChild(choice);
      choice.anchor.set(0, 0.5);
      choice.position.set(this.style.x + 12, this.style.y + 4 + (this.style.height - 8) * (2 * num + 1) / (2 * len));
      num++;
    }
    // style解析
    this.style = style;
    // lib
    this.lib = lib;

    // 矢印生成・配置
    this.arrow = new PIXI.Text('>', this.style.unselected_style);
    this.arrow.anchor.set(0, 0.5);
    this.arrow.position = this.selected.position;
    this.arrow.position.x -= 8;
    this.addChild(this.arrow);

    // Keyboard
    this.addKeyboard('down', () => {
      this.next();
    }, () => {});
    this.addKeyboard('up', () => {
      this.back();
    }, () => {});
    this.addKeyboard('z', () => {
      this.done();
    }, () => {});
    this.addKeyboard('x', () => {
      this.cancel();
    }, () => {});
    // キャンセル用
    this.isCancel = false;
  }
  updateGlobal() {
  }
  updateLocal() {
  }
  next() {
    this.lib.sound.fx.gun_fire.play();
    this._selected_number = (this._selected_number + 1) % this.choices.length;
    this.selected = this.choices[this._selected_number];
    this.arrow.position = this.selected.position;
    this.arrow.position.x -= 8;
  }
  back() {
    this.lib.sound.fx.gun_fire.play();
    this._selected_number = (this._selected_number + this.choices.length - 1) % this.choices.length;
    this.selected = this.choices[this._selected_number];
    this.arrow.position = this.selected.position;
    this.arrow.position.x -= 8;
  }
  done() {
    this.lib.sound.fx.gun_fire.play();
    this.selected.done();
  }
  cancel() {
    this.isCancel = true;
  }
};
