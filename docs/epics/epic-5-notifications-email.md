# Epic 5: Notifications & Email System

## Overview
نظام شامل للإشعارات والبريد الإلكتروني لإبقاء المستخدمين على اطلاع بجميع التحديثات المهمة.

## Business Value
تحسين التواصل بين الباحثين والمسؤولين، وزيادة الشفافية والمتابعة الفعالة للطلبات.

## User Stories

### US-5.1: إشعار بريد التحقق
**كمستخدم جديد**، أريد أن أتلقى بريداً إلكترونياً للتحقق من حسابي.

**معايير القبول:**
- [ ] إرسال تلقائي عند التسجيل
- [ ] رابط تحقق فريد وآمن
- [ ] تصميم بريد احترافي باللغة العربية
- [ ] معلومات واضحة عن الخطوات
- [ ] صلاحية الرابط 24 ساعة
- [ ] إمكانية إعادة الإرسال

**تقديرات:**
- Story Points: 5
- الأولوية: High
- المرحلة: Phase 4

---

### US-5.2: تأكيد تقديم البحث
**كباحث**، أريد أن أتلقى تأكيداً عبر البريد الإلكتروني عند تقديم بحثي.

**معايير القبول:**
- [ ] إرسال فوري بعد تقديم الطلب
- [ ] رقم المرجع واضح
- [ ] ملخص بيانات الطلب
- [ ] رابط لمتابعة الطلب
- [ ] معلومات الاتصال للدعم

**تقديرات:**
- Story Points: 3
- الأولوية: High
- المرحلة: Phase 4

---

### US-5.3: إشعار تغيير الحالة
**كباحث**، أريد أن أتلقى إشعاراً عند تغيير حالة طلبي.

**معايير القبول:**
- [ ] إشعار داخل المنصة (in-app)
- [ ] بريد إلكتروني
- [ ] توضيح الحالة الجديدة
- [ ] سبب التغيير (إن وُجد)
- [ ] رابط مباشر لصفحة الطلب

**تقديرات:**
- Story Points: 5
- الأولوية: High
- المرحلة: Phase 4

---

### US-5.4: إشعار التعليقات
**كباحث**، أريد أن أتلقى إشعاراً عند إضافة تعليق من المسؤول.

**معايير القبول:**
- [ ] إشعار داخل المنصة
- [ ] بريد إلكتروني يحتوي على التعليق
- [ ] اسم المسؤول الذي أضاف التعليق
- [ ] رابط للرد أو المراجعة

**تقديرات:**
- Story Points: 5
- الأولوية: High
- المرحلة: Phase 4

---

### US-5.5: إشعار استعادة كلمة المرور
**كمستخدم**، أريد أن أتلقى رابط إعادة تعيين كلمة المرور.

**معايير القبول:**
- [ ] إرسال فوري بعد الطلب
- [ ] رابط آمن صالح لمدة ساعة واحدة
- [ ] تنبيه أمني إذا لم يكن المستخدم هو من طلب ذلك
- [ ] تعليمات واضحة

**تقديرات:**
- Story Points: 3
- الأولوية: High
- المرحلة: Phase 4

---

### US-5.6: مركز الإشعارات
**كمستخدم**، أريد أن أرى جميع إشعاراتي في مكان واحد.

**معايير القبول:**
- [ ] أيقونة جرس في شريط التنقل
- [ ] عداد للإشعارات غير المقروءة
- [ ] قائمة منسدلة بالإشعارات الأخيرة
- [ ] إمكانية وضع علامة "مقروء"
- [ ] إمكانية وضع علامة "مقروء للجميع"
- [ ] صفحة كاملة لجميع الإشعارات
- [ ] فلترة حسب النوع والحالة

**تقديرات:**
- Story Points: 8
- الأولوية: Medium
- المرحلة: Phase 4

---

### US-5.7: إعدادات الإشعارات
**كمستخدم**، أريد أن أتحكم في أنواع الإشعارات التي أتلقاها.

**معايير القبول:**
- [ ] صفحة إعدادات الإشعارات
- [ ] تفعيل/تعطيل الإشعارات عبر البريد
- [ ] تفعيل/تعطيل الإشعارات داخل المنصة
- [ ] اختيار أنواع الإشعارات:
  - تغيير الحالة
  - تعليقات جديدة
  - تذكيرات
  - أخبار المنصة
- [ ] حفظ التفضيلات

**تقديرات:**
- Story Points: 5
- الأولوية: Low
- المرحلة: Phase 5

---

### US-5.8: تذكيرات للمسؤولين
**كمسؤول**، أريد أن أتلقى تذكيرات بالطلبات التي تحتاج مراجعة.

**معايير القبول:**
- [ ] تذكير يومي بعدد الطلبات قيد المراجعة
- [ ] تنبيه للطلبات القديمة (أكثر من 7 أيام)
- [ ] إحصائيات يومية/أسبوعية
- [ ] إمكانية تخصيص وقت التذكير

**تقديرات:**
- Story Points: 5
- الأولوية: Low
- المرحلة: Phase 5

---

## Technical Requirements

### Email Templates
```html
<!-- email-templates/verify-email.html -->
<!-- email-templates/submission-confirmation.html -->
<!-- email-templates/status-change.html -->
<!-- email-templates/new-comment.html -->
<!-- email-templates/password-reset.html -->
```

### Database Schema
```sql
-- Notification preferences table
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_enabled BOOLEAN DEFAULT TRUE,
  in_app_enabled BOOLEAN DEFAULT TRUE,
  status_change_email BOOLEAN DEFAULT TRUE,
  comments_email BOOLEAN DEFAULT TRUE,
  reminders_email BOOLEAN DEFAULT TRUE,
  news_email BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Email log table (للتتبع وحل المشاكل)
CREATE TABLE email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email_type VARCHAR(50) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'sent', 'failed', 'queued'
  error_message TEXT,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_log_user ON email_log(user_id);
CREATE INDEX idx_email_log_status ON email_log(status);
```

### API Endpoints
- `GET /api/notifications` - جميع إشعارات المستخدم
- `GET /api/notifications/unread-count` - عدد غير المقروءة
- `PUT /api/notifications/:id/read` - وضع علامة مقروء
- `PUT /api/notifications/read-all` - وضع علامة مقروء للجميع
- `DELETE /api/notifications/:id` - حذف إشعار
- `GET /api/notifications/preferences` - إعدادات الإشعارات
- `PUT /api/notifications/preferences` - تحديث الإعدادات

### Email Service Configuration
```javascript
// config/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});
```

### Realtime Notifications
استخدام Supabase Realtime للإشعارات الفورية:
```javascript
// Subscribe to notifications table
const subscription = supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // عرض الإشعار فوراً
    showNotification(payload.new);
  })
  .subscribe();
```

---

## Acceptance Criteria
- [ ] جميع User Stories مكتملة ومختبرة
- [ ] البريد الإلكتروني يُرسل بنجاح 99%+ من الوقت
- [ ] الإشعارات الفورية تعمل بدون تأخير
- [ ] قوالب البريد احترافية ومتجاوبة
- [ ] المستخدمون يمكنهم التحكم في تفضيلاتهم

## Testing Requirements
- [ ] Unit tests لوظائف الإرسال
- [ ] Integration tests مع خدمة البريد
- [ ] End-to-end tests للإشعارات
- [ ] Email template testing على عملاء بريد مختلفين
- [ ] Load testing للإرسال الجماعي

## Dependencies
- Epic 1: Authentication
- Epic 2: Research Submission
- Epic 3: Researcher Dashboard
- Epic 4: Admin Dashboard

## Risks & Mitigation
- **خطر**: البريد يذهب إلى spam
  - **التخفيف**: استخدام SMTP موثوق، SPF/DKIM records، تجنب الكلمات المشبوهة
- **خطر**: فشل إرسال البريد
  - **التخفيف**: Queue system، إعادة المحاولة تلقائياً، تسجيل الأخطاء
- **خطر**: إغراق المستخدمين بالإشعارات
  - **التخفيف**: إعدادات قابلة للتخصيص، تجميع الإشعارات

