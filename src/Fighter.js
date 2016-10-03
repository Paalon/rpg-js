// Fighter.js
// Copyright 2016 Paalon
//
// class Fighter
//

'use strict';

let PIXI = require('pixi.js/bin/pixi.js');

let FileUtil = require('../FileUtil.js');

const DAMAGE_LIFETIME = 40; // ダメージの表示時間

module.exports = class Fighter extends PIXI.Container {
  constructor(status) {
    super();
    this.hp = status.hp;
    this.def_hp = status.def_hp;
    this.mp = status.mp;
    this.def_mp = status.mp;
    this.atk = status.atk;
    this.def = status.def;
    this.mgc = status.mgc;
    // ダメージ
    this.damage = new PIXI.Container();
    this.addChild(this.damage);
    this.damage.list = [];
    this.damage.texts = [];
    this.damage.mov = {};
    this.damage.style = new PIXI.TextStyle({fontSize: 10, fill: 0xcc5555});
    this.damage.visible = true;
    this.damage.lifetime = 0;
  }
  attack(enemy) {
    let dmg = Math.floor(100 * (this.atk * (Math.random() + 0.5)) / (enemy.def + 1));
    enemy.hp -= dmg;
    if (enemy.hp < 0) {
      enemy.hp = 0;
    }
    // ダメージ表示
    enemy.damage.list = dmg.toString().split(''); // 数字を分割
    let num = 0;
    let rx = 40 * Math.random() - 20;
    let ry = 40 * Math.random() - 20;
    for (let i of enemy.damage.list) {
      let textures = FileUtil.fromSpriteSheet('./img', 'damage' + i);
      let movie = new PIXI.extras.MovieClip(textures);
      movie.position.set(-8 + 9 * num++ + rx, -8 + ry);
      movie.animationSpeed = 0.5;
      movie.loop = false;
      movie.play();
      enemy.damage.addChild(movie);
      enemy.damage.texts.push(movie);
    }
    enemy.damage.lifetime = DAMAGE_LIFETIME;
    enemy.damage.visible = true;
    return dmg;
  }
  heal(enemy) {
    let dmg = Math.floor(100 * (this.mgc * (Math.random() + 0.5)));
    enemy.hp += dmg;
    return dmg;
  }
  mahou(enemy) {
    if (this.mp >= 4) {
      this.mp -= 4;
      let dmg = Math.floor(200 * (this.mgc * (Math.random() + 0.5)) / (enemy.def + 1));
      enemy.hp -= dmg;
      if (enemy.hp < 0) {
        enemy.hp = 0;
      }
      return dmg;
    } else {
      throw new Error('マナが足りない');
    }
  }
};
