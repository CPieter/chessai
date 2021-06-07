socket = io(window.location.host);

socket.on(200, async (data) => {
    document.cookie = "token=" + data;
});

$(document).ready(function () {
    $("#LogIn").click(function (event) {
        event.preventDefault();
        socket.emit("login", {
            user: $("#username").val(),
            pass: $("#password").val()
        });
    });
});