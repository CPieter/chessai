const game = new Chess();
const whiteSquareGrey = '#a9a9a9'
const blackSquareGrey = '#696969'
let boardEl;
let board;
let playerColor;

const config = {
    pieceTheme: '../../img/chesspieces/{piece}.png',
    position: 'start',
    snapSpeed: 0, //CAUTION: board updates after snapping is done, will cause trouble when response move comes before snapEnd
    draggable: true,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
}

function startGame(boardElement, color) {
    game.reset();
    boardEl = boardElement;
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
    removeGreySquares();

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

function onMouseoutSquare (square, piece) {
    removeGreySquares()
}

function onMouseoverSquare (square, piece) {
    // get list of possible moves for this square
    const moves = game.moves({
        square: square,
        verbose: true
    })

    // exit if there are no moves available for this square
    if (moves.length === 0) return

    // highlight the square they moused over
    greySquare(square)

    // highlight the possible squares for this piece
    for (let i = 0; i < moves.length; i++) {
        greySquare(moves[i].to)
    }
}

function updateStatus() {
    let status = '';

    let moveColor = 'White';
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

function removeGreySquares () {
    $('#' + boardEl + ' .square-55d63').css('background', '')
}

function greySquare (square) {
    // only when play is correct color
    if ((game.turn() === 'w' && playerColor !== 'white') || (game.turn() === 'b' && playerColor !== 'black'))
        return false;

    let $square = $('#' + boardEl + ' .square-' + square)

    let background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
        background = blackSquareGrey
    }

    $square.css('background', background)
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