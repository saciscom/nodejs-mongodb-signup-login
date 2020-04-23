const Define = require('../define/define');

exports.throwAuthenticateError = () => {
    const error = new Error(Define.errAuthentication);
    error.statusCode = 401;
    throw error;
}

exports.throwError401 = (message) => {
    const error = new Error(message);
    error.statusCode = 401;
    throw error;
}