// Keyboard.js
// Copyright 2016 Paalon
//
// class Keyboard
//

'use strict';

let keyboardJS = require('keyboardjs');

module.exports = class Keyboard {
  constructor(key_name, press_func, release_func) {
    // keyboard
    this.name = key_name;
    this.isDown = false;
    this.isUp = true;
    this.pressHandler = (event) => {
      press_func();
      this.isDown = true;
      this.isUp = false;
      event.preventRepeat();
    };
    this.releaseHandler = () => {
      release_func();
      this.isUp = true;
      this.isDown = false;
    };
  }
  bind() {
    keyboardJS.on(this.name, this.pressHandler, this.releaseHandler);
  }
  unbind() {
    keyboardJS.off(this.name, this.pressHandler, this.releaseHandler);
  }
};
