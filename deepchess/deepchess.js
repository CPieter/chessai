const tf = require('@tensorflow/tfjs');

class DeepChess {
    #model;

    constructor() {
        tf.loadLayersModel("model.json").then(function(model) {
            this.#model = model;
        });
    }

    GetBestMoveIndex(bitboards) {
        inputs = []
        bitboards.forEach(bitboard => {
            inputs.push(tf.tensor(bitboard).reshape([-1]));
        });

        best_bitboard = inputs[0];

        inputs.forEach(input => {
            prediction = this.#model.predict([best_bitboard, input]);

            if (prediction[0] < prediction[1]) {
                best_bitboard = input;
            }
        });
        return inputs.indexOf(best_bitboard);
    };
}


module.exports = new DeepChess();