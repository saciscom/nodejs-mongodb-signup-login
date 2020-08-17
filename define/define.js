const Config = require('../config');
//Error message
exports.errSomethingWhenWrong = 'Something went wrong.'
exports.errInvalidEmail = 'Please enter a valid email address.';
exports.errEmailExists = 'Email address already exists.';
exports.errNameEmpty = 'Name must not be empty.';
exports.errPasswordLength = (length) => 'Password must be at least ' + length + ' characters.';
exports.errUserNotExists = 'User not found.';
exports.errLoginInvalid = 'Invalid login credentials.';
exports.errPasswordWrong = 'Incorrect password.';
exports.errValidationFailed = 'Validation failed.'
exports.errAuthentication = 'Authentication error.'
exports.errAuthenticationExpired = 'Authentication expired.'

//Message
exports.mesUserCreated = 'User created successfully.';
exports.mesSuccess = 'Success';
exports.mesNewPasswordSent = 'A temporary password has been sent to your email, please check your inbox.';

//String
exports.strPasswordForgotMailTitle = Config.APP_NAME + ' - Forgot password'