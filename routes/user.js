const express = require('express');

const userController = require('../controllers/user');
const validator = require('../utils/validator');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.put('/', isAuth, validator.updateUserValidator, userController.putUpdateUserInfo);

router.post('/forgotpassword', validator.emailValidator, userController.postForgotPassword);

router.put('/changepassword', isAuth, validator.changePasswordValidator, userController.putChangePassword);

router.get('/:userId', isAuth, userController.getUserInfo);

module.exports = router;