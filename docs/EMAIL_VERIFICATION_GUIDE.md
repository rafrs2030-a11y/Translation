# دليل التحقق من تفعيل البريد الإلكتروني

## ✅ التحقق من إضافة Secrets

### الطريقة 1: التحقق من Supabase Dashboard

1. اذهب إلى: https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj/settings/functions
2. انقر على تبويب **Secrets**
3. تحقق من وجود Secrets التالية في القائمة:
   - ✅ `RESEND_API_KEY` (مع SHA256 hash)
   - ✅ `EMAIL_PROVIDER`
   - ✅ `FROM_EMAIL`
   - ✅ `FROM_NAME`

### الطريقة 2: التحقق من السجلات

```sql
-- التحقق من حالة البريد
SELECT 
  recipient_email,
  subject,
  status,
  error_message,
  created_at,
  sent_at
FROM email_log
ORDER BY created_at DESC
LIMIT 5;
```

## 🧪 اختبار إرسال البريد

### الطريقة 1: تغيير حالة طلب (موصى به)

1. **سجل دخول كمسؤول**
2. **اذهب إلى صفحة تفاصيل أي طلب**
3. **غيّر الحالة** (مثلاً: من `pending` إلى `approved`)
4. **تحقق من:**
   - ✅ الإشعار يظهر في المنصة
   - ✅ البريد يصل إلى صندوق الوارد
   - ✅ السجل في `email_log` يصبح `sent`

### الطريقة 2: تقديم بحث جديد

1. **سجل دخول كباحث**
2. **قدّم بحث جديد**
3. **تحقق من:**
   - ✅ بريد التأكيد يصل
   - ✅ السجل في `email_log` يصبح `sent`

### الطريقة 3: التحقق من Logs

1. اذهب إلى Supabase Dashboard
2. **Logs** > **Edge Functions**
3. ابحث عن `send-notification-email`
4. تحقق من:
   - ✅ لا توجد أخطاء
   - ✅ رسائل نجاح الإرسال

## 🔍 التحقق من الحالة الحالية

### باستخدام SQL:

```sql
-- إحصائيات شاملة
SELECT 
  COUNT(*) as total_emails,
  COUNT(*) FILTER (WHERE status = 'sent') as sent,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  COUNT(*) FILTER (WHERE status = 'queued') as queued
FROM email_log;

-- آخر 5 رسائل مع التفاصيل
SELECT 
  recipient_email,
  subject,
  status,
  error_message,
  created_at,
  sent_at
FROM email_log
ORDER BY created_at DESC
LIMIT 5;
```

## ⚠️ ملاحظات مهمة

### البريد القديم في قائمة الانتظار:

- **البريد الذي كان `queued` قبل إضافة Secrets لن يُعاد إرساله تلقائياً**
- **الحل:** تحتاج محاولة إرسال جديدة (تغيير حالة طلب جديد)

### إذا كان البريد لا يزال `queued`:

1. **تحقق من Secrets:**
   - تأكد من إضافة جميع Secrets
   - تحقق من صحة `RESEND_API_KEY`
   - تأكد من `EMAIL_PROVIDER=resend`

2. **تحقق من Logs:**
   - اذهب إلى Supabase Dashboard > Logs > Edge Functions
   - ابحث عن أخطاء في `send-notification-email`

3. **تحقق من Resend Dashboard:**
   - اذهب إلى [resend.com](https://resend.com)
   - تحقق من قسم **Logs** أو **Emails**
   - قد ترى محاولات الإرسال هناك

## ✅ علامات النجاح

بعد إضافة Secrets بنجاح:

1. ✅ **البريد الجديد يُرسل مباشرة:**
   - عند تغيير حالة طلب
   - عند تقديم بحث جديد
   - السجل يصبح `sent` مباشرة

2. ✅ **لا توجد أخطاء في Logs:**
   - Edge Function تعمل بدون أخطاء
   - Resend API يستجيب بنجاح

3. ✅ **البريد يصل إلى صندوق الوارد:**
   - تحقق من صندوق الوارد
   - تحقق من مجلد Spam (أحياناً)

## 🔧 استكشاف الأخطاء

### المشكلة: البريد لا يزال `queued`

**الأسباب المحتملة:**
- Secrets لم تُحفظ بشكل صحيح
- `RESEND_API_KEY` غير صحيح
- `EMAIL_PROVIDER` غير مضبوط على `resend`

**الحل:**
1. أعد التحقق من Secrets في Dashboard
2. تأكد من الحفظ (Save)
3. جرب إرسال بريد جديد

### المشكلة: البريد `failed`

**الأسباب المحتملة:**
- API Key غير صحيح أو منتهي
- البريد المُستخدم غير مُتحقق في Resend
- مشكلة في Resend API

**الحل:**
1. تحقق من `error_message` في `email_log`
2. تحقق من Resend Dashboard للأخطاء
3. تأكد من استخدام `onboarding@resend.dev` للاختبار

### المشكلة: لا توجد سجلات جديدة

**الأسباب المحتملة:**
- Edge Function لا تُستدعى
- مشكلة في الكود البرمجي

**الحل:**
1. تحقق من Console في المتصفح
2. تحقق من أن `sendStatusChangeEmail()` يُستدعى
3. تحقق من Logs في Supabase

---

**آخر تحديث:** 2025-01-27

