const express = require('express');

const authController = require('../controllers/auth');
const validator = require('../utils/validator');

const router = express.Router();

router.put('/signup', validator.signupValidator, authController.signup);

router.post('/login', validator.loginValidator, authController.login);

module.exports = router;