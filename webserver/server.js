const { io } = require('./config/server_setup');
const registerGameVsComputerHandler = require("./game/AIHandler.js");

const onConnection = (socket) => {
    // registreer alle handlers bij connectie
    registerGameVsComputerHandler(io, socket);
}

io.sockets.on("connection", onConnection);