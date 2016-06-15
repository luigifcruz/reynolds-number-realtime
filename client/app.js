"use strict";

const konfig = require('konfig')({ path: '../' });
const io = require('socket.io-client');
const GPIO = require('onoff').Gpio;
const button = new GPIO(konfig.app.pin, 'in', 'both');

var socket = io.connect(konfig.app.domain);
let ticks = [];

function tick(err, state) {
    if (state == 1) {
        ticks.push(Date.now());
    }
}

socket.emit('clientConnect', "client is rogue");
button.watch(tick);

setInterval(() => {
  const now = Date.now();
  let frequency = 0;

  ticks.map((time) => {
    if (time + 1000 >= now) {
      frequency += 1;
    }
  });

  socket.emit('clientDump', frequency / 7.5);
}, 200);
