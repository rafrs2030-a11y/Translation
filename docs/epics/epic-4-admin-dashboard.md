# Epic 4: Admin Dashboard

## Overview
لوحة تحكم شاملة للمسؤولين لمراجعة الطلبات، تحديث الحالات، إضافة التعليقات، وإدارة المنصة.

## Business Value
تمكين المسؤولين من مراجعة الأبحاث بكفاءة وشفافية، مما يحسن جودة المحتوى المنشور.

## User Stories

### US-4.1: عرض جميع الطلبات
**كمسؤول**، أريد أن أرى قائمة بجميع الطلبات المقدمة من جميع الباحثين.

**معايير القبول:**
- [ ] جدول شامل يعرض جميع الطلبات مع:
  - رقم المرجع
  - اسم الباحث
  - نوع البحث
  - الفئة
  - تاريخ التقديم
  - الحالة الحالية
  - آخر تحديث
- [ ] ترتيب افتراضي حسب تاريخ التقديم (الأحدث أولاً)
- [ ] إمكانية الترتيب حسب أي عمود
- [ ] pagination للطلبات الكثيرة
- [ ] عرض عدد الطلبات حسب الحالة

**تقديرات:**
- Story Points: 5
- الأولوية: High
- المرحلة: Phase 3

---

### US-4.2: فلترة وبحث متقدم
**كمسؤول**، أريد أن أتمكن من تصفية الطلبات والبحث فيها بمعايير متقدمة.

**معايير القبول:**
- [ ] فلتر حسب الحالة
- [ ] فلتر حسب نوع البحث
- [ ] فلتر حسب الفئة
- [ ] فلتر حسب التاريخ (من - إلى)
- [ ] بحث برقم المرجع
- [ ] بحث باسم الباحث
- [ ] بحث بالبريد الإلكتروني
- [ ] إعادة تعيين جميع الفلاتر

**تقديرات:**
- Story Points: 5
- الأولوية: Medium
- المرحلة: Phase 3

---

### US-4.3: فتح ومراجعة الطلب
**كمسؤول**، أريد أن أفتح طلباً محدداً لمراجعة جميع تفاصيله.

**معايير القبول:**
- [ ] صفحة تفاصيل كاملة تعرض:
  - جميع بيانات النموذج
  - معلومات الباحث (اسم، بريد، رقم هاتف)
  - تاريخ التقديم والتحديث
  - الحالة الحالية
  - التعليقات السابقة
  - سجل التغييرات (Timeline)
- [ ] واجهة نظيفة وسهلة القراءة
- [ ] إمكانية الطباعة أو التصدير PDF

**تقديرات:**
- Story Points: 5
- الأولوية: High
- المرحلة: Phase 3

---

### US-4.4: تحميل ومعاينة ملف البحث
**كمسؤول**، أريد أن أتمكن من تحميل ومعاينة ملف البحث المرفق.

**معايير القبول:**
- [ ] زر "تحميل الملف"
- [ ] عرض اسم الملف، النوع، والحجم
- [ ] إمكانية معاينة PDF في المتصفح
- [ ] تحميل سريع وآمن

**تقديرات:**
- Story Points: 3
- الأولوية: High
- المرحلة: Phase 3

---

### US-4.5: تحديث حالة الطلب
**كمسؤول**، أريد أن أتمكن من تغيير حالة الطلب.

**معايير القبول:**
- [ ] قائمة منسدلة للحالات:
  - قيد المراجعة (pending)
  - مقبول (approved)
  - مرفوض (rejected)
  - يحتاج مراجعة (needs_revision)
- [ ] تأكيد قبل تغيير الحالة
- [ ] تحديث فوري في قاعدة البيانات
- [ ] إرسال إشعار للباحث عبر البريد الإلكتروني
- [ ] تسجيل التغيير في سجل التاريخ

**تقديرات:**
- Story Points: 5
- الأولوية: High
- المرحلة: Phase 3

---

### US-4.6: إضافة تعليقات وملاحظات
**كمسؤول**، أريد أن أضيف تعليقات أو ملاحظات على الطلب لتكون مرئية للباحث.

**معايير القبول:**
- [ ] حقل نصي لإدخال التعليق
- [ ] إمكانية إضافة تعليقات متعددة
- [ ] عرض جميع التعليقات السابقة مع التواريخ
- [ ] عرض اسم المسؤول الذي أضاف التعليق
- [ ] إرسال إشعار للباحث عند إضافة تعليق
- [ ] إمكانية التعديل والحذف للتعليقات الخاصة

**تقديرات:**
- Story Points: 5
- الأولوية: High
- المرحلة: Phase 3

---

### US-4.7: لوحة إحصائيات
**كمسؤول**، أريد أن أرى إحصائيات شاملة عن المنصة.

**معايير القبول:**
- [ ] عدد الطلبات الإجمالي
- [ ] عدد الطلبات قيد المراجعة
- [ ] عدد الطلبات المقبولة
- [ ] عدد الطلبات المرفوضة
- [ ] عدد الباحثين المسجلين
- [ ] إحصائيات حسب نوع البحث (رسم بياني)
- [ ] إحصائيات حسب الفئة (رسم بياني)
- [ ] متوسط وقت المراجعة
- [ ] معدل القبول %

**تقديرات:**
- Story Points: 8
- الأولوية: Medium
- المرحلة: Phase 3

---

### US-4.8: إدارة المستخدمين
**كمسؤول رئيسي**، أريد أن أتمكن من إدارة حسابات المسؤولين.

**معايير القبول:**
- [ ] عرض قائمة المسؤولين
- [ ] إضافة مسؤول جديد
- [ ] تعطيل/تفعيل حساب مسؤول
- [ ] تعيين أدوار ومستويات صلاحيات
- [ ] سجل نشاط المسؤولين (Audit Log)

**تقديرات:**
- Story Points: 8
- الأولوية: Low
- المرحلة: Phase 5

---

### US-4.9: تصدير البيانات
**كمسؤول**، أريد أن أتمكن من تصدير البيانات للتحليل أو الأرشفة.

**معايير القبول:**
- [ ] تصدير قائمة الطلبات إلى Excel/CSV
- [ ] تصدير إحصائيات إلى PDF
- [ ] تصدير حسب الفلاتر المطبقة
- [ ] تحميل فوري للملف

**تقديرات:**
- Story Points: 5
- الأولوية: Low
- المرحلة: Phase 5

---

## Technical Requirements

### Database Schema
```sql
-- Admin comments table
CREATE TABLE admin_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  comment TEXT NOT NULL,
  is_visible_to_researcher BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Status change history table
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Audit log table
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_comments_submission ON admin_comments(submission_id);
CREATE INDEX idx_status_history_submission ON status_history(submission_id);
CREATE INDEX idx_audit_log_admin ON audit_log(admin_id);
```

### API Endpoints
- `GET /api/admin/submissions` - جميع الطلبات
- `GET /api/admin/submissions/:id` - تفاصيل طلب محدد
- `PUT /api/admin/submissions/:id/status` - تحديث الحالة
- `POST /api/admin/submissions/:id/comment` - إضافة تعليق
- `GET /api/admin/submissions/:id/comments` - جميع التعليقات
- `PUT /api/admin/comments/:id` - تعديل تعليق
- `DELETE /api/admin/comments/:id` - حذف تعليق
- `GET /api/admin/stats` - الإحصائيات
- `GET /api/admin/users` - قائمة المستخدمين
- `POST /api/admin/users` - إضافة مسؤول
- `PUT /api/admin/users/:id` - تحديث مستخدم
- `GET /api/admin/audit-log` - سجل التدقيق
- `GET /api/admin/export/submissions` - تصدير الطلبات

### UI Components
- AdminSubmissionsList
- SubmissionReviewPage
- StatusChangeModal
- CommentBox
- StatsChart
- UserManagement
- ExportButton

---

## Acceptance Criteria
- [ ] جميع User Stories مكتملة ومختبرة
- [ ] واجهة احترافية وسهلة الاستخدام
- [ ] الإشعارات تُرسل للباحثين فوراً
- [ ] جميع الإجراءات مسجلة في Audit Log
- [ ] صلاحيات المسؤولين محددة بوضوح

## Testing Requirements
- [ ] Unit tests لجميع الوظائف
- [ ] Integration tests للـ API
- [ ] Authorization tests
- [ ] UI/UX testing
- [ ] Load testing

## Dependencies
- Epic 1: Authentication
- Epic 2: Research Submission
- Epic 3: Researcher Dashboard (للإشعارات)

## Risks & Mitigation
- **خطر**: تعديل غير مصرح به للطلبات
  - **التخفيف**: Role-based access control، Audit Log
- **خطر**: فقدان التعليقات
  - **التخفيف**: نسخ احتياطية دورية، soft delete
- **خطر**: بطء عرض البيانات الكثيرة
  - **التخفيف**: Pagination، indexing، caching

