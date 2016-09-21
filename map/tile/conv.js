// conv.js
// Copyright 2016 Paalon
//
// asepriteの吐くsprite sheetのjsonのpathをrelativeに変換
// node.js

let fs = require('fs');

let conv = (file_path) => {
  let text = fs.readFileSync(file_path, 'utf8');
  let json = JSON.parse(text);
  let img_path = json.meta.image;
  let splited = img_path.split('/');
  let img_name = splited.pop();
  json.meta.image = img_name;
  fs.writeFile(file_path, JSON.stringify(json, null, '  '));
  console.log('converting ' + file_path);
};

let list = fs.readdirSync('.');
let file_names = [];
const settingFileName = 'img.json';
for (let file_name of list) {
  let ext = file_name.split('.');
  ext = ext.pop();
  if (ext == 'json') {
    if (file_name !== settingFileName) {
      conv(file_name);
      file_names.push(file_name);
    }
  }
}

fs.writeFile(settingFileName, JSON.stringify(file_names, null, '  '));
