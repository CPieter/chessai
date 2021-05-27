const { io } = require('./config/server_setup');
const InitiateMongoServer = require("./config/database");
const AIHandler = require("./game/AIHandler");
const registerRoomHandler = require("./room/RoomHandler");
const user = require("./routes/user");

InitiateMongoServer();

const onConnection = (socket) => {
    // registreer alle handlers bij connectie
    AIHandler(io, socket);
    registerRoomHandler(io, socket);
}

io.sockets.on("connection", onConnection);