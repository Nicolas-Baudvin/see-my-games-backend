const express = require('express');

const router = express.Router();
const userCtrl = require('../Controllers/user');

router.post('/signup/', userCtrl.signup);
router.post('/login/', userCtrl.login);
router.post('/delete/', userCtrl.delete);
router.post('/update/', userCtrl.update);

module.exports = router;