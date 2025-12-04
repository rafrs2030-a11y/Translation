# Shared Email Utilities

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

---

## 2. تفضيلات المستخدم (User Preferences)

### الملف: `get-user-preferences.ts`

يوفر وظائف للوصول إلى تفضيلات إشعارات المستخدم من جدول `notification_preferences` في Supabase.

### الاستخدام

#### 1. استيراد الدوال

```typescript
import { getUserPreferences, shouldSendEmailToUser } from '../_shared/get-user-preferences.ts';
```

#### 2. الحصول على تفضيلات المستخدم

```typescript
const userPreferences = await getUserPreferences(supabaseClient, userId);

// userPreferences يحتوي على:
// {
//   email_enabled: boolean,           // التحكم الرئيسي
//   in_app_enabled: boolean,          // إشعارات داخل التطبيق
//   status_change_email: boolean,     // إشعار عند تغيير الحالة
//   comments_email: boolean,          // إشعار عند إضافة تعليق
//   reminders_email: boolean,         // تذكيرات
//   news_email: boolean               // أخبار
// }
```

#### 3. التحقق من إمكانية الإرسال للمستخدم

```typescript
// قبل إرسال البريد، تحقق من تفضيلات المستخدم
if (!shouldSendEmailToUser(userPreferences, 'status_change')) {
  // لا ترسل البريد - المستخدم عطل هذا النوع من الإشعارات
  return;
}

// يمكنك المتابعة في إرسال البريد
```

### أنواع البريد المدعومة

- `'status_change'` → يتحقق من `status_change_email`
- `'comment_added'` → يتحقق من `comments_email`
- `'reminder'` → يتحقق من `reminders_email`
- `'system'` → يتحقق من `news_email`
- `'new_submission'` → يتحقق من `email_enabled` (التحكم الرئيسي)

### منطق التحقق

1. **التحقق الرئيسي**: إذا كان `email_enabled` معطلاً، لن يتم إرسال أي بريد إلكتروني.
2. **التحقق المحدد**: كل نوع بريد يتحقق من التفضيل المحدد له.

### القيم الافتراضية

إذا لم توجد تفضيلات للمستخدم أو فشل الجلب، يتم استخدام القيم الافتراضية (جميعها مفعلة):
- `email_enabled: true`
- `status_change_email: true`
- `comments_email: true`
- `reminders_email: true`
- `news_email: true`
- `in_app_enabled: true`

---

## التكامل مع Edge Functions

تم دمج هذه الوظائف في:
- `send-notification-email` - يتحقق من إعدادات المنصة **ثم** تفضيلات المستخدم
- `send-welcome-emails` - يتحقق من إعدادات المنصة **ثم** تفضيلات المستخدم

### ترتيب التحقق (Hierarchy)

1. **أولاً**: التحقق من إعدادات المنصة (`platform_settings`)
   - إذا كانت معطلة → لا ترسل لأي مستخدم
   
2. **ثانياً**: التحقق من تفضيلات المستخدم (`notification_preferences`)
   - إذا كانت معطلة → لا ترسل لهذا المستخدم فقط

### مثال كامل

```typescript
import { getEmailSettings, shouldSendEmail } from '../_shared/get-email-settings.ts';
import { getUserPreferences, shouldSendEmailToUser } from '../_shared/get-user-preferences.ts';

// 1. التحقق من إعدادات المنصة أولاً
const emailSettings = await getEmailSettings(supabase);
if (!shouldSendEmail(emailSettings, 'status_change')) {
  return; // إعدادات المنصة معطلة
}

// 2. التحقق من تفضيلات المستخدم ثانياً
if (userId) {
  const userPreferences = await getUserPreferences(supabase, userId);
  if (!shouldSendEmailToUser(userPreferences, 'status_change')) {
    return; // المستخدم عطل هذا النوع من الإشعارات
  }
}

// 3. إرسال البريد
await sendEmail(...);
```

---

## تحديث الإعدادات

### إعدادات المنصة
يمكن تحديثها من:
- صفحة الإعدادات في لوحة التحكم (`/pages/admin/settings.html`)
- جدول `platform_settings` في Supabase مباشرة

### تفضيلات المستخدم
يمكن تحديثها من:
- صفحة الملف الشخصي للباحث (`/pages/researcher/profile.html`)
- جدول `notification_preferences` في Supabase مباشرة

التغييرات فورية وتؤثر على جميع Edge Functions التي تستخدم هذه الوظائف.

