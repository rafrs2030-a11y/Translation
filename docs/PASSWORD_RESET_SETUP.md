# إعداد إعادة تعيين كلمة المرور - Password Reset Setup

## المشكلة

عند إرسال طلب إعادة تعيين كلمة المرور، قد يظهر خطأ 500 من Supabase.

## الحل

### 1. إضافة Redirect URL في Supabase Dashboard

يجب إضافة URL الخاص بك في قائمة URLs المسموح بها في Supabase:

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **Authentication** > **URL Configuration**
4. في قسم **Redirect URLs**، أضف:
   ```
   https://res-assistant.com/reset-password
   http://localhost:3000/reset-password (للتطوير المحلي)
   ```
5. احفظ التغييرات

### 2. التحقق من Environment Variables

تأكد من أن المتغيرات التالية موجودة في Netlify:

```
NEXT_PUBLIC_SUPABASE_URL=https://rzenhmmwocctvonwhnrj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. التحقق من Email Templates

في Supabase Dashboard:
1. اذهب إلى **Authentication** > **Email Templates**
2. تأكد من أن **Reset Password** template يحتوي على:
   ```
   {{ .ConfirmationURL }}
   ```
   بدلاً من رابط ثابت

### 4. ملاحظات إضافية

- تأكد من أن SMTP settings في Supabase صحيحة إذا كنت تستخدم بريد إلكتروني مخصص
- الرابط المرسل عبر البريد سيحتوي على `#access_token=...` في URL fragment
- الكود الحالي يدعم كل من URL fragments و query parameters للتوافق

## حل مشكلة manifest.json

إذا ظهر خطأ في manifest.json:
1. تأكد من أن الملف في `public/manifest.json`
2. تأكد من أن الملف صالح JSON (يمكن التحقق من خلال JSON validator)
3. تأكد من أن Content-Type هو `application/manifest+json`

