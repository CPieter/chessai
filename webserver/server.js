const { io } = require('./config/server_setup');
const registerGameVsComputerHandler = require("./game/AIHandler.js");
const registerRoomHandler = require("./room/RoomHandler.js");

const onConnection = (socket) => {
    // registreer alle handlers bij connectie
    registerGameVsComputerHandler(io, socket);
    registerRoomHandler(io, socket);
}

io.sockets.on("connection", onConnection);