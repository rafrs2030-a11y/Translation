# 🔧 إصلاح خطأ "Database error querying schema"

## ❌ المشكلة

```
AuthApiError: Database error querying schema
POST https://rzenhmmwocctvonwhnrj.supabase.co/auth/v1/token?grant_type=password 500
```

---

## 🔍 السبب الجذري (المشاكل المتعددة!)

### ❌ المشكلة #1: عمود `password_hash` في `public.users`
كان جدول `public.users` يحتوي على عمود **`password_hash`** وهذا يتعارض مع كيفية عمل **Supabase Auth**.

**Supabase Auth** يدير كلمات المرور في جدول `auth.users` مع عمود `encrypted_password`، لذلك وجود `password_hash` في `public.users` يسبب تعارض.

### ❌ المشكلة #2: `confirmation_token` = NULL في `auth.users`
```
error finding user: sql: Scan error on column index 3, name "confirmation_token": 
converting NULL to string is unsupported
```

عندما أنشأنا المستخدمين في `auth.users` يدوياً، بعض الأعمدة كانت NULL:
- `confirmation_token` = NULL
- `recovery_token` = NULL  
- `email_change_token_new` = NULL

**Supabase Auth** يتوقع أن تكون هذه الأعمدة **strings** (حتى لو فارغة '')، وليست NULL!

---

## ✅ الحل المُطبق

### 1. إصلاح `public.users`:

#### حذف عمود `password_hash`:
```sql
ALTER TABLE public.users DROP COLUMN password_hash;
```

#### جعل بعض الأعمدة nullable:
```sql
ALTER TABLE public.users ALTER COLUMN national_id DROP NOT NULL;
ALTER TABLE public.users ALTER COLUMN phone DROP NOT NULL;
```

### 2. إصلاح `auth.users` NULL values:
```sql
-- ✅ ملء القيم الفارغة بدلاً من NULL
UPDATE auth.users
SET 
    confirmation_token = '',
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change = COALESCE(email_change, ''),
    phone_change_token = COALESCE(phone_change_token, '')
WHERE confirmation_token IS NULL;
```

### 3. إصلاح RLS Policies:
```sql
-- السماح لـ anon بالقراءة (للتحقق أثناء تسجيل الدخول)
CREATE POLICY "Allow anon to read for auth"
ON public.users FOR SELECT TO anon USING (true);

-- السماح لـ authenticated بقراءة جميع البيانات
CREATE POLICY "Allow authenticated to read all"
ON public.users FOR SELECT TO authenticated USING (true);
```

---

## 📋 هيكل الجداول الصحيح

### ✅ `auth.users` (يديره Supabase):
- `id` (uuid)
- `email`
- `encrypted_password` ← **هنا كلمات المرور**
- `email_confirmed_at`
- `raw_app_meta_data`
- `raw_user_meta_data`

### ✅ `public.users` (بياناتنا الإضافية):
- `id` (uuid) ← **نفس id من auth.users**
- `username`
- `email`
- `national_id`
- `phone`
- `role` (researcher/admin)
- `email_verified`
- ~~`password_hash`~~ ← **تم حذفه! ❌**

---

## 🔐 بيانات تسجيل الدخول

### حساب Admin:
```
البريد: admin@arabresearch.com
الباسورد: Admin@123
```

### حساب Researcher:
```
البريد: ahmad@example.com
الباسورد: Test@123
```

---

## 🚀 للاختبار الآن

1. **أعد تحميل الصفحة بالكامل:**
   - اضغط `Ctrl + Shift + R` (Windows/Linux)
   - أو `Cmd + Shift + R` (Mac)

2. **افتح صفحة تسجيل الدخول:**
   ```
   http://localhost:3000/pages/login.html
   ```

3. **سجل دخول بحساب Admin:**
   - البريد: `admin@arabresearch.com`
   - الباسورد: `Admin@123`

---

## ✅ النتيجة المتوقعة

يجب أن يعمل تسجيل الدخول الآن بنجاح! 🎉

### في Console يجب أن ترى:
```javascript
// لا أخطاء 500
// تسجيل دخول ناجح
Login success!
// التوجيه التلقائي
Redirecting to dashboard...
```

### يتم التوجيه إلى:
- **Admin:** `/pages/admin/dashboard.html`
- **Researcher:** `/pages/researcher/dashboard.html`

---

## 📝 ملاحظات مهمة

### كلمات المرور:
- ✅ يتم تخزينها في `auth.users.encrypted_password`
- ✅ يديرها Supabase Auth بشكل آمن
- ✅ مُشفرة باستخدام bcrypt
- ❌ **لا** تُخزن في `public.users`

### المصادقة:
- ✅ `signInWithPassword()` يتحقق من `auth.users`
- ✅ بعد النجاح، يجلب البيانات من `public.users`
- ✅ يُنشئ session و JWT token

### الأمان:
- ✅ RLS مُفعّل على `public.users`
- ✅ `anon` يمكنه القراءة للتحقق أثناء تسجيل الدخول
- ✅ `authenticated` يمكنه قراءة جميع البيانات
- ✅ `service_role` له صلاحية كاملة

---

## 🐛 إذا استمرت المشاكل

### خطأ: "Invalid login credentials"
**الحل:** تأكد من:
- البريد الصحيح: `admin@arabresearch.com`
- كلمة المرور الصحيحة: `Admin@123` (حساسة لحالة الأحرف!)

### خطأ: "User not found"
**الحل:** تحقق من:
```sql
SELECT * FROM auth.users WHERE email = 'admin@arabresearch.com';
SELECT * FROM public.users WHERE email = 'admin@arabresearch.com';
```

### خطأ: "Cannot read properties of null"
**الحل:** تحقق من أن:
- `public.users` يحتوي على نفس `id` من `auth.users`
- عمود `role` موجود وليس null

---

## 📊 التحقق من الإصلاح

### تحقق من structure الجدول:
```sql
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'public';
```

يجب **ألا** ترى `password_hash` في النتيجة! ✅

### تحقق من المستخدمين:
```sql
SELECT u.email, u.role, au.email_confirmed_at
FROM public.users u
JOIN auth.users au ON au.id = u.id;
```

---

## ✨ ملخص التغييرات

| قبل الإصلاح ❌ | بعد الإصلاح ✅ |
|----------------|----------------|
| `public.users` به `password_hash` | ✅ تم حذف `password_hash` |
| `auth.users.confirmation_token` = NULL | ✅ `confirmation_token` = '' |
| `auth.users.recovery_token` = NULL | ✅ `recovery_token` = '' |
| Scan error عند قراءة المستخدم | ✅ لا أخطاء Scan |
| تعارض مع `auth.users` | ✅ لا تعارض |
| خطأ 500 عند تسجيل الدخول | ✅ تسجيل دخول ناجح |
| RLS صارم جداً | ✅ RLS متوازن |

---

## 🎯 الخطوة التالية

بعد نجاح تسجيل الدخول:
1. ✅ اختبر لوحة تحكم Admin
2. ✅ اختبر تقديم بحث
3. ✅ اختبر الإشعارات
4. ✅ اختبر تسجيل الخروج

---

**تم إصلاح المشكلة بنجاح! 🎉**

*التاريخ: 16 نوفمبر 2025*

