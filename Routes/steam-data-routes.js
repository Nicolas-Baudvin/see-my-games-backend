const express = require('express');
const steamDataRouter = require('../Controllers/steam-data');


const router = express.Router();

router.get('/steam/games/:steamid', steamDataRouter.games);
router.get('/steam/summaries/:steamid', steamDataRouter.summaries);
router.get('/steam/game/:appid', steamDataRouter.game);

module.exports = router;