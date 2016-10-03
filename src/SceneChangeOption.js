// SceneChangeOption.js
// Copyright 2016 Paalon
//
// class SceneChangeOption
// deprecated

'use strict';

module.exports = class SceneChangeOption {
  constructor(name, to) {
    switch (name) {
      case 'transit': {
        this.name = name;
        this.to = to;
        break;
      }
      case 'freeze': {
        this.name = name;
        this.to = to;
        break;
      }
      case 'unfreeze': {
        this.name = name;
        if (to !== null) {
          throw new Error('シーンの解凍に次のシーンを指定する必要はないよ。');
        } else {
          this.to = to;
        }
        break;
      }
      default: {
        throw new Error('シーン遷移の名前が変だよ。');
      }
    }
  }
  static make(optionArray) {
    let options = [];
    if (optionArray.length == 0) {
      throw new Error('オプションに何も指定されてないよ。');
    } else if (optionArray.length % 2 !== 0) {
      throw new Error('オプションの数がおかしいよ。');
    } else {
      for (let i = 0; i < optionArray.length / 2; i++) {
        options.push(new SceneChangeOption(optionArray[2 * i], optionArray[2 * i + 1]));
      }
    }
    return options;
  }
};