const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require('uuid-random');

const User = require("../model/User");

module.exports = (io, socket) => {
    const login = async (data) => {
        console.log("Login has started...");
        const username = data.user;
        const password = data.pass;

        let user = await User.findOne({
            username
        });
        if (user) {
            const payload = {
                user: {
                    id: user.id
                }
            };

            if (await bcrypt.compareSync(password, user.password)) {
                console.log("Password is correct !");
                jwt.sign(
                    payload,
                    uuid(), {
                        expiresIn: 10000
                    },
                    (err, token) => {
                        if (err) throw err;
                        user.token = token;
                        user.save();
                        socket.emit(200, user.token);
                        console.log("Token was sent !!");
                    }
                );
            }
        } else {
            console.log("Resource not found !!");
            socket.emit(404, "Resource not found")
        }
    }

    const signup = async (data) => {
        console.log("Signup has started...");
        try {
            const username = data.user;
            const password = data.pass;

            let user = await User.findOne({
                username: username
            });
            if (user) {
                console.log("User already exists !!");
                socket.emit(400, "User Already Exists");
            } else {
                user = new User({
                    username,
                    password
                });

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                console.log("Password has been hashed...");

                const payload = {
                    user: {
                        id: user.id
                    }
                };

                jwt.sign(
                    payload,
                    uuid(), {
                        expiresIn: 10000
                    },
                    (err, token) => {
                        if (err) throw err;
                        user.token = token;
                        user.save();
                        socket.emit(200, user.token);
                        console.log("Token was sent !!");
                    }
                );
            }
        } catch (err) {
            console.log(err.message);
            socket.emit(500, "Error in Saving");
        }
    }

    const cookie = async (data) => {
        console.log(data.token.replace('token=', ''));
        try {
            const token = data.token.replace('token=', '');
            let user = await User.findOne({
                token: token
            });
            console.log(user.username);
        } catch (err) {
            console.log(err.message);
            socket.emit(404, "Data not found");
        }
    }

    socket.on("login", login);
    socket.on("signup", signup);
    socket.on("cookie", cookie);
}