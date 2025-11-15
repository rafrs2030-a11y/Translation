# 📦 Stores Documentation

دليل شامل لاستخدام Stores في المشروع

## 📋 جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [authStore](#authstore)
- [submissionsStore](#submissionsstore)
- [adminStore](#adminstore)
- [notificationsStore](#notificationsstore)
- [أمثلة الاستخدام](#أمثلة-الاستخدام)

---

## نظرة عامة

Stores هي نمط إدارة الحالة (State Management) المستخدم في المشروع. كل Store مسؤول عن جزء محدد من حالة التطبيق.

### الميزات الرئيسية

- ✅ **Singleton Pattern** - نسخة واحدة فقط من كل Store
- ✅ **Reactive** - تحديث تلقائي للواجهة عند تغيير الحالة
- ✅ **Type-Safe** - جميع الدوال موثقة بوضوح
- ✅ **Error Handling** - معالجة شاملة للأخطاء

### الاستيراد

```javascript
// استيراد Store واحد
import authStore from './stores/authStore';

// استيراد جميع الـ Stores
import stores from './stores';
const { auth, submissions, admin, notifications } = stores;
```

---

## authStore

إدارة حالة المصادقة والمستخدم الحالي.

### الحالة (State)

```javascript
{
  user: null,              // بيانات المستخدم الحالي
  session: null,           // جلسة Supabase
  loading: false,          // حالة التحميل
  error: null,             // رسائل الخطأ
  isAuthenticated: false,  // هل المستخدم مسجل الدخول
  role: null,              // دور المستخدم (researcher/admin)
}
```

### الدوال (Methods)

#### `register(userData)`
تسجيل مستخدم جديد

```javascript
const result = await authStore.register({
  username: 'أحمد محمد',
  email: 'ahmad@example.com',
  national_id: '1234567890',
  phone: '0501234567',
  password: 'SecurePass123'
});

if (result.success) {
  console.log('تم التسجيل بنجاح');
}
```

#### `login(email, password)`
تسجيل الدخول

```javascript
const result = await authStore.login('ahmad@example.com', 'SecurePass123');

if (result.success) {
  console.log('تم تسجيل الدخول');
  console.log('الدور:', authStore.getState().role);
}
```

#### `logout()`
تسجيل الخروج

```javascript
await authStore.logout();
```

#### `requestPasswordReset(email)`
طلب إعادة تعيين كلمة المرور

```javascript
await authStore.requestPasswordReset('ahmad@example.com');
```

#### `resetPassword(newPassword)`
إعادة تعيين كلمة المرور

```javascript
await authStore.resetPassword('NewSecurePass123');
```

#### Helper Methods

```javascript
// التحقق من تسجيل الدخول
if (authStore.isLoggedIn()) {
  // المستخدم مسجل الدخول
}

// التحقق من الدور
if (authStore.hasRole('admin')) {
  // المستخدم مسؤول
}

// التحقق من تأكيد البريد
if (authStore.isEmailVerified()) {
  // البريد مؤكد
}
```

### الاشتراك في التغييرات

```javascript
// الاشتراك في تغييرات الحالة
const unsubscribe = authStore.subscribe((state) => {
  console.log('الحالة الجديدة:', state);
  
  if (state.isAuthenticated) {
    // المستخدم سجل الدخول
    updateUI();
  }
});

// إلغاء الاشتراك
unsubscribe();
```

---

## submissionsStore

إدارة حالة طلبات تقديم الأبحاث.

### الحالة (State)

```javascript
{
  submissions: [],         // قائمة الطلبات
  currentSubmission: null, // الطلب الحالي
  drafts: [],              // المسودات
  loading: false,
  error: null,
  filters: {...},          // الفلاتر المطبقة
  pagination: {...},       // معلومات الصفحات
}
```

### الدوال (Methods)

#### `fetchUserSubmissions()`
جلب طلبات المستخدم الحالي

```javascript
await submissionsStore.fetchUserSubmissions();
const submissions = submissionsStore.getState().submissions;
```

#### `createSubmission(data)`
إنشاء طلب جديد

```javascript
const result = await submissionsStore.createSubmission({
  full_name: 'د. أحمد محمد',
  country: 'المملكة العربية السعودية',
  email: 'ahmad@example.com',
  gender: 'ذكر',
  id_number: '1234567890',
  research_type: 'رسالة ماجستير',
  category: 'الهندسة وتقنية المعلومات',
  main_researcher: 'د. أحمد محمد',
  general_specialization: 'علوم الحاسب',
  detailed_specialization: 'الذكاء الاصطناعي',
  file_url: 'https://...',
  file_name: 'research.pdf',
  file_size: 1024000,
  declaration_accepted: true,
});

console.log('رقم المرجع:', result.data.reference_number);
```

#### `uploadFile(file, submissionId)`
رفع ملف

```javascript
const fileInput = document.getElementById('file');
const file = fileInput.files[0];

const result = await submissionsStore.uploadFile(file, submissionId);

if (result.success) {
  console.log('رابط الملف:', result.fileUrl);
}
```

#### `setFilters(filters)`
تطبيق فلاتر

```javascript
submissionsStore.setFilters({
  status: 'pending',
  researchType: 'رسالة ماجستير',
  dateFrom: '2024-01-01',
});
```

#### `getStats()`
الحصول على الإحصائيات

```javascript
const stats = submissionsStore.getStats();
console.log('إجمالي الطلبات:', stats.total);
console.log('معدل القبول:', stats.acceptanceRate);
```

---

## adminStore

إدارة حالة لوحة تحكم المسؤول.

### الحالة (State)

```javascript
{
  allSubmissions: [],      // جميع الطلبات
  currentSubmission: null,
  comments: [],            // التعليقات
  statusHistory: [],       // سجل التغييرات
  stats: {...},            // الإحصائيات
  loading: false,
  error: null,
}
```

### الدوال (Methods)

#### `fetchAllSubmissions()`
جلب جميع الطلبات

```javascript
await adminStore.fetchAllSubmissions();
```

#### `updateSubmissionStatus(submissionId, newStatus)`
تحديث حالة الطلب

```javascript
const result = await adminStore.updateSubmissionStatus(
  submissionId,
  'approved'
);

if (result.success) {
  console.log('تم تحديث الحالة');
  // سيتم إرسال إشعار تلقائياً للباحث
}
```

#### `addComment(submissionId, comment, isVisible)`
إضافة تعليق

```javascript
await adminStore.addComment(
  submissionId,
  'الرجاء تحديث الفصل الثاني',
  true // مرئي للباحث
);
```

#### `fetchStats()`
جلب الإحصائيات

```javascript
await adminStore.fetchStats();
const stats = adminStore.getState().stats;

console.log('طلبات قيد المراجعة:', stats.pending);
console.log('معدل القبول:', stats.acceptanceRate + '%');
```

#### `exportSubmissions(format)`
تصدير البيانات

```javascript
// تصدير إلى CSV
await adminStore.exportSubmissions('csv');

// تصدير إلى JSON
await adminStore.exportSubmissions('json');
```

---

## notificationsStore

إدارة حالة الإشعارات.

### الحالة (State)

```javascript
{
  notifications: [],       // قائمة الإشعارات
  unreadCount: 0,          // عدد غير المقروءة
  preferences: {...},      // تفضيلات الإشعارات
  loading: false,
  error: null,
}
```

### الدوال (Methods)

#### `initialize()`
تهيئة نظام الإشعارات

```javascript
await notificationsStore.initialize();
// سيبدأ الاستماع للإشعارات الفورية
```

#### `fetchNotifications()`
جلب الإشعارات

```javascript
await notificationsStore.fetchNotifications();
const notifications = notificationsStore.getState().notifications;
```

#### `markAsRead(notificationId)`
وضع علامة مقروء

```javascript
await notificationsStore.markAsRead(notificationId);
```

#### `markAllAsRead()`
وضع علامة مقروء على الجميع

```javascript
await notificationsStore.markAllAsRead();
```

#### `updatePreferences(preferences)`
تحديث التفضيلات

```javascript
await notificationsStore.updatePreferences({
  email_enabled: true,
  status_change_email: true,
  comments_email: false,
});
```

#### `requestNotificationPermission()`
طلب إذن إشعارات المتصفح

```javascript
const result = await notificationsStore.requestNotificationPermission();

if (result.success) {
  console.log('تم منح الإذن');
}
```

---

## أمثلة الاستخدام

### مثال 1: تسجيل دخول وعرض الطلبات

```javascript
import authStore from './stores/authStore';
import submissionsStore from './stores/submissionsStore';

async function loginAndFetchSubmissions() {
  // تسجيل الدخول
  const loginResult = await authStore.login(email, password);
  
  if (!loginResult.success) {
    alert('فشل تسجيل الدخول');
    return;
  }
  
  // جلب الطلبات
  await submissionsStore.fetchUserSubmissions();
  
  // عرض الطلبات
  const submissions = submissionsStore.getState().submissions;
  renderSubmissions(submissions);
}
```

### مثال 2: مراجعة طلب (مسؤول)

```javascript
import adminStore from './stores/adminStore';

async function reviewSubmission(submissionId) {
  // جلب تفاصيل الطلب
  await adminStore.fetchSubmissionDetails(submissionId);
  
  const submission = adminStore.getState().currentSubmission;
  
  // إضافة تعليق
  await adminStore.addComment(
    submissionId,
    'بحث ممتاز، تمت الموافقة',
    true
  );
  
  // تحديث الحالة
  await adminStore.updateSubmissionStatus(submissionId, 'approved');
  
  alert('تم قبول البحث وإرسال إشعار للباحث');
}
```

### مثال 3: الاشتراك في الإشعارات الفورية

```javascript
import notificationsStore from './stores/notificationsStore';

// تهيئة
await notificationsStore.initialize();

// الاشتراك في التغييرات
notificationsStore.subscribe((state) => {
  // تحديث العداد
  document.getElementById('notif-badge').textContent = state.unreadCount;
  
  // عرض آخر إشعار
  if (state.notifications.length > 0) {
    const latest = state.notifications[0];
    showToast(latest.message);
  }
});
```

### مثال 4: رفع ملف وتقديم بحث

```javascript
import submissionsStore from './stores/submissionsStore';

async function submitResearch(formData, file) {
  // رفع الملف أولاً
  const uploadResult = await submissionsStore.uploadFile(file, 'temp');
  
  if (!uploadResult.success) {
    alert('فشل رفع الملف');
    return;
  }
  
  // تقديم الطلب
  const submissionData = {
    ...formData,
    file_url: uploadResult.fileUrl,
    file_name: uploadResult.fileName,
    file_size: uploadResult.fileSize,
  };
  
  const result = await submissionsStore.createSubmission(submissionData);
  
  if (result.success) {
    alert(`تم التقديم بنجاح! رقم المرجع: ${result.data.reference_number}`);
  }
}
```

---

## 🔧 نصائح التطوير

### 1. دائماً تحقق من النتيجة

```javascript
const result = await store.someMethod();

if (result.success) {
  // نجح
} else {
  console.error(result.error);
}
```

### 2. استخدم الاشتراكات بحذر

```javascript
// تذكر إلغاء الاشتراك
useEffect(() => {
  const unsubscribe = store.subscribe(listener);
  return () => unsubscribe(); // cleanup
}, []);
```

### 3. معالجة الأخطاء

```javascript
try {
  await store.someMethod();
} catch (error) {
  console.error('خطأ:', error);
  showErrorMessage(error.message);
}
```

---

## 📚 مراجع إضافية

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [State Management Patterns](https://www.patterns.dev/posts/state-pattern)

---

تم التحديث: نوفمبر 2025

