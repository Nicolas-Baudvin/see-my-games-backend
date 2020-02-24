const http = require("http");
const app = require("./app");

const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || "5000");

app.set("port", port);

const errorHandler = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === "string" ? `pipe ${address}` : `port: ${port}`;

    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges.`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is already in use.`);
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
    const address = server.address();
    const bind = typeof address === "string" ? `pipe ${address}` : `port ${port}`;

    console.log(`Listening on ${bind}`);
});


/**
 * Socket IO
 */
const socketIo = require("socket.io");
const io = socketIo(server, { "path": "/socketio" });
const socketCtrl = require("./Controllers/socket");

console.log("test", io);

/**
 * Channel Général
 */
const general = io.of("/generalchat");
let generalUsersOnline = [];


general.on("connection", (socket) => {
    let userData;

    socket.on("exchange_message", (message) => socketCtrl.sendMessage(message, socket, general));

    socket.on("new_user", (user) => {
        socket.emit("welcome_message", `Bienvenue sur le chat "Général" de See My Games ${user.username}`);
        userData = user;
        socket.user = { "username": user.username, "avatar": user.avatar, "socketId": socket.id, "globalSocketId": socket.conn.id };
        generalUsersOnline.push(general.sockets[socket.id].user);
        general.emit("update_userlist", generalUsersOnline);
    });

    socket.on("exchange_steamgame", (data) => socketCtrl.sendSteamGame(data, general, socket));

    socket.on("disconnect", () => {
        generalUsersOnline = generalUsersOnline.filter((user) => {
            if (user && user.username !== userData.username) {
                return user;
            }
        });
        general.emit("update_userlist", generalUsersOnline);
    });
});

/**
 * Channel Steam
 */
const steam = io.of("/steamchat");
let steamUsersOnline = [];

steam.on("connection", (socket) => {
    let userData;

    socket.on("exchange_message", (message) => socketCtrl.sendMessage(message, socket, steam));

    socket.on("new_user", (user) => {
        socket.emit("welcome_message", `Bienvenue sur le chat "Steam" de See My Games ${user.username}`);
        userData = user;
        socket.user = { "username": user.username, "avatar": user.avatar, "socketId": socket.id, "globalSocketId": socket.conn.id };
        steamUsersOnline.push(steam.sockets[socket.id].user);
        steam.emit("update_userlist", steamUsersOnline);
    });

    socket.on("exchange_steamgame", (data) => socketCtrl.sendSteamGame(data, steam, socket));

    socket.on("disconnect", () => {
        steamUsersOnline = steamUsersOnline.filter((user) => {
            if (user && user.username !== userData.username) {
                return user;
            }
        });
        steam.emit("update_userlist", steamUsersOnline);
    });
});

/**
 * Channel Other
 */
const other = io.of("/otherchat");
let otherUsersOnline = [];

other.on("connection", (socket) => {
    let userData;

    socket.on("exchange_message", (message) => socketCtrl.sendMessage(message, socket, other));

    socket.on("new_user", (user) => {
        socket.emit("welcome_message", `Bienvenue sur le chat "Autre" de See My Games ${user.username}`);
        userData = user;
        socket.user = { "username": user.username, "avatar": user.avatar, "socketId": socket.id, "globalSocketId": socket.conn.id };
        otherUsersOnline.push(other.sockets[socket.id].user);
        other.emit("update_userlist", otherUsersOnline);
    });

    socket.on("exchange_steamgame", (data) => socketCtrl.sendSteamGame(data, other, socket));

    socket.on("disconnect", () => {
        otherUsersOnline = otherUsersOnline.filter((user) => {
            if (user && user.username !== userData.username) {
                return user;
            }
        });
        other.emit("update_userlist", otherUsersOnline);
    });
});

/**
 * Private Chat
 */
io.on("connection", (socket) => {
    socket.on("private", (message) => socketCtrl.sendPrivateMessage(message, io, socket));
    socket.on("disconnect", () => {
    });
});

server.listen(port);
