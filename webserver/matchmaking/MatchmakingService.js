module.exports.JoinQueue = (io, socket, payload) => {
    socket.join("queue");
};

module.exports.LeaveQueue = (io, socket, payload) => {
    socket.rooms.forEach(room => {
        if(room === 'queue')
            socket.leave(room);
    });
};