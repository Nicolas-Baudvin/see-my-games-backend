const Message = require("../Models/message");
let counter = 0;

exports.sendMessage = (message, socket, namespace) => {
    if (!message.message || message.message === null) {
        return socket.emit("error_message", "Le message est vide");
    }
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();


    const newMessage = new Message({
        "message": message.message,
        "avatar": message.avatar,
        "time": `${h} : ${m} : ${s}`,
        "user": message.user,
        "chan": message.chan,
        "socketId": socket.id,
        "isPrivate": false
    });
    const messageToSend = { ...message, "date": `${h}h ${m}m ${s}s`, "_id": newMessage._id, "socketId": socket.id };

    console.log(newMessage);

    newMessage.save()
        .then(() => {
            // message enregistré avec succès
            namespace.emit("exchange_message", messageToSend);
        })
        .catch((err) => {
            console.log(err);
            socket.emit("error_message", "Une erreur est survenue lors de l'envoie du message", err);
            throw err;
        });
};

exports.sendPrivateMessage = (message, io, socket) => {
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    io.to(`${message.socketId}`).emit("private", { ...message, "date": `${h}h ${m}m ${s}s`, "fromSocketId": socket.id, "test": socket.conn.id, "id": counter });
    counter++;
    // socket.to(``)
};
