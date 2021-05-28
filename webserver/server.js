const { io } = require('./config/server_setup');
const InitiateMongoServer = require("./config/database");
const AIHandler = require("./game/AIHandler");
const registerRoomHandler = require("./room/RoomHandler");
const userHandler = require("./routes/user");
const QueueHandler = require("./matchmaking/QueueHandler.js");
const MatchmakingHandler = require("./matchmaking/MatchmachkingHandler");

InitiateMongoServer();

const onConnection = (socket) => {
    // registreer alle handlers bij connectie
    AIHandler(io, socket);
    registerRoomHandler(io, socket);
    userHandler(io, socket);
    MatchmakingHandler(io, socket);
}

io.sockets.on("connection", onConnection);

QueueHandler.init(io);



