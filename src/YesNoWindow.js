// YesNoWindow.js
// Copyright 2016 Paalon
//
// class YesNoWindow
//

'use strict';

let ChoiceWindow = require('./ChoiceWindow.js');
let TextChoice = require('./TextChiooce.js');

module.exports = class YesNoWindow extends ChoiceWindow {
  constructor(yes, no, style) {
    let choices = [
      new TextChoice('はい', yes),
      new TextChoice('いいえ', no)
    ];
    super(choices, style);
  }
};
