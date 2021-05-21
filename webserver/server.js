const { io } = require('./server_setup');
const registerGameVsComputerHandler = require("./game/GameVsComputerHandler.js");

const onConnection = (socket) => {
    // registreer alle handlers bij connectie
    registerGameVsComputerHandler(io, socket);
}

io.sockets.on("connection", onConnection);