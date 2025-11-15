# Epic 3: Researcher Dashboard

## Overview
لوحة تحكم شاملة للباحث لإدارة طلباته وتتبع حالتها والتفاعل مع تعليقات المراجعين.

## Business Value
تمكين الباحثين من متابعة حالة أبحاثهم بشفافية وسهولة، مما يحسن تجربة المستخدم.

## User Stories

### US-3.1: عرض جميع الطلبات
**كباحث**، أريد أن أرى قائمة بجميع طلباتي المقدمة حتى أتابع حالتها.

**معايير القبول:**
- [ ] جدول يعرض جميع الطلبات مع:
  - رقم المرجع
  - عنوان البحث/اسم الباحث الرئيسي
  - نوع البحث
  - تاريخ التقديم
  - الحالة الحالية
- [ ] ترتيب الطلبات حسب التاريخ (الأحدث أولاً)
- [ ] ألوان مختلفة للحالات:
  - أصفر: قيد المراجعة (pending)
  - أخضر: مقبول (approved)
  - أحمر: مرفوض (rejected)
  - أزرق: يحتاج مراجعة (needs_revision)
- [ ] عرض عدد الطلبات لكل حالة

**تقديرات:**
- Story Points: 5
- الأولوية: High
- المرحلة: Phase 2

---

### US-3.2: عرض تفاصيل الطلب
**كباحث**، أريد أن أفتح طلباً محدداً لأرى جميع تفاصيله.

**معايير القبول:**
- [ ] صفحة تفاصيل تعرض جميع معلومات الطلب
- [ ] عرض اسم الملف المرفوع وحجمه
- [ ] عرض الحالة الحالية مع تاريخ آخر تحديث
- [ ] عرض تعليقات المسؤول (إن وجدت)
- [ ] زر للعودة إلى قائمة الطلبات

**تقديرات:**
- Story Points: 3
- الأولوية: High
- المرحلة: Phase 2

---

### US-3.3: تحميل ملف البحث المرفوع
**كباحث**، أريد أن أتمكن من تحميل نسخة من الملف الذي قدمته.

**معايير القبول:**
- [ ] زر "تحميل الملف" في صفحة التفاصيل
- [ ] تحميل الملف بنفس الاسم والامتداد الأصلي
- [ ] إمكانية تحميل الملف فقط من الباحث نفسه

**تقديرات:**
- Story Points: 3
- الأولوية: Medium
- المرحلة: Phase 2

---

### US-3.4: الإشعارات
**كباحث**، أريد أن أتلقى إشعارات عند تغيير حالة طلبي أو إضافة تعليق.

**معايير القبول:**
- [ ] إشعار في لوحة التحكم عند تغيير الحالة
- [ ] بريد إلكتروني عند تغيير الحالة
- [ ] بريد إلكتروني عند إضافة تعليق من المسؤول
- [ ] عداد للإشعارات غير المقروءة
- [ ] قائمة الإشعارات مع إمكانية وضع علامة "مقروء"

**تقديرات:**
- Story Points: 8
- الأولوية: Medium
- المرحلة: Phase 4

---

### US-3.5: فلترة وبحث
**كباحث**، أريد أن أتمكن من تصفية طلباتي والبحث فيها.

**معايير القبول:**
- [ ] فلتر حسب الحالة
- [ ] فلتر حسب نوع البحث
- [ ] بحث برقم المرجع
- [ ] بحث باسم الباحث الرئيسي
- [ ] إعادة تعيين الفلاتر

**تقديرات:**
- Story Points: 5
- الأولوية: Low
- المرحلة: Phase 5

---

### US-3.6: تقديم بحث جديد
**كباحث**، أريد أن أصل إلى نموذج تقديم البحث من لوحة التحكم.

**معايير القبول:**
- [ ] زر واضح "تقديم بحث جديد"
- [ ] توجيه إلى صفحة نموذج التقديم
- [ ] العودة إلى لوحة التحكم بعد الإرسال الناجح

**تقديرات:**
- Story Points: 2
- الأولوية: High
- المرحلة: Phase 2

---

### US-3.7: إحصائيات شخصية
**كباحث**، أريد أن أرى إحصائيات عن طلباتي.

**معايير القبول:**
- [ ] عدد الطلبات الإجمالي
- [ ] عدد الطلبات المقبولة
- [ ] عدد الطلبات قيد المراجعة
- [ ] عدد الطلبات المرفوضة
- [ ] معدل القبول (%)

**تقديرات:**
- Story Points: 3
- الأولوية: Low
- المرحلة: Phase 5

---

## Technical Requirements

### Database Schema
```sql
-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'status_change', 'comment_added'
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

### API Endpoints
- `GET /api/researcher/submissions` - جميع طلبات الباحث
- `GET /api/researcher/submissions/:id` - تفاصيل طلب محدد
- `GET /api/researcher/submissions/:id/download` - تحميل ملف البحث
- `GET /api/researcher/notifications` - جميع الإشعارات
- `PUT /api/researcher/notifications/:id/read` - وضع علامة مقروء
- `GET /api/researcher/stats` - إحصائيات الباحث

### UI Components
- SubmissionsList
- SubmissionDetails
- SubmissionCard
- StatusBadge
- NotificationBell
- StatsWidget

---

## Acceptance Criteria
- [ ] جميع User Stories مكتملة ومختبرة
- [ ] الواجهة سريعة وسلسة
- [ ] البيانات محمية (الباحث يرى طلباته فقط)
- [ ] التصميم متجاوب على جميع الأجهزة
- [ ] الإشعارات تعمل بشكل فوري

## Testing Requirements
- [ ] Unit tests لجميع الوظائف
- [ ] Integration tests للـ API
- [ ] UI/UX testing
- [ ] Performance testing للإشعارات الفورية

## Dependencies
- Epic 1: Authentication
- Epic 2: Research Submission

## Risks & Mitigation
- **خطر**: بطء تحميل الصفحة مع كثرة الطلبات
  - **التخفيف**: pagination، lazy loading
- **خطر**: تأخر الإشعارات
  - **التخفيف**: استخدام Supabase Realtime

