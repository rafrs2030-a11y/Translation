# تفعيل إرسال البريد الإلكتروني - Email Activation Guide

## ✅ الحالة الحالية

- ✅ Edge Function منشورة ومفعّلة: `send-notification-email`
- ✅ الكود جاهز ويعمل
- ⚠️ يوجد بريد واحد في قائمة الانتظار (queued)
- ❌ مفاتيح API غير مضبوطة (Resend/SendGrid)

## 🚀 خطوات التفعيل

### الطريقة 1: استخدام Supabase Dashboard (الأسهل)

1. **اذهب إلى Supabase Dashboard:**
   - افتح: https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj
   - سجل دخول إلى حسابك

2. **إعداد Edge Function Secrets:**
   - اذهب إلى **Project Settings** > **Edge Functions**
   - أو مباشرة: https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj/settings/functions
   - في قسم **Secrets**، أضف المتغيرات التالية:

#### إذا كنت تستخدم Resend (موصى به):

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_PROVIDER=resend
FROM_EMAIL=onboarding@resend.dev
FROM_NAME=منصة نشر الأبحاث العربية
```

#### إذا كنت تستخدم SendGrid:

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_PROVIDER=sendgrid
FROM_EMAIL=noreply@arabresearch.com
FROM_NAME=منصة نشر الأبحاث العربية
```

3. **احصل على API Key:**

   **لـ Resend:**
   - اذهب إلى [resend.com](https://resend.com)
   - سجل حساب جديد أو سجل دخول
   - اذهب إلى **API Keys**
   - أنشئ API Key جديد
   - انسخ المفتاح (يبدأ بـ `re_`)

   **لـ SendGrid:**
   - اذهب إلى [sendgrid.com](https://sendgrid.com)
   - سجل حساب جديد أو سجل دخول
   - اذهب إلى **Settings** > **API Keys**
   - أنشئ API Key جديد
   - انسخ المفتاح (يبدأ بـ `SG.`)

### الطريقة 2: استخدام Supabase CLI

```bash
# تثبيت Supabase CLI (إذا لم يكن مثبتاً)
npm install -g supabase

# تسجيل الدخول
supabase login

# ربط المشروع
supabase link --project-ref rzenhmmwocctvonwhnrj

# إضافة Secrets
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
supabase secrets set EMAIL_PROVIDER=resend
supabase secrets set FROM_EMAIL=onboarding@resend.dev
supabase secrets set FROM_NAME="منصة نشر الأبحاث العربية"
```

## 🧪 اختبار الإرسال

بعد إضافة Secrets:

1. **اختبار يدوي:**
   - سجل دخول كمسؤول
   - غيّر حالة أحد الطلبات
   - تحقق من وصول البريد

2. **التحقق من السجلات:**
   ```sql
   SELECT * FROM email_log 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

3. **التحقق من Logs:**
   - اذهب إلى Supabase Dashboard > **Logs** > **Edge Functions**
   - ابحث عن `send-notification-email`
   - تحقق من أي أخطاء

## 📊 التحقق من الحالة

### باستخدام SQL:

```sql
-- إحصائيات البريد
SELECT 
  COUNT(*) as total_emails,
  COUNT(*) FILTER (WHERE status = 'sent') as sent,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  COUNT(*) FILTER (WHERE status = 'queued') as queued
FROM email_log;

-- آخر 5 رسائل
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

### باستخدام MCP:

يمكنك استخدام:
- `mcp_supabase_execute_sql` للتحقق من السجلات
- `mcp_supabase_get_logs` للتحقق من Logs

## ⚠️ ملاحظات مهمة

1. **Resend (موصى به):**
   - أسهل في الإعداد
   - مجاني حتى 3000 بريد/شهر
   - يدعم البريد العربي بشكل ممتاز
   - البريد الافتراضي: `onboarding@resend.dev`

2. **SendGrid:**
   - مجاني حتى 100 بريد/يوم
   - يحتاج إعداد Domain Verification للإنتاج
   - أكثر تعقيداً في الإعداد

3. **بعد إضافة Secrets:**
   - Edge Function ستعيد المحاولة تلقائياً
   - البريد في قائمة الانتظار سيتم إرساله
   - أي محاولة إرسال جديدة ستعمل مباشرة

## 🔍 استكشاف الأخطاء

### المشكلة: البريد لا يصل

1. **تحقق من Secrets:**
   - تأكد من إضافة جميع المتغيرات
   - تحقق من صحة API Key

2. **تحقق من Logs:**
   ```bash
   # باستخدام Supabase CLI
   supabase functions logs send-notification-email
   ```

3. **تحقق من email_log:**
   - ابحث عن `error_message` في السجلات
   - قد يكون السبب: API Key غير صحيح، أو Domain غير مُتحقق

### المشكلة: البريد في قائمة الانتظار

- هذا يعني أن Edge Function تعمل لكن API Key غير مضاف
- أضف Secrets كما هو موضح أعلاه
- البريد سيتم إرساله تلقائياً

## ✅ بعد التفعيل

بعد إضافة Secrets بنجاح:

1. ✅ البريد سيتم إرساله تلقائياً عند:
   - تغيير حالة الطلب
   - إضافة تعليق من المسؤول
   - تقديم بحث جديد

2. ✅ جميع المحاولات تُسجل في `email_log`

3. ✅ يمكنك مراقبة الإحصائيات من Dashboard

---

**آخر تحديث:** 2025-01-27
**الحالة:** Edge Function منشورة - يحتاج إضافة Secrets فقط

