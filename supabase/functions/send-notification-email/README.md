# Send Notification Email - Edge Function

## الوصف

دالة Supabase Edge Function لإرسال البريد الإلكتروني للمستخدمين عند تغيير حالة الطلبات أو إضافة تعليقات.

## المتغيرات البيئية المطلوبة

### للاستخدام مع SMTP (موصى به):
```
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASSWORD=YOUR_RESEND_API_KEY
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=منصة نشر الأبحاث العربية
```

### للاستخدام مع Resend REST API:
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_PROVIDER=resend
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=منصة نشر الأبحاث العربية
```

### للاستخدام مع SendGrid:
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_PROVIDER=sendgrid
FROM_EMAIL=verified@yourdomain.com
FROM_NAME=منصة نشر الأبحاث العربية
```

### متغيرات Supabase (تضاف تلقائياً):
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**ملاحظة:** عند استخدام SMTP مع Resend، `SMTP_PASSWORD` يجب أن يكون نفس `RESEND_API_KEY`.

## الاستخدام

### Request Body:
```json
{
  "emailData": {
    "to": "user@example.com",
    "subject": "تحديث حالة البحث",
    "type": "status_change",
    "userId": "user-uuid",
    "submissionId": "submission-uuid"
  },
  "statusData": {
    "researcherName": "اسم الباحث",
    "referenceNumber": "REF-2025-1234",
    "oldStatus": "pending",
    "newStatus": "approved",
    "oldStatusLabel": "قيد المراجعة",
    "newStatusLabel": "مقبول",
    "researchTitle": "عنوان البحث",
    "researchType": "ورقة علمية",
    "submissionDate": "2025-01-27",
    "comment": "ملاحظات المراجع (اختياري)",
    "submissionLink": "https://yourdomain.com/submissions/123"
  }
}
```

### Response:
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

## النشر

```bash
supabase functions deploy send-notification-email
```

## الاختبار المحلي

```bash
supabase functions serve send-notification-email
```

## الدعم

راجع `docs/EMAIL_SETUP_GUIDE.md` للتعليمات الكاملة.

