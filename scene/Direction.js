// Direction.js
// Copyright 2016 Paalon
//
// class Direction
//

module.exports = class Direction {
  constructor(direction) {
    switch (direction) {
      case 'left': {
        this._number = 3;
        break;
      }
      case 'right': {
        this._number = 1;
        break;
      }
      case 'front': {
        this._number = 0;
        break;
      }
      case 'back': {
        this._number = 2;
        break;
      }
      default: {
        throw new Error('セットした方向名が変だよ。');
      }
    }
  }
  turnLeft() {
    this._number = (this._number + 1) % 4;
  }
  turnRight() {
    this._number = (this._number + 3) % 4;
  }
  turn() {
    this._number = (this._number + 2) % 4;
  }
  get() {
    let enumDirection = ['front', 'right', 'back', 'left'];
    return enumDirection[this._number];
  }
  set(str) {
    switch (str) {
      case 'left': {
        this._number = 3;
        break;
      }
      case 'right': {
        this._number = 1;
        break;
      }
      case 'front': {
        this._number = 0;
        break;
      }
      case 'back': {
        this._number = 2;
        break;
      }
      default: {
        throw new Error('セットした方向名が変だよ。');
      }
    }
  }
};
