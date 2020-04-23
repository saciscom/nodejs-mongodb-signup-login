const Define = require('../define/define');

exports.error500 = (error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message || Define.errsome;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
};