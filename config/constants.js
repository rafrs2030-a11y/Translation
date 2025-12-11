/**
 * Constants
 * الثوابت المستخدمة في التطبيق
 */

// حالات الطلبات
export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEEDS_REVISION: 'needs_revision',
  DRAFT: 'draft',
};

// تسميات الحالات بالعربية
export const STATUS_LABELS = {
  [SUBMISSION_STATUS.PENDING]: 'قيد المراجعة',
  [SUBMISSION_STATUS.APPROVED]: 'مقبول',
  [SUBMISSION_STATUS.REJECTED]: 'مرفوض',
  [SUBMISSION_STATUS.NEEDS_REVISION]: 'يحتاج مراجعة',
  [SUBMISSION_STATUS.DRAFT]: 'مسودة',
};

// ألوان الحالات
export const STATUS_COLORS = {
  [SUBMISSION_STATUS.PENDING]: '#FFA500', // برتقالي
  [SUBMISSION_STATUS.APPROVED]: '#28A745', // أخضر
  [SUBMISSION_STATUS.REJECTED]: '#DC3545', // أحمر
  [SUBMISSION_STATUS.NEEDS_REVISION]: '#007BFF', // أزرق
  [SUBMISSION_STATUS.DRAFT]: '#6C757D', // رمادي
};

// أنواع البحث
export const RESEARCH_TYPES = [
  'ورقة علمية',
  'رسالة ماجستير',
  'أطروحة دكتوراه',
  'كتاب',
];

// فئات البحث
export const RESEARCH_CATEGORIES = [
  'العلوم الصحية',
  'العلوم الاجتماعية',
  'الدراسات الإسلامية',
  'التاريخ والتراث',
  'الاقتصاد والمال',
  'الهندسة وتقنية المعلومات',
  'أخرى',
];

// الدول العربية
export const ARAB_COUNTRIES = [
  'المملكة العربية السعودية',
  'الإمارات العربية المتحدة',
  'مصر',
  'الأردن',
  'الكويت',
  'البحرين',
  'قطر',
  'عمان',
  'لبنان',
  'فلسطين',
  'العراق',
  'سوريا',
  'اليمن',
  'ليبيا',
  'تونس',
  'الجزائر',
  'المغرب',
  'السودان',
  'الصومال',
  'جيبوتي',
  'جزر القمر',
  'موريتانيا',
];

// جميع الدول العربية والأجنبية
export const ALL_COUNTRIES = [
  // الدول العربية
  'المملكة العربية السعودية',
  'الإمارات العربية المتحدة',
  'مصر',
  'الأردن',
  'الكويت',
  'البحرين',
  'قطر',
  'عمان',
  'لبنان',
  'فلسطين',
  'العراق',
  'سوريا',
  'اليمن',
  'ليبيا',
  'تونس',
  'الجزائر',
  'المغرب',
  'السودان',
  'الصومال',
  'جيبوتي',
  'جزر القمر',
  'موريتانيا',
  // الدول الأجنبية
  'أفغانستان',
  'ألبانيا',
  'أندورا',
  'أنغولا',
  'أنتيغوا وباربودا',
  'الأرجنتين',
  'أرمينيا',
  'أستراليا',
  'النمسا',
  'أذربيجان',
  'باهاماس',
  'بنغلاديش',
  'باربادوس',
  'بيلاروس',
  'بلجيكا',
  'بليز',
  'بنين',
  'بوتان',
  'بوليفيا',
  'البوسنة والهرسك',
  'بوتسوانا',
  'البرازيل',
  'بروناي',
  'بلغاريا',
  'بوركينا فاسو',
  'بوروندي',
  'كمبوديا',
  'الكاميرون',
  'كندا',
  'الرأس الأخضر',
  'جمهورية أفريقيا الوسطى',
  'تشاد',
  'تشيلي',
  'الصين',
  'كولومبيا',
  'جمهورية الكونغو',
  'جمهورية الكونغو الديمقراطية',
  'كوستاريكا',
  'كرواتيا',
  'كوبا',
  'قبرص',
  'جمهورية التشيك',
  'الدنمارك',
  'دومينيكا',
  'جمهورية الدومينيكان',
  'الإكوادور',
  'السلفادور',
  'غينيا الاستوائية',
  'إريتريا',
  'إستونيا',
  'إسواتيني',
  'إثيوبيا',
  'فيجي',
  'فنلندا',
  'فرنسا',
  'الغابون',
  'غامبيا',
  'جورجيا',
  'ألمانيا',
  'غانا',
  'اليونان',
  'غرينادا',
  'غواتيمالا',
  'غينيا',
  'غينيا بيساو',
  'غيانا',
  'هايتي',
  'هندوراس',
  'المجر',
  'آيسلندا',
  'الهند',
  'إندونيسيا',
  'إيران',
  'أيرلندا',
  'إسرائيل',
  'إيطاليا',
  'ساحل العاج',
  'جامايكا',
  'اليابان',
  'كازاخستان',
  'كينيا',
  'كيريباتي',
  'كوسوفو',
  'قيرغيزستان',
  'لاوس',
  'لاتفيا',
  'ليسوتو',
  'ليبيريا',
  'ليختنشتاين',
  'ليتوانيا',
  'لوكسمبورغ',
  'مدغشقر',
  'مالاوي',
  'ماليزيا',
  'جزر المالديف',
  'مالي',
  'مالطا',
  'جزر مارشال',
  'موريشيوس',
  'المكسيك',
  'ميكرونيسيا',
  'مولدوفا',
  'موناكو',
  'منغوليا',
  'الجبل الأسود',
  'موزمبيق',
  'ميانمار',
  'ناميبيا',
  'ناورو',
  'نيبال',
  'هولندا',
  'نيوزيلندا',
  'نيكاراغوا',
  'النيجر',
  'نيجيريا',
  'كوريا الشمالية',
  'مقدونيا الشمالية',
  'النرويج',
  'باكستان',
  'بالاو',
  'بنما',
  'بابوا غينيا الجديدة',
  'باراغواي',
  'بيرو',
  'الفلبين',
  'بولندا',
  'البرتغال',
  'رومانيا',
  'روسيا',
  'رواندا',
  'سانت كيتس ونيفيس',
  'سانت لوسيا',
  'سانت فنسنت والغرينادين',
  'ساموا',
  'سان مارينو',
  'ساو تومي وبرينسيبي',
  'السنغال',
  'صربيا',
  'سيشل',
  'سيراليون',
  'سنغافورة',
  'سلوفاكيا',
  'سلوفينيا',
  'جزر سليمان',
  'جنوب أفريقيا',
  'كوريا الجنوبية',
  'جنوب السودان',
  'إسبانيا',
  'سريلانكا',
  'سورينام',
  'السويد',
  'سويسرا',
  'تايوان',
  'طاجيكستان',
  'تنزانيا',
  'تايلاند',
  'تيمور الشرقية',
  'توغو',
  'تونغا',
  'ترينيداد وتوباغو',
  'تركيا',
  'تركمانستان',
  'توفالو',
  'أوغندا',
  'أوكرانيا',
  'المملكة المتحدة',
  'الولايات المتحدة',
  'الأوروغواي',
  'أوزبكستان',
  'فانواتو',
  'الفاتيكان',
  'فنزويلا',
  'فيتنام',
  'زامبيا',
  'زيمبابوي',
];

// الجنس
export const GENDERS = ['ذكر', 'أنثر'];

// أنواع الإشعارات
export const NOTIFICATION_TYPES = {
  STATUS_CHANGE: 'status_change',
  COMMENT_ADDED: 'comment_added',
  NEW_SUBMISSION: 'new_submission',
  REMINDER: 'reminder',
  SYSTEM: 'system',
};

// أدوار المستخدمين
export const USER_ROLES = {
  RESEARCHER: 'researcher',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

// أنواع الملفات المسموحة
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
];

// امتدادات الملفات المسموحة
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.docx', '.doc'];

// الحد الأقصى لحجم الملف (200MB)
export const MAX_FILE_SIZE = 200 * 1024 * 1024;

// عدد العناصر في الصفحة
export const ITEMS_PER_PAGE = {
  DEFAULT: 10,
  ADMIN: 20,
  NOTIFICATIONS: 50,
};

// رسائل الخطأ
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'غير مصرح لك بالوصول',
  NETWORK_ERROR: 'خطأ في الاتصال بالشبكة',
  FILE_TOO_LARGE: 'حجم الملف كبير جداً',
  INVALID_FILE_TYPE: 'نوع الملف غير مدعوم',
  REQUIRED_FIELD: 'هذا الحقل مطلوب',
  INVALID_EMAIL: 'البريد الإلكتروني غير صحيح',
  WEAK_PASSWORD: 'كلمة المرور ضعيفة',
  PASSWORDS_DONT_MATCH: 'كلمات المرور غير متطابقة',
};

// رسائل النجاح
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'تم تسجيل الدخول بنجاح',
  REGISTER_SUCCESS: 'تم إنشاء الحساب بنجاح',
  SUBMISSION_SUCCESS: 'تم تقديم البحث بنجاح',
  UPDATE_SUCCESS: 'تم التحديث بنجاح',
  DELETE_SUCCESS: 'تم الحذف بنجاح',
  COMMENT_ADDED: 'تم إضافة التعليق بنجاح',
};

// مدة الجلسة (24 ساعة)
export const SESSION_DURATION = 24 * 60 * 60 * 1000;

// مدة صلاحية رابط التحقق (24 ساعة)
export const VERIFICATION_LINK_EXPIRY = 24 * 60 * 60 * 1000;

// مدة صلاحية رابط إعادة تعيين كلمة المرور (1 ساعة)
export const PASSWORD_RESET_EXPIRY = 60 * 60 * 1000;

// RegEx Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+?966|0)?5[0-9]{8}$/,
  NATIONAL_ID: /^[12]\d{9}$/,
  REFERENCE_NUMBER: /^REF-\d{4}-\d{4}$/,
};

// API Endpoints (إذا كنت تستخدم API منفصل)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    VERIFY_EMAIL: '/api/auth/verify-email',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  SUBMISSIONS: {
    CREATE: '/api/submissions/create',
    GET_ALL: '/api/submissions',
    GET_BY_ID: '/api/submissions/:id',
    UPDATE: '/api/submissions/:id',
    DELETE: '/api/submissions/:id',
    UPLOAD: '/api/submissions/upload',
  },
  ADMIN: {
    GET_ALL_SUBMISSIONS: '/api/admin/submissions',
    UPDATE_STATUS: '/api/admin/submissions/:id/status',
    ADD_COMMENT: '/api/admin/submissions/:id/comment',
    GET_STATS: '/api/admin/stats',
    EXPORT: '/api/admin/export',
  },
  NOTIFICATIONS: {
    GET_ALL: '/api/notifications',
    MARK_READ: '/api/notifications/:id/read',
    MARK_ALL_READ: '/api/notifications/read-all',
    DELETE: '/api/notifications/:id',
    PREFERENCES: '/api/notifications/preferences',
  },
};

// Routes (مسارات الصفحات)
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Researcher Routes
  RESEARCHER_DASHBOARD: '/researcher/dashboard',
  SUBMIT_RESEARCH: '/researcher/submit',
  VIEW_SUBMISSION: '/researcher/submissions/:id',
  DRAFTS: '/researcher/drafts',
  NOTIFICATIONS: '/researcher/notifications',
  PROFILE: '/researcher/profile',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_SUBMISSIONS: '/admin/submissions',
  ADMIN_SUBMISSION_DETAILS: '/admin/submissions/:id',
  ADMIN_STATS: '/admin/stats',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
};

export default {
  SUBMISSION_STATUS,
  STATUS_LABELS,
  STATUS_COLORS,
  RESEARCH_TYPES,
  RESEARCH_CATEGORIES,
  ARAB_COUNTRIES,
  ALL_COUNTRIES,
  GENDERS,
  NOTIFICATION_TYPES,
  USER_ROLES,
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_EXTENSIONS,
  MAX_FILE_SIZE,
  ITEMS_PER_PAGE,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  REGEX_PATTERNS,
  API_ENDPOINTS,
  ROUTES,
};

