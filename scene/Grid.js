// Grid.js
// Copyright 2016 Paalon
//
// class Grid
//

'use strict';

module.exports = class Grid {
  constructor(x, y) {
    if (typeof x == 'undefined') {
      this.x = 0;
    } else this.x = x;
    if (typeof y == 'undefined') {
      this.y = 0;
    } else this.y = y;
  }
  set(x, y) {
    this.x = x;
    this.y = y;
  }
};
