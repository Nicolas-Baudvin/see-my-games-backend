const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, 'RANDOM_SECRET_KEY');
        const userId = decode.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Userid non valable';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({error: error | 'Requête non authentifiée'});
    }
}