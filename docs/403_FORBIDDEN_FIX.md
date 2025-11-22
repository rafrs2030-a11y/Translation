# إصلاح مشكلة 403 Forbidden على Netlify

## المشكلة
عند فتح الموقع على Netlify، يظهر خطأ 403 Forbidden:
```
You don't have permission to access this resource.
Additionally, a 403 Forbidden error was encountered while trying to use an ErrorDocument to handle the request.
```

## الأسباب المحتملة

### 1. إعدادات البناء غير صحيحة في Netlify Dashboard
- **Publish directory** غير مضبوط بشكل صحيح
- **Build command** غير موجود أو غير صحيح

### 2. مشكلة في ملف `netlify.toml`
- الإعدادات غير صحيحة
- التوجيهات (redirects) تسبب مشاكل

### 3. ملف `index.html` غير موجود في المكان الصحيح
- الملف غير موجود في مجلد `public`
- المشكلة في هيكل المجلدات

## الحلول المطبقة

### ✅ 1. تحديث `netlify.toml`
تم تحديث الملف ليشمل:
- إعدادات بناء صحيحة
- Headers للأمان
- إعدادات Cache للملفات الثابتة
- Redirects صحيحة مع `force = false`

### ✅ 2. التحقق من الملفات
- `public/index.html` موجود ✅
- جميع الملفات في مكانها الصحيح ✅
- `.gitignore` لا يمنع الملفات المهمة ✅

## خطوات الإصلاح في Netlify Dashboard

### الخطوة 1: التحقق من إعدادات البناء
1. اذهب إلى **Site settings** في Netlify Dashboard
2. انقر على **Build & deploy**
3. في قسم **Build settings**:
   - **Build command**: اتركه فارغاً أو ضع `echo 'No build step required'`
   - **Publish directory**: يجب أن يكون `public`
   - **Functions directory**: يجب أن يكون `netlify/functions`

### الخطوة 2: مسح الكاش
1. في نفس الصفحة، انقر على **Clear build cache**
2. انقر **Clear cache**

### الخطوة 3: إعادة النشر
1. اذهب إلى **Deploys** في القائمة الجانبية
2. انقر على **Trigger deploy** > **Deploy site**
3. انتظر حتى يكتمل البناء

### الخطوة 4: التحقق من الإعدادات
تأكد من أن الإعدادات في Dashboard تطابق `netlify.toml`:
- ✅ Publish directory: `public`
- ✅ Functions directory: `netlify/functions`
- ✅ Build command: فارغ أو `echo 'No build step required'`

## التحقق من الحل

### 1. تحقق من الصفحة الرئيسية
افتح: `https://your-site.netlify.app/`
- يجب أن تظهر الصفحة الرئيسية بدون خطأ 403

### 2. تحقق من الملفات الثابتة
افتح:
- `https://your-site.netlify.app/css/main.css`
- `https://your-site.netlify.app/js/main.js`
- `https://your-site.netlify.app/images/logo.png`
- يجب أن تُحمّل جميع الملفات بشكل صحيح

### 3. تحقق من الصفحات
افتح:
- `https://your-site.netlify.app/pages/login.html`
- `https://your-site.netlify.app/pages/register.html`
- يجب أن تعمل جميع الصفحات

## إذا استمرت المشكلة

### الحل 1: النشر مباشرة عبر CLI
```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# ربط المشروع
netlify link

# نشر
netlify deploy --prod --dir=public
```

### الحل 2: التحقق من الصلاحيات
1. تأكد من أن الحساب لديه صلاحيات كافية
2. تحقق من أن الموقع ليس في وضع Private
3. تأكد من أن النطاق مفعّل بشكل صحيح

### الحل 3: إعادة إنشاء الموقع
إذا استمرت المشكلة:
1. احذف الموقع من Netlify
2. أنشئ موقعاً جديداً
3. استورد نفس المستودع من GitHub
4. تأكد من الإعدادات الصحيحة

## الإعدادات الصحيحة في `netlify.toml`

```toml
[build]
  publish = "public"
  functions = "netlify/functions"
  command = "echo 'No build step required - static site'"

# Headers for security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

# API routes redirect
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

# SPA fallback - only redirect if file doesn't exist
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
```

## ملاحظات مهمة

1. **ترتيب الأولوية في Netlify:**
   - إعدادات Dashboard تأخذ الأولوية على `netlify.toml`
   - تأكد من أن الإعدادات في Dashboard تطابق الملف

2. **خيار `force = false`:**
   - يضمن أن الملفات الثابتة تُقدّم أولاً
   - التوجيه يحدث فقط إذا كان الملف غير موجود

3. **ملف `_redirects`:**
   - يجب أن يكون موجوداً في `public/_redirects`
   - يجب أن يحتوي فقط على توجيهات API
   - لا يجب أن يحتوي على catch-all `/*`

## الملفات المعدلة

- ✅ `netlify.toml` - تحديث الإعدادات وإضافة Headers
- ✅ هذا الملف (التوثيق)

## تاريخ الإصلاح
تم الإصلاح في: 2025-01-XX

