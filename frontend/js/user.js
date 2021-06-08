socket.on(200, (data) => {
    document.cookie = "token=" + data + "; path=/";
    window.location.href = "../";
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