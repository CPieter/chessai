const { Chess } = require('chess.js');

module.exports = (io, socket) => {
    const game = new Chess();

    const move = (payload) => {
        game.move(payload);
        updateStatus(game);


        const moves = game.moves();
        const response = moves[Math.floor(Math.random() * moves.length)];

        socket.emit("move", response);
        game.move(response);
        updateStatus(game);
    }

    const reset = (payload) => {
        game.reset();
        updateStatus(game);
        if (payload == "black") {
            const moves = game.moves();
            const response = moves[Math.floor(Math.random() * moves.length)];
            setTimeout(() => {
                socket.emit("move", response);
                game.move(response);
                updateStatus(game);
            }, 1000);
        }
    }

    const changeSide = (payload) => {
        game.reset();
        updateStatus(game);
        if (payload == "black") {
            const moves = game.moves();
            const response = moves[Math.floor(Math.random() * moves.length)];
            setTimeout(() => {
                socket.emit("move", response);
                game.move(response);
                updateStatus(game);
            }, 1000);
        }
    }

    socket.on("move", move);
    socket.on("reset", reset);
    socket.on("changeSide", changeSide);
}

function updateStatus(game) {
    var status = '';

    var moveColor = 'White';
    if (game.turn() === 'b') {
        moveColor = 'Black';
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    }

    // draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position';
    }

    // game still on
    else {
        status = moveColor + ' to move';

        // check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check';
        }
    }
    console.log(game.pgn());
    console.log(status);

}