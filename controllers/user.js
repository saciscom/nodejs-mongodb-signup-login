const Bcrypt = require('bcryptjs');

const User = require('../models/user');
const Define = require('../define/define');
const ModelUtil = require('../utils/models');
const ValidatorUtil = require('../utils/validator');
const Config = require('../config');
const CommonError = require('../define/common-error');
const Response = require('../define/response');
const PasswordRandom = require('../utils/password-random');
const Nodemailer = require('nodemailer');
const FileHelper = require('../utils/file');
const Ejs = require('ejs');

const transporter = Nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: Config.EMAIL,
        pass: Config.EMAIL_PASSWORD
    }
});

exports.getUserInfo = (req, res, next) => {
    ValidatorUtil.catchValidation(req);
    const requestUserId = req.params.userId;
    console.log(requestUserId);

    User.findOne({ _id: requestUserId })
        .then(user => {
            if (!user) {
                CommonError.throwError401(Define.errUserNotExists);
            }
            return user;
        })
        .then(user => {
            Response.send(res, ModelUtil.getUser(user));
        })
        .catch(err => next(err));
}

exports.putUpdateUserInfo = (req, res, next) => {
    ValidatorUtil.catchValidation(req);
    const userId = req.userId;
    const name = req.body.name;
    const files = req.files;
    const hasAvatar = (files && files.avatar && files.avatar[0]);
    let avatarUrl = hasAvatar ? files.avatar[0].path : null;

    User.findOne({ _id: userId })
        .then(user => {
            if (!user) {
                throw Error(Define.errUserNotExists);
            }

            if (hasAvatar) {
                console.log(user.avatar);
                FileHelper.deleteFile(user.avatar);
                user.avatar = avatarUrl;
            }

            if (name) {
                user.name = name;
            }

            return user.save();
        })
        .then(user => {
            Response.send(res, ModelUtil.getUser(user));
        })
        .catch(err => next(err));
}

exports.postForgotPassword = (req, res, next) => {
    ValidatorUtil.catchValidation(req);
    const email = req.body.email;
    const newPassword = PasswordRandom(8);
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                throw Error(Define.errUserNotExists);
            }

            return Bcrypt
                .hash(newPassword, Config.PASSWORD_HASH_SAIL)
                .then(hashedPw => {
                    user.password = hashedPw;
                    return user.save();
                })
        })
        .then(user => {
            sendForgotPasswordEmail(email, newPassword, user.name);
            Response.message(res, Define.mesNewPasswordSent);
        })
        .catch(err => next(err));
}

const sendForgotPasswordEmail = (email, newPassword, name) => {
    const mailForgotPasswordFile = __dirname + '/../views/mail-forgot-password.ejs';
    Ejs.renderFile(mailForgotPasswordFile, { password: newPassword, name: name })
        .then(html => {
            transporter.sendMail({
                to: email,
                from: Config.EMAIL,
                subject: Define.strPasswordForgotMailTitle,
                html: html
            });
        });
}

exports.putChangePassword = (req, res, next) => {
    ValidatorUtil.catchValidation(req);
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const userId = req.userId;
    let loadedUser;

    User.findOne({ _id: userId })
        .then(user => {
            if (!user) {
                throw Error(Define.errUserNotExists);
            }
            loadedUser = user;
            console.log(oldPassword);
            return Bcrypt.compare(oldPassword, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error(Define.errPasswordWrong);
                error.statusCode = 401;
                throw error;
            }

            return Bcrypt
                .hash(newPassword, Config.PASSWORD_HASH_SAIL)
                .then(hashedPw => {
                    loadedUser.password = hashedPw;
                    return loadedUser.save();
                })
        })
        .then(user => {
            Response.send(res, ModelUtil.getUser(user));
        })
        .catch(err => next(err));
}