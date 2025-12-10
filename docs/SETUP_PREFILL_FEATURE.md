# دليل تطبيق ميزة الملء التلقائي
# Setup Guide for User Data Pre-fill Feature

## خطوات التطبيق السريعة

### 1️⃣ تحديث قاعدة البيانات (Supabase)

قم بتسجيل الدخول إلى Supabase Dashboard وافتح SQL Editor، ثم نفذ الأوامر التالية:

```sql
-- إضافة حقل الجنس
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('ذكر', 'أنثى'));

-- إضافة حقل الدولة
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- إضافة index للدولة (اختياري لكن موصى به)
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);

-- إضافة تعليقات توضيحية
COMMENT ON COLUMN users.gender IS 'جنس المستخدم (ذكر/أنثى)';
COMMENT ON COLUMN users.country IS 'دولة المستخدم';
```

### 2️⃣ التحقق من التحديثات

تأكد من تطبيق التحديثات بنجاح:

```sql
-- عرض structure جدول users
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

يجب أن ترى الحقول التالية في جدول users:
- ✅ id
- ✅ username
- ✅ email
- ✅ national_id
- ✅ phone
- ✅ password_hash
- ✅ email_verified
- ✅ role
- ✅ **gender** (جديد)
- ✅ **country** (جديد)
- ✅ created_at
- ✅ updated_at

### 3️⃣ اختبار الميزة

#### أ) اختبار التسجيل
1. افتح `/pages/register.html`
2. سجل مستخدم جديد
3. تأكد من ظهور حقلي الجنس والدولة
4. أكمل التسجيل

#### ب) اختبار الملء التلقائي
1. سجل دخول بالمستخدم الجديد
2. انتقل إلى `/pages/researcher/submit.html` (تقديم بحث جديد)
3. تحقق من ملء الحقول التالية تلقائياً:
   - ✅ الاسم الكامل
   - ✅ البريد الإلكتروني
   - ✅ رقم الهوية
   - ✅ الجنس
   - ✅ الدولة

### 4️⃣ تحديث المستخدمين الحاليين (اختياري)

إذا كان لديك مستخدمين حاليين وتريد تحديث بياناتهم:

```sql
-- مثال: تحديث دولة مستخدم معين
UPDATE users 
SET country = 'المملكة العربية السعودية', 
    gender = 'ذكر'
WHERE email = 'user@example.com';

-- أو تحديث جميع المستخدمين بقيمة افتراضية
UPDATE users 
SET country = 'غير محدد'
WHERE country IS NULL;
```

## استكشاف الأخطاء

### المشكلة: الحقول لا تملأ تلقائياً

**الحلول:**
1. افتح Console المتصفح (F12)
2. تحقق من رسائل الخطأ
3. تأكد من:
   ```javascript
   // يجب أن ترى:
   "User data prefilled successfully"
   ```

### المشكلة: خطأ في قاعدة البيانات

**الحلول:**
1. تحقق من تطبيق migration بشكل صحيح
2. تأكد من وجود الحقول:
   ```sql
   SELECT * FROM users LIMIT 1;
   ```

### المشكلة: المستخدمين القدامى لا يرون بياناتهم

**السبب:** المستخدمون المسجلون قبل التحديث لا يملكون بيانات gender/country

**الحل:**
- إما تحديث بياناتهم يدوياً في قاعدة البيانات
- أو انتظار تطوير صفحة الملف الشخصي للتحديث

## الملفات المعدلة

تم تعديل الملفات التالية:

### قاعدة البيانات
- ✅ `database/schema.sql`
- ✅ `database/migrations/003_add_user_profile_fields.sql` (جديد)

### Frontend - HTML
- ✅ `public/pages/register.html`

### Frontend - JavaScript
- ✅ `public/js/auth/register.js`
- ✅ `public/js/stores/authStore.js`
- ✅ `public/js/researcher/submit.js`

### Documentation
- ✅ `docs/USER_DATA_PREFILL_FEATURE.md` (جديد)
- ✅ `SETUP_PREFILL_FEATURE.md` (هذا الملف)

## اختبار شامل

### Checklist كامل

#### ✅ قاعدة البيانات
- [ ] تم تطبيق migration بنجاح
- [ ] الحقول gender و country موجودة
- [ ] الـ indexes تم إنشاؤها

#### ✅ التسجيل
- [ ] حقل الجنس يظهر في صفحة التسجيل
- [ ] حقل الدولة يظهر مع قائمة الدول العربية
- [ ] التحقق من الحقول يعمل بشكل صحيح
- [ ] البيانات تُحفظ في قاعدة البيانات

#### ✅ الملء التلقائي
- [ ] الاسم الكامل يُملأ تلقائياً
- [ ] البريد الإلكتروني يُملأ تلقائياً
- [ ] رقم الهوية يُملأ تلقائياً
- [ ] الجنس يُملأ تلقائياً
- [ ] الدولة تُملأ تلقائياً

#### ✅ الوظائف الأخرى
- [ ] المسودة تتجاوز الملء التلقائي
- [ ] يمكن تعديل القيم المملوءة تلقائياً
- [ ] النموذج يعمل للمستخدمين القدامى

## الدعم الفني

إذا واجهت أي مشاكل:

1. **تحقق من Logs:**
   - Browser Console (F12)
   - Supabase Logs
   - Network Tab

2. **الأخطاء الشائعة:**
   ```
   Error: relation "users" does not have column "gender"
   ✅ الحل: نفذ migration في قاعدة البيانات
   
   Error: Cannot read property 'gender' of null
   ✅ الحل: تأكد من تسجيل دخول المستخدم
   
   Error: Permission denied
   ✅ الحل: تحقق من RLS policies
   ```

3. **للمساعدة:**
   - راجع `docs/USER_DATA_PREFILL_FEATURE.md` للتفاصيل الكاملة
   - تحقق من الكود في `public/js/researcher/submit.js`

## النسخ الاحتياطي

**⚠️ مهم:** قبل تطبيق أي تحديثات على قاعدة البيانات الإنتاجية:

```sql
-- أخذ نسخة احتياطية من جدول users
CREATE TABLE users_backup AS SELECT * FROM users;

-- في حالة الحاجة للاسترجاع
-- DROP TABLE users;
-- ALTER TABLE users_backup RENAME TO users;
```

## الخلاصة

بعد تطبيق هذه التحديثات:
- ✅ المستخدمون الجدد سيدخلون بيانات كاملة عند التسجيل
- ✅ نموذج تقديم البحث سيملأ تلقائياً من ملف المستخدم
- ✅ تجربة مستخدم أفضل وأسرع
- ✅ بيانات أكثر اتساقاً

---

**تاريخ الإنشاء:** 16 نوفمبر 2025
**الحالة:** جاهز للتطبيق ✅

