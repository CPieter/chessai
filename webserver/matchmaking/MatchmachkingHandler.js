const SocketEvents = require("./MatchmakingSocketEvents");
const MatchmakingService = require("./MatchmakingService.js");

module.exports = (io, socket) => {
    const JoinQueue = (payload) => {
        socket.emit("custom", "Joining queue");
        MatchmakingService.JoinQueue(io, socket, payload);
    }


    socket.on(SocketEvents.JoinQueue, JoinQueue);
};