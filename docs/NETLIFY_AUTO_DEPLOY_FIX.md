# إصلاح مشكلة عدم تحديث Netlify تلقائياً من GitHub

## 🔍 المشكلة

- ✅ **GitHub**: التحديثات تُرفع بشكل صحيح
- ❌ **Netlify**: لا يقوم بنشر التحديثات تلقائياً
- ❌ **الموقع**: يعرض التحديث الأول فقط ولا يتم تحديثه

## ✅ الحلول

### الحل 1: التحقق من إعدادات Build & Deploy في Netlify

1. **افتح Netlify Dashboard:**
   ```
   https://app.netlify.com/projects/assistant-for-evaluating-scientific-r/settings/deploys
   ```

2. **تحقق من Continuous Deployment:**
   - يجب أن يكون **Continuous Deployment** مفعّل
   - يجب أن يكون **Build hook** مربوطاً بـ GitHub

3. **تحقق من إعدادات البناء:**
   - **Build command**: `echo 'No build step required - static site'`
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`

4. **تحقق من Branch settings:**
   - **Production branch**: `main` (أو `master`)
   - **Branch deploys**: يجب أن يكون مفعّل

### الحل 2: إعادة ربط GitHub مع Netlify

1. **في Netlify Dashboard:**
   - اذهب إلى: **Site settings > Build & deploy > Continuous Deployment**
   - انقر على **Link to Git provider**
   - اختر **GitHub**
   - اختر المستودع: `Assistant-for-evaluating-scientific-research`
   - تأكد من أن Branch هو `main`

2. **تحقق من Webhook:**
   - في GitHub، اذهب إلى: **Settings > Webhooks**
   - تأكد من وجود webhook لـ Netlify
   - إذا لم يكن موجوداً، Netlify سيقوم بإنشائه تلقائياً عند الربط

### الحل 3: إعادة تشغيل Build يدوياً

1. **من Netlify Dashboard:**
   - اذهب إلى: **Deploys**
   - انقر على **Trigger deploy** > **Deploy site**
   - اختر **Clear cache and deploy site**

2. **من Terminal:**
   ```bash
   netlify deploy --prod --dir=public
   ```

### الحل 4: مسح الكاش وإعادة النشر

1. **مسح Build Cache:**
   - في Netlify Dashboard: **Site settings > Build & deploy**
   - انقر على **Clear build cache**
   - ثم **Trigger deploy** > **Deploy site**

2. **مسح CDN Cache:**
   - في Netlify Dashboard: **Deploys**
   - اختر آخر deploy
   - انقر على **Publish deploy** (إذا لم يكن منشوراً)
   - أو **Clear cache and deploy site**

### الحل 5: التحقق من إعدادات Git

1. **تحقق من أن التغييرات موجودة في GitHub:**
   ```bash
   git status
   git log --oneline -5
   ```

2. **إذا كانت التغييرات محلية فقط:**
   ```bash
   git add .
   git commit -m "Update site"
   git push origin main
   ```

3. **تحقق من أن Netlify يراقب Branch الصحيح:**
   - في Netlify Dashboard: **Site settings > Build & deploy**
   - تأكد من أن **Production branch** هو `main`

### الحل 6: إصلاح Webhook في GitHub

1. **في GitHub:**
   - اذهب إلى: **Settings > Webhooks**
   - ابحث عن webhook لـ Netlify
   - إذا لم يكن موجوداً:
     - في Netlify Dashboard: **Site settings > Build & deploy**
     - انقر على **Link to Git provider**
     - اختر GitHub واتبع التعليمات

2. **اختبار Webhook:**
   - في GitHub: **Settings > Webhooks**
   - انقر على webhook Netlify
   - انقر على **Recent Deliveries**
   - تحقق من أن الطلبات ناجحة

## 🔧 إعدادات netlify.toml الصحيحة

تأكد من أن `netlify.toml` يحتوي على:

```toml
[build]
  publish = "public"
  functions = "netlify/functions"
  command = "echo 'No build step required - static site'"
```

## 📋 قائمة التحقق

- [ ] Continuous Deployment مفعّل في Netlify
- [ ] GitHub مربوط بشكل صحيح مع Netlify
- [ ] Production branch مضبوط على `main`
- [ ] Build command صحيح في `netlify.toml`
- [ ] Publish directory مضبوط على `public`
- [ ] Webhook موجود في GitHub
- [ ] التغييرات موجودة في GitHub (تم push)
- [ ] Build cache تم مسحه
- [ ] تم إعادة تشغيل Build

## 🛠️ خطوات سريعة للإصلاح

### الطريقة السريعة (من Terminal):

```bash
# 1. تأكد من أن التغييرات في GitHub
git status
git add .
git commit -m "Update site"
git push origin main

# 2. انتظر بضع ثوانٍ (Netlify يجب أن يبدأ البناء تلقائياً)

# 3. إذا لم يبدأ تلقائياً، قم بالنشر يدوياً
netlify deploy --prod --dir=public
```

### الطريقة من Dashboard:

1. **افتح Netlify Dashboard:**
   ```
   https://app.netlify.com/projects/assistant-for-evaluating-scientific-r
   ```

2. **اذهب إلى Deploys:**
   - انقر على **Trigger deploy** > **Deploy site**
   - اختر **Clear cache and deploy site**

3. **انتظر حتى يكتمل البناء**

4. **تحقق من الموقع:**
   - افتح: https://res-assistant.com
   - أو: https://6921621236b08a0008b2b75f--assistant-for-evaluating-scientific-r.netlify.app

## 🆘 إذا استمرت المشكلة

### 1. تحقق من Build Logs

في Netlify Dashboard > Deploys > آخر deploy:
- افتح Build logs
- تحقق من وجود أخطاء
- تحقق من أن Build command يعمل بشكل صحيح

### 2. تحقق من إعدادات المستودع

في GitHub:
- تأكد من أن المستودع موجود
- تأكد من أن Netlify لديه صلاحيات الوصول
- تحقق من أن Branch `main` موجود

### 3. إعادة ربط المشروع

```bash
# من Terminal
netlify unlink
netlify link
```

ثم في Dashboard:
- اذهب إلى **Site settings > Build & deploy**
- انقر على **Link to Git provider**
- اختر GitHub والمستودع

### 4. الاتصال بدعم Netlify

- من Dashboard: **Help > Contact support**
- أو راجع: https://docs.netlify.com/site-deploys/create-deploys/

## 📝 ملاحظات مهمة

1. **Netlify يراقب Branch `main` فقط** (ما لم يتم تغيير الإعدادات)
2. **يجب أن تكون التغييرات في GitHub** قبل أن يقوم Netlify بنشرها
3. **Build cache قد يسبب مشاكل** - امسحه إذا لزم الأمر
4. **Webhook يجب أن يكون نشطاً** في GitHub
5. **قد يستغرق البناء بضع دقائق** - انتظر حتى يكتمل

## ✅ التحقق من الحل

بعد تطبيق الحلول:

1. ✅ قم بعمل تغيير صغير في الموقع
2. ✅ ارفع التغيير إلى GitHub: `git push origin main`
3. ✅ انتظر بضع ثوانٍ
4. ✅ تحقق من Netlify Dashboard - يجب أن يبدأ Build تلقائياً
5. ✅ بعد اكتمال Build، تحقق من الموقع - يجب أن تظهر التحديثات

---

**تاريخ الإصلاح**: 2025-01-XX
**Project ID**: `764aa0c2-2d11-41ab-9a71-8b8acb4300a9`
**Admin URL**: https://app.netlify.com/projects/assistant-for-evaluating-scientific-r

