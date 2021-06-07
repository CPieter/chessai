$(document).ready(function () {
    ChangeLogInButton(GetCookieValue("token="));
    var navbarLogin = $("#navbarLogin");
    $("#LogIn").click(function (event) {
        event.preventDefault();
        socket.emit("login", {
            user: $("#username").val(),
            pass: $("#password").val()
        });
    });

    navbarLogin.click(function () {
        if (navbarLogin.html() == "Log Off") {
            document.cookie = "token= ";
            navbarLogin.html("Log In");
        }
    });

    socket.on(200, async(data) => {
        document.cookie = "token=" + data + "; path=/";
        ChangeLogInButton(GetCookieValue("token="));
    });
});

function ChangeLogInButton(token) {
    if (token != "") {
        $("#navbarLogin").html("Log Off");
    }
}

function GetCookieValue(cookieName) {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(cookieName))
        .split('=')[1];
}
