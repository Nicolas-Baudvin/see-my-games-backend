const bcrypt = require('bcrypt');
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const mailer = require('nodemailer');
const mailType = require('../Data/mail')

exports.signup = (req, res, next) => {
    if (!req.body.password || !req.body.email || !req.body.confPassword || !req.body.username) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }
    if (req.body.password === req.body.confPassword) {
        if (req.body.password.length >= 6) {

            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const user = new User({
                        email: req.body.email,
                        username: req.body.username,
                        password: hash
                    });
                    user.save()
                        .then(() => {
                            const smtpTransport = mailer.createTransport({
                                service: "gmail",
                                auth: {
                                    user: process.env.EMAIL_SMTP,
                                    pass: process.env.EMAIL_PASSWORD
                                }
                            });
                            const mail = {
                                from: process.env.EMAIL_SMTP,
                                to: req.body.email,
                                subject: "SMG - Confirmation d'inscription",
                                html: mailType.mailSignup
                            }
                            smtpTransport.sendMail(mail, (err, res) => {
                                if (err) {
                                    console.log("Erreur lors de l'envoie du mail: ", err);
                                }
                                else {
                                    console.log("Mail envoyé !", res);
                                }
                            });
                            res.status(201).json({ message: "Votre compte a bien été créer" });
                        })
                        .catch(err => {
                            res.status(400).json({ err });
                        })
                })
                .catch(err => {
                    res.status(500).json({ err });
                })

        }
        else {
            res.status(403).json({ message: "Le mot de passe doit contenir 6 caractères minimum" });
        }

    } else {
        res.status(403).json({ message: "Les mots de passes sont différents !" });
    }
}

exports.login = (req, res, next) => {

    User.findOne({ username: req.body.username })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: "Vos identifiants sont incorrects" });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: "Vos identifiants sont incorrects" });
                    }
                    res.status(200).json({
                        userId: user._id,
                        username: user.username,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_SECRET_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(err => {
                    res.status(500).json({ err });
                });
        })
        .catch(err => {
            res.status(500).json({ err, message: 'from serv' })
        });

}

exports.delete = (req, res, next) => {
    User.findOneAndDelete({ username: req.body.username })
        .then(doc => {
            console.log(doc);
            if (!doc) {
                return res.status(401).json({ message: "Ce compte n'existe pas !" })
            }
            res.status(200).json({ message: "Votre compte a été supprimé" })
        })
        .catch(err => {
            res.status(500).json({ err });
        })
}

exports.update = (req, res, next) => {
    if (req.body.newUsername) {
        User.findOneAndUpdate({ username: req.body.currentUsername }, { $set: { username: req.body.newUsername } })
            .then(doc => {
                if (!doc) {
                    return res.status(400).json({ message: "Ce pseudo n'existe pas" })
                }
                res.status(200).json({ message: "Vos identifiants ont bien été modifiés" });
            })
            .catch(err => {
                res.status(500).json({ err });
            })
    }
    else {
        return res.status(400).json({ message: "Vous devez indiquer un nouveau pseudo valide !" })
    }
}

exports.mail_update = (req, res, next) => {
    // send mail to confirm change
}

exports.pass_update = (req, res, next) => {
    // send mail to confirm change
}