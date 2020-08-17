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

exports.getUserInfo = async (req, res, next) => {
    try {
        ValidatorUtil.catchValidation(req);
        const requestUserId = req.params.userId;
        const user = await User.findOne({ _id: requestUserId })
        if (!user) {
            CommonError.throwError401(Define.errUserNotExists);
        }
        Response.send(res, ModelUtil.getUser(user));
    } catch (err) { next(err) };
}

exports.putUpdateUserInfo = async (req, res, next) => {
    try {
        ValidatorUtil.catchValidation(req);
        const userId = req.userId;
        const name = req.body.name;
        const files = req.files;
        const hasAvatar = (files && files.avatar && files.avatar[0]);
        let avatarUrl = hasAvatar ? files.avatar[0].path : null;
        const user = await User.findOne({ _id: userId })
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

        await user.save();
        Response.send(res, ModelUtil.getUser(user));
    } catch (err) { next(err) };
}

exports.postForgotPassword = async (req, res, next) => {
    try {
        ValidatorUtil.catchValidation(req);
        const email = req.body.email;
        const newPassword = PasswordRandom(8);
        const user = await User.findOne({ email: email })
        if (!user) {
            throw Error(Define.errUserNotExists);
        }

        const hashedPw = await Bcrypt.hash(newPassword, Config.PASSWORD_HASH_SAIL)
        user.password = hashedPw;
        await user.save();

        sendForgotPasswordEmail(email, newPassword, user.name);
        Response.message(res, Define.mesNewPasswordSent);
    } catch (err) { next(err) };
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

exports.putChangePassword = async (req, res, next) => {
    try {
        ValidatorUtil.catchValidation(req);
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const userId = req.userId;
        const user = await User.findOne({ _id: userId })

        if (!user) {
            throw Error(Define.errUserNotExists);
        }

        const isEqual = await Bcrypt.compare(oldPassword, user.password);
        if (!isEqual) {
            const error = new Error(Define.errPasswordWrong);
            error.statusCode = 401;
            throw error;
        }

        const hashedPw = await Bcrypt.hash(newPassword, Config.PASSWORD_HASH_SAIL)

        user.password = hashedPw;
        await user.save();

        Response.send(res, ModelUtil.getUser(user));
    } catch (err) { next(err) };
}