const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("nodemailer");
const mailType = require("../Data/mail");
const fs = require("fs");

const User = require("../Models/user");

exports.signup = (req, res, next) => {
    if (req.body.password === req.body.confPassword) {
        if (req.body.password.length >= 6) {

            bcrypt.hash(req.body.password, 10)
                .then((hash) => {
                    const user = new User({
                        "email": req.body.email,
                        "username": req.body.username,
                        "password": hash,
                        "imported_games": false,
                        "steam_is_linked": false,
                        "avatar": "http:localhost:3000/src/assets/default-avatar.png"
                    });

                    user.save()
                        .then(() => {
                            const smtpTransport = mailer.createTransport({
                                "service": "gmail",
                                "auth": {
                                    "user": process.env.EMAIL_SMTP,
                                    "pass": process.env.EMAIL_PASSWORD
                                }
                            });
                            const mail = {
                                "from": process.env.EMAIL_SMTP,
                                "to": req.body.email,
                                "subject": "SMG - Confirmation d'inscription",
                                "html": mailType.mailSignup
                            };

                            smtpTransport.sendMail(mail, (err, response) => {
                                if (err) {
                                    console.log("Erreur lors de l'envoie du mail: ", err);
                                } else {
                                    console.log("Mail envoyé !", response);
                                }
                            });
                            res.status(201).json({ "message": "Votre compte a bien été créer" });
                        })
                        .catch((err) => {
                            console.log("err", err);
                            res.status(400).json({ err, "message": "Erreur lors de l'envoie du mail" });
                        });
                })
                .catch((err) => {
                    res.status(500).json({ err });
                });
        } else {
            return res.status(403).json({ "message": "Le mot de passe doit contenir 6 caractères minimum" });
        }
    } else {
        return res.status(403).json({ "message": "Les mots de passes sont différents !" });
    }
};

exports.login = (req, res, next) => {
    if (!req.body.username && !req.body.password) {
        return res.status(400).json({ "message": "Tous les champs sont obligatoires" });
    }

    User.findOne({ "username": req.body.username })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ "message": "Vos identifiants sont incorrects" });
            }
            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({ "message": "Vos identifiants sont incorrects" });
                    }
                    const token = jwt.sign(
                        { "userId": user._id },
                        process.env.TOKEN_SECRET_KEY,
                        { "expiresIn": "24h" }
                    );

                    // res.setHeader("Set-Cookie", `token=${token}; HttpOnly`);
                    res.status(200).json({
                        "_id": user._id,
                        "username": user.username,
                        "email": user.email,
                        "steam_avatar": user.steam_avatar,
                        "steam_avatarfull": user.steam_avatarfull,
                        "steam_avatarmedium": user.steam_avatarmedium,
                        "steam_id": user.steam_id,
                        "steam_profileurl": user.steam_profileurl,
                        "steam_realname": user.steam_realname,
                        "steam_timecreated": user.steam_timecreated,
                        "steam_username": user.steam_username,
                        "imported_games": user.imported_games,
                        "avatar": user.avatar,
                        token
                    });
                })
                .catch((err) => {
                    res.status(500).json({ err });
                });
        })
        .catch((err) => {
            res.status(500).json({ err, "message": "from serv" });
        });

};

exports.delete = (req, res, next) => {
    const { userId } = req.body;

    User.deleteOne({ "_id": userId })
        .then(() => {
            console.log();
            res.status(200).json({ "message": "Votre compte a été supprimé" });
        })
        .catch((err) => {
            res.status(500).json({ "message": "Une erreur est survenue avec le serveur, veuillez réessayer ou contacter l'administrateur du site", err });
        });
};

exports.update = (req, res, next) => {
    if (req.body.newUsername) {
        User.updateOne({ "_id": req.body.id }, { "username": req.body.newUsername })
            .then(() => {
                User.findOne({ "_id": req.body.id })
                    .then((user) => {
                        if (!user) {
                            return res.status(400).json({ "message": "Ce compte n'existe pas !" });
                        }

                        user.password = undefined;

                        res.status(200).json({ "message": "Votre pseudo a bien été modifié", "user": JSON.parse((JSON.stringify(user))) });
                    })
                    .catch((err) => {
                        res.status(500).json({ err });
                    });
            })
            .catch((err) => {
                res.status(400).json({ err });
            });
    } else {
        return res.status(400).json({ "message": "Vous devez indiquer un nouveau pseudo valide !" });
    }
};

exports.mail_update = async (req, res, next) => {
    // send mail to confirm change
    const { userId, email, confEmail } = req.body;

    if (email !== confEmail) {
        return res.status(400).json({ "message": "Les emails sont différents !" });
    }
    const user = await User.findOne({ "_id": userId });

    if (!user) {
        return res.status(400).json({ "message": "Vous n'êtes pas connecté !" });
    }
    const token = jwt.sign({ "userId": user._id, "email": user.email, "new_email": email }, process.env.TOKEN_SECRET_KEY, { "expiresIn": "1h" });
    const link = `http://localhost:5000/api/auth/confirm-email/${token}`;
    const smtpTransport = mailer.createTransport({
        "service": "gmail",
        "auth": {
            "user": process.env.EMAIL_SMTP,
            "pass": process.env.EMAIL_PASSWORD
        }
    });
    const mail = {
        "from": process.env.EMAIL_SMTP,
        "to": user.email,
        "subject": "SMG - Confirmation de changement d'email",
        "html": mailType.mail_confirm(link)
    };

    smtpTransport.sendMail(mail, (err, result) => {
        if (err) {
            console.log("Erreur lors de l'envoie du mail: ", err);
            res.status(500).json({ "message": "Une erreur est survenue lors de l'envoie du mail, veuillez réessayer.", err });
        } else {
            console.log("Mail envoyé !", result);
            res.status(200).json({ "message": "Un email de confirmation a été envoyé sur votre boite mail !" });
        }
    });
};

exports.pass_update = async (req, res, next) => {
    // send mail to confirm change
    const { password, confPassword, userId } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ "message": "Les mots de passes sont incorrects" });
    }

    const user = await User.findOne({ "_id": userId });

    if (!user) {
        return res.status(400).json({ "message": "Vous n'êtes pas connecté !" });
    }

    bcrypt.hash(password, 10)
        .then((hash) => {
            const token = jwt.sign({ userId, "password": hash }, process.env.TOKEN_SECRET_KEY, { "expiresIn": "1h" });
            const link = `http://localhost:5000/api/auth/confirm-password/${token}`;
            const smtpTransport = mailer.createTransport({
                "service": "gmail",
                "auth": {
                    "user": process.env.EMAIL_SMTP,
                    "pass": process.env.EMAIL_PASSWORD
                }
            });
            const mail = {
                "from": process.env.EMAIL_SMTP,
                "to": user.email,
                "subject": "SMG - Confirmation de changement de mot de passe",
                "html": mailType.password_confirm(link)
            };

            smtpTransport.sendMail(mail, (err, result) => {
                if (err) {
                    console.log("Erreur lors de l'envoie du mail: ", err);
                    res.status(500).json({ "message": "Une erreur est survenue lors de l'envoie du mail, veuillez réessayer.", err });
                } else {
                    console.log("Mail envoyé !", result);
                    res.status(200).json({ "message": "Un email de confirmation a été envoyé sur votre boite mail !" });
                }
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ err });
        });
};

exports.confirm_mail_change = (req, res, next) => {
    // confirm change & update database
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const userId = decodedToken.userId;
    const newEmail = decodedToken.new_email;

    User.updateOne({ "_id": userId }, { "email": newEmail })
        .then(() => {
            res.render("email-changed", { "clientUrl": "http://localhost:3000/mon-compte/" });
        })
        .then((err) => {
            console.log(err);
            res.status(500).json({ err });
        });
};

exports.confirm_password_change = (req, res, next) => {
    // confirm change & update database
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const userId = decodedToken.userId;
    const newPassword = decodedToken.password;

    User.updateOne({ "_id": userId }, { "password": newPassword })
        .then(() => {
            res.render("password-changed", { "clientUrl": "http://localhost:3000/mon-compte/" });
        })
        .then((err) => {
            console.log(err);
            res.status(500).json({ err });
        });
};

exports.avatar = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token);

    let img = `${req.file.path}`;
    let avatar = {};

    avatar.data = fs.readFileSync(img);
    avatar.contentType = "image/png";

    User.updateOne({ "_id": decoded.userId }, { "avatar": avatar })
        .then(async () => {
            const user = await User.findOne({ "_id": decoded.userId });

            res.status(200).json({ "message": "avatar mis à jour", user });
        })
        .catch((err) => {
            console.log(err);
        });


};

exports.sessionChecker = (req, res) => {
    res.status(200).json({ "message": "ok" });
};
