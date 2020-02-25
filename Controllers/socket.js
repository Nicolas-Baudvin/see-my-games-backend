const Message = require("../Models/message");
let counter = 0;

/**
 * @description Enregistre le message dans la BDD et l'envoie aux destinaires sur le channel correspondant
 *
 * @param {object} message Objet message {message: string, avatar: string, user: string, chan: string }
 * @returns Retourne une erreur si le message est vide
 */
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
    const messageToSend = { ...message, "time": `${h}h ${m}m ${s}s`, "_id": newMessage._id, "socketId": socket.id };

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

/**
 * @description Gère l'envoie des messages privés
 * @param {object} message => Même paramètre message que la fonction sendMessage, avec le socket et le pseudo du destinataire et de l'expéditeur
 */
exports.sendPrivateMessage = (message, io, socket) => {
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    io.to(`${message.socketId}`).emit("private", { ...message, "date": `${h}h ${m}m ${s}s`, "fromSocketId": socket.id, "test": socket.conn.id, "id": counter });
    counter++;
};

exports.sendSteamGame = (data, namespace, socket) => {
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    const newMessage = new Message({
        "game": data.game,
        "socketId": socket.id,
        "from": data.from,
        "isPrivate": false,
        "chan": data.chan,
        "user": data.from,
        "avatar": data.avatar,
        "time": `${h}h ${m}m ${s}s `
    });

    newMessage.save()
        .then(() => {
            namespace.emit("exchange_steamgame", { ...data, "socketId": socket.id, "date": `${h}h ${m}m ${s}s `, "_id": newMessage._id});
        })
        .catch((err) => {
            socket.emit("error_message", "Une erreur est survenue lors de l'envoie du message", err);
        });

};
