# إصلاح خطأ 403 على الصفحة الرئيسية

## المشكلة
عند فتح الموقع على `https://res-assistant.com/` يظهر خطأ 403 Forbidden.

## التغييرات المطبقة

### 1. ✅ تحديث Content Security Policy
- إضافة `https://api.ipify.org` إلى `connect-src` للسماح بجلب IP العميل

### 2. ✅ تبسيط Build Command
- تغيير من `npm install` إلى `echo 'No build step required - static site'`
- هذا مناسب للمواقع الثابتة التي لا تحتاج إلى build step

### 3. ✅ التحقق من إعدادات Redirects
- التأكد من أن `force = false` موجود في SPA fallback redirect
- هذا يضمن أن الملفات الثابتة تُقدّم مباشرة

## خطوات تطبيق التغييرات

### الطريقة 1: إعادة النشر التلقائي (مستحسن)

1. **التحقق من أن التغييرات موجودة في Git:**
   ```bash
   git status
   git log --oneline -1
   ```

2. **إذا كانت التغييرات موجودة محلياً فقط، قم برفعها:**
   ```bash
   git add netlify.toml
   git commit -m "Fix 403 error on root URL - update CSP and build config"
   git push origin main
   ```

3. **انتظر حتى يكتمل النشر التلقائي في Netlify**

### الطريقة 2: إعادة النشر اليدوي من Netlify Dashboard

1. اذهب إلى [Netlify Dashboard](https://app.netlify.com)
2. اختر موقعك
3. اذهب إلى **Deploys** في القائمة الجانبية
4. انقر على **Trigger deploy** > **Deploy site**
5. اختر **Clear cache and deploy site** لضمان تطبيق جميع التغييرات

### الطريقة 3: إعادة النشر عبر Netlify CLI

```bash
# تثبيت Netlify CLI (إذا لم يكن مثبتاً)
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# ربط المشروع (إذا لم يكن مربوطاً)
netlify link

# نشر مع مسح الكاش
netlify deploy --prod --dir=public
```

## التحقق من الإعدادات في Netlify Dashboard

**مهم جداً:** إعدادات Dashboard تأخذ الأولوية على `netlify.toml`

1. اذهب إلى **Site settings** > **Build & deploy**
2. تحقق من الإعدادات التالية:

   - **Publish directory:** يجب أن يكون `public`
   - **Build command:** اتركه فارغاً أو ضع `echo 'No build step required - static site'`
   - **Functions directory:** يجب أن يكون `netlify/functions`

3. **مسح الكاش:**
   - في نفس الصفحة، انقر على **Clear build cache**
   - ثم قم بإعادة النشر

## الإعدادات الصحيحة في netlify.toml

```toml
[build]
  publish = "public"
  functions = "netlify/functions"
  command = "echo 'No build step required - static site'"

# Headers
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "... connect-src 'self' https://*.supabase.co https://api.ipify.org; ..."

# Redirects
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
```

## التحقق من الحل

بعد إعادة النشر:

1. **افتح الصفحة الرئيسية:**
   - `https://res-assistant.com/`
   - يجب أن تظهر الصفحة بدون خطأ 403

2. **تحقق من الملفات الثابتة:**
   - `https://res-assistant.com/css/main.css`
   - `https://res-assistant.com/js/main.js`
   - يجب أن تُحمّل جميع الملفات بشكل صحيح

3. **تحقق من Console في المتصفح:**
   - افتح Developer Tools (F12)
   - اذهب إلى Console
   - يجب ألا يكون هناك أخطاء 403

## إذا استمرت المشكلة

### 1. تحقق من Domain Settings
- تأكد من أن النطاق `res-assistant.com` مضبوط بشكل صحيح
- تحقق من DNS settings

### 2. تحقق من Build Logs
- في Netlify Dashboard، اذهب إلى **Deploys**
- افتح آخر deploy
- تحقق من Build logs للتأكد من عدم وجود أخطاء

### 3. تحقق من File Permissions
- تأكد من أن `public/index.html` موجود
- تأكد من أن الملفات لديها الصلاحيات الصحيحة

### 4. اتصال بالدعم
إذا استمرت المشكلة بعد تجربة جميع الخطوات:
- راجع [Netlify Documentation](https://docs.netlify.com/)
- أو اتصل بدعم Netlify

## ملاحظات مهمة

1. **Cache:** قد تحتاج إلى مسح كاش المتصفح (Ctrl+Shift+Delete)
2. **CDN:** Netlify يستخدم CDN، قد يستغرق بضع دقائق حتى تظهر التغييرات
3. **Build Time:** بعد مسح الكاش، قد يستغرق البناء وقتاً أطول في المرة الأولى

## تاريخ الإصلاح
تم تطبيق الإصلاحات في: 2025-01-XX

