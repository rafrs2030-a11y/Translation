# إصلاح مشكلة 403 على النطاق المخصص - دليل سريع

## 🔍 المشكلة

- ❌ **res-assistant.com**: يعرض خطأ 403 Forbidden
- ✅ **Netlify Subdomain**: يعمل بشكل صحيح

## ✅ الحل السريع

المشكلة في **إعدادات النطاق في Netlify Dashboard**، وليس في الكود.

### الخطوات:

1. **افتح Netlify Dashboard:**
   ```
   https://app.netlify.com/projects/assistant-for-evaluating-scientific-r/configuration/domains
   ```

2. **تحقق من النطاق `res-assistant.com`:**
   - إذا كان موجوداً: تأكد من أنه "Verified" وليس "Pending"
   - إذا لم يكن موجوداً: أضفه من خلال "Add custom domain"

3. **تحقق من DNS Records:**
   
   في موفر النطاق (Domain Registrar)، تأكد من وجود:
   
   **خيار 1: A Record**
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   TTL: 3600
   ```
   
   **خيار 2: CNAME Record (أسهل)**
   ```
   Type: CNAME
   Name: @
   Value: assistant-for-evaluating-scientific-r.netlify.app
   TTL: 3600
   ```
   
   **لـ www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: assistant-for-evaluating-scientific-r.netlify.app
   TTL: 3600
   ```

4. **تحقق من SSL Certificate:**
   - في Netlify Dashboard > Domain settings > HTTPS
   - تأكد من أن SSL Certificate نشط
   - إذا لم يكن نشطاً، انقر "Verify DNS configuration"

5. **انتظر 5-10 دقائق** لانتشار DNS

6. **اختبر الموقع:**
   - افتح: https://res-assistant.com
   - يجب أن يعمل الآن

## 🔧 إذا استمرت المشكلة

### الحل 1: إعادة إضافة النطاق

1. في Netlify Dashboard > Domain settings
2. احذف النطاق `res-assistant.com` (إن وجد)
3. أضف النطاق مرة أخرى
4. اتبع التعليمات لإضافة DNS records
5. انتظر حتى يتم التحقق

### الحل 2: التحقق من DNS Propagation

استخدم أدوات مثل:
- https://dnschecker.org
- https://www.whatsmydns.net

ابحث عن `res-assistant.com` وتأكد من أن DNS records تظهر بشكل صحيح.

### الحل 3: مسح الكاش وإعادة النشر

```bash
# في Netlify Dashboard:
# Site settings > Build & deploy > Clear build cache
# ثم Trigger deploy > Deploy site
```

أو من Terminal:
```bash
netlify deploy --prod --dir=public
```

## 📋 معلومات المشروع

- **Project ID**: `764aa0c2-2d11-41ab-9a71-8b8acb4300a9`
- **Project Name**: `assistant-for-evaluating-scientific-r`
- **Netlify Subdomain**: `6921621236b08a0008b2b75f--assistant-for-evaluating-scientific-r.netlify.app`
- **Custom Domain**: `res-assistant.com`
- **Admin URL**: https://app.netlify.com/projects/assistant-for-evaluating-scientific-r

## ✅ التحقق من الحل

بعد تطبيق الحلول:

1. ✅ افتح: https://res-assistant.com
2. ✅ يجب أن تظهر الصفحة الرئيسية
3. ✅ يجب أن يكون هناك قفل أخضر (SSL نشط)
4. ✅ اختبر الصفحات الأخرى:
   - https://res-assistant.com/pages/login.html
   - https://res-assistant.com/pages/register.html

## 🆘 إذا استمرت المشكلة

اتصل بدعم Netlify:
- من Dashboard: Help > Contact support
- أو راجع: https://docs.netlify.com/domains-https/custom-domains/

---

**تاريخ الإصلاح**: 2025-01-XX
**آخر نشر**: Deploy ID: `69216f03cc6e35b35217cc5e`

