const express = require('express');
const router = express.Router();
const postCtrl = require('../Controllers/posts');


router.get('/search/:postid', postCtrl.getAll);

router.get('/search/', postCtrl.getOne);

router.post('/add/', postCtrl.add);

router.put('/update/:postid', postCtrl.update);

router.delete('/delete/:postid', postCtrl.delete);

module.exports = router;