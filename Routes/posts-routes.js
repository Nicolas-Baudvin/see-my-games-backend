const express = require("express");
const router = express.Router();
const postCtrl = require("../Controllers/posts");
const auth = require("../Middlewares/auth");


router.get("/search/:postid", auth, postCtrl.getAll);

router.get("/search/", auth, postCtrl.getOne);

router.post("/add/", auth, postCtrl.add);

router.put("/update/:postid", auth, postCtrl.update);

router.delete("/delete/:postid", auth, postCtrl.delete);

module.exports = router;
