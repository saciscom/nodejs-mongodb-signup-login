const { body, validationResult } = require('express-validator');
const config = require('../config');
const Define = require('../define/define');
const User = require('../models/user');

exports.catchValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(Define.errValidationFailed);
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
}

exports.signupValidator = [
    body('email')
        .isEmail()
        .withMessage(Define.errInvalidEmail)
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(Define.errEmailExists);
                    }
                });
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: config.PASSWORD_MIN_LENGTH })
        .withMessage(Define.errPasswordLength(config.PASSWORD_MIN_LENGTH)),
    body('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage(Define.errNameEmpty)
]

exports.loginValidator = [
    body('email')
        .isEmail()
        .withMessage(Define.errInvalidEmail),
    body('password')
        .trim()
        .isLength({ min: config.PASSWORD_MIN_LENGTH })
        .withMessage(Define.errPasswordLength(config.PASSWORD_MIN_LENGTH))
]

exports.updateUserValidator = [
    body('name')
        .optional()
        .trim()
        .not()
        .isEmpty()
        .withMessage(Define.errNameEmpty)
]

exports.emailValidator = [
    body('email')
        .isEmail()
        .withMessage(Define.errInvalidEmail)
]

exports.changePasswordValidator = [
    body('oldPassword')
        .trim()
        .isLength({ min: config.PASSWORD_MIN_LENGTH })
        .withMessage(Define.errPasswordLength(config.PASSWORD_MIN_LENGTH)),
    body('newPassword')
        .trim()
        .isLength({ min: config.PASSWORD_MIN_LENGTH })
        .withMessage(Define.errPasswordLength(config.PASSWORD_MIN_LENGTH))
]