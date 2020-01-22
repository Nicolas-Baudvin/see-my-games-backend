const mailer = require("nodemailer");
const Newsletter = require("../Models/newsletter");
const mailType = require("../Data/mail");
const jwt = require("jsonwebtoken");

exports.subscribe = (req, res) => {

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { email } = req.body;

    if (!regex.test(String(email).toLowerCase())) {
        return res.status(400).json({ "message": "Votre email est invalide !" });
    }
    const token = jwt.sign({ "email": email }, process.env.TOKEN_SECRET_KEY, { "expiresIn": "1h" });
    const link = `http://localhost:5000/api/newsletter/confirm-subscribtion/${token}`;
    const smtpTransport = mailer.createTransport({
        "service": "gmail",
        "auth": {
            "user": process.env.EMAIL_SMTP,
            "pass": process.env.EMAIL_PASSWORD
        }
    });
    const mail = {
        "from": process.env.EMAIL_SMTP,
        "to": email,
        "subject": "SMG - Confirmation d'inscription à la newsletter'",
        "html": mailType.newsletters(link)
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


exports.confirm_subscribe = (req, res) => {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const email = decoded.email;

    new Newsletter({
        "email": email
    }).save()
        .then(() => {
            res.render("newsletter", { "clientUrl": "localhost:3000/" })
        })
        .catch((err) => res.render("error500", { "error": err }));
};

exports.send_newletters = (req, res) => {
    // send email to all subscribers
};
