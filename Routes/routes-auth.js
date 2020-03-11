const express = require("express");
const auth = require("../Middlewares/auth");
const router = express.Router();
const userCtrl = require("../Controllers/user");
const multer = require("multer");

let storage = multer.diskStorage({
    "destination": (req, file, cb) => {
        cb(null, "./storage");
    },
    "filename": (req, file, cb) => {
        console.log(file);
        let filetype = "";

        if(file.mimetype === "image/gif") {
            filetype = "gif";
        }
        if(file.mimetype === "image/png") {
            filetype = "png";
        }
        if(file.mimetype === "image/jpeg") {
            filetype = "jpg";
        }
        cb(null, `image-${ Date.now() }.${ filetype}`);
    }
});

const upload = multer({
    storage
});

router.post("/signup/", userCtrl.signup);
router.post("/login/", userCtrl.login);
router.delete("/delete/", auth, userCtrl.delete);
router.post("/update/", auth, userCtrl.update);
router.post("/change-email/", auth, userCtrl.mail_update);
router.post("/change-password/", auth, userCtrl.pass_update);
router.get("/confirm-email/:token", auth, userCtrl.confirm_mail_change);
router.get("/confirm-password/:token", auth, userCtrl.confirm_password_change);
router.post("/new-avatar/", upload.single("avatar"), userCtrl.avatar);
router.get("/session-checker/:userId", auth, userCtrl.sessionChecker);

module.exports = router;
