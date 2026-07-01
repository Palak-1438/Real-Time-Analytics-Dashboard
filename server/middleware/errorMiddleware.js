const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    });

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        timestamp: new Date().toISOString(),
        status: statusCode,
        error: statusCode === 404 ? 'Not Found' : 'Internal Server Error',
        message: err.message,
        path: req.originalUrl
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
