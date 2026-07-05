/**
 * Centralized error handling middleware.
 * Catches errors passed via next(err) from any route or controller.
 */
const errorHandler = (err, _req, res, _next) => {
  console.error('Unhandled error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.values(err.errors).forEach((e) => {
      errors[e.path] = e.message;
    });
    return res.status(400).json({ success: false, message: 'Validation failed.', errors });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format.' });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate entry detected.' });
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
};

export default errorHandler;
