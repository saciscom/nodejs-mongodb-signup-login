const Config = require('../config');
const jwt = require('jsonwebtoken');

exports.getUserToken = (user) => jwt.sign(
    {
        email: user.email,
        userId: user._id.toString()
    },
    Config.JWT_SECRET,
    { expiresIn: Config.TOKEN_EXPIRES_IN }
);