# Epic 2: Research Submission System

## Overview
نظام لتقديم الأبحاث العلمية يشمل نموذج شامل لإدخال البيانات ورفع الملفات.

## Business Value
تمكين الباحثين من تقديم أبحاثهم بطريقة منظمة ومعيارية، مما يسهل عملية المراجعة.

## User Stories

### US-2.1: نموذج تقديم البحث
**كباحث**، أريد أن أتمكن من ملء نموذج تقديم البحث حتى أرسل بحثي للمراجعة.

**معايير القبول:**
- [ ] نموذج يحتوي على جميع الحقول المطلوبة:
  - الاسم الكامل
  - الدولة
  - البريد الإلكتروني
  - الجنس
  - رقم الهوية
  - نوع البحث (ورقة علمية، رسالة ماجستير، أطروحة دكتوراه، كتاب)
  - فئة البحث (العلوم الصحية، العلوم الاجتماعية، الدراسات الإسلامية، التاريخ، الاقتصاد، الهندسة وتقنية المعلومات، أخرى)
  - اسم الباحث الرئيسي
  - التخصص العام
  - التخصص الدقيق
- [ ] التحقق من صحة البيانات لكل حقل
- [ ] واجهة سهلة الاستخدام ومتجاوبة

**تقديرات:**
- Story Points: 8
- الأولوية: High
- المرحلة: Phase 2

---

### US-2.2: رفع ملف البحث
**كباحث**، أريد أن أتمكن من رفع ملف البحث (PDF أو DOCX) مع طلب التقديم.

**معايير القبول:**
- [ ] إمكانية رفع ملفات PDF و DOCX فقط
- [ ] حد أقصى لحجم الملف (مثلاً 50MB)
- [ ] التحقق من نوع الملف
- [ ] شريط تقدم عند رفع الملف
- [ ] حفظ الملف في Supabase Storage
- [ ] إمكانية معاينة اسم الملف قبل الإرسال

**تقديرات:**
- Story Points: 8
- الأولوية: High
- المرحلة: Phase 2

---

### US-2.3: إقرار الدقة
**كباحث**، أريد أن أوافق على إقرار الدقة قبل إرسال البحث حتى أؤكد صحة المعلومات.

**معايير القبول:**
- [ ] عرض نص الإقرار بوضوح:
  "أنا، [اسم الباحث]، أقر بأن جميع المعلومات المقدمة دقيقة وأن هذا البحث/الكتاب من عملي الأصلي. إذا ثبت خلاف ذلك، أتحمل المسؤولية الكاملة."
- [ ] checkbox للموافقة (إلزامي)
- [ ] تعطيل زر الإرسال حتى الموافقة على الإقرار
- [ ] حفظ وقت الموافقة في قاعدة البيانات

**تقديرات:**
- Story Points: 3
- الأولوية: High
- المرحلة: Phase 2

---

### US-2.4: إرسال الطلب
**كباحث**، أريد أن أرسل طلب التقديم وأتلقى تأكيداً بنجاح الإرسال.

**معايير القبول:**
- [ ] التحقق من اكتمال جميع الحقول الإلزامية
- [ ] حفظ البيانات في جدول submissions
- [ ] حفظ الملف في Supabase Storage
- [ ] تعيين الحالة الافتراضية "pending"
- [ ] عرض رسالة تأكيد للباحث
- [ ] إرسال بريد إلكتروني تأكيدي
- [ ] إعطاء رقم مرجعي للطلب

**تقديرات:**
- Story Points: 5
- الأولوية: High
- المرحلة: Phase 2

---

### US-2.5: حفظ مسودة
**كباحث**، أريد أن أتمكن من حفظ النموذج كمسودة للعودة إليه لاحقاً.

**معايير القبول:**
- [ ] زر "حفظ كمسودة"
- [ ] حفظ البيانات المدخلة حتى لو كانت غير مكتملة
- [ ] إمكانية استرجاع المسودات من لوحة التحكم
- [ ] حد أقصى للمسودات (مثلاً 5 مسودات)

**تقديرات:**
- Story Points: 5
- الأولوية: Low
- المرحلة: Phase 5

---

## Technical Requirements

### Database Schema
```sql
-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  id_number VARCHAR(50) NOT NULL,
  research_type VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  main_researcher VARCHAR(255) NOT NULL,
  general_specialization VARCHAR(255) NOT NULL,
  detailed_specialization VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, needs_revision
  admin_comment TEXT,
  declaration_accepted BOOLEAN NOT NULL,
  declaration_timestamp TIMESTAMP NOT NULL,
  reference_number VARCHAR(50) UNIQUE NOT NULL,
  is_draft BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_reference_number ON submissions(reference_number);
```

### API Endpoints
- `POST /api/submissions/create` - إنشاء طلب جديد
- `POST /api/submissions/draft` - حفظ مسودة
- `GET /api/submissions/drafts` - الحصول على المسودات
- `POST /api/submissions/upload` - رفع ملف
- `DELETE /api/submissions/draft/:id` - حذف مسودة

### File Storage
- Supabase Storage bucket: `research-files`
- تنظيم الملفات: `/user_id/submission_id/filename`
- سياسة الأمان: المستخدم فقط يمكنه رفع الملفات إلى مجلده

---

## Acceptance Criteria
- [ ] جميع User Stories مكتملة ومختبرة
- [ ] رفع الملفات يعمل بشكل آمن
- [ ] التحقق من صحة البيانات شامل
- [ ] الواجهة سهلة الاستخدام وباللغة العربية
- [ ] رسائل الخطأ واضحة

## Testing Requirements
- [ ] Unit tests لوظائف التحقق من البيانات
- [ ] Integration tests لرفع الملفات
- [ ] UI/UX testing للنموذج
- [ ] Load testing لرفع الملفات الكبيرة

## Dependencies
- Epic 1: Authentication (يجب أن يكون المستخدم مسجلاً ومسجل الدخول)

## Risks & Mitigation
- **خطر**: رفع ملفات ضارة
  - **التخفيف**: فحص نوع الملف، استخدام antivirus scanning
- **خطر**: فشل رفع الملفات الكبيرة
  - **التخفيف**: chunked upload، إعادة المحاولة تلقائياً
- **خطر**: فقدان البيانات أثناء الإدخال
  - **التخفيف**: auto-save، حفظ محلي مؤقت

