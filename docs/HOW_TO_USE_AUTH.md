# دليل استخدام نظام المصادقة والحماية

## 📖 مقدمة

هذا دليل سريع لفهم واستخدام نظام المصادقة والحماية الجديد.

---

## 🚀 البدء السريع

### 1. إضافة حماية لصفحة جديدة للباحث

```javascript
// في بداية ملف JS الخاص بالصفحة
import { requireResearcher } from '../utils/auth-guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    // هذا السطر يحمي الصفحة
    const user = await requireResearcher();
    if (!user) return;
    
    // باقي الكود هنا
    console.log('المستخدم:', user.username);
});
```

### 2. إضافة حماية لصفحة جديدة للأدمن

```javascript
import { requireAdmin } from '../utils/auth-guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const admin = await requireAdmin();
    if (!admin) return;
    
    // باقي الكود
});
```

### 3. صفحة تسجيل دخول أو تسجيل

```javascript
import { guestOnly } from '../utils/auth-guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    await guestOnly();
    
    // باقي الكود
});
```

---

## 🔑 الدوال المتاحة

### من `auth-guard.js`

#### `requireAuth(requiredRole)`
التحقق العام من المصادقة مع دور اختياري

```javascript
import { requireAuth } from '../utils/auth-guard.js';

// بدون تحديد دور - أي مستخدم مسجل
const user = await requireAuth();

// مع تحديد دور
const researcher = await requireAuth('researcher');
const admin = await requireAuth('admin');
```

#### `requireResearcher()`
التحقق من أن المستخدم باحث

```javascript
import { requireResearcher } from '../utils/auth-guard.js';

const user = await requireResearcher();
// إذا لم يكن باحث، سيتم إعادة توجيهه تلقائياً
```

#### `requireAdmin()`
التحقق من أن المستخدم أدمن

```javascript
import { requireAdmin } from '../utils/auth-guard.js';

const admin = await requireAdmin();
// إذا لم يكن أدمن، سيتم إعادة توجيهه تلقائياً
```

#### `guestOnly()`
للصفحات التي يجب أن يكون المستخدم غير مسجل

```javascript
import { guestOnly } from '../utils/auth-guard.js';

await guestOnly();
// المسجلون سيتم إعادة توجيههم لوحة التحكم
```

#### `validateSession()`
التحقق من صلاحية الجلسة

```javascript
import { validateSession } from '../utils/auth-guard.js';

const isValid = await validateSession();
if (isValid) {
    console.log('الجلسة صالحة');
} else {
    console.log('الجلسة منتهية');
}
```

---

### من `authStore.js`

#### `getCurrentUser()`
الحصول على بيانات المستخدم الحالي

```javascript
import authStore from '../stores/authStore.js';

const user = await authStore.getCurrentUser();
if (user) {
    console.log('الاسم:', user.username);
    console.log('البريد:', user.email);
    console.log('الدور:', user.role);
}
```

#### `isLoggedIn()`
التحقق من تسجيل الدخول

```javascript
const isLoggedIn = authStore.isLoggedIn();
if (isLoggedIn) {
    console.log('المستخدم مسجل');
}
```

#### `login(email, password)`
تسجيل الدخول

```javascript
const result = await authStore.login(email, password);
if (result.success) {
    console.log('تم تسجيل الدخول بنجاح');
} else {
    console.error('خطأ:', result.error);
}
```

#### `logout()`
تسجيل الخروج

```javascript
const result = await authStore.logout();
if (result.success) {
    console.log('تم تسجيل الخروج');
}
```

#### `register(userData)`
تسجيل مستخدم جديد

```javascript
const userData = {
    username: 'أحمد',
    email: 'ahmed@example.com',
    password: 'password123',
    national_id: '1234567890',
    phone: '0501234567'
};

const result = await authStore.register(userData);
if (result.success) {
    console.log('تم التسجيل بنجاح');
}
```

---

## 🎯 أمثلة شاملة

### مثال 1: صفحة لوحة تحكم الباحث

```javascript
/**
 * researcher-dashboard.js
 */
import { requireResearcher } from '../utils/auth-guard.js';
import authStore from '../stores/authStore.js';

// DOM Elements
let welcomeMessage;

document.addEventListener('DOMContentLoaded', async () => {
    // حماية الصفحة
    const user = await requireResearcher();
    if (!user) return;
    
    // تهيئة العناصر
    welcomeMessage = document.getElementById('welcome-message');
    
    // عرض رسالة ترحيب
    welcomeMessage.textContent = `مرحباً ${user.username}!`;
    
    // تحميل البيانات
    await loadDashboardData(user.id);
});

async function loadDashboardData(userId) {
    // ... تحميل البيانات
}
```

### مثال 2: صفحة تسجيل دخول

```javascript
/**
 * login.js
 */
import { guestOnly } from '../utils/auth-guard.js';
import authStore from '../stores/authStore.js';

document.addEventListener('DOMContentLoaded', async () => {
    // منع المسجلين من الوصول
    await guestOnly();
    
    // تهيئة النموذج
    const form = document.getElementById('login-form');
    form.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = await authStore.login(email, password);
    
    if (result.success) {
        // الحصول على بيانات المستخدم
        const user = await authStore.getCurrentUser();
        
        // إعادة التوجيه حسب الدور
        if (user.role === 'admin') {
            window.location.href = '/pages/admin/dashboard.html';
        } else {
            window.location.href = '/pages/researcher/dashboard.html';
        }
    } else {
        alert('خطأ في تسجيل الدخول');
    }
}
```

### مثال 3: زر تسجيل خروج

```javascript
/**
 * في أي صفحة
 */
import authStore from '../stores/authStore.js';

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', async () => {
    const result = await authStore.logout();
    
    if (result.success) {
        window.location.href = '/pages/login.html';
    }
});
```

### مثال 4: التحقق من الصلاحيات في الكود

```javascript
import authStore from '../stores/authStore.js';

async function deleteSubmission(submissionId) {
    const user = await authStore.getCurrentUser();
    
    // التحقق من الصلاحيات
    if (user.role !== 'admin') {
        alert('ليس لديك صلاحية لحذف الطلبات');
        return;
    }
    
    // حذف الطلب
    // ...
}
```

---

## 🔄 سير العمل الكامل

### 1. تسجيل مستخدم جديد

```javascript
// في صفحة التسجيل
const result = await authStore.register({
    username: 'محمد',
    email: 'mohammed@example.com',
    password: 'Pass123!',
    national_id: '1234567890',
    phone: '0501234567'
});

if (result.success) {
    // يتم إنشاء المستخدم في Supabase Auth
    // ويتم إضافة سجل في جدول users
    // بدور researcher افتراضياً
}
```

### 2. تسجيل الدخول

```javascript
const result = await authStore.login('mohammed@example.com', 'Pass123!');

if (result.success) {
    // يتم إنشاء جلسة في Supabase
    // ويتم حفظها في localStorage
    // ويتم تحديث authStore.state
}
```

### 3. الوصول للصفحات

```javascript
// عند فتح أي صفحة محمية
const user = await requireResearcher();
// authStore يتحقق من:
// 1. وجود جلسة في localStorage
// 2. صلاحية الجلسة مع Supabase
// 3. دور المستخدم من جدول users
// 4. إذا كل شيء صحيح، يسمح بالوصول
// 5. وإلا، يعيد التوجيه
```

### 4. تسجيل الخروج

```javascript
await authStore.logout();
// يتم:
// 1. إنهاء الجلسة في Supabase
// 2. مسح localStorage
// 3. مسح authStore.state
// 4. إعادة التوجيه لصفحة تسجيل الدخول
```

---

## 📋 Checklist للصفحات الجديدة

عند إنشاء صفحة جديدة، تأكد من:

- [ ] استيراد الدالة المناسبة من `auth-guard.js`
- [ ] استدعاء الدالة في `DOMContentLoaded`
- [ ] التحقق من أن `user` ليس `null` قبل المتابعة
- [ ] إضافة معالجة للأخطاء
- [ ] اختبار الصفحة مع أدوار مختلفة

### مثال Checklist:

```javascript
// ✅ استيراد صحيح
import { requireResearcher } from '../utils/auth-guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    // ✅ استدعاء في DOMContentLoaded
    const user = await requireResearcher();
    
    // ✅ التحقق من null
    if (!user) return;
    
    try {
        // ✅ معالجة الأخطاء
        await initPage(user);
    } catch (error) {
        console.error('خطأ:', error);
    }
});
```

---

## ⚠️ أخطاء شائعة

### ❌ خطأ 1: نسيان await

```javascript
// خطأ
const user = requireResearcher(); // ❌
if (!user) return;

// صحيح
const user = await requireResearcher(); // ✅
if (!user) return;
```

### ❌ خطأ 2: عدم التحقق من null

```javascript
// خطأ
const user = await requireResearcher();
console.log(user.username); // ❌ قد يكون null

// صحيح
const user = await requireResearcher();
if (!user) return; // ✅
console.log(user.username);
```

### ❌ خطأ 3: استخدام الدالة الخاطئة

```javascript
// في صفحة باحث - خطأ
const user = await requireAdmin(); // ❌

// صحيح
const user = await requireResearcher(); // ✅
```

### ❌ خطأ 4: عدم استيراد الدالة

```javascript
// خطأ
const user = await requireResearcher(); // ❌ غير مستورد

// صحيح
import { requireResearcher } from '../utils/auth-guard.js'; // ✅
const user = await requireResearcher();
```

---

## 🎓 نصائح متقدمة

### 1. استخدام authStore.subscribe للتحديثات

```javascript
import authStore from '../stores/authStore.js';

// الاستماع لتغييرات الحالة
authStore.subscribe((state) => {
    if (state.isAuthenticated) {
        console.log('المستخدم مسجل:', state.user);
    } else {
        console.log('المستخدم غير مسجل');
    }
});
```

### 2. انتظار التهيئة

```javascript
import authStore from '../stores/authStore.js';

// انتظار انتهاء التهيئة
await authStore.waitForInitialization();

// الآن يمكنك استخدام authStore
const isLoggedIn = authStore.isLoggedIn();
```

### 3. التحقق من الصلاحيات في الكود

```javascript
import authStore from '../stores/authStore.js';

function canEdit(submission, currentUser) {
    // الأدمن يمكنه التعديل دائماً
    if (currentUser.role === 'admin') {
        return true;
    }
    
    // الباحث يمكنه تعديل طلباته فقط
    return submission.user_id === currentUser.id;
}
```

---

## 📞 الحصول على المساعدة

إذا واجهت مشكلة:

1. افتح console في المتصفح (F12)
2. ابحث عن رسائل الخطأ باللون الأحمر
3. تأكد من Supabase credentials صحيحة
4. تحقق من جدول `users` في قاعدة البيانات

---

## ✨ الخلاصة

نظام المصادقة والحماية الآن:

- ✅ **سهل الاستخدام:** دالة واحدة تحمي الصفحة
- ✅ **آمن:** كل الصفحات محمية تلقائياً
- ✅ **مرن:** يدعم أدوار مختلفة
- ✅ **متكامل:** يعمل مع Supabase بشكل كامل

استمتع بالتطوير! 🚀

---

**تم إعداده بواسطة:** عمر العديني  
**التاريخ:** 16 نوفمبر 2025

