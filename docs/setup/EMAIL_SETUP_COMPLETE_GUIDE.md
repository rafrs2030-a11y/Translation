# 📧 دليل إعداد البريد الإلكتروني الكامل
## منصة نشر الأبحاث العربية

**تاريخ الإنشاء:** 2025-01-27  
**الحالة:** ✅ جاهز للإعداد

---

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد نظام البريد الإلكتروني للمنصة. النظام يدعم:
- ✅ **Resend** (موصى به - الأسهل)
- ✅ **SendGrid** (للإنتاج)
- ✅ **SMTP** (أي مزود SMTP)

---

## 🚀 الطريقة 1: إعداد Resend (موصى به)

### الخطوة 1: إنشاء حساب Resend

1. اذهب إلى [https://resend.com/signup](https://resend.com/signup)
2. سجل حساب جديد (مجاني حتى 3,000 بريد/شهر)
3. تحقق من بريدك الإلكتروني

### الخطوة 2: الحصول على API Key

1. بعد تسجيل الدخول، اذهب إلى [https://resend.com/api-keys](https://resend.com/api-keys)
2. انقر **Create API Key**
3. أدخل اسم المفتاح (مثلاً: `arab-research-platform`)
4. اختر الصلاحيات: **Sending access**
5. انسخ المفتاح (يبدأ بـ `re_`)

⚠️ **مهم:** احفظ المفتاح في مكان آمن، لن تتمكن من رؤيته مرة أخرى!

### الخطوة 3: إضافة Domain (اختياري - للإنتاج)

للإنتاج، يجب إضافة domain خاص بك:

1. اذهب إلى [https://resend.com/domains](https://resend.com/domains)
2. انقر **Add Domain**
3. أدخل domain (مثلاً: `yourdomain.com`)
4. أضف DNS records كما هو موضح:
   ```
   Type: TXT
   Name: @
   Value: [القيمة المعطاة]
   
   Type: MX
   Name: @
   Value: [القيمة المعطاة]
   ```
5. انتظر التحقق (قد يستغرق بضع دقائق)

### الخطوة 4: إضافة Secrets في Supabase

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **Edge Functions** > **Secrets**
4. أضف المتغيرات التالية:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_PROVIDER=resend
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=منصة نشر الأبحاث العربية
```

**ملاحظات:**
- `RESEND_API_KEY`: المفتاح الذي نسخته من Resend
- `EMAIL_PROVIDER`: اتركه `resend`
- `FROM_EMAIL`: 
  - للتطوير: استخدم `onboarding@resend.dev` (جاهز للاستخدام)
  - للإنتاج: استخدم email من domainك (مثلاً: `noreply@yourdomain.com`)
- `FROM_NAME`: اسم المرسل (سيظهر في البريد)

### الخطوة 5: نشر Edge Function

```bash
# تأكد من تثبيت Supabase CLI
npm install -g supabase

# تسجيل الدخول
supabase login

# ربط المشروع
supabase link --project-ref your-project-ref

# نشر Edge Function
supabase functions deploy send-notification-email
```

### الخطوة 6: اختبار الإرسال

1. سجل دخول كمسؤول
2. اذهب إلى لوحة تحكم المسؤول
3. غيّر حالة أي طلب
4. تحقق من:
   - جدول `email_log` في Supabase (يجب أن يظهر سجل جديد)
   - بريد المستخدم (يجب أن يستلم البريد)

---

## 📧 الطريقة 2: إعداد SendGrid

### الخطوة 1: إنشاء حساب SendGrid

1. اذهب إلى [https://signup.sendgrid.com](https://signup.sendgrid.com)
2. سجل حساب جديد (مجاني حتى 100 بريد/يوم)
3. أكمل التحقق من الهوية

### الخطوة 2: الحصول على API Key

1. اذهب إلى **Settings** > **API Keys**
2. انقر **Create API Key**
3. أدخل اسم المفتاح
4. اختر **Full Access** أو **Restricted Access** (مع صلاحيات Mail Send)
5. انسخ المفتاح

### الخطوة 3: إضافة Secrets في Supabase

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_PROVIDER=sendgrid
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=منصة نشر الأبحاث العربية
```

### الخطوة 4: إضافة Domain (للإنتاج)

1. اذهب إلى **Settings** > **Sender Authentication**
2. اختر **Authenticate Your Domain**
3. أضف DNS records
4. انتظر التحقق

### الخطوة 5: نشر Edge Function

```bash
supabase functions deploy send-notification-email
```

---

## 🔧 الطريقة 3: إعداد SMTP

### الخطوة 1: الحصول على بيانات SMTP

من مزود البريد الخاص بك (Gmail, Outlook, إلخ):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### الخطوة 2: إعداد Gmail (مثال)

1. فعّل **2-Step Verification**
2. اذهب إلى **Google Account** > **Security** > **App passwords**
3. أنشئ App Password جديد
4. استخدمه في `SMTP_PASSWORD`

### الخطوة 3: إضافة Secrets في Supabase

```
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=منصة نشر الأبحاث العربية
```

### الخطوة 4: نشر Edge Function

```bash
supabase functions deploy send-notification-email
```

---

## ✅ التحقق من الإعداد

### 1. فحص Secrets

في Supabase Dashboard > Edge Functions > Secrets، تأكد من وجود:
- ✅ `EMAIL_PROVIDER`
- ✅ `FROM_EMAIL`
- ✅ `FROM_NAME`
- ✅ `RESEND_API_KEY` (أو `SENDGRID_API_KEY` أو `SMTP_PASSWORD`)

### 2. اختبار Edge Function

```bash
# استدعاء Edge Function مباشرة
curl -X POST \
  'https://your-project.supabase.co/functions/v1/send-notification-email' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "emailData": {
      "to": "test@example.com",
      "subject": "اختبار",
      "html": "<h1>اختبار</h1>",
      "type": "system"
    }
  }'
```

### 3. فحص Logs

في Supabase Dashboard > Edge Functions > Logs:
- ✅ يجب أن تظهر محاولات الإرسال
- ✅ يجب ألا توجد أخطاء

### 4. فحص جدول email_log

في Supabase Dashboard > Table Editor > `email_log`:
- ✅ يجب أن تظهر سجلات جديدة عند إرسال البريد
- ✅ `status` يجب أن يكون `sent` (وليس `failed`)

---

## 🐛 استكشاف الأخطاء

### المشكلة: البريد لا يُرسل

**الحلول:**
1. ✅ تحقق من Secrets في Supabase
2. ✅ تحقق من Logs في Edge Functions
3. ✅ تحقق من جدول `email_log` (قد يكون هناك رسالة خطأ)
4. ✅ تأكد من أن `EMAIL_PROVIDER` صحيح
5. ✅ تأكد من صلاحية API Key

### المشكلة: "Email service not configured"

**السبب:** لم يتم إضافة Secrets في Supabase

**الحل:**
1. اذهب إلى Supabase Dashboard > Edge Functions > Secrets
2. أضف جميع المتغيرات المطلوبة
3. أعد نشر Edge Function

### المشكلة: "Invalid API Key"

**السبب:** API Key غير صحيح أو منتهي الصلاحية

**الحل:**
1. تحقق من API Key في Resend/SendGrid
2. أنشئ مفتاح جديد إذا لزم الأمر
3. حدّث Secret في Supabase

### المشكلة: البريد يذهب إلى Spam

**الحلول:**
1. ✅ أضف Domain في Resend/SendGrid
2. ✅ أضف SPF و DKIM records
3. ✅ استخدم `FROM_EMAIL` من domainك (وليس `onboarding@resend.dev`)

---

## 📊 مراقبة الإرسال

### في Supabase

1. **Edge Functions Logs:**
   - اذهب إلى Edge Functions > Logs
   - راقب محاولات الإرسال والأخطاء

2. **email_log Table:**
   - اذهب إلى Table Editor > `email_log`
   - راجع:
     - عدد الرسائل المرسلة
     - عدد الرسائل الفاشلة
     - رسائل الخطأ

### في Resend

1. اذهب إلى [https://resend.com/emails](https://resend.com/emails)
2. راجع:
   - عدد الرسائل المرسلة
   - معدل التسليم
   - الأخطاء

### في SendGrid

1. اذهب إلى **Activity**
2. راجع:
   - عدد الرسائل المرسلة
   - معدل التسليم
   - الأخطاء

---

## 🔒 الأمان

### أفضل الممارسات:

1. ✅ **لا تشارك API Keys** - احفظها في Secrets فقط
2. ✅ **استخدم Environment Variables** - لا تكتبها في الكود
3. ✅ **استخدم Domain خاص** - للإنتاج، استخدم domainك الخاص
4. ✅ **راقب الاستخدام** - راقب عدد الرسائل المرسلة
5. ✅ **استخدم Rate Limiting** - لمنع الإساءة

---

## 📞 الدعم

### للمساعدة:

- **Resend:** [https://resend.com/docs](https://resend.com/docs)
- **SendGrid:** [https://docs.sendgrid.com](https://docs.sendgrid.com)
- **Supabase:** [https://supabase.com/docs](https://supabase.com/docs)

### معلومات الاتصال:

**المطور:** الحاضنة الرقمية باكورة التقنيات  
**الواتساب:** +966533189111  
**البريد:** info@rafrs.com

---

## ✅ قائمة التحقق

### قبل الإطلاق:

- [ ] تم إنشاء حساب Resend/SendGrid
- [ ] تم الحصول على API Key
- [ ] تم إضافة Domain (للإنتاج)
- [ ] تم إضافة Secrets في Supabase
- [ ] تم نشر Edge Function
- [ ] تم اختبار الإرسال
- [ ] تم التحقق من Logs
- [ ] تم التحقق من جدول `email_log`

---

**آخر تحديث:** 2025-01-27  
**الحالة:** ✅ جاهز للإعداد
