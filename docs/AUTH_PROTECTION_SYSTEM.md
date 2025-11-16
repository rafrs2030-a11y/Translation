# نظام حماية الصفحات والمصادقة
## Auth Protection & Authentication System

تاريخ التحديث: 16 نوفمبر 2025

---

## ملخص التحديثات / Summary

تم إصلاح نظام المصادقة بالكامل وإضافة حماية شاملة لجميع الصفحات.

### المشاكل التي تم حلها:

1. ✅ نظام المصادقة لا يعمل مع Supabase بشكل صحيح
2. ✅ لا توجد حماية للصفحات - يمكن الوصول إليها مباشرة
3. ✅ `authStore.getCurrentUser()` كانت مفقودة
4. ✅ التحقق من الجلسة لا يعمل بشكل صحيح
5. ✅ صفحات تسجيل الدخول يمكن الوصول إليها وأنت مسجل

---

## البنية الجديدة / New Structure

### 1. Auth Store المحسّن

**الملف:** `public/js/stores/authStore.js`

#### الدوال الجديدة:

```javascript
// الحصول على المستخدم الحالي
async getCurrentUser()

// انتظار انتهاء التهيئة
async waitForInitialization()
```

#### الميزات:
- ✅ تهيئة تلقائية عند تحميل الصفحة
- ✅ الاستماع لتغييرات الجلسة
- ✅ التكامل الكامل مع Supabase Auth
- ✅ جلب بيانات المستخدم من قاعدة البيانات

---

### 2. Auth Guard Middleware

**الملف:** `public/js/utils/auth-guard.js`

نظام موحد لحماية جميع الصفحات.

#### الدوال المتاحة:

##### `requireAuth(requiredRole)`
حماية عامة - يتحقق من تسجيل الدخول والدور (اختياري)

```javascript
import { requireAuth } from '../utils/auth-guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAuth(); // أي مستخدم
    if (!user) return;
    
    // ... باقي الكود
});
```

##### `requireResearcher()`
حماية خاصة بالباحثين

```javascript
import { requireResearcher } from '../utils/auth-guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireResearcher();
    if (!user) return;
    
    // المستخدم باحث مؤكد
});
```

##### `requireAdmin()`
حماية خاصة بالمسؤولين

```javascript
import { requireAdmin } from '../utils/auth-guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAdmin();
    if (!user) return;
    
    // المستخدم أدمن مؤكد
});
```

##### `guestOnly()`
للصفحات التي يجب الوصول إليها فقط إذا لم تكن مسجلاً (تسجيل دخول، تسجيل)

```javascript
import { guestOnly } from '../utils/auth-guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    await guestOnly(); // يعيد توجيه المستخدمين المسجلين
    
    // ... باقي الكود
});
```

##### `validateSession()`
التحقق من صلاحية الجلسة الحالية

```javascript
import { validateSession } from '../utils/auth-guard.js';

const isValid = await validateSession();
if (!isValid) {
    // الجلسة غير صالحة
}
```

---

## الصفحات المحمية / Protected Pages

### صفحات الباحث / Researcher Pages

جميع الصفحات محمية بـ `requireResearcher()`:

- ✅ `/pages/researcher/dashboard.html`
- ✅ `/pages/researcher/submissions.html`
- ✅ `/pages/researcher/submit.html`
- ✅ `/pages/researcher/profile.html`
- ✅ `/pages/researcher/notifications.html`

**السلوك:**
- إذا لم يكن مسجلاً → إعادة توجيه إلى `/pages/login.html`
- إذا كان أدمن → إعادة توجيه إلى `/pages/admin/dashboard.html`

### صفحات الأدمن / Admin Pages

جميع الصفحات محمية بـ `requireAdmin()`:

- ✅ `/pages/admin/dashboard.html`
- ✅ `/pages/admin/submissions.html`
- ✅ `/pages/admin/users.html`

**السلوك:**
- إذا لم يكن مسجلاً → إعادة توجيه إلى `/pages/login.html`
- إذا كان باحث → إعادة توجيه إلى `/pages/researcher/dashboard.html`

### صفحات المصادقة / Auth Pages

محمية بـ `guestOnly()`:

- ✅ `/pages/login.html`
- ✅ `/pages/register.html`

**السلوك:**
- إذا كان مسجلاً → إعادة توجيه حسب الدور

---

## سير العمل / Workflow

### 1. تحميل الصفحة

```
المستخدم يفتح صفحة محمية
    ↓
authStore يتهيأ تلقائياً
    ↓
auth-guard يتحقق من الجلسة
    ↓
يتحقق من الدور
    ↓
إما: السماح بالوصول
أو: إعادة التوجيه
```

### 2. تسجيل الدخول

```
المستخدم يدخل بياناته
    ↓
authStore.login(email, password)
    ↓
Supabase يتحقق من البيانات
    ↓
جلب بيانات المستخدم من DB
    ↓
تحديث authStore.state
    ↓
إعادة التوجيه حسب الدور
```

### 3. تسجيل الخروج

```
المستخدم يضغط تسجيل خروج
    ↓
authStore.logout()
    ↓
Supabase.auth.signOut()
    ↓
مسح authStore.state
    ↓
إعادة التوجيه إلى /pages/login.html
```

---

## الأمثلة / Examples

### مثال 1: صفحة محمية للباحث

```javascript
import { requireResearcher } from '../utils/auth-guard.js';
import submissionsStore from '../stores/submissionsStore.js';

document.addEventListener('DOMContentLoaded', async () => {
    // التحقق من المصادقة والدور
    const user = await requireResearcher();
    if (!user) return; // سيتم إعادة التوجيه تلقائياً
    
    // الآن أنت متأكد أن user موجود وهو باحث
    console.log('مرحباً', user.username);
    
    // تحميل البيانات
    await loadData();
});
```

### مثال 2: صفحة محمية للأدمن

```javascript
import { requireAdmin } from '../utils/auth-guard.js';
import adminStore from '../stores/adminStore.js';

document.addEventListener('DOMContentLoaded', async () => {
    const admin = await requireAdmin();
    if (!admin) return;
    
    // الآن أنت متأكد أن admin موجود وهو مسؤول
    await loadAdminData();
});
```

### مثال 3: صفحة تسجيل دخول

```javascript
import { guestOnly } from '../utils/auth-guard.js';
import authStore from '../stores/authStore.js';

document.addEventListener('DOMContentLoaded', async () => {
    // إذا كان مسجلاً، سيتم إعادة توجيهه
    await guestOnly();
    
    // الآن أنت متأكد أنه غير مسجل
    initLoginForm();
});
```

---

## الاختبار / Testing

### اختبار الحماية:

1. **باحث يحاول الوصول لصفحة أدمن:**
   ```
   يفتح: /pages/admin/dashboard.html
   يعاد توجيهه إلى: /pages/researcher/dashboard.html
   ```

2. **أدمن يحاول الوصول لصفحة باحث:**
   ```
   يفتح: /pages/researcher/dashboard.html
   يعاد توجيهه إلى: /pages/admin/dashboard.html
   ```

3. **غير مسجل يحاول الوصول لأي صفحة:**
   ```
   يفتح: أي صفحة محمية
   يعاد توجيهه إلى: /pages/login.html
   ```

4. **مسجل يحاول الوصول لصفحة تسجيل:**
   ```
   يفتح: /pages/login.html
   يعاد توجيهه إلى: لوحة التحكم الخاصة به
   ```

---

## الملفات المعدلة / Modified Files

### ملفات جديدة:
- ✅ `public/js/utils/auth-guard.js` - نظام الحماية الموحد

### ملفات محدثة:

#### Stores:
- ✅ `public/js/stores/authStore.js`

#### صفحات الباحث:
- ✅ `public/js/researcher/dashboard.js`
- ✅ `public/js/researcher/submissions.js`
- ✅ `public/js/researcher/submit.js`
- ✅ `public/js/researcher/profile.js`
- ✅ `public/js/researcher/notifications.js`

#### صفحات الأدمن:
- ✅ `public/js/admin/dashboard.js`
- ✅ `public/js/admin/submissions.js`
- ✅ `public/js/admin/users.js`

#### صفحات المصادقة:
- ✅ `public/js/auth/login.js`
- ✅ `public/js/auth/register.js`

---

## الميزات / Features

### ✅ الميزات المضافة:

1. **حماية شاملة للصفحات**
   - كل صفحة محمية حسب دورها
   - منع الوصول غير المصرح

2. **تكامل كامل مع Supabase**
   - المصادقة تعمل بشكل صحيح
   - جلب البيانات من DB
   - الاستماع لتغييرات الجلسة

3. **نظام موحد للحماية**
   - كود قابل لإعادة الاستخدام
   - سهل الصيانة والتحديث

4. **تجربة مستخدم أفضل**
   - إعادة توجيه تلقائية
   - عدم عرض محتوى غير مصرح

---

## الخطوات التالية / Next Steps

### اختبار شامل:
1. اختبار تسجيل دخول جديد
2. اختبار الوصول لجميع الصفحات
3. اختبار تسجيل الخروج
4. اختبار الحماية من الوصول المباشر

### تحسينات مستقبلية:
- إضافة refresh token
- تحسين معالجة الأخطاء
- إضافة loading states أفضل

---

## الدعم / Support

إذا واجهت أي مشاكل:

1. تحقق من console للأخطاء
2. تأكد من Supabase credentials صحيحة
3. تحقق من أن المستخدم موجود في جدول `users`

---

**تم التطوير بواسطة:** عمر العديني
**التاريخ:** 16 نوفمبر 2025

