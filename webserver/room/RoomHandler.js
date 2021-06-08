const RoomSocketEvents = require("./RoomSocketEvents");
const PlayerVsPlayerService = require("../game/PlayerVsPlayer/PlayerVsPlayerService");
const RoomService = require("./RoomService.js");

module.exports = (io, socket) => {
    const Join = (payload) => {
        if(!RoomService.Join(io, socket, "room:" + payload))
            return socket.emit(RoomSocketEvents.JoinFailed, "Failed to join room");

        const sockets = [...io.sockets.adapter.rooms.get("room:" + payload)];
        const whiteSocket = io.of("/").sockets.get(sockets[0]);
        const blackSocket = io.of("/").sockets.get(sockets[1]);

        PlayerVsPlayerService.StartGame(io, "room:" + payload, whiteSocket, blackSocket);
    }

    const Create = (payload) => {
        const result = RoomService.Create(io, socket, payload);
        if(!result)
            return socket.emit(RoomSocketEvents.CreateFailed, "Failed to create room");
        socket.emit(RoomSocketEvents.CreateSuccess, result.slice(5));
    }

    const Leave = (payload) => {
        RoomService.Leave(io, socket, payload);
        socket.emit("custom", [...socket.rooms]);
    }

    socket.on(RoomSocketEvents.Join, Join);
    socket.on(RoomSocketEvents.Create, Create);
    socket.on(RoomSocketEvents.Leave, Leave);
};