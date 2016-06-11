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
  height: 0
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
    state.total = total(data);
    state.flow = round(data);
    state.height = height(data);

    io.sockets.emit('status', state);
  });
});

function round(number) {
  return Math.round(number * 100) / 100;
}

function reynolds(flow) {
  return round(flow);
}

function total(flow) {
  return round(state.total + flow);
}

function height(flow) {
  return round(flow * 6);
}
