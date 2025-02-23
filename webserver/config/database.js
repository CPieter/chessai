const mongoose = require("mongoose");

const MONGOURI = "mongodb+srv://testuser:testpassword@chessai.dwhth.mongodb.net/chessai?retryWrites=true&w=majority";

const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true
        });
        console.log("Connection with the database succeeded !!");
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = InitiateMongoServer;