module.exports.GenerateUniqueRoomString = () => {
    return "room:" + Date.now().toString(36) + Math.random().toString(36).substr(2, 9).toUpperCase();
}

module.exports.ValidateRoomString = (roomString) => {
    if(roomString === null)
        return false;
    if((typeof roomString) !== 'string')
        return false;
    if(roomString.substr(0,4) !== 'room')
        return false;
    if(!new RegExp("^[A-Za-z0-9]+$").test(roomString.substr(5,roomString.length - 5)))
        return false;
    return true;
}

module.exports.Join = (io, socket, payload) => {
    if(!this.ValidateRoomString(payload))
        return false;
    if(!io.sockets.adapter.rooms.has(payload))
        return false;

    this.Leave(io, socket, payload);
    socket.join(payload);
    return true;
}

module.exports.Create = (io, socket, payload) => {
    const roomId = this.GenerateUniqueRoomString();
    this.Leave(io, socket, payload);
    socket.join(roomId);
    return roomId;
}

module.exports.Leave = (io, socket, payload) => {
    socket.rooms.forEach(room => {
        if(room.substr(0,4) === 'room')
            socket.leave(room);
    });
}