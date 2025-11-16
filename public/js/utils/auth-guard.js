/**
 * Auth Guard - حماية الصفحات
 * يتحقق من تسجيل الدخول والصلاحيات قبل تحميل الصفحة
 */

import authStore from '../stores/authStore.js';

/**
 * التحقق من المصادقة وإعادة التوجيه إذا لم يكن مسجلاً
 * @param {string} requiredRole - الدور المطلوب ('researcher' أو 'admin') - اختياري
 * @returns {Promise<object|null>} - بيانات المستخدم أو null
 */
export async function requireAuth(requiredRole = null) {
  try {
    // انتظار انتهاء التهيئة
    await authStore.waitForInitialization();

    // التحقق من تسجيل الدخول
    const isLoggedIn = authStore.isLoggedIn();
    
    if (!isLoggedIn) {
      console.log('User not authenticated, redirecting to login...');
      window.location.href = '/pages/login.html';
      return null;
    }

    // الحصول على المستخدم الحالي
    const user = await authStore.getCurrentUser();
    
    if (!user) {
      console.log('User data not found, redirecting to login...');
      window.location.href = '/pages/login.html';
      return null;
    }

    // التحقق من الدور المطلوب إذا تم تحديده
    if (requiredRole && user.role !== requiredRole) {
      console.log(`User role mismatch. Required: ${requiredRole}, Got: ${user.role}`);
      
      // إعادة التوجيه حسب الدور الفعلي
      if (user.role === 'admin') {
        window.location.href = '/pages/admin/dashboard.html';
      } else if (user.role === 'researcher') {
        window.location.href = '/pages/researcher/dashboard.html';
      } else {
        window.location.href = '/pages/login.html';
      }
      
      return null;
    }

    return user;
  } catch (error) {
    console.error('Auth guard error:', error);
    window.location.href = '/pages/login.html';
    return null;
  }
}

/**
 * التحقق من المصادقة للباحث
 */
export async function requireResearcher() {
  return await requireAuth('researcher');
}

/**
 * التحقق من المصادقة للأدمن
 */
export async function requireAdmin() {
  return await requireAuth('admin');
}

/**
 * منع الوصول للصفحات إذا كان المستخدم مسجلاً
 * (للاستخدام في صفحات تسجيل الدخول والتسجيل)
 */
export async function guestOnly() {
  try {
    await authStore.waitForInitialization();
    
    const isLoggedIn = authStore.isLoggedIn();
    
    if (isLoggedIn) {
      const user = await authStore.getCurrentUser();
      
      if (user) {
        // إعادة التوجيه حسب الدور
        if (user.role === 'admin') {
          window.location.href = '/pages/admin/dashboard.html';
        } else {
          window.location.href = '/pages/researcher/dashboard.html';
        }
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Guest guard error:', error);
    return true; // السماح بالوصول في حالة الخطأ
  }
}

/**
 * التحقق من صلاحية الجلسة الحالية
 * @returns {Promise<boolean>}
 */
export async function validateSession() {
  try {
    await authStore.waitForInitialization();
    return authStore.isLoggedIn();
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

