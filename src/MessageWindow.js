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
    this.time = 0;
    this.cool = 0;
    this.coolingInterval = 3;
  }
  init() {
    this.splitMessage = this.message.split('');
    this.messageLength = this.splitMessage.length;
    let messageSprite = this.messageSprite = new PIXI.Text('', this.style.unselected_style);
    this.addChild(messageSprite);
    this.addKeyboard('z', () => {}, () => {});

    this.bindAllKeys();
    this.activate();
    this.state = 'messageShowing';

    this.updateL.fadeIn = () => {
      this.time++;
    };
    this.updateL.play = () => {
    };
    this.updateL.messageShowing = () => {
      if (this.cool <= 0) {
        if (this.messageLength > 0) {
          let char = this.splitMessage.shift();
          this.messageSprite.text += char;
          this.messageLength--;
          if (char == '\n') {
            this.cool += 5 * this.coolingInterval;
          } else {
            this.lib.sound.fx.message.play();
            this.cool += this.coolingInterval;
          }

          this.cool--;
        }
      } else {
        this.cool--;
      }
      if (this.cool == 0 && this.messageLength == 0) {
        this.state = 'messageWaiting';

      }
    };
    this.updateL.messageWaiting = () => {
      if (this.keyboard.z.isDown) {
        this.parent.removeWindow();
        this.state = 'finished';
      }
    };
  }
};
