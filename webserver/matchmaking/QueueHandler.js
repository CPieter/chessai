const RoomService = require("../room/RoomService.js");
const MatchmakingService = require("./MatchmakingService.js");

const CreateQuickMatch = (io, sockets) => {
    const roomId = RoomService.GenerateUniqueRoomString();
    const player1 = io.sockets.sockets.get(sockets[0]);
    const player2 = io.sockets.sockets.get(sockets[1]);
    MatchmakingService.LeaveQueue(io, player1, "");
    MatchmakingService.LeaveQueue(io, player2, "");
    player1.join(roomId);
    player2.join(roomId);

    io.of("/").to(roomId).emit("custom", [...io.sockets.adapter.rooms.get(roomId)]);
};

module.exports.init = (io) => {
    io.of("/").adapter.on("join-room", (room, socket) => {
        if (room === "queue") {
            if (io.sockets.adapter.rooms.get("queue").size === 2) {
                CreateQuickMatch(io, [...io.sockets.adapter.rooms.get('queue')]);
            }
        }
    });
}