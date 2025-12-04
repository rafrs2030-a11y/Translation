# Email Settings Utility

## نظرة عامة

هذا الملف المشترك (`get-email-settings.ts`) يوفر وظائف للوصول إلى إعدادات البريد الإلكتروني من جدول `platform_settings` في Supabase.

## الاستخدام

### 1. استيراد الدوال

```typescript
import { getEmailSettings, shouldSendEmail } from '../_shared/get-email-settings.ts';
```

### 2. الحصول على الإعدادات

```typescript
const emailSettings = await getEmailSettings(supabaseClient);

// emailSettings يحتوي على:
// {
//   email_notifications: boolean,      // تفعيل إشعارات البريد الإلكتروني
//   email_new_submission: boolean,      // إشعار عند طلب جديد
//   email_status_change: boolean        // إشعار عند تغيير الحالة
// }
```

### 3. التحقق من إمكانية الإرسال

```typescript
// قبل إرسال البريد، تحقق من الإعدادات
if (!shouldSendEmail(emailSettings, 'new_submission')) {
  // لا ترسل البريد - الإعدادات معطلة
  return;
}

// يمكنك المتابعة في إرسال البريد
```

## أنواع البريد المدعومة

- `'new_submission'` - إشعار عند طلب جديد
- `'status_change'` - إشعار عند تغيير الحالة
- `'comment_added'` - إشعار عند إضافة تعليق
- `'reminder'` - تذكير
- `'system'` - إشعارات النظام

## منطق التحقق

1. **التحقق الرئيسي**: إذا كان `email_notifications` معطلاً، لن يتم إرسال أي بريد إلكتروني.
2. **التحقق المحدد**: 
   - `new_submission` → يتحقق من `email_new_submission`
   - `status_change` → يتحقق من `email_status_change`
   - الأنواع الأخرى → تتحقق من `email_notifications` فقط

## القيم الافتراضية

إذا فشل جلب الإعدادات من قاعدة البيانات، يتم استخدام القيم الافتراضية (جميعها مفعلة):
- `email_notifications: true`
- `email_new_submission: true`
- `email_status_change: true`

## مثال كامل

```typescript
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { getEmailSettings, shouldSendEmail } from '../_shared/get-email-settings.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// الحصول على الإعدادات
const emailSettings = await getEmailSettings(supabase);

// التحقق قبل الإرسال
if (shouldSendEmail(emailSettings, 'status_change')) {
  // إرسال البريد
  await sendEmail(...);
} else {
  console.log('Email disabled in platform settings');
}
```

## التكامل مع Edge Functions

تم دمج هذه الوظائف في:
- `send-notification-email` - للتحقق قبل إرسال إشعارات البريد
- `send-welcome-emails` - للتحقق قبل إرسال رسائل الترحيب

## تحديث الإعدادات

يمكن تحديث إعدادات البريد من:
- صفحة الإعدادات في لوحة التحكم (`/pages/admin/settings.html`)
- جدول `platform_settings` في Supabase مباشرة

التغييرات فورية وتؤثر على جميع Edge Functions التي تستخدم هذه الوظائف.

