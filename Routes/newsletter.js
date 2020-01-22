const express = require("express");
const nwsletterCtrl = require("../Controllers/newsletter");
const router = express.Router();

router.post("/subscribe/", nwsletterCtrl.subscribe);
router.get("/confirm-subscribtion/:token/", nwsletterCtrl.confirm_subscribe);
router.get("/send-newsletter/", nwsletterCtrl.send_newletters);

module.exports = router;
