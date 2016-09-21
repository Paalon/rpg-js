// ChoiceWindow.js
// Copyright 2016 Paalon
//
// class ChoiceWindow
//

let PIXI = require('pixi.js/bin/pixi.js');

//let Choice = require('./Choice.js');

module.exports = class ChoiceWindow extends PIXI.Container {
  constructor(choices, selected_style, unselected_style, window_option) {
    super();
    this.window = new PIXI.Graphics();
    this.window.beginFill(0xcc77aa, 0.8);
    this.window.lineStyle(2, 0x444444, 0.8);
    this.window.drawRect(window_option.x, window_option.y, window_option.width, window_option.height);
    this.addChild(this.window);
    this._selected_style = selected_style;
    this._unselected_style = unselected_style;
    this.choices = choices;
    let num = 0;
    let len = choices.length;
    for (let choice of choices) {
      choice.style = this._unselected_style;
      this.window.addChild(choice);
      choice.anchor.set(0, 0.5);
      choice.position.set(window_option.x + 12, window_option.y + 4 + (window_option.height - 8) * (2 * num + 1) / (2 * len));
      num++;
    }

    this._selected_number = 0;
    this.selected = this.choices[this._selected_number];
    this.selected.selected();
    this.arrow = new PIXI.Text('>', selected_style);
    this.addChild(this.arrow);
    this.arrow.anchor.set(0, 0.5);
    this.arrow.position.set(this.selected.position.x - 8, this.selected.position.y);
  }
  next() {
    this.selected.unselected();
    this._selected_number = (this._selected_number + 1) % this.choices.length;
    this.selected = this.choices[this._selected_number];
    this.selected.selected();
    this.arrow.position.set(this.selected.position.x - 8, this.selected.position.y);
  }
  back() {
    this.selected.unselected();
    this._selected_number = (this._selected_number + this.choices.length - 1) % this.choices.length;
    this.selected = this.choices[this._selected_number];
    this.selected.selected();
    this.arrow.position.set(this.selected.position.x - 8, this.selected.position.y);
  }
  done() {
    this.selected.done();
  }
};
