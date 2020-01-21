const Post = require('../Models/posts');

exports.getAll = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({ message: "Articles envoyés", posts });
        })
        .catch(err => {
            res.status(400).json({ err });
        })
}

exports.add = (req, res, next) => {
    const {
        title, header_img, desc, short_desc, category, author, author_id
    } = req.body;

    if (title && header_img && desc && short_desc && category && author && author_id) {
        new Post({
            title: title,
            header_img: header_img,
            desc: desc,
            author: author,
            author_id: author_id,
            short_desc: short_desc,
            category: category
        }).save()
            .then(() => {
                res.status(201).json({ message: "L'article est bien enregistré." });
            })
            .catch(err => {
                res.status(500).json({ err });
            });
    }
    else {
        res.status(400).json({ message: "Tous les champs sont obigatoires !" });
    }
}

exports.update = (req, res, next) => {
    const {
        title, header_img, desc, short_desc, category, author, author_id
    } = req.body;
    if (title || header_img || desc || short_desc || category || author || author_id) {
        Post.updateOne({ _id: req.params.postid }, { ...req.body, _id: req.params.postid })
            .then(() => {
                res.status(200).json({ message: "Article modifié." })
            })
            .catch(err => res.status(400).json({ err }))
    }
    else {
        res.status(400).json({ message: "Au moins un champs doit être valide" });
    }
}

exports.delete = (req, res, next) => {

    Post.deleteOne({ _id: req.params.postid })
        .then(() => {
            res.status(200).json({ message: "Article supprimé." });
        })
        .catch(err => res.status(400).json({ err }));
}

exports.getOne = (req, res, next) => {
    Post.findOne({ _id: req.params.postid })
        .then((post) => {
            res.status(200).json({ post })
        })
        .catch(err => res.status(400).json({ err }));
}