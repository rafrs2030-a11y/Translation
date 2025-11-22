# إصلاح مشكلة 403 على النطاق المخصص - دليل MCP

## 🔍 المشكلة الحالية

- ❌ **res-assistant.com**: يعرض خطأ 403 Forbidden
- ✅ **Netlify Subdomain**: يعمل بشكل صحيح
- ✅ **الكود والإعدادات**: صحيحة

## ✅ ما تم إصلاحه

### 1. تحديث `netlify.toml`
- ✅ إضافة redirect صريح للصفحة الرئيسية `/`
- ✅ التأكد من أن `force = false` موجود

### 2. تحديث `public/_redirects`
- ✅ إضافة redirect للصفحة الرئيسية

### 3. إعادة النشر
- ✅ Deploy ID: `69216f6473fb36e71cd72b54`
- ✅ Build ID: `69216f6373fb36e71cd72b52`

## 🔧 الحل النهائي (يجب تنفيذه في Netlify Dashboard)

المشكلة الحقيقية في **إعدادات النطاق في Netlify Dashboard**. يجب تنفيذ الخطوات التالية:

### الخطوة 1: فتح Domain Settings

1. اذهب إلى:
   ```
   https://app.netlify.com/projects/assistant-for-evaluating-scientific-r/configuration/domains
   ```

2. أو استخدم الأمر:
   ```bash
   netlify open:admin
   ```

### الخطوة 2: التحقق من النطاق

1. **ابحث عن `res-assistant.com` في قائمة النطاقات**
   - إذا كان موجوداً: تحقق من حالته
   - إذا لم يكن موجوداً: أضفه

2. **إذا كان النطاق موجوداً لكنه "Pending":**
   - انقر على النطاق
   - تحقق من DNS records المطلوبة
   - أضفها في موفر النطاق (Domain Registrar)

3. **إذا كان النطاق "Verified" لكن لا يزال يعرض 403:**
   - احذف النطاق
   - أضفه مرة أخرى
   - اتبع التعليمات لإضافة DNS records

### الخطوة 3: إعداد DNS Records

في موفر النطاق (Domain Registrar)، أضف:

#### خيار 1: A Record (موصى به)
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600 (أو Auto)
```

#### خيار 2: CNAME Record (أسهل)
```
Type: CNAME
Name: @
Value: assistant-for-evaluating-scientific-r.netlify.app
TTL: 3600 (أو Auto)
```

**ملاحظة:** بعض موفري النطاقات لا يدعمون CNAME على root domain (@). في هذه الحالة، استخدم A Record.

#### لـ www subdomain:
```
Type: CNAME
Name: www
Value: assistant-for-evaluating-scientific-r.netlify.app
TTL: 3600
```

### الخطوة 4: التحقق من SSL Certificate

1. في Netlify Dashboard > Domain settings > HTTPS
2. تأكد من أن SSL Certificate نشط
3. إذا لم يكن نشطاً:
   - انقر "Verify DNS configuration"
   - انتظر بضع دقائق
   - Netlify سيقوم بإصدار شهادة SSL تلقائياً

### الخطوة 5: الانتظار والتحقق

1. **انتظر 5-10 دقائق** لانتشار DNS
2. **تحقق من DNS Propagation:**
   - استخدم: https://dnschecker.org
   - ابحث عن `res-assistant.com`
   - تأكد من أن DNS records تظهر بشكل صحيح

3. **اختبر الموقع:**
   - افتح: https://res-assistant.com
   - يجب أن يعمل الآن

## 🛠️ استخدام MCP Tools للتحقق

### التحقق من حالة النشر:
```bash
# استخدام Netlify CLI
netlify status
netlify open:admin
```

### إعادة النشر:
```bash
netlify deploy --prod --dir=public
```

## 📋 معلومات المشروع

- **Project ID**: `764aa0c2-2d11-41ab-9a71-8b8acb4300a9`
- **Project Name**: `assistant-for-evaluating-scientific-r`
- **Netlify Subdomain**: `6921621236b08a0008b2b75f--assistant-for-evaluating-scientific-r.netlify.app`
- **Custom Domain**: `res-assistant.com`
- **Admin URL**: https://app.netlify.com/projects/assistant-for-evaluating-scientific-r

## ✅ قائمة التحقق

- [ ] النطاق مضاف في Netlify Dashboard
- [ ] النطاق "Verified" وليس "Pending"
- [ ] DNS records مضبوطة بشكل صحيح
- [ ] SSL Certificate نشط
- [ ] انتظر 5-10 دقائق لانتشار DNS
- [ ] اختبر الموقع: https://res-assistant.com

## 🆘 إذا استمرت المشكلة

### 1. تحقق من Domain Registrar
- تأكد من أن النطاق نشط
- تحقق من Nameservers
- تأكد من عدم وجود قيود على النطاق

### 2. مسح الكاش
```bash
# في Netlify Dashboard:
# Site settings > Build & deploy > Clear build cache
```

### 3. إعادة إضافة النطاق
1. احذف النطاق من Netlify
2. أضفه مرة أخرى
3. اتبع التعليمات لإضافة DNS records
4. انتظر حتى يتم التحقق

### 4. الاتصال بدعم Netlify
- من Dashboard: Help > Contact support
- أو راجع: https://docs.netlify.com/domains-https/custom-domains/

## 📝 ملاحظات مهمة

1. **المشكلة ليست في الكود**: الموقع يعمل بشكل صحيح على Netlify subdomain
2. **المشكلة في إعدادات النطاق**: يجب إصلاحها في Netlify Dashboard
3. **DNS Propagation**: قد يستغرق من بضع دقائق إلى 24 ساعة
4. **SSL Certificate**: Netlify يوفر SSL تلقائياً عبر Let's Encrypt

---

**تاريخ الإصلاح**: 2025-01-XX
**آخر نشر**: Deploy ID: `69216f6473fb36e71cd72b54`
**الحالة**: ⚠️ يحتاج إلى إصلاح إعدادات النطاق في Dashboard

