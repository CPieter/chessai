const GameSocketEvents = require("../GameSocketEvents");
const AiSocketEvents = require("./AiSocketEvents");
const { Chess } = require('chess.js');

module.exports = (io, socket) => {
    let initialized = false;
    let game;
    let playerColor;

    const Start = (payload) => {
        game = new Chess();
        playerColor = payload;
        if (payload === 'black') {
            const randomMove = GetMove();
            game.move(randomMove);
            socket.emit(GameSocketEvents.Move, randomMove);
        }

        if (!initialized) {
            initialized = true;
            InitializeListeners();
        }
    };

    const Move = (payload) => {
        game.move(payload);

        const randomMove = GetMove();
        game.move(randomMove);
        socket.emit(GameSocketEvents.Move, randomMove);
    };

    const Undo = (payload) => {
        game.undo();
        game.undo();
        socket.emit(GameSocketEvents.Undo, 2);

        if (playerColor !== 'white' && game.turn() === 'w') {
            const randomMove = GetMove();
            game.move(randomMove);
            socket.emit(GameSocketEvents.Move, randomMove);
        }
    };

    const GetMove = () => {
        const moves = game.moves();
        return moves[Math.floor(Math.random() * moves.length)];
    }

    const InitializeListeners = () => {
        socket.on(GameSocketEvents.Move, Move);
        socket.on(AiSocketEvents.Undo, Undo);
    };

    socket.on(AiSocketEvents.Start, Start);
};