const Define = require('../define/define');

module.exports.send = (res, data, statusCode) => {
    res.status(statusCode || 200).json({
        message: Define.mesSuccess,
        data: data
    });
}

module.exports.message = (res, message, statusCode) => {
    res.status(statusCode || 200).json({
        message: message
    });
}