/**
 * Validators
 * وظائف التحقق من صحة البيانات
 */

import { REGEX_PATTERNS, ERROR_MESSAGES } from '../config/constants.js';

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
 * التحقق من كلمة المرور
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }
  
  if (password.length < 8) {
    return { valid: false, error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' };
  }
  
  // التحقق من وجود حرف كبير وصغير ورقم
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return { 
      valid: false, 
      error: 'كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام' 
    };
  }
  
  return { valid: true };
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
 * التحقق من رقم الهاتف
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }
  
  // تنظيف الرقم من المسافات والأحرف
  const cleanedPhone = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
  
  // التحقق من أن الرقم يبدأ بـ + أو رقم ويحتوي على 8-15 رقم
  if (!/^(\+?\d{1,4})?\d{8,15}$/.test(cleanedPhone)) {
    return { valid: false, error: 'رقم الهاتف غير صحيح. يجب أن يكون بين 8 و 15 رقم' };
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
  
  // تنظيف الرقم من المسافات والأحرف
  const cleanedId = nationalId.replace(/\s+/g, '').replace(/[^\d]/g, '');
  
  // التحقق من أن الرقم يحتوي على أرقام فقط وطوله معقول (من 8 إلى 20 رقم)
  if (!/^\d+$/.test(cleanedId)) {
    return { valid: false, error: 'رقم الهوية يجب أن يحتوي على أرقام فقط' };
  }
  
  if (cleanedId.length < 8 || cleanedId.length > 20) {
    return { valid: false, error: 'رقم الهوية يجب أن يكون بين 8 و 20 رقم' };
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

