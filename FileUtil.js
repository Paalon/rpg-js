// FileUtil.js
// Copyright 2016 Paalon
//
// namespace FileUtil
//
// ファイルの入出力関連

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

module.exports = {
  loadFile,
  loadJSON,
  loadMap,
  fromSpriteSheet
};

function getCSVFile(fileName) {
  let xhr = new XMLHttpRequest();
  let object;
  xhr.onload = function() {
    object = csvToMatrix(xhr.responseText);
  };
  xhr.open("get", fileName, false);
  xhr.send(null);
  return object;
}

// csvファイルを読み込んで配列に変換する
function csvToMatrix(csvData) {
  let tempArray = csvData.split("\n");
  let csvArray = new Array();
  for (let i = 0; i < tempArray.length; i++) {
    csvArray[i] = tempArray[i].split(",");
  }
  return csvArray;
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

function ajax(fileName) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open('get', fileName);
    request.onload = () => {
      if (request.status == 200) {
        resolve(request.response);
      } else {
        reject(new Error(request.statusText));
      }
    };
    request.onerror = reject;
    request.send();
  });
}

function loadFile(fileName) { // sync
  let text;
  let request = new XMLHttpRequest();
  request.open('get', fileName, false);
  request.onload = () => {
    text = request.response;
  };
  request.send();
  return text;
}
function loadJSON(fileName) {
  let json = loadFile(fileName);
  return JSON.parse(json);
}

// 地図を読み込む
function loadMap(fileName) {
  let map = loadJSON(fileName);
  //map.tile.view = transposeMatrix(csvToMatrix(loadFile(map.tile.view)));
  map.tile.view = transposeMatrix(getCSVFile(map.tile.view));
  //map.tile.collision = transposeMatrix(csvToMatrix(loadFile(map.tile.collision)));
  map.tile.collision = transposeMatrix(getCSVFile(map.tile.collision));
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
