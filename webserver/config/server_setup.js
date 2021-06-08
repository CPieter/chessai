const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const User = require("../model/User");

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

  io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"],
      credentials: true,
      transports: ['websocket', 'polling'],
    },
    allowEIO3: true
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = await User.findOne({
        token: token
      });

      createSocketUser(socket, user);

      socket.emit("user:information", socket.user);
    } catch (err) {
      console.log(err.message);
      socket.emit(404, "Data not found");
    }
    next();
  });
}


function createSocketUser(socket, user) {
  socket.user =  {
    username: user ? user.username : 'anonymous',
    points: user ? 0 : 0
  }
}

exports.io = io;