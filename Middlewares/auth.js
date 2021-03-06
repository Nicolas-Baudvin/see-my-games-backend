const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[ 1 ];
        const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        const userId = decode.userId;


        if ((req.body.userId || req.params.userId) && (req.body.userId || req.params.userId) !== userId) {
            throw Error("Userid non valable");
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ "error": error | "Requête non authentifiée", "message": "Votre session a expiré, veuillez vous reconnecter" });
    }
};
