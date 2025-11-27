# تعليمات تشغيل سكربت إرسال الإيميلات الترحيبية

## الطريقة 1: تشغيل مباشر

افتح Terminal أو PowerShell في مجلد المشروع وقم بتشغيل:

```bash
node scripts/send-welcome-email-to-all-users.js
```

## الطريقة 2: اختبار إيميل واحد أولاً

```bash
node scripts/send-test-welcome.js
```

## المتغيرات البيئية المطلوبة

تأكد من وجود ملف `.env` في جذر المشروع يحتوي على:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SMTP_PASSWORD=your_resend_api_key
# أو
RESEND_API_KEY=your_resend_api_key

# اختياري
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
FROM_EMAIL=rafrs2030@gmail.com
FROM_NAME=منصة نشر الأبحاث العربية
```

## ملاحظات

- السكربت سيرسل إيميلات ترحيبية لجميع المستخدمين في جدول `users`
- سيتم تسجيل جميع الإيميلات في جدول `email_log`
- الإيميلات تُرسل بشكل متوازي في دفعات من 10 إيميلات

