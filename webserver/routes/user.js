const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

module.exports = (io, socket) => {
    const signup = async (data) => {
        try {
            const username = data.username;
            const password = data.password;

            let user = await User.findOne({
                username: username
            });
            if (user) {
                socket.emit(400, "User Already Exists");
            } else {
                user = new User({
                    username,
                    password
                });

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);

                await user.save();

                const payload = {
                    user: {
                        id: user.id
                    }
                };

                jwt.sign(
                    payload,
                    "randomString", {
                        expiresIn: 10000
                    },
                    (err, token) => {
                        if (err) throw err;
                        socket.emit(200, token);
                    }
                );
            }
        } catch (err) {
            console.log(err.message);
            socket.emit(500, "Error in Saving");
        }
    }

    socket.on("signup", signup);
}