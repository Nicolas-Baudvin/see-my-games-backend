const express = require("express");
const steamDataRouter = require("../Controllers/steam-data");


const router = express.Router();

router.get("/games/:steamid/:ownerId", steamDataRouter.games);
router.get("/summaries/:steamid/:ownerId", steamDataRouter.summaries);
router.get("/game/:appid", steamDataRouter.game);
router.get("/recent-games/:steamid", steamDataRouter.recents_game);

module.exports = router;
