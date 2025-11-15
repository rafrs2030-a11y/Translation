# 🚀 دليل النشر - Deployment Guide

دليل شامل لنشر المشروع على Netlify مع Supabase

## 📋 المتطلبات الأساسية

- ✅ حساب GitHub
- ✅ حساب Netlify
- ✅ حساب Supabase
- ✅ Node.js >= 18.0.0

---

## 1️⃣ إعداد Supabase

### خطوة 1: إنشاء مشروع جديد

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. انقر على **New Project**
3. املأ البيانات:
   - **Project Name**: arab-research-platform
   - **Database Password**: (احفظ كلمة المرور)
   - **Region**: اختر أقرب منطقة
4. انقر **Create Project**

### خطوة 2: إعداد قاعدة البيانات

1. انتقل إلى **SQL Editor**
2. انسخ محتوى ملف `database/schema.sql`
3. الصق في SQL Editor واضغط **Run**
4. (اختياري) لإضافة بيانات تجريبية: نفذ `database/seed.sql`

### خطوة 3: إعداد Storage Bucket

1. انتقل إلى **Storage**
2. انقر **Create new bucket**
3. الاسم: `research-files`
4. **Public**: اجعله False (private)
5. احفظ

### خطوة 4: إعداد Authentication

1. انتقل إلى **Authentication > Providers**
2. فعّل **Email** provider
3. في **Email Templates**:
   - اضبط **Confirm Signup Template**
   - اضبط **Reset Password Template**

### خطوة 5: الحصول على المفاتيح

1. انتقل إلى **Settings > API**
2. احفظ:
   - **Project URL**
   - **anon (public) key**
   - **service_role (secret) key**

---

## 2️⃣ إعداد المشروع محلياً

### خطوة 1: استنساخ المشروع

```bash
git clone https://github.com/yourusername/Arab-Research-Publishing-Platform.git
cd Arab-Research-Publishing-Platform
```

### خطوة 2: تثبيت الحزم

```bash
npm install
```

### خطوة 3: إنشاء ملف .env

```bash
# انسخ الملف المثال
cp .env.example .env

# حرره وأضف بياناتك
nano .env
```

محتوى `.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PROJECT_ID=your_project_id

PORT=3000
NODE_ENV=development

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### خطوة 4: اختبار محلياً

```bash
npm run dev
```

افتح المتصفح: `http://localhost:3000`

---

## 3️⃣ النشر على Netlify

### الطريقة 1: النشر عبر GitHub (موصى به)

#### خطوة 1: رفع الكود إلى GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### خطوة 2: ربط مع Netlify

1. اذهب إلى [Netlify](https://app.netlify.com)
2. انقر **Add new site > Import an existing project**
3. اختر **GitHub**
4. ابحث عن المستودع واختره
5. اضبط الإعدادات:
   - **Build command**: `npm install`
   - **Publish directory**: `public`
   - **Functions directory**: `server`

#### خطوة 3: إضافة متغيرات البيئة

1. في إعدادات الموقع، اذهب إلى **Environment variables**
2. أضف جميع المتغيرات من `.env`:

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NODE_ENV=production
...
```

#### خطوة 4: نشر

1. انقر **Deploy site**
2. انتظر حتى يكتمل البناء
3. الموقع جاهز! 🎉

### الطريقة 2: النشر عبر CLI

```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# ربط المشروع
netlify init

# نشر
netlify deploy --prod
```

---

## 4️⃣ إعداد النطاق المخصص (اختياري)

### خطوة 1: في Netlify

1. اذهب إلى **Domain settings**
2. انقر **Add custom domain**
3. أدخل نطاقك: `arabresearch.com`
4. اتبع التعليمات

### خطوة 2: في موفر النطاق

أضف DNS records:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

### خطوة 3: تفعيل HTTPS

Netlify يفعّل HTTPS تلقائياً مع Let's Encrypt!

---

## 5️⃣ إعداد البريد الإلكتروني

### خيار 1: Gmail (للتطوير)

1. فعّل 2FA في حساب Gmail
2. أنشئ App Password
3. استخدمه في `SMTP_PASSWORD`

### خيار 2: SendGrid (للإنتاج - موصى به)

```bash
# سجل في SendGrid
# احصل على API Key

# في .env:
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

### خيار 3: Supabase Email (الأسهل)

استخدم Supabase Auth لإرسال البريد مباشرة!

---

## 6️⃣ المراقبة والصيانة

### Netlify Analytics

1. فعّل **Analytics** في Netlify
2. راقب:
   - عدد الزيارات
   - سرعة التحميل
   - الأخطاء

### Supabase Logs

1. في Dashboard، انتقل إلى **Logs**
2. راقب:
   - API requests
   - Database queries
   - Errors

### Uptime Monitoring

استخدم خدمات مثل:
- UptimeRobot
- Pingdom
- StatusCake

---

## 7️⃣ النسخ الاحتياطي

### قاعدة البيانات

```bash
# تصدير قاعدة البيانات
npx supabase db dump > backup.sql

# استيراد
psql $DATABASE_URL < backup.sql
```

### الملفات (Storage)

استخدم Supabase CLI:

```bash
supabase storage sync
```

---

## 8️⃣ استكشاف الأخطاء

### مشكلة: الموقع لا يعمل

**الحل:**
- تحقق من Netlify Logs
- تأكد من متغيرات البيئة
- تحقق من Build settings

### مشكلة: قاعدة البيانات لا تستجيب

**الحل:**
- تحقق من Supabase status
- تأكد من صحة المفاتيح
- راجع RLS policies

### مشكلة: البريد لا يُرسل

**الحل:**
- تحقق من SMTP credentials
- تأكد من عدم وجود firewall
- استخدم Supabase Email بدلاً من ذلك

---

## 9️⃣ التحسينات الأمنية

### 1. تفعيل Rate Limiting

تم تنفيذه في `server/middleware/rateLimiter.js`

### 2. تفعيل CORS

```javascript
// في server/index.js
app.use(cors({
  origin: 'https://your-domain.com',
  credentials: true
}));
```

### 3. إخفاء معلومات الخادم

```javascript
app.disable('x-powered-by');
```

### 4. استخدام Helmet

```bash
npm install helmet

// في server/index.js
const helmet = require('helmet');
app.use(helmet());
```

---

## 🔟 CI/CD (اختياري)

### GitHub Actions

أنشئ `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod
```

---

## ✅ قائمة التحقق النهائية

قبل النشر، تأكد من:

- [ ] قاعدة البيانات معدة بالكامل
- [ ] جميع متغيرات البيئة مضبوطة
- [ ] RLS policies فعّالة
- [ ] Storage bucket مُنشأ
- [ ] SMTP مُختبر
- [ ] الموقع يعمل محلياً
- [ ] `.gitignore` يخفي `.env`
- [ ] الكود تم push إلى GitHub
- [ ] Netlify مربوط بـ GitHub
- [ ] النطاق مضبوط (إن وُجد)
- [ ] HTTPS مفعّل
- [ ] Analytics مفعّلة

---

## 🆘 الدعم

إذا واجهت مشاكل:

1. راجع [Netlify Docs](https://docs.netlify.com)
2. راجع [Supabase Docs](https://supabase.com/docs)
3. تواصل على: support@arabresearch.com

---

**تم التحديث:** نوفمبر 2025  
**الإصدار:** 1.0.0

