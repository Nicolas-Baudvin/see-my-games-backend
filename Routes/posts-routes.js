const express = require('express');
const router = express.Router();
const postCtrl = require('../Controllers/posts');
const auth = require('../Middlewares/auth');


router.get('/search/:postid', postCtrl.getAll);

router.get('/search/', postCtrl.getOne);

router.post('/add/', auth, postCtrl.add);

router.put('/update/:postid', postCtrl.update);

router.delete('/delete/:postid', postCtrl.delete);

module.exports = router;