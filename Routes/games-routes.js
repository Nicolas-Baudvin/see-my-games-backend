const express = require('express');
const router = express.Router();
const gameCtrl = require('../Controllers/games');
const auth = require('../Middlewares/auth');

router.post('/add/', auth, gameCtrl.add);
router.delete('/delete/:id', auth, gameCtrl.delete);
router.put('/update/:id', auth, gameCtrl.update);
router.get('/search/', auth, gameCtrl.search);
router.get('/search/:id', auth, gameCtrl.searchOne);

module.exports = router;