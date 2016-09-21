// ChoiceWindow2.js
// Copyright 2016 Paalon
//
// class ChoiceWindow2
//

let PIXI = require('pixi.js/bin/pixi.js');

let Window = require('./Window.js');
let Keyboard = require('../Keyboard.js');

module.exports = class ChoiceWindow2 extends Window {
  constructor(choices, style) {
    super(style);
    this.choices = choices;
    this._selected_number = 0; // 選んでいるchoiceの番号
    this.selected = choices[this._selected_number];
    // style解析
    this.style =  style;

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
  }
  init() {
    this.bindAllKeys();
  }
  finish() {
    this.unbindAllKeys();
  }
  play() {
    this.bindAllKeys();
  }
  pause() {
    this.unbindAllKeys();
  }
  updateGlobal() {
  }
  updateLocal() {
  }
  next() {
    this._selected_number = (this._selected_number + 1) % this.choices.length;
    this.selected = this.choices[this._selected_number];
  }
  back() {
    this._selected_number = (this._selected_number + this.choices.length - 1) % this.choices.length;
    this.selected = this.choices[this._selected_number];
  }
  done() {
    this.selected.done();
  }
  cancel() {
  }
};
