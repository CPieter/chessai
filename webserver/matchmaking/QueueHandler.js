const RoomService = require("../room/RoomService.js");
const MatchmakingService = require("./MatchmakingService.js");
const PlayerVsPlayerService = require("../game/PlayerVsPlayer/PlayerVsPlayerService");

const CreateQuickMatch = (io, sockets) => {
    const roomId = RoomService.GenerateUniqueRoomString();
    const whiteSocket = io.of("/").sockets.get(sockets[0]);
    const blackSocket = io.of("/").sockets.get(sockets[1]);

    JoinQuickMatch(io, whiteSocket, roomId);
    JoinQuickMatch(io, blackSocket, roomId);
    PlayerVsPlayerService.StartGame(io, roomId, whiteSocket, blackSocket);
};

const JoinQuickMatch = (io, socket, roomId) => {
    MatchmakingService.LeaveQueue(io, socket, "");
    RoomService.Leave(io, socket, '');
    socket.join(roomId);
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