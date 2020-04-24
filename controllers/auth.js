const Bcrypt = require('bcryptjs');

const User = require('../models/user');
const Define = require('../define/define');
const ModelUtil = require('../utils/models');
const UserTokenUtil = require('../utils/user-token');
const ValidatorUtil = require('../utils/validator');
const Config = require('../config');
const Response = require('../define/response');

exports.signup = (req, res, next) => {
    ValidatorUtil.catchValidation(req);
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const avatar = req.files.avatar;
    const hasAvatar = (avatar && avatar[0]);
    let avatarUrl = hasAvatar ? avatar[0].path : null;
    Bcrypt
        .hash(password, Config.PASSWORD_HASH_SAIL)
        .then(hashedPw => {
            const user = new User({
                email: email,
                password: hashedPw,
                name: name,
                avatar: avatarUrl
            });
            return user.save();
        })
        .then(user => {
            Response.send(res, ModelUtil.getUser(user), 201);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.login = (req, res, next) => {
    ValidatorUtil.catchValidation(req);
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error(Define.errUserNotExists);
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return Bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error(Define.errLoginInvalid);
                error.statusCode = 401;
                throw error;
            }

            const responseData = {
                ...ModelUtil.getUser(loadedUser),
                token: UserTokenUtil.getUserToken(loadedUser)
            }
            Response.send(res, responseData);
        })
        .catch(err => next(err));
}