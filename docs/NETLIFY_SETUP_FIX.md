# إصلاح مشكلة ربط Netlify وحل مشاكل الصفحات

## المشكلة
- باقي الصفحات لا تعمل غير الصفحة الرئيسية
- المشروع غير مربوط بـ Netlify

## الحلول المطبقة

### 1. إصلاح ملف `netlify.toml`
تم تحديث ملف `netlify.toml` لضمان تقديم الملفات الفعلية أولاً:
```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. إنشاء ملف `_redirects`
تم إنشاء ملف `public/_redirects` لضمان عمل جميع الصفحات:
```
# API routes
/api/* /.netlify/functions/api/:splat 200

# SPA fallback - Netlify serves static files first, then redirects to index.html if file doesn't exist
/* /index.html 200
```

## الخطوات المطلوبة للنشر

### الطريقة 1: عبر Netlify Dashboard (موصى به)

1. **اذهب إلى [Netlify Dashboard](https://app.netlify.com)**

2. **إنشاء مشروع جديد:**
   - انقر على **"Add new site"**
   - اختر **"Import an existing project"**
   - اختر **GitHub**
   - ابحث عن المستودع: `rafrs2030-a11y/Assistant-for-evaluating-scientific-research`
   - اختره

3. **إعدادات البناء:**
   - **Build command**: اتركه فارغاً (لأننا ننشر مجلد `public` مباشرة)
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`

4. **إضافة متغيرات البيئة:**
   - اذهب إلى **Site settings > Environment variables**
   - أضف المتغيرات التالية:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     NODE_ENV=production
     ```

5. **النشر:**
   - انقر **"Deploy site"**
   - انتظر حتى يكتمل البناء

### الطريقة 2: عبر Netlify CLI

```bash
# 1. تثبيت Netlify CLI (إذا لم يكن مثبتاً)
npm install -g netlify-cli

# 2. تسجيل الدخول
netlify login

# 3. ربط المشروع (اختر "Create & configure a new site")
netlify init

# 4. إعدادات البناء:
#    - Build command: (اتركه فارغاً)
#    - Publish directory: public
#    - Functions directory: netlify/functions

# 5. إضافة متغيرات البيئة
netlify env:set SUPABASE_URL "your_url"
netlify env:set SUPABASE_ANON_KEY "your_key"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "your_key"

# 6. نشر
netlify deploy --prod
```

### الطريقة 3: ربط مشروع موجود

إذا كان لديك مشروع Netlify موجود بالفعل:

```bash
# ربط المشروع المحلي بمشروع Netlify موجود
netlify link

# ثم نشر
netlify deploy --prod
```

## التحقق من الحل

بعد النشر، تحقق من أن جميع الصفحات تعمل:

- ✅ `/` - الصفحة الرئيسية
- ✅ `/pages/login.html` - صفحة تسجيل الدخول
- ✅ `/pages/register.html` - صفحة التسجيل
- ✅ `/pages/admin/*` - صفحات الإدارة
- ✅ `/pages/researcher/*` - صفحات الباحث

## استكشاف الأخطاء

### المشكلة: الصفحات لا تزال لا تعمل

**الحل:**
1. تحقق من ملف `_redirects` في مجلد `public`
2. تأكد من أن الملفات موجودة في `public/pages/`
3. امسح cache Netlify:
   - Netlify Dashboard > Site settings > Build & deploy > Clear build cache

### المشكلة: خطأ 404

**الحل:**
1. تأكد من أن `publish = "public"` في `netlify.toml`
2. تحقق من أن ملف `_redirects` موجود في `public/`
3. أعد نشر الموقع

### المشكلة: Functions لا تعمل

**الحل:**
1. تأكد من أن `functions = "netlify/functions"` في `netlify.toml`
2. تحقق من أن ملف `netlify/functions/api.js` موجود
3. تحقق من متغيرات البيئة

## ملاحظات مهمة

- ملف `_redirects` يجب أن يكون في مجلد `public/`
- ملف `netlify.toml` يجب أن يكون في جذر المشروع
- جميع الملفات الثابتة يجب أن تكون في `public/`
- Functions يجب أن تكون في `netlify/functions/`

## الملفات المهمة

- ✅ `netlify.toml` - تكوين Netlify
- ✅ `public/_redirects` - قواعد التوجيه
- ✅ `public/index.html` - الصفحة الرئيسية
- ✅ `public/pages/*` - باقي الصفحات
- ✅ `netlify/functions/api.js` - Serverless Functions

