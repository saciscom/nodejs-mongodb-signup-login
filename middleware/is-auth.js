const jwt = require('jsonwebtoken');
const Config = require('../config');
const Define = require('../define/define');
const CommonError = require('../define/common-error');

const catchTokenError = (err) => {
    err.message = Define.errAuthentication;

    if (err.name === 'TokenExpiredError') {
        err.message = Define.errAuthenticationExpired;
    }

    err.statusCode = 401;
    throw err;
}

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        CommonError.throwAuthenticateError();
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, Config.JWT_SECRET);
    } catch (err) {
        catchTokenError(err);
    }

    if (!decodedToken) {
        CommonError.throwAuthenticateError();
    }

    req.userId = decodedToken.userId;
    next();
};
