const express = require("express");
const steamDataRouter = require("../Controllers/steam-data");
const auth = require("../Middlewares/auth");

const router = express.Router();

router.get("/games/:steamid/:ownerId", auth, steamDataRouter.games);
router.get("/summaries/:steamid/:ownerId", auth, steamDataRouter.summaries);
router.get("/game/:appid", auth, steamDataRouter.game);
router.get("/recent-games/:steamid", auth, steamDataRouter.recents_game);

module.exports = router;
