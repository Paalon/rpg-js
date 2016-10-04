// MessageWindow.js
// Copyright 2016 Paalon
//
// class MessageWindow
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let StyledWindow = require('./StyledWindow.js');

module.exports = class MessageWindow extends StyledWindow {
  constructor(message, style) {
    super(style);
    this.message = message;
    this.cool = 0;
    this.coolingInterval = 3;
  }
  init() {
    this.splitMessage = this.message.split('');
    this.messageLength = this.splitMessage.length;
    let messageSprite = this.messageSprite = new PIXI.Text('', this.style.unselected_style);
    this.addChild(messageSprite);
    this.bindAllKeys();
    this.activate();
    this.state = 'play';
  }
  updateLocal() {
    if (this.cool <= 0) {
      if (this.messageLength > 0) {
        this.lib.sound.fx.message.play();
        this.messageSprite.text += this.splitMessage.shift();
        this.messageLength--;
        this.cool += this.coolingInterval;
        this.cool--;
      }
    } else {
      this.cool--;
    }
    if (this.cool == 0 && this.messageLength == 0) {
      this.parent.removeWindow();
    }
  }
};
