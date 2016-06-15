const express = require('express');
const path    = require('path');
const config = require('../webpack.config.js');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const http = require('http');
const konfig = require('konfig')({ path: '../' });

var app = express();
var server = http.createServer(app).listen(konfig.app.port);
var io = require('socket.io').listen(server);
var compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));

app.use(express.static('./dist'));

app.use('*', function (req, res) {
  res.sendFile(path.resolve('./client/index.html'));
});

// MARK: - Socket state.

let state = {
  available: false,
  socket: null,
  reynolds: 0,
  flow: 0,
  total: 0,
  height: 0,
  readings: [{
    flow: 0,
    timestamp: new Date().getTime()
  }]
}

console.log(`Server is up and running...`);
console.log(`   Port:   ${konfig.app.port}`);
console.log(`   Domain: ${konfig.app.domain}`);

io.on('connect', function (socket) {
  io.sockets.emit('status', state);

  socket.on('disconnect', function (data) {
    if (state.socket == socket.id) {
      state.available = false;
      state.socket = null;
      state.total = 0;
      state.readings = [{
        flow: 0,
        timestamp: new Date().getTime()
      }];

      io.sockets.emit('status', state);
      console.log("Client hangout.");
    }
  });

  socket.on('clientConnect', function (data) {
    state.available = true;
    state.socket = socket.id;
    io.sockets.emit('status', state);

    console.log("Client has been connected.");
  });

  socket.on('clientDump', function (data) {
    state.available = true;
    state.reynolds = reynolds(data);
    state.total = round(total(data));
    state.flow = round(data);
    state.height = height(data);

    io.sockets.emit('status', state);
  });
});

function round(number) {
  return Math.round(number * 100) / 100;
}

function reynolds(flow) {
  const density = 1000; // kg/m3
  const viscosity = 0.001003; // Pa/s
  const diameter = 0.0127; // m

  let flowM3 = (flow / 1000) / 60;
  let speed = flowM3 / (Math.PI * (diameter/2)*(diameter/2)) // m/s

  let reynolds = (2 * diameter * density * speed) / viscosity;

  return round(reynolds);
}

function total(flow) {
  let newReading = {
    flow: flow,
    timestamp: new Date().getTime()
  }
  state.readings.push(newReading);

  if (flow != 0) {
    let totalFlow = 0;
    state.readings.map((time) => {
      totalFlow += time.flow;
    });

    let averageFlow = totalFlow / state.readings.length;
    let miliseconds = state.readings[state.readings.length - 1].timestamp - state.readings[0].timestamp;

    return round(averageFlow) * round(miliseconds / 1000 / 60);
  } else {
    return state.total;
  }
}

function height(flow) {
  return round(flow * 6);
}
