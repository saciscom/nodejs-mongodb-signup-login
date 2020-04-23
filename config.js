// project config
exports.APP_NAME = 'Authenticate App'
exports.MONGODB_URI = 'Your mongodb uri' // Sample: mongodb+srv://mongouser:SamplePassword@cluster0-ppbsp.mongodb.net/authenticate
exports.JWT_SECRET = 'Your JWT secret' //This is used to sign and verify JWT tokens, replace with your own secret, it can be any string

// user model config
exports.PASSWORD_HASH_SAIL = 12;
exports.PASSWORD_MIN_LENGTH = 8;
exports.TOKEN_EXPIRES_IN = '30d'; // Expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d"

// Gmail service
// Using for setup forgot password mail.
exports.EMAIL = 'sender email';
exports.EMAIL_PASSWORD = 'sender password';