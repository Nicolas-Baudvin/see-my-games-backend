const express = require('express');

const router = express.Router();
const userCtrl = require('../Controllers/user');

router.post('/signup/', userCtrl.signup);
router.post('/login/', userCtrl.login);
router.post('/delete/', userCtrl.delete);
router.post('/update/', userCtrl.update);
router.post('/change-email/', userCtrl.mail_update);
router.post('/change-password/', userCtrl.pass_update);
router.get('/confirm-email/:token', userCtrl.confirm_mail_change);
router.get('/confirm-password/:token', userCtrl.confirm_password_change);

module.exports = router;