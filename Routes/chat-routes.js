const express = require("express");
const messCtrl = require("../Controllers/messages");
const auth = require("../Middlewares/auth");

const router = express.Router();

router.get("/messages/", auth, messCtrl.getmessage);
router.get("/messages-steam/", auth, messCtrl.getSteamMessages);
router.get("/messages-other/", auth, messCtrl.getOtherMessages);

module.exports = router;
