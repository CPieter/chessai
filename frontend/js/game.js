const game = new Chess();
let board;
let playerColor;

const config = {
    pieceTheme: '../../img/chesspieces/{piece}.png',
    position: 'start',
    snapSpeed: 0, //CAUTION: board updates after snapping is done, will cause trouble when response move comes before snapEnd
    draggable: true,
    onDragStart: onDragStart,
    onDrop: onDrop,
}

function startGame(boardElement, color) {
    game.reset();
    board = Chessboard(boardElement, config);
    board.orientation(color);
    playerColor = color;
}

function onDragStart(source, piece) {
    // do not pick up pieces if the game is over
    if (game.game_over())
        return false

    // only when play is correct color
    if ((game.turn() === 'w' && playerColor !== 'white') || (game.turn() === 'b' && playerColor !== 'black'))
        return false;

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) || (game.turn() === 'b' && piece.search(/^w/) !== -1))
        return false;
}

function onDrop(source, target) {
    // see if the move is legal
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    })

    // illegal move
    if (move === null) {
        return 'snapback'
    } else {
        socket.emit('game:move', move);
        updateStatus();
    }
}

function updateStatus() {
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
    $("#status").text(status);
}

socket.on('game:undo', (payload) => {
    for (i = 0; i < payload; i++) {
        game.undo();
    }
    board.position(game.fen());
});

socket.on('game:move', (payload) => {
    game.move(payload);
    board.position(game.fen());
    updateStatus();
});