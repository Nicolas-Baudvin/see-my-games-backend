const Game = require('../Models/game');

exports.add = (req, res, next) => {
    if (req.body.name && req.body.imageURI && req.body.desc && req.body.release_date && req.body.ownerId) {
        const newGame = new Game({
            ...req.body
        });

        newGame.save()
            .then(() => {
                res.status(201).json({ message: `Le jeu ${req.body.name} a été ajouté à votre bibliothèque de jeu !` });
            })
            .catch(err => {
                res.status(400).json({ err });
            })
    }
    else {
        return res.status(400).json({ message: "Tous les champs sont obligatoires !" })
    }
}

exports.delete = (req, res, next) => {
    Game.deleteOne({_id: req.params.id})
    .then(() => {
        res.status(200).json({ message: `Le jeu a bien été supprimé`});
    })
    .catch(err => res.status(400).json({err}));
}

exports.update = (req, res, next) => {
    Game.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Votre jeu a bien été modifié !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.search = (req, res, next) => {
    Game.find()
        .then((games) => {
            res.status(200).json({ games });
        })
        .catch(err => {
            res.status(400).json({ err });
        })
}

exports.searchOne = (req, res, next) => {
    console.log(req.params);
    Game.findOne({ _id: req.params.id })
        .then(game => {
            res.status(200).json({ game });
        })
        .catch(err => {
            res.status(400).json({ err });
        });
}
