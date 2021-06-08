const socket = io({
    auth: {
        token: getCookie('token')
    }
});

