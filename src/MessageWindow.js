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
      if (this.cool <= 0) { // 文字を表示してもいい時間のとき
        if (this.messageLength > 0) { // まだ文字が残っているとき
          let char = this.splitMessage.shift();
          this.messageLength--;
          if (char == '#') { // 命令のとき
            let command = '';
            while (true) {
              let char2 = this.splitMessage.shift();
              this.messageLength--;
              if (char2 == '#') {
                break;
              } else {
                command += char2;
              }
            }
            // 命令に合わせて分岐
            console.log(command);
            switch (command) {
              case 'line': {
                console.log('line');
                this.messageSprite.text += '\n';
                break;
              }
              case 'rest': {
                this.cool += 5 * this.coolingInterval;
                break;
              }
              case 'wait': {
                this.state = 'messageWaiting';
                break;
              }
              case 'clear': {
                this.messageSprite.text = '';
                break;
              }
              case 'end': {
                this.state = '';
                break;
              }
              default:
            }
          } else { // 命令じゃなくて普通の文字のとき
            this.messageSprite.text += char;
            this.lib.sound.fx.message.play();
            this.cool += this.coolingInterval;
            this.cool--;
          }
        }
      } else {
        this.cool--;
      }
      if (this.cool == 0 && this.messageLength == 0) {
        this.state = 'messageEnding';
      }
    };
    this.updateL.messageWaiting = () => {
      if (this.keyboard.z.isDown) {
        this.state = 'messageShowing';
      }
    };
    this.updateL.messageEnding = () => {
      if (this.keyboard.z.isDown) {
        this.parent.removeWindow();
        this.state = 'finished';
      }
    };
  }
};
