import ApiError from '../utils/apiError.js';
import config from '../config/index.js';

const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (config.env === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      statusCode,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(config.env === 'development' && { stack: err.stack }),
  });
};

export { notFound, errorHandler };
