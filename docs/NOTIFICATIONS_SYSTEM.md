# نظام الإشعارات - Notifications System

## نظرة عامة

تم تنفيذ نظام إشعارات شامل يرسل تحديثات حالة الطلبات للمستخدمين عبر:
1. **البريد الإلكتروني** - إرسال بريد إلكتروني عند تغيير الحالة
2. **إشعارات داخل المنصة (Realtime)** - إشعارات فورية عبر Supabase Realtime
3. **إشعارات المتصفح** - إشعارات المتصفح (Browser Notifications)

## المكونات

### 1. Supabase Edge Function
**الموقع:** `supabase/functions/send-notification-email/index.ts`

تقوم هذه الدالة بإرسال البريد الإلكتروني عند استدعائها. يمكن تكاملها مع:
- Resend
- SendGrid
- Supabase Email (إذا كان متاحاً)
- أي خدمة بريد إلكتروني أخرى

**الاستخدام:**
```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/send-notification-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    'apikey': SUPABASE_ANON_KEY,
  },
  body: JSON.stringify({
    emailData: {
      to: 'user@example.com',
      subject: 'تحديث حالة البحث',
      type: 'status_change',
      userId: 'user-id',
      submissionId: 'submission-id',
    },
    statusData: {
      researcherName: 'اسم الباحث',
      referenceNumber: 'REF-2025-1234',
      oldStatus: 'pending',
      newStatus: 'approved',
      oldStatusLabel: 'قيد المراجعة',
      newStatusLabel: 'مقبول',
      // ... المزيد من البيانات
    },
  }),
});
```

### 2. Database Triggers
تم إنشاء Triggers في قاعدة البيانات ترسل إشعارات تلقائياً عند:
- تغيير حالة الطلب (`trigger_notify_status_change`)
- إضافة تعليق جديد (`trigger_notify_comment_added`)

**المزايا:**
- إشعارات تلقائية بدون تدخل من الكود
- موثوقية عالية
- يعمل حتى لو فشل الكود في إرسال الإشعار

### 3. AdminStore Updates
تم تحديث `stores/adminStore.js` ليشمل:
- `sendStatusChangeEmail()` - إرسال بريد عند تغيير الحالة
- `sendCommentEmail()` - إرسال بريد عند إضافة تعليق
- `createNotification()` - إنشاء إشعار داخل المنصة

### 4. Realtime Notifications
تم تفعيل Supabase Realtime على جدول `notifications` لإرسال إشعارات فورية للمستخدمين.

**الكود موجود في:** `stores/notificationsStore.js`

## كيفية العمل

### عند تغيير حالة الطلب:

1. **AdminStore.updateSubmissionStatus()** يتم استدعاؤه
2. يتم تحديث الحالة في قاعدة البيانات
3. **Database Trigger** يكتشف التغيير تلقائياً:
   - ينشئ إشعار في جدول `notifications`
   - يسجل بريد إلكتروني في جدول `email_log`
4. **Supabase Realtime** يرسل الإشعار فوراً للمستخدم المتصل
5. **AdminStore.sendStatusChangeEmail()** يستدعي Edge Function لإرسال البريد
6. **Edge Function** يرسل البريد الإلكتروني (إذا كان متوفراً)

### عند إضافة تعليق:

1. **AdminStore.addComment()** يتم استدعاؤه
2. يتم إدراج التعليق في قاعدة البيانات
3. **Database Trigger** يكتشف التعليق الجديد:
   - ينشئ إشعار في جدول `notifications`
   - يسجل بريد إلكتروني في جدول `email_log`
4. **Supabase Realtime** يرسل الإشعار فوراً
5. **AdminStore.sendCommentEmail()** يستدعي Edge Function لإرسال البريد

## الإعداد

### 1. تفعيل Realtime

تم تفعيل Realtime تلقائياً عبر Migration. للتأكد:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

### 2. إعداد خدمة البريد الإلكتروني

لإرسال البريد الإلكتروني فعلياً، راجع الدليل الكامل:

- **[دليل الإعداد السريع](./EMAIL_SETUP_QUICK_START.md)** - للبدء في 5 دقائق
- **[دليل الإعداد الكامل](./EMAIL_SETUP_GUIDE.md)** - للتفاصيل الكاملة

**ملخص سريع:**

1. **إنشاء حساب Resend** (موصى به) أو SendGrid
2. **الحصول على API Key**
3. **إضافة Secrets في Supabase:**
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   EMAIL_PROVIDER=resend
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=منصة نشر الأبحاث العربية
   ```
4. **نشر Edge Function:**
   ```bash
   supabase functions deploy send-notification-email
   ```

**ملاحظة:** Edge Function محدثة بالفعل وتدعم Resend و SendGrid تلقائياً!

## الاختبار

### اختبار الإشعارات داخل المنصة:

1. سجل دخول كباحث
2. افتح Console في المتصفح
3. في لوحة المسؤول، غيّر حالة أحد الطلبات
4. يجب أن يظهر إشعار فوري في Console وفي واجهة المستخدم

### اختبار البريد الإلكتروني:

1. تأكد من إعداد خدمة البريد
2. غيّر حالة طلب
3. تحقق من جدول `email_log` في Supabase:
   ```sql
   SELECT * FROM email_log 
   WHERE status = 'sent' 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

### اختبار Realtime:

1. افتح صفحتين من المتصفح
2. سجل دخول في كليهما
3. في إحدى الصفحات (كمسؤول)، غيّر حالة طلب
4. يجب أن يظهر الإشعار فوراً في الصفحة الأخرى

## الجداول المستخدمة

### `notifications`
- `id` - UUID
- `user_id` - معرف المستخدم
- `submission_id` - معرف الطلب
- `type` - نوع الإشعار
- `message` - نص الإشعار
- `is_read` - هل تم القراءة
- `created_at` - تاريخ الإنشاء

### `email_log`
- `id` - UUID
- `user_id` - معرف المستخدم
- `email_type` - نوع البريد
- `recipient_email` - بريد المستقبل
- `subject` - موضوع البريد
- `status` - الحالة (sent, failed, queued)
- `error_message` - رسالة الخطأ (إن وجدت)
- `sent_at` - تاريخ الإرسال
- `created_at` - تاريخ الإنشاء

## ملاحظات مهمة

1. **الأمان:** تأكد من أن Edge Function محمية بـ RLS Policies
2. **الأداء:** الإشعارات تعمل بشكل غير متزامن (async)
3. **التكرار:** يمكن إعادة محاولة إرسال البريد الفاشل من جدول `email_log`
4. **التفضيلات:** يمكن للمستخدمين تعطيل أنواع معينة من الإشعارات من `notification_preferences`

## الخطوات التالية

1. ✅ إنشاء Edge Function
2. ✅ تحديث AdminStore
3. ✅ تفعيل Database Triggers
4. ✅ تفعيل Realtime
5. ⏳ إعداد خدمة البريد الإلكتروني (Resend/SendGrid)
6. ⏳ اختبار النظام بالكامل
7. ⏳ إضافة معالجة للأخطاء وإعادة المحاولة

## الدعم

للمساعدة أو الاستفسارات، راجع:
- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)

