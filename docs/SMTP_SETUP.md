# إعداد SMTP لإرسال البريد الإلكتروني

## نظرة عامة

تم تحديث النظام لاستخدام SMTP بدلاً من REST API لإرسال البريد الإلكتروني. هذا يوفر مرونة أكبر ويدعم مختلف مزودي SMTP.

## إعدادات SMTP لـ Resend

### في ملف `.env`:

```env
# إعدادات SMTP
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASSWORD=YOUR_RESEND_API_KEY
FROM_EMAIL=rafrs2030@gmail.com
FROM_NAME=منصة نشر الأبحاث العربية

# أو يمكنك استخدام RESEND_API_KEY مباشرة
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**ملاحظة:** `SMTP_PASSWORD` يجب أن يكون نفس `RESEND_API_KEY` الخاص بك.

### في Supabase Dashboard:

1. اذهب إلى **Settings > Auth > SMTP Settings**
2. فعّل **Enable Custom SMTP**
3. أدخل الإعدادات التالية:
   - **Host:** `smtp.resend.com`
   - **Port:** `465` (أو `587` لـ STARTTLS)
   - **Username:** `resend`
   - **Password:** `YOUR_RESEND_API_KEY`
   - **Sender email:** `rafrs2030@gmail.com`
   - **Sender name:** `منصة نشر الأبحاث العربية`

### في Supabase Edge Functions:

أضف المتغيرات التالية في **Edge Functions > Secrets**:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASSWORD=YOUR_RESEND_API_KEY
FROM_EMAIL=rafrs2030@gmail.com
FROM_NAME=منصة نشر الأبحاث العربية
```

## المنافذ المدعومة

- **465:** SSL/TLS (موصى به)
- **587:** STARTTLS
- **25:** غير مشفر (غير موصى به)

## الاختبار

### اختبار السكربتات المحلية:

```bash
# اختبار إرسال إيميل واحد
node scripts/test-email-script.js

# إرسال إيميلات ترحيبية لجميع المستخدمين
node scripts/send-welcome-email-to-all-users.js
```

### اختبار Edge Function:

```bash
# نشر Edge Function
supabase functions deploy send-notification-email

# اختبار محلي
supabase functions serve send-notification-email
```

## استكشاف الأخطاء

### المشكلة: فشل المصادقة

**الحل:**
- تأكد من أن `SMTP_PASSWORD` هو نفس `RESEND_API_KEY`
- تحقق من أن المفتاح صحيح وغير منتهي الصلاحية

### المشكلة: اتصال فاشل

**الحل:**
- تحقق من إعدادات الجدار الناري
- جرب منفذ 587 بدلاً من 465
- تأكد من أن `SMTP_HOST` صحيح

### المشكلة: الإيميلات لا تصل

**الحل:**
- تحقق من مجلد Spam
- تأكد من أن عنوان المرسل (`FROM_EMAIL`) مُحقق في Resend
- راجع سجلات Supabase Logs

## مزودو SMTP آخرون

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=YOUR_SENDGRID_API_KEY
```

### Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=YOUR_APP_PASSWORD
```

**ملاحظة:** لـ Gmail، تحتاج إلى إنشاء App Password من إعدادات الحساب.

## المراجع

- [Resend SMTP Documentation](https://resend.com/docs/send-with-smtp)
- [Supabase Auth SMTP Settings](https://supabase.com/docs/guides/auth/auth-smtp)
- [Nodemailer Documentation](https://nodemailer.com/about/)

