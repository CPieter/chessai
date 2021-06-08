const PlayerVsPlayerHandler = require("./PlayerVsPlayerHandler");
const GameSocketEvents = require("../../game/GameSocketEvents");
const GameRoom = require("../../game/GameRooms");
const {Chess} = require('chess.js');

const EmitPlayerVsPlayerMatch = (socket, color, whiteUser, blackUser) => {
    socket.emit(GameSocketEvents.Start, {
        playerColor: color,
        turn: 'white',
        white: {
            user: whiteUser
        },
        black: {
            user: blackUser
        }
    });
};

module.exports.StartGame = (io, roomId, whiteSocket, blackSocket) => {
    GameRoom.set(roomId, new Chess);
    PlayerVsPlayerHandler(io, whiteSocket, roomId);
    PlayerVsPlayerHandler(io, blackSocket, roomId);
    EmitPlayerVsPlayerMatch(whiteSocket, 'white', whiteSocket.user, blackSocket.user);
    EmitPlayerVsPlayerMatch(blackSocket, 'black', whiteSocket.user, blackSocket.user);
};