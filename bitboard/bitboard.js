const fen_input = "rnb1k1nr/pppp1ppp/8/3Pp3/3bP3/2N2N2/PPP2qPP/R1BQKB1R w - - 0 1";
const piece_dict = {"P": 0, "N": 1, "B": 2, "R": 3, "Q": 4, "K": 5,
    "p": 6, "n": 7, "b": 8, "r": 9, "q": 10, "k": 11}

const castling_dict = {"K": 0, "Q": 1, "k": 2, "q": 3}

module.exports.fen_to_bitboard = (fen_input) => {
    const fen_parts = fen_input.split(" ");
    const pieces = fen_parts[0].replace(/\//g, "");
    const to_move = fen_parts[1];
    const castling_rights = fen_parts[2];

    let bitboard = [];

    for (let i = 0; i < pieces.length; i++) {
        const character = pieces[i];
        const number = parseInt(character)

        if(!isNaN(number)) {
            for (let y = 0; y < number * 12; y++) {
                bitboard.push(0);
            }
        } else {
            const index = piece_dict[character];
            for (let y = 0; y < index; y++) {
                bitboard.push(0);
            }
            bitboard.push(1);
            for (let y = 0; y < 12-index-1; y++) {
                bitboard.push(0);
            }
        }
    }

    if (to_move === 'w') {
        bitboard.push(1);
    } else {
        bitboard.push(0);
    }

    const castling = [0, 0, 0, 0];
    for (let i = 0; i < castling_rights.length; i++) {
        const c = castling_rights[i];
        if (c !== '-') {
            castling[castling_dict[c]] = 1;
        }
    }

    for (let i = 0; i < castling.length; i++) {
        const bit = castling[i];
        bitboard.push(bit);
    }

    return bitboard;
}