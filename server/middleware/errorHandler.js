/**
 * Error Handler Middleware
 * معالجة الأخطاء المركزية
 */

class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * معالج الأخطاء الرئيسي
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    statusCode: error.statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Supabase errors
  if (err.code === 'PGRST116') {
    error.message = 'البيانات المطلوبة غير موجودة';
    error.statusCode = 404;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = 'بيانات غير صحيحة';
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'رمز المصادقة غير صالح';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'انتهت صلاحية الجلسة';
    error.statusCode = 401;
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error.message = 'حجم الملف كبير جداً';
    error.statusCode = 400;
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error.message = 'نوع الملف غير مدعوم';
    error.statusCode = 400;
  }

  // Response
  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    statusCode: error.statusCode,
    timestamp: new Date().toISOString(),
    path: req.path,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * معالج الأخطاء غير المتوقعة
 */
const handleUnexpectedError = (err) => {
  console.error('Unexpected Error:', err);
  
  if (!err.isOperational) {
    console.error('Critical error! Shutting down...');
    process.exit(1);
  }
};

// معالجة الأخطاء غير المعالجة
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  handleUnexpectedError(err);
});

module.exports = {
  AppError,
  errorHandler,
  handleUnexpectedError,
};

