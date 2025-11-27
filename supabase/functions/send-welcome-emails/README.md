# Send Welcome Emails Edge Function

Edge Function لإرسال إيميلات ترحيبية لجميع المستخدمين المسجلين في قاعدة البيانات باستخدام **Supabase Email** (Email Beta / Email Edge).

## المتطلبات

### Environment Variables (Secrets)

يجب ضبط الأسرار التالية في Supabase Dashboard > Edge Functions > `send-welcome-emails` > Secrets:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FROM_EMAIL=noreply@res-assistant.com
FROM_NAME=منصة نشر الأبحاث العربية
BATCH_SIZE=2  # اختياري، افتراضي: 2
DELAY_BETWEEN_EMAILS=600  # اختياري، افتراضي: 600ms
DELAY_BETWEEN_BATCHES=1000  # اختياري، افتراضي: 1000ms
```

**ملاحظة:** لا حاجة لـ `RESEND_API_KEY` - Supabase Email متكامل مع Supabase!

## الاستخدام

### 1. نشر Edge Function

```bash
# باستخدام Supabase CLI
supabase functions deploy send-welcome-emails

# أو من خلال Supabase Dashboard
# اذهب إلى Edge Functions > Deploy new function
```

### 2. استدعاء Edge Function

#### باستخدام curl:

```bash
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-welcome-emails' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

#### باستخدام JavaScript:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

const { data, error } = await supabase.functions.invoke('send-welcome-emails', {
  method: 'POST',
});

if (error) {
  console.error('Error:', error);
} else {
  console.log('Result:', data);
}
```

#### باستخدام Supabase MCP:

يمكن استدعاء Edge Function مباشرة من خلال MCP Supabase.

## الميزات

- ✅ جلب تلقائي لجميع المستخدمين من قاعدة البيانات
- ✅ تصفية تلقائية للإيميلات غير الصالحة
- ✅ إرسال متوازي في دفعات (configurable)
- ✅ إعادة المحاولة التلقائية (2 محاولات إضافية)
- ✅ تسجيل جميع الإيميلات في `email_log`
- ✅ معالجة شاملة للأخطاء
- ✅ دعم CORS
- ✅ HTML template احترافي للإيميل الترحيبي

## الاستجابة

### نجاح:

```json
{
  "ok": true,
  "total": 10,
  "sent": 9,
  "failed": 1,
  "results": [
    { "email": "user@example.com", "status": "sent" },
    { "email": "invalid@example.com", "status": "failed", "detail": "Error message" }
  ]
}
```

### خطأ:

```json
{
  "error": "db_select_failed",
  "detail": "Error message"
}
```

## Rate Limits

- **Batch Size**: افتراضي 10 إيميلات في كل دفعة (قابل للتعديل عبر `BATCH_SIZE`)
- **Delay between batches**: 500ms
- **Retry delay**: 1s, 2s (exponential backoff)

## استكشاف الأخطاء

### خطأ: "Missing required environment variables"
- تحقق من أن جميع الأسرار (Secrets) مضبوطة في Supabase Dashboard

### خطأ: "Resend error 401"
- تحقق من أن `RESEND_API_KEY` صحيح ومفعّل

### خطأ: "Resend error 422"
- تحقق من أن `FROM_EMAIL` مسجل ومفعّل في حساب resend.com
- تحقق من صحة تنسيق الإيميلات المرسلة إليها

### خطأ: "db_select_failed"
- تحقق من أن `SUPABASE_SERVICE_ROLE_KEY` صحيح
- تحقق من أن جدول `users` موجود ويمكن الوصول إليه

## ملاحظات

- السكربت يحد من عدد النتائج في الاستجابة إلى 100 لتجنب payloads كبيرة
- جميع الإيميلات تُسجل في جدول `email_log` بغض النظر عن نجاح أو فشل الإرسال
- الإيميلات تُرسل بشكل متوازي داخل كل دفعة، لكن مع تأخير بين الدفعات

