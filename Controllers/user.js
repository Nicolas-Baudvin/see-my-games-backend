const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailer = require('nodemailer');
const mailType = require('../Data/mail');

const User = require('../Models/user');

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

exports.mail_update = async (req, res, next) => {
    // send mail to confirm change
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
        return res.status(400).json({ message: "Vous n'êtes pas connecté !" });
    }
    const token = jwt.sign({ userId: user._id, email: user.email, new_email: req.body.new_email }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
    const link = `http://localhost:5000/api/auth/confirm-email/${token}`;
    const smtpTransport = mailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_SMTP,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mail = {
        from: process.env.EMAIL_SMTP,
        to: user.email,
        subject: "SMG - Confirmation de changement d'email",
        html: mailType.mail_confirm(link)
    }
    smtpTransport.sendMail(mail, (err, result) => {
        if (err) {
            console.log("Erreur lors de l'envoie du mail: ", err);
            res.status(500).json({ message: "Une erreur est survenue lors de l'envoie du mail, veuillez réessayer.", err });
        }
        else {
            console.log("Mail envoyé !", result);
            res.status(200).json({ message: "Un email de confirmation a été envoyé sur votre boite mail !" });
        }
    });
}

exports.pass_update = (req, res, next) => {
    // send mail to confirm change
    let token;

    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
        return res.status(400).json({ message: "Vous n'êtes pas connecté !" });
    }

    bcrypt.hash(req.body.new_password, 10)
        .then(hash => {
            token = jwt.sign({ userId: user._id, new_password: hash }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err });
        })
    const link = `http://localhost:5000/api/auth/confirm-password/${token}`;
    const smtpTransport = mailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_SMTP,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mail = {
        from: process.env.EMAIL_SMTP,
        to: user.email,
        subject: "SMG - Confirmation de changement de mot de passe",
        html: mailType.password_confirm(link)
    }
    smtpTransport.sendMail(mail, (err, result) => {
        if (err) {
            console.log("Erreur lors de l'envoie du mail: ", err);
            res.status(500).json({ message: "Une erreur est survenue lors de l'envoie du mail, veuillez réessayer.", err });
        }
        else {
            console.log("Mail envoyé !", result);
            res.status(200).json({ message: "Un email de confirmation a été envoyé sur votre boite mail !" });
        }
    });
}

exports.confirm_mail_change = (req, res, next) => {
    // confirm change & update database
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const userId = decodedToken.userId;
    const newEmail = decodedToken.new_email;

    User.updateOne({ _id: userId }, { email: newEmail })
        .then(() => {
            res.render('email-changed', { clientUrl: "http://localhost:3000/mon-compte/" });
        })
        .then(err => {
            console.log(err);
            res.status(500).json({ err });
        });
}

exports.confirm_password_change = (req, res, next) => {
    // confirm change & update database
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const userId = decodedToken.userId;
    const newPassword = decodedToken.new_password;

    User.updateOne({ _id: userId }, { password: newPassword })
        .then(() => {
            res.render('password-changed', { clientUrl: "http://localhost:3000/mon-compte/" });
        })
        .then(err => {
            console.log(err);
            res.status(500).json({ err });
        });
}