const RoomService = require("../room/RoomService.js");
const MatchmakingService = require("./MatchmakingService.js");
const GameRoom = require("../game/GameRooms");
const {Chess} = require('chess.js');
const PlayerVsPlayerHandler = require("../game/PlayerVsPlayerHandler");
const GameSocketEvents = require("../game/GameSocketEvents");

const CreateQuickMatch = (io, sockets) => {
    const roomId = RoomService.GenerateUniqueRoomString();
    GameRoom.set(roomId, new Chess);
    const whiteSocket = io.of("/").sockets.get(sockets[0]);
    const blackSocket = io.of("/").sockets.get(sockets[1]);
    StartQuickMatch(io, whiteSocket, roomId, whiteSocket, blackSocket, 'white');
    StartQuickMatch(io, blackSocket, roomId, whiteSocket, blackSocket, 'black');
};

const StartQuickMatch = (io, socket, roomId, whiteSocket, blackSocket, playerColor) => {
    MatchmakingService.LeaveQueue(io, socket, "");
    socket.join(roomId);
    PlayerVsPlayerHandler(io, socket, roomId);
    socket.emit(GameSocketEvents.Start, {
        playerColor: playerColor,
        turn: 'white',
        white: {
            user: whiteSocket.user
        },
        black: {
            user: blackSocket.user
        }
    });
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