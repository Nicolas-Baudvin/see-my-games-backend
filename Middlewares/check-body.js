// mail regex
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = (req, res, next) => {
    if (req.body.username && req.body.password && req.body.email && req.body.confPassword) {
        if (req.body.password.length >= 6) {
            if (regex.test(String(req.body.email).toLowerCase())) {
                next();
            }
            else {
                res.status(400).json({ message: "L'email est invalide" })
            }
        }
        else {
            res.status(400).json({ message: "Le mot de passe doit contenir 6 caractères" });
        }
    } else {
        res.status(400).json({ message: "Tous les champs sont requis" });
    }
}