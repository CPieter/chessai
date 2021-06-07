const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');

const app = express();
const port = 3000;

app.use(express.static(__dirname + '/frontend/'));
app.use(express.static('frontend'));

let io;

if (process.env.NODE_ENV === "development") {
  let port = process.env.PORT || 3000;
  let server = app.listen(port, listen);

  function listen() {
    console.log(`ChessAI app listening at: "localhost:${port}"`);
  }
  io = require('socket.io')(server);
}


exports.io = io;