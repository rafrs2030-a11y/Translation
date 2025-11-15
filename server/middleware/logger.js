/**
 * Request Logger Middleware
 * تسجيل الطلبات HTTP
 */

/**
 * Logger middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log after response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    };

    // Color code based on status
    let color = '\x1b[32m'; // green
    if (res.statusCode >= 400 && res.statusCode < 500) {
      color = '\x1b[33m'; // yellow
    } else if (res.statusCode >= 500) {
      color = '\x1b[31m'; // red
    }

    console.log(
      `${color}[${log.timestamp}] ${log.method} ${log.path} - ${log.statusCode} - ${log.duration}\x1b[0m`
    );

    // Log to file or external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to logging service (e.g., LogRocket, Sentry)
    }
  });

  next();
};

/**
 * API logger - detailed logging for API routes
 */
const apiLogger = (req, res, next) => {
  const log = {
    method: req.method,
    path: req.path,
    query: req.query,
    body: sanitizeBody(req.body),
    headers: {
      'content-type': req.get('content-type'),
      'user-agent': req.get('user-agent'),
    },
    ip: req.ip || req.connection.remoteAddress,
    timestamp: new Date().toISOString(),
  };

  console.log('API Request:', JSON.stringify(log, null, 2));

  next();
};

/**
 * Sanitize request body (remove sensitive data)
 */
const sanitizeBody = (body) => {
  if (!body) return body;

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'password_hash', 'token', 'secret'];

  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
};

module.exports = {
  requestLogger,
  apiLogger,
  sanitizeBody,
};

