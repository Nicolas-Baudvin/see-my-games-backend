const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/steam/", passport.authenticate("steam", { "session": false }), (req, res) => {
    console.log(req);
});

router.get("/steam/return", passport.authenticate("steam", { "session": false }), (req, res) => {
    console.log("requêtes retournée :", req.user);
    const steamid = req.user.steamid;

    res.render("authenticated", { "steamData": steamid, "clientUrl": "http://localhost:3000" });
});

module.exports = router;
