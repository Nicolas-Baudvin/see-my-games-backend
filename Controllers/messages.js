const Message = require("../Models/message");

exports.getmessage = (req, res, next) => {
    Message.find({ "chan": "Général" })
        .then((mes) => {
            if (!mes) {
                return res.status(400).json({ "message": "Il n'y a pas de messages sur ce channel" });
            }
            res.status(200).json({ "messages": mes });
        })
        .catch((err) => {
            res.status(500).json({ err, "message": "Une erreur server est survenue, les messages n'ont pas pu être chargé" });
        });
};

exports.getSteamMessages = (req, res, next) => {
    Message.find({ "chan": "Steam" })
        .then((mes) => {
            if (!mes) {
                return res.status(400).json({ "message": "Il n'y a pas de messages sur ce channel" });
            }
            res.status(200).json({ "messages": mes });
        })
        .catch((err) => {
            res.status(500).json({ err, "message": "Une erreur server est survenue, les messages n'ont pas pu être chargé" });
        });
};

exports.getOtherMessages = (req, res, next) => {
    Message.find({ "chan": "Autre" })
        .then((mes) => {
            if (!mes) {
                return res.status(400).json({ "message": "Il n'y a pas de messages sur ce channel" });
            }
            res.status(200).json({ "messages": mes });
        })
        .catch((err) => {
            res.status(500).json({ err, "message": "Une erreur server est survenue, les messages n'ont pas pu être chargé" });
        });
}