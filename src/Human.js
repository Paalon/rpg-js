// Human.js
// Copyright 2016 Paalon
//
// class Human
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let Grid = require('./Grid.js');
let Direction = require('./Direction.js');

module.exports = class Human extends PIXI.extras.MovieClip {
  constructor(directionalTextures) {
    super(directionalTextures.front);
    this.directionalTextures = directionalTextures;
    this.grid = new Grid();
    this.direction = new Direction('front');
    this.isMoving = false;
    this.walking_speed = 1; // 1 pixel per frame
  }
  moveTo(grid) {
  }
  /*
  goStraight() {
    this.direction.
  }*/
  turnLeft() {
    this.direction.turnLeft();
    let dir = this.direction.get();
    this.textures = this.directionalTextures[dir];
  }
  turnRight() {
    this.direction.turnRight();
    this.textures = this.directionalTextures[this.direction.get()];
  }
  turn() {
    this.direction.turn();
    this.textures = this.directionalTextures[this.direction.get()];
  }
  setDirection(str) {
    this.direction.set(str);
    switch (str) {
      case 'left': {
        this.textures = this.directionalTextures.left;
        break;
      }
      case 'right': {
        this.textures = this.directionalTextures.right;
        break;
      }
      case 'front': {
        this.textures = this.directionalTextures.front;
        break;
      }
      case 'back': {
        this.textures = this.directionalTextures.back;
        break;
      }
      default: {
        throw new Error('セットした方向名が変だよ。');
      }
    }
  }
};
