/**
 * Rate Limiter Middleware
 * حماية من الهجمات والاستخدام المفرط
 */

// Simple in-memory rate limiter
// في الإنتاج، استخدم Redis أو مكتبة مثل express-rate-limit

class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
    this.maxRequests = options.maxRequests || 100;
    this.clients = new Map();
    
    // تنظيف البيانات القديمة كل دقيقة
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  getClientKey(req) {
    return req.ip || req.connection.remoteAddress;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.clients.entries()) {
      if (now - data.resetTime > this.windowMs) {
        this.clients.delete(key);
      }
    }
  }

  middleware() {
    return (req, res, next) => {
      const clientKey = this.getClientKey(req);
      const now = Date.now();

      let clientData = this.clients.get(clientKey);

      // إنشاء سجل جديد إذا لم يكن موجوداً
      if (!clientData || now - clientData.resetTime > this.windowMs) {
        clientData = {
          count: 0,
          resetTime: now,
        };
        this.clients.set(clientKey, clientData);
      }

      clientData.count++;

      // إضافة headers
      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - clientData.count));
      res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime + this.windowMs).toISOString());

      // تحقق من الحد الأقصى
      if (clientData.count > this.maxRequests) {
        const retryAfter = Math.ceil((clientData.resetTime + this.windowMs - now) / 1000);
        res.setHeader('Retry-After', retryAfter);
        
        return res.status(429).json({
          success: false,
          error: 'تجاوزت الحد الأقصى للطلبات. يرجى المحاولة لاحقاً.',
          retryAfter: `${retryAfter} seconds`,
        });
      }

      next();
    };
  }
}

// Rate limiters لمسارات مختلفة
const generalLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
});

const authLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // محاولات محدودة للمصادقة
});

const apiLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 200,
});

const uploadLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 uploads per hour
});

module.exports = {
  rateLimiter: generalLimiter.middleware(),
  authRateLimiter: authLimiter.middleware(),
  apiRateLimiter: apiLimiter.middleware(),
  uploadRateLimiter: uploadLimiter.middleware(),
  RateLimiter,
};

