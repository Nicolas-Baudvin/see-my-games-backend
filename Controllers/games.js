const Game = require("../Models/game");

exports.add = (req, res, next) => {
    if (!req.body.ownerId) {
        return res.status(400).json({ "message": "Vous n'êtes pas connecté !" });
    }
    if (req.body.name && req.body.header_img && req.body.desc && req.body.release_date && req.body.ownerId && req.body.platform) {
        const newGame = new Game({
            ...req.body,
            "hand_added": true
        });

        newGame.save()
            .then(() => {
                res.status(201).json({ "message": `Le jeu ${req.body.name} a été ajouté à votre bibliothèque de jeu !` });
            })
            .catch((err) => {
                res.status(400).json({ err, "message": "Le jeu n'a pas pu s'enregisrer, réessayez à nouveau." });
            });
    } else {
        return res.status(400).json({ "message": "Tous les champs sont obligatoires !" });
    }
};

exports.delete = (req, res, next) => {
    Game.deleteOne({ "_id": req.params.id })
        .then(() => {
            res.status(200).json({ "message": "Le jeu a bien été supprimé" });
        })
        .catch((err) => res.status(400).json({ err }));
};

exports.update = (req, res, next) => {
    const { ownerId } = req.pararms;
    const { name, header_img, desc, release_date, platform } = req.body;
    
    if (!ownerId) {
        return res.status(400).json({ "message": "L'id du jeu n'est pas fournie" });
    }
    if (name || header_img || desc || release_date || platform) {

        Game.updateOne({ "_id": req.params.id }, { ...req.body, "_id": req.params.id })
            .then(() => res.status(200).json({ "message": "Votre jeu a bien été modifié !" }))
            .catch((error) => res.status(400).json({ error }));
    } else {
        return res.status(400).json({ "message": "Au moins un champs doit être valide" });
    }
};

exports.search = (req, res, next) => {
    const { ownerId } = req.params;

    console.log(ownerId);
    Game.find({ "ownerId": ownerId })
        .then((games) => {
            res.status(200).json({ games });
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

exports.searchOne = (req, res, next) => {
    const { ownerId, id } = req.params;

    Game.findOne({ "_id": req.params.id })
        .then((game) => {
            res.status(200).json({ game });
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};
