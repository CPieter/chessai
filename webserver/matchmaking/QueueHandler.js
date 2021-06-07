const RoomService = require("../room/RoomService.js");
const MatchmakingService = require("./MatchmakingService.js");
const GameRoom = require("../game/GameRooms");
const {Chess} = require('chess.js');
const PlayerVsPlayerHandler = require("../game/PlayerVsPlayerHandler");
const GameSocketEvents = require("../game/GameSocketEvents");

const CreateQuickMatch = (io, sockets) => {
    const roomId = RoomService.GenerateUniqueRoomString();
    GameRoom.set(roomId, new Chess);
    StartQuickMatch(io, io.sockets.sockets.get(sockets[0]), roomId, 'white');
    StartQuickMatch(io, io.sockets.sockets.get(sockets[1]), roomId, 'black');

    //TODO: Send player information to each other
    // io.of("/").to(roomId).emit("custom", [...io.sockets.adapter.rooms.get(roomId)]);
};

const StartQuickMatch = (io, socket, roomId, color) => {
    MatchmakingService.LeaveQueue(io, socket, "");
    socket.join(roomId);
    PlayerVsPlayerHandler(io, socket, roomId);
    socket.emit(GameSocketEvents.Start, color)
}

module.exports.init = (io) => {
    io.of("/").adapter.on("join-room", (room, socket) => {
        if (room === "queue") {
            if (io.sockets.adapter.rooms.get("queue").size === 2) {
                CreateQuickMatch(io, [...io.sockets.adapter.rooms.get('queue')]);
            }
        }
    });
}