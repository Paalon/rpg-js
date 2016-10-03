// TiledMap.js
// Copyright 2016 Paalon
//
// class
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');
const FileUtil = require('../FileUtilNode.js');

module.exports = class TiledMap extends PIXI.Container {
  constructor(map) {
    super();
    this.texture = {};
    for (let id in map.tileId) {
      let textures = FileUtil.fromSpriteSheet('./map/tile', map.tileId[id]);
      this.texture[id] = textures;
    }
    let spritesMap = [];

  }
};