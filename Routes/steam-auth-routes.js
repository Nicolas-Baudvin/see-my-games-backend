const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/steam/', passport.authenticate('steam', { session: false }), (req, res) => {
    console.log(req);
});

router.get('/steam/return', passport.authenticate('steam', { session: false }), (req, res) => {
    console.log('requêtes retournée :', req);
const token = jwt.sign({ user: req.user }, process.env.STEAM_TOKEN_KEY, {expiresIn: '24h'});
res.render('authenticated', { jwtToken: token, clientUrl: "http://localhost:3000" });
});

module.exports = router;