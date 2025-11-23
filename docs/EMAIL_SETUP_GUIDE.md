# دليل إعداد خدمة البريد الإلكتروني
# Email Service Setup Guide

## نظرة عامة

يستخدم النظام خدمة بريد إلكتروني خارجية لإرسال الإشعارات للمستخدمين. يدعم النظام حالياً:
- **Resend** (موصى به - سهل الإعداد)
- **SendGrid** (خيار بديل)
- **SMTP** (قريباً)

---

## 🚀 الإعداد السريع - Resend (موصى به)

### الخطوة 1: إنشاء حساب Resend

1. اذهب إلى [resend.com](https://resend.com)
2. سجل حساب جديد (مجاني حتى 3000 بريد/شهر)
3. بعد تسجيل الدخول، اذهب إلى **API Keys**
4. انقر **Create API Key**
5. اختر اسم للـ Key (مثلاً: `arab-research-production`)
6. انسخ الـ API Key (سيظهر مرة واحدة فقط!)

### الخطوة 2: إضافة Domain (اختياري للإنتاج)

للإنتاج، يجب إضافة Domain خاص بك:

1. في Resend Dashboard، اذهب إلى **Domains**
2. انقر **Add Domain**
3. أدخل Domain الخاص بك (مثلاً: `arabresearch.com`)
4. أضف DNS Records كما هو موضح:
   ```
   Type: TXT
   Name: @
   Value: [القيمة المعطاة من Resend]
   
   Type: CNAME
   Name: resend._domainkey
   Value: [القيمة المعطاة من Resend]
   ```
5. انتظر التحقق (قد يستغرق بضع دقائق)

**للاختبار:** يمكنك استخدام `onboarding@resend.dev` بدون إعداد Domain

### الخطوة 3: إضافة متغيرات البيئة في Supabase

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **Project Settings** > **Edge Functions**
4. في قسم **Secrets**, أضف:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_PROVIDER=resend
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=منصة نشر الأبحاث العربية
```

**ملاحظة:** استبدل:
- `re_xxxxxxxxxxxxxxxxxxxxx` بـ API Key الخاص بك من Resend
- `noreply@yourdomain.com` بـ البريد الذي تريد الإرسال منه

### الخطوة 4: نشر Edge Function

```bash
# تأكد من تثبيت Supabase CLI
npm install -g supabase

# تسجيل الدخول
supabase login

# ربط المشروع
supabase link --project-ref your-project-ref

# نشر الدالة
supabase functions deploy send-notification-email
```

---

## 📧 الإعداد - SendGrid (بديل)

### الخطوة 1: إنشاء حساب SendGrid

1. اذهب إلى [sendgrid.com](https://sendgrid.com)
2. سجل حساب جديد (مجاني حتى 100 بريد/يوم)
3. بعد تسجيل الدخول، اذهب إلى **Settings** > **API Keys**
4. انقر **Create API Key**
5. اختر **Full Access** أو **Restricted Access** (مع صلاحيات Mail Send)
6. انسخ الـ API Key

### الخطوة 2: التحقق من البريد الإلكتروني

1. اذهب إلى **Settings** > **Sender Authentication**
2. انقر **Verify a Single Sender**
3. أدخل بيانات البريد الإلكتروني
4. تحقق من البريد

### الخطوة 3: إضافة متغيرات البيئة في Supabase

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_PROVIDER=sendgrid
FROM_EMAIL=verified@yourdomain.com
FROM_NAME=منصة نشر الأبحاث العربية
```

### الخطوة 4: نشر Edge Function

نفس الخطوات المذكورة أعلاه.

---

## 🧪 الاختبار

### اختبار إرسال بريد إلكتروني:

1. سجل دخول كمسؤول
2. غيّر حالة أحد الطلبات
3. تحقق من:
   - جدول `email_log` في Supabase (يجب أن تكون الحالة `sent`)
   - صندوق الوارد للبريد الإلكتروني

### استعلام SQL للتحقق:

```sql
-- عرض آخر 10 رسائل
SELECT 
  recipient_email,
  subject,
  status,
  sent_at,
  error_message,
  created_at
FROM email_log
ORDER BY created_at DESC
LIMIT 10;

-- عرض الرسائل الفاشلة
SELECT *
FROM email_log
WHERE status = 'failed'
ORDER BY created_at DESC;
```

---

## 🔧 استكشاف الأخطاء

### المشكلة: البريد لا يُرسل

**الحلول:**

1. **تحقق من متغيرات البيئة:**
   ```bash
   # في Supabase Dashboard
   # تأكد من وجود:
   - RESEND_API_KEY أو SENDGRID_API_KEY
   - EMAIL_PROVIDER=resend أو sendgrid
   - FROM_EMAIL
   ```

2. **تحقق من Logs:**
   - في Supabase Dashboard، اذهب إلى **Edge Functions** > **Logs**
   - ابحث عن أخطاء في `send-notification-email`

3. **تحقق من API Key:**
   - تأكد من أن API Key صحيح
   - تأكد من أن API Key له صلاحيات الإرسال

4. **تحقق من Domain (للإنتاج):**
   - تأكد من إضافة Domain في Resend/SendGrid
   - تأكد من التحقق من DNS Records

### المشكلة: البريد يصل إلى Spam

**الحلول:**

1. **إضافة SPF Record:**
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.resend.com ~all
   ```

2. **إضافة DKIM Record:**
   - في Resend: استخدم القيمة المعطاة في Domain Settings
   - في SendGrid: استخدم القيمة من Sender Authentication

3. **إضافة DMARC Record:**
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:admin@yourdomain.com
   ```

---

## 📊 مراقبة الأداء

### في Supabase:

```sql
-- إحصائيات البريد
SELECT 
  status,
  COUNT(*) as count,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentage
FROM email_log
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY status;

-- معدل النجاح
SELECT 
  DATE(created_at) as date,
  COUNT(*) FILTER (WHERE status = 'sent') as sent,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  COUNT(*) as total
FROM email_log
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### في Resend Dashboard:

- اذهب إلى **Emails** لرؤية جميع الرسائل المرسلة
- اذهب إلى **Analytics** لرؤية الإحصائيات

### في SendGrid Dashboard:

- اذهب إلى **Activity** لرؤية جميع الرسائل
- اذهب إلى **Stats** لرؤية الإحصائيات

---

## 💰 التكاليف

### Resend:
- **مجاني:** حتى 3000 بريد/شهر
- **Pro:** $20/شهر - 50,000 بريد
- **Business:** $80/شهر - 200,000 بريد

### SendGrid:
- **Free:** 100 بريد/يوم (3,000/شهر)
- **Essentials:** $19.95/شهر - 50,000 بريد
- **Pro:** $89.95/شهر - 100,000 بريد

---

## 🔐 الأمان

### أفضل الممارسات:

1. **لا تشارك API Keys:**
   - احفظها في Supabase Secrets فقط
   - لا تضعها في الكود
   - لا ترفعها إلى GitHub

2. **استخدم Domain خاص:**
   - لا تستخدم `onboarding@resend.dev` في الإنتاج
   - أضف Domain خاص بك

3. **راقب الاستخدام:**
   - تحقق من Logs بانتظام
   - راقب عدد الرسائل المرسلة
   - ضع حدود للاستخدام

---

## 📝 ملاحظات إضافية

1. **Rate Limits:**
   - Resend: 10 رسائل/ثانية (Free Plan)
   - SendGrid: 100 رسائل/ثانية (Free Plan)

2. **Bounce Handling:**
   - النظام يسجل البريد في `email_log`
   - يمكن إضافة Webhook لمعالجة Bounces تلقائياً

3. **Unsubscribe:**
   - يمكن إضافة رابط إلغاء الاشتراك في القوالب
   - يمكن استخدام `notification_preferences` لإدارة التفضيلات

---

## 🆘 الدعم

- **Resend:** [docs.resend.com](https://docs.resend.com)
- **SendGrid:** [docs.sendgrid.com](https://docs.sendgrid.com)
- **Supabase:** [supabase.com/docs](https://supabase.com/docs)

---

## ✅ قائمة التحقق

- [ ] إنشاء حساب Resend/SendGrid
- [ ] الحصول على API Key
- [ ] إضافة متغيرات البيئة في Supabase
- [ ] نشر Edge Function
- [ ] اختبار إرسال بريد
- [ ] إضافة Domain (للإنتاج)
- [ ] إعداد DNS Records
- [ ] مراقبة Logs
- [ ] إعداد Monitoring

---

**آخر تحديث:** 2025-01-27

