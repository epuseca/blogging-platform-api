require('dotenv').config();

const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Route is not found!',
        message: `Cannot found ${req.method} ${req.originalUrl}`,
        availableEndpoints: [
            'GET /',
            'GET /api',

        ]
    })
}

const errorHandler = (req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        timestamp: new Date().toISOString(),
        url: req.originalUrl,
        method: req.method
    });

    const statusCode = err.statusCode || 500;

    const errorResponse = {
        success: false,
        error: err.message || 'Internal Server Error',
        timestamp: new Date().toISOString()
    };

    if (config.nodeEnv === 'development' && err.stack) {
        errorResponse.stack = err.stack;
    }

    if (err.details) {
        errorResponse.details = err.details;
    }

    res.status(statusCode).json(errorResponse);
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    notFoundHandler,
    errorHandler,
    asyncHandler
};