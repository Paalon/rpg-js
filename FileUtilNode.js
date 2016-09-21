// FileUtilNode.js
// Copyright 2016 Paalon
//
// namespace FileUtilNode
//

'use strict';

let fs = require('fs');
let PIXI = require('pixi.js/bin/pixi.js');

module.exports = {
  loadFile,
  loadJSON,
  loadMap,
  fromSpriteSheet
};

function loadFile(path) {
  return fs.readFileSync(path, 'utf-8');
}

// csvデータを２次元配列に変換する
function csvToMatrix(csv) {
  let gyou = csv.split('\n');
  let gyouretsu = [];
  for (let i = 0; i < gyou.length; i++) {
    gyouretsu[i] = gyou[i].split(',');
  }
  return gyouretsu;
}

// csvファイルを読み込んで２次元配列を返す
function readSyncCsvToMatrix(path) {
  let nakami = fs.readFileSync(path, 'utf-8');
  return csvToMatrix(nakami);
}

// 行列を転置
function transposeMatrix(matrix) {
  let new_matrix = [];
  for (let j = 0; j < matrix[0].length; j++) {
    new_matrix.push([]);
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      new_matrix[j][i] = matrix[i][j];
    }
  }
  return new_matrix;
}

function loadJSON(fileName) {
  let json = fs.readFileSync(fileName, 'utf-8');
  return JSON.parse(json);
}

function loadMap(fileName) {
  let map = loadJSON(fileName);
  map.tile.view = transposeMatrix(csvToMatrix(map.tile.view));
  map.tile.collision = transposeMatrix(csvToMatrix(map.tile.collision));
  return map;
}

function fromSpriteSheet(filePath, fileName) {
  let frames = [];
  let json = loadJSON(filePath + "/" + fileName + ".json");
  let frameNumber = Object.keys(json.frames).length;
  if (frameNumber == 1) { // フレーム数が1枚の時、"test.ase"の形式
    frames.push(new PIXI.Texture.fromFrame(fileName + ".ase"));
  } else { // フレーム数が複数ある時、"test 0.ase", "test 1.ase"の形式
    for (let i = 0; i < frameNumber; i++) {
      frames.push(new PIXI.Texture.fromFrame(fileName + " " + i + ".ase"));
    }
  }
  return frames;
}