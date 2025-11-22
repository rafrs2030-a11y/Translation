# حل سريع: إصلاح مشكلة عدم تحديث Netlify

## 🚀 الحل السريع (5 دقائق)

### الخطوة 1: التحقق من إعدادات Netlify

1. افتح: https://app.netlify.com/projects/assistant-for-evaluating-scientific-r/settings/deploys

2. تحقق من:
   - ✅ **Continuous Deployment**: يجب أن يكون مفعّل
   - ✅ **Production branch**: `main`
   - ✅ **Build command**: `echo 'No build step required - static site'`
   - ✅ **Publish directory**: `public`

### الخطوة 2: إعادة ربط GitHub (إذا لزم الأمر)

1. في نفس الصفحة، انقر على **Link to Git provider**
2. اختر **GitHub**
3. اختر المستودع: `Assistant-for-evaluating-scientific-research`
4. تأكد من Branch: `main`

### الخطوة 3: إعادة تشغيل Build

1. اذهب إلى: https://app.netlify.com/projects/assistant-for-evaluating-scientific-r/deploys
2. انقر على **Trigger deploy** > **Deploy site**
3. اختر **Clear cache and deploy site**
4. انتظر حتى يكتمل البناء

### الخطوة 4: التحقق

1. بعد اكتمال البناء، افتح الموقع
2. يجب أن تظهر التحديثات الآن

## 🔧 إذا لم يعمل الحل السريع

### الحل البديل: استخدام Netlify CLI

```bash
# 1. تأكد من أنك مربوط
netlify status

# 2. قم بالنشر مع مسح الكاش
netlify deploy --prod --dir=public

# 3. أو من Dashboard:
# Deploys > Trigger deploy > Clear cache and deploy site
```

## 📋 معلومات المشروع

- **Project ID**: `764aa0c2-2d11-41ab-9a71-8b8acb4300a9`
- **GitHub Repo**: `rafrs2030-a11y/Assistant-for-evaluating-scientific-research`
- **Branch**: `main`
- **Publish Directory**: `public`

---

**ملاحظة**: بعد إصلاح الإعدادات، يجب أن يقوم Netlify بنشر التحديثات تلقائياً عند كل `git push` إلى `main`.

