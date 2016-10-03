// DirectionalTextures.js
// Copyright 2016 Paalon
//
// class DirectionalTextures
//

'use strict';

let FileUtil = require('../FileUtil.js');

module.exports = class DirectionalTextures {
  constructor(path, name) {
    this.front = FileUtil.fromSpriteSheet(path, name + '.front');
    this.back = FileUtil.fromSpriteSheet(path, name + '.back');
    this.left = FileUtil.fromSpriteSheet(path, name + '.left');
    this.right = FileUtil.fromSpriteSheet(path, name + '.right');
  }
};
