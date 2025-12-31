/**
 * Validators
 * وظائف التحقق من صحة البيانات
 */

import { REGEX_PATTERNS, ERROR_MESSAGES } from '../config/constants';

// Cache for minimum password length (fetched from settings)
let cachedMinPasswordLength = 6;

/**
 * التحقق من البريد الإلكتروني
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }

  if (!REGEX_PATTERNS.EMAIL.test(email)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
  }

  return { valid: true };
};

/**
 * Get minimum password length from settings (async)
 */
export const getMinimumPasswordLength = async () => {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return 6; // Default for server-side
    }

    // Check localStorage cache first
    const cached = localStorage.getItem('minimum_password_length');
    if (cached) {
      const length = parseInt(cached, 10);
      if (!isNaN(length) && length >= 6 && length <= 32) {
        cachedMinPasswordLength = length;
        return length;
      }
    }

    // Try to fetch from Supabase if available
    if (typeof window.supabase !== 'undefined') {
      const { data, error } = await window.supabase
        .from('platform_settings')
        .select('setting_value')
        .eq('setting_key', 'minimum_password_length')
        .single();

      if (!error && data && data.setting_value) {
        const length = parseInt(data.setting_value, 10);
        if (!isNaN(length) && length >= 6 && length <= 32) {
          cachedMinPasswordLength = length;
          localStorage.setItem('minimum_password_length', length.toString());
          return length;
        }
      }
    }

    // Return cached value or default
    return cachedMinPasswordLength;
  } catch (error) {
    console.error('Error fetching minimum password length:', error);
    return cachedMinPasswordLength; // Return cached or default
  }
};

/**
 * التحقق من كلمة المرور (sync version - uses cached/default value)
 */
export const validatePassword = (password) => {
  return validatePasswordWithLength(password, cachedMinPasswordLength);
};

/**
 * التحقق من كلمة المرور مع طول محدد
 */
export const validatePasswordWithLength = (password, minLength = 6) => {
  if (!password) {
    return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }

  if (password.length < minLength) {
    return { valid: false, error: `كلمة المرور يجب أن تكون ${minLength} أحرف على الأقل` };
  }

  return { valid: true };
};

/**
 * التحقق من كلمة المرور (async version - fetches from settings)
 */
export const validatePasswordAsync = async (password) => {
  const minLength = await getMinimumPasswordLength();
  return validatePasswordWithLength(password, minLength);
};

/**
 * التحقق من تطابق كلمات المرور
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { valid: false, error: ERROR_MESSAGES.PASSWORDS_DONT_MATCH };
  }
  return { valid: true };
};

/**
 * التحقق من رقم الهاتف السعودي
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }

  if (!REGEX_PATTERNS.PHONE.test(phone)) {
    return { valid: false, error: 'رقم الهاتف غير صحيح' };
  }

  return { valid: true };
};

/**
 * التحقق من رقم الهوية الوطنية
 */
export const validateNationalId = (nationalId) => {
  if (!nationalId) {
    return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }

  if (!REGEX_PATTERNS.NATIONAL_ID.test(nationalId)) {
    return { valid: false, error: 'رقم الهوية غير صحيح' };
  }

  return { valid: true };
};

/**
 * التحقق من حقل مطلوب
 */
export const validateRequired = (value, fieldName = 'هذا الحقل') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, error: `${fieldName} مطلوب` };
  }
  return { valid: true };
};

/**
 * التحقق من نوع الملف
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file) {
    return { valid: false, error: 'لم يتم اختيار ملف' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_FILE_TYPE };
  }

  return { valid: true };
};

/**
 * التحقق من حجم الملف
 */
export const validateFileSize = (file, maxSize) => {
  if (!file) {
    return { valid: false, error: 'لم يتم اختيار ملف' };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `حجم الملف يجب أن لا يتجاوز ${maxSizeMB} ميجابايت`
    };
  }

  return { valid: true };
};

/**
 * التحقق من امتداد الملف
 */
export const validateFileExtension = (filename, allowedExtensions) => {
  const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `الامتدادات المسموحة: ${allowedExtensions.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * التحقق من نموذج تقديم البحث
 */
export const validateSubmissionForm = (formData) => {
  const errors = {};

  // التحقق من الحقول المطلوبة
  const requiredFields = [
    'full_name',
    'country',
    'email',
    'gender',
    'id_number',
    'research_type',
    'category',
    'main_researcher',
    'general_specialization',
    'detailed_specialization',
  ];

  requiredFields.forEach(field => {
    const validation = validateRequired(formData[field]);
    if (!validation.valid) {
      errors[field] = validation.error;
    }
  });

  // التحقق من البريد الإلكتروني
  if (formData.email) {
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error;
    }
  }

  // التحقق من الإقرار
  if (!formData.declaration_accepted) {
    errors.declaration_accepted = 'يجب الموافقة على الإقرار';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * التحقق من نموذج التسجيل
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};

  // اسم المستخدم
  const usernameValidation = validateRequired(formData.username, 'اسم المستخدم');
  if (!usernameValidation.valid) {
    errors.username = usernameValidation.error;
  }

  // البريد الإلكتروني
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error;
  }

  // رقم الهوية
  const nationalIdValidation = validateNationalId(formData.national_id);
  if (!nationalIdValidation.valid) {
    errors.national_id = nationalIdValidation.error;
  }

  // رقم الهاتف
  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.valid) {
    errors.phone = phoneValidation.error;
  }

  // كلمة المرور
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error;
  }

  // تطابق كلمة المرور
  if (formData.confirm_password) {
    const matchValidation = validatePasswordMatch(
      formData.password,
      formData.confirm_password
    );
    if (!matchValidation.valid) {
      errors.confirm_password = matchValidation.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * تنظيف وتعقيم المدخلات
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .trim()
    .replace(/[<>]/g, '') // إزالة علامات HTML
    .replace(/javascript:/gi, '') // إزالة javascript:
    .replace(/on\w+=/gi, ''); // إزالة event handlers
};

/**
 * التحقق من URL
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'الرابط غير صحيح' };
  }
};

export default {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
  validateNationalId,
  validateRequired,
  validateFileType,
  validateFileSize,
  validateFileExtension,
  validateSubmissionForm,
  validateRegistrationForm,
  sanitizeInput,
  validateUrl,
};

