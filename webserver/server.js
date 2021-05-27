const { io } = require('./config/server_setup');
const registerGameVsComputerHandler = require("./game/AIHandler");
const InitiateMongoServer = require("./config/database");
const user = require("./routes/user"); //new addition

InitiateMongoServer();

const onConnection = (socket) => {
    // registreer alle handlers bij connectie
    registerGameVsComputerHandler(io, socket);
}

io.sockets.on("connection", onConnection);