// project config
exports.APP_NAME = 'Alasto';
exports.MONGODB_URI = 'mongodb://127.0.0.1:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false/alasto';
exports.JWT_SECRET = 'WhatIsMySecret???';

// user model config
exports.PASSWORD_HASH_SAIL = 12;
exports.PASSWORD_MIN_LENGTH = 8;
exports.TOKEN_EXPIRES_IN = '30d';

// Gmail service
// Using for setup forgot password mail.
exports.EMAIL = 'sender email';
exports.EMAIL_PASSWORD = 'sender password';