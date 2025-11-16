/**
 * Helpers
 * وظائف مساعدة عامة
 */

import { STATUS_LABELS, STATUS_COLORS } from '../config/constants.js';

/**
 * تنسيق التاريخ بالعربية
 */
export const formatDate = (date, includeTime = false) => {
  const d = new Date(date);
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return d.toLocaleDateString('ar-SA', options);
};

/**
 * تنسيق الوقت النسبي (منذ 5 دقائق)
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);
  
  if (diffInSeconds < 60) {
    return 'الآن';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} دقيقة`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ساعة`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `منذ ${diffInDays} يوم`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `منذ ${diffInMonths} شهر`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `منذ ${diffInYears} سنة`;
};

/**
 * تنسيق حجم الملف
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 بايت';
  
  const k = 1024;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * الحصول على تسمية الحالة
 */
export const getStatusLabel = (status) => {
  return STATUS_LABELS[status] || status;
};

/**
 * الحصول على لون الحالة
 */
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || '#6C757D';
};

/**
 * اختصار النص
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * توليد رقم مرجعي عشوائي
 */
export const generateReferenceNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `REF-${year}-${random}`;
};

/**
 * نسخ النص إلى الحافظة
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } else {
      // Fallback للمتصفحات القديمة
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * تحويل كائن إلى query string
 */
export const objectToQueryString = (obj) => {
  const params = new URLSearchParams();
  
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      params.append(key, obj[key]);
    }
  });
  
  return params.toString();
};

/**
 * تحويل query string إلى كائن
 */
export const queryStringToObject = (queryString) => {
  const params = new URLSearchParams(queryString);
  const obj = {};
  
  for (const [key, value] of params.entries()) {
    obj[key] = value;
  }
  
  return obj;
};

/**
 * تأخير (للاستخدام مع async/await)
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * debounce - تأخير تنفيذ دالة
 */
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * throttle - تحديد معدل تنفيذ دالة
 */
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * ترتيب مصفوفة من الكائنات
 */
export const sortArray = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

/**
 * تجميع مصفوفة حسب مفتاح
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * إزالة التكرارات من مصفوفة
 */
export const uniqueArray = (array, key = null) => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * التحقق من كون الكائن فارغ
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * استخراج الأحرف الأولى من الاسم
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * تحويل الأرقام الإنجليزية إلى عربية
 */
export const toArabicNumbers = (str) => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.toString().replace(/[0-9]/g, (digit) => arabicNumbers[digit]);
};

/**
 * تحويل الأرقام العربية إلى إنجليزية
 */
export const toEnglishNumbers = (str) => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let result = str.toString();
  arabicNumbers.forEach((arab, index) => {
    result = result.replace(new RegExp(arab, 'g'), index);
  });
  return result;
};

/**
 * التحقق من صلاحية JSON
 */
export const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * إنشاء UUID بسيط
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * حساب النسبة المئوية
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * معالجة أخطاء Supabase
 */
export const handleSupabaseError = (error) => {
  if (!error) return 'حدث خطأ غير معروف';
  
  // أخطاء شائعة
  const errorMessages = {
    'Invalid login credentials': 'بيانات الدخول غير صحيحة',
    'User already registered': 'المستخدم مسجل مسبقاً',
    'Email not confirmed': 'البريد الإلكتروني غير مؤكد',
    'Invalid email': 'البريد الإلكتروني غير صحيح',
    'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
  };
  
  return errorMessages[error.message] || error.message || 'حدث خطأ';
};

export default {
  formatDate,
  formatRelativeTime,
  formatFileSize,
  getStatusLabel,
  getStatusColor,
  truncateText,
  generateReferenceNumber,
  copyToClipboard,
  objectToQueryString,
  queryStringToObject,
  delay,
  debounce,
  throttle,
  sortArray,
  groupBy,
  uniqueArray,
  isEmpty,
  getInitials,
  toArabicNumbers,
  toEnglishNumbers,
  isValidJSON,
  generateUUID,
  calculatePercentage,
  handleSupabaseError,
};

