/**
 * Authentication Middleware
 * التحقق من المصادقة والصلاحيات
 */

const { createClient } = require('@supabase/supabase-js');
const { AppError } = require('./errorHandler');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * التحقق من تسجيل الدخول
 */
const requireAuth = async (req, res, next) => {
  try {
    // الحصول على التوكن من header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('غير مصرح بالوصول', 401);
    }

    const token = authHeader.substring(7);

    // التحقق من التوكن
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new AppError('جلسة غير صالحة', 401);
    }

    // الحصول على بيانات المستخدم الكاملة
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      throw new AppError('خطأ في جلب بيانات المستخدم', 500);
    }

    // إضافة المستخدم إلى request
    req.user = userData;
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * التحقق من دور المستخدم
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('غير مصرح بالوصول', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('ليس لديك صلاحية للوصول', 403));
    }

    next();
  };
};

/**
 * التحقق من أن المستخدم مسؤول
 */
const requireAdmin = requireRole('admin', 'super_admin');

/**
 * التحقق من أن المستخدم باحث
 */
const requireResearcher = requireRole('researcher');

/**
 * التحقق من تأكيد البريد الإلكتروني
 */
const requireEmailVerified = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('غير مصرح بالوصول', 401));
  }

  if (!req.user.email_verified) {
    return next(new AppError('يجب تأكيد البريد الإلكتروني أولاً', 403));
  }

  next();
};

/**
 * التحقق من ملكية المورد
 */
const requireOwnership = (resourceIdParam = 'id', resourceType = 'submission') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError('غير مصرح بالوصول', 401));
      }

      // المسؤول يمكنه الوصول لكل شيء
      if (req.user.role === 'admin' || req.user.role === 'super_admin') {
        return next();
      }

      const resourceId = req.params[resourceIdParam];

      // التحقق من الملكية بناءً على نوع المورد
      let query;
      if (resourceType === 'submission') {
        query = supabase
          .from('submissions')
          .select('user_id')
          .eq('id', resourceId)
          .single();
      }

      const { data, error } = await query;

      if (error || !data) {
        return next(new AppError('المورد غير موجود', 404));
      }

      if (data.user_id !== req.user.id) {
        return next(new AppError('ليس لديك صلاحية للوصول', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware اختياري - لا يرمي خطأ إذا لم يكن المستخدم مسجلاً
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const { data: { user } } = await supabase.auth.getUser(token);

    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      req.user = userData;
      req.token = token;
    }

    next();
  } catch (error) {
    // تجاهل الأخطاء في optional auth
    next();
  }
};

module.exports = {
  requireAuth,
  requireRole,
  requireAdmin,
  requireResearcher,
  requireEmailVerified,
  requireOwnership,
  optionalAuth,
};

