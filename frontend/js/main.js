socket.on("user:information", (data) => {
    if (data.username !== 'anonymous') {
        $("#navbarLogin").html("Log Off");
    }
});

$("#navbarLogin").click(function () {
    const navbar = $("#navbarLogin");
    if (navbar.html() === "Log Off") {
        deleteAllCookies();
        navbar.html("Log In");
    }
});