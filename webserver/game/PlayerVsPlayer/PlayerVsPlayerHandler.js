const GameRoom = require("../GameRooms");
const GameSocketEvents = require("../GameSocketEvents");

module.exports = (io, socket, roomId) => {
    const game = GameRoom.get(roomId);

    const move = (payload) => {
        game.move(payload);
        socket.to(roomId).emit(GameSocketEvents.Move, payload);
    }

    socket.on(GameSocketEvents.Move, move);
};
