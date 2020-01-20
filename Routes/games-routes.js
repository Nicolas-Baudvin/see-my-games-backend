const express = require('express');
const router = express.Router();
const gameCtrl = require('../Controllers/games');

router.post('/add/', gameCtrl.add);
router.delete('/delete/:id', gameCtrl.delete);
router.put('/update/:id', gameCtrl.update);
router.get('/search/', gameCtrl.search);
router.get('/search/:id', gameCtrl.searchOne);

module.exports = router;