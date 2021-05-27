const SocketEvents = require("./RoomSocketEvents");
const RoomService = require("./RoomService.js");

module.exports = (io, socket) => {
    const Join = (payload) => {
        if(!RoomService.Join(io, socket, "room:" + payload))
            return socket.emit("custom", "Failed to join room");
        socket.emit("custom", [...io.sockets.adapter.rooms.get("room:" + payload)]);
    }

    const Create = (payload) => {
        const result = RoomService.Create(io, socket, payload);
        if(!result)
            return socket.emit("custom", "Failed to join room");
        socket.emit("custom", "Created room: " + result);
    }

    const Leave = (payload) => {
        RoomService.Leave(io, socket, payload);
        socket.emit("custom", [...socket.rooms]);
    }

    socket.on(SocketEvents.Join, Join);
    socket.on(SocketEvents.Create, Create);
    socket.on(SocketEvents.Leave, Leave);
};