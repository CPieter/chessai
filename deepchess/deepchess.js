const tf = require('@tensorflow/tfjs-node');

class DeepChess {
    #model;

    constructor() {
        this.#loadModel();
    }

    #loadModel = async() => {
        this.#model = await tf.loadLayersModel("file://deepchess/model.json");
    }

    GetBestMoveIndex(bitboards, color) {
        let inputs = []
        bitboards.forEach(bitboard => {
            inputs.push(tf.tensor(bitboard).reshape([1, -1]));
        });

        let best_bitboard = inputs[0];

        inputs.forEach(input => {
            const prediction = this.#model.predict([best_bitboard, input]).dataSync();


            if (color == "white") {
                if (prediction[0] < prediction[1]) {
                    best_bitboard = input;
                }
            }
            if (color == "black") {
                if (prediction[0] > prediction[1]) {
                    best_bitboard = input;
                }
            }
        });
        return inputs.indexOf(best_bitboard);
    };
}


module.exports = new DeepChess();