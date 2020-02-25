const express = require("express");
const auth = require("../Middlewares/auth");
const router = express.Router();
const userCtrl = require("../Controllers/user");

router.post("/signup/", auth, userCtrl.signup);
router.post("/login/", auth, userCtrl.login);
router.delete("/delete/", auth, userCtrl.delete);
router.post("/update/", auth, userCtrl.update);
router.post("/change-email/", auth, userCtrl.mail_update);
router.post("/change-password/", auth, userCtrl.pass_update);
router.get("/confirm-email/:token", auth, userCtrl.confirm_mail_change);
router.get("/confirm-password/:token", auth, userCtrl.confirm_password_change);
router.post("/new-avatar/");

module.exports = router;
