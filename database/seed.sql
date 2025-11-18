-- ============================================
-- Seed Data for Arab Research Publishing Platform
-- ============================================
-- This file contains sample data for testing

BEGIN;

-- ============================================
-- 1. CREATE TEST USERS
-- ============================================

-- Admin User (password: Admin@123)
INSERT INTO users (id, username, email, national_id, phone, password_hash, email_verified, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin',
  'admin@arabresearch.com',
  '1000000000',
  '0500000000',
  crypt('Admin@123', gen_salt('bf')),
  true,
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Test Researcher 1
INSERT INTO users (id, username, email, national_id, phone, password_hash, email_verified, role)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'ahmad_mohammed',
  'ahmad@example.com',
  '1234567890',
  '0501234567',
  crypt('Test@123', gen_salt('bf')),
  true,
  'researcher'
) ON CONFLICT (email) DO NOTHING;

-- Test Researcher 2
INSERT INTO users (id, username, email, national_id, phone, password_hash, email_verified, role)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'fatima_ali',
  'fatima@example.com',
  '1234567891',
  '0501234568',
  crypt('Test@123', gen_salt('bf')),
  true,
  'researcher'
) ON CONFLICT (email) DO NOTHING;

-- Test Researcher 3
INSERT INTO users (id, username, email, national_id, phone, password_hash, email_verified, role)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'mohammed_hassan',
  'mohammed@example.com',
  '1234567892',
  '0501234569',
  crypt('Test@123', gen_salt('bf')),
  true,
  'researcher'
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 2. CREATE NOTIFICATION PREFERENCES
-- ============================================

INSERT INTO notification_preferences (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- 3. CREATE TEST SUBMISSIONS
-- ============================================

-- Submission 1: Pending
INSERT INTO submissions (
  user_id, full_name, country, email, gender, id_number,
  research_type, category, main_researcher, general_specialization,
  detailed_specialization, file_url, file_name, file_size,
  status, reference_number, declaration_accepted, declaration_timestamp
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'د. أحمد محمد',
  'المملكة العربية السعودية',
  'ahmad@example.com',
  'ذكر',
  '1234567890',
  'رسالة ماجستير',
  'الهندسة وتقنية المعلومات',
  'د. أحمد محمد',
  'علوم الحاسب',
  'الذكاء الاصطناعي',
  'https://example.com/research1.pdf',
  'ai_research.pdf',
  2048000,
  'pending',
  'REF-2025-0001',
  true,
  NOW()
);

-- Submission 2: Approved
INSERT INTO submissions (
  user_id, full_name, country, email, gender, id_number,
  research_type, category, main_researcher, general_specialization,
  detailed_specialization, file_url, file_name, file_size,
  status, reference_number, declaration_accepted, declaration_timestamp
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  'د. فاطمة علي',
  'مصر',
  'fatima@example.com',
  'أنثى',
  '1234567891',
  'أطروحة دكتوراه',
  'العلوم الصحية',
  'د. فاطمة علي',
  'الطب',
  'أمراض القلب',
  'https://example.com/research2.pdf',
  'medical_research.pdf',
  3072000,
  'approved',
  'REF-2025-0002',
  true,
  NOW() - INTERVAL '5 days'
);

-- Submission 3: Needs Revision
INSERT INTO submissions (
  user_id, full_name, country, email, gender, id_number,
  research_type, category, main_researcher, general_specialization,
  detailed_specialization, file_url, file_name, file_size,
  status, reference_number, declaration_accepted, declaration_timestamp
) VALUES (
  '00000000-0000-0000-0000-000000000004',
  'د. محمد حسن',
  'الإمارات العربية المتحدة',
  'mohammed@example.com',
  'ذكر',
  '1234567892',
  'ورقة علمية',
  'الاقتصاد المالي',
  'د. محمد حسن',
  'الاقتصاد المالي',
  'الاقتصاد الرقمي',
  'https://example.com/research3.pdf',
  'economy_research.pdf',
  1536000,
  'needs_revision',
  'REF-2025-0003',
  true,
  NOW() - INTERVAL '3 days'
);

-- Submission 4: Rejected
INSERT INTO submissions (
  user_id, full_name, country, email, gender, id_number,
  research_type, category, main_researcher, general_specialization,
  detailed_specialization, file_url, file_name, file_size,
  status, reference_number, declaration_accepted, declaration_timestamp
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'د. أحمد محمد',
  'المملكة العربية السعودية',
  'ahmad@example.com',
  'ذكر',
  '1234567890',
  'كتاب',
  'التاريخ',
  'د. أحمد محمد',
  'التاريخ الإسلامي',
  'التاريخ الأندلسي',
  'https://example.com/research4.pdf',
  'history_book.pdf',
  5120000,
  'rejected',
  'REF-2025-0004',
  true,
  NOW() - INTERVAL '7 days'
);

-- Draft Submission
INSERT INTO submissions (
  user_id, full_name, country, email, gender, id_number,
  research_type, category, main_researcher, general_specialization,
  detailed_specialization, file_url, file_name, file_size,
  status, reference_number, declaration_accepted, declaration_timestamp, is_draft
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'د. أحمد محمد',
  'المملكة العربية السعودية',
  'ahmad@example.com',
  'ذكر',
  '1234567890',
  'رسالة ماجستير',
  'الدراسات الإسلامية العربية',
  'د. أحمد محمد',
  'القرآن وعلومه',
  'التفسير',
  'https://example.com/draft.pdf',
  'draft_research.pdf',
  1024000,
  'draft',
  'REF-2025-0005',
  false,
  NOW(),
  true
);

-- ============================================
-- 4. CREATE ADMIN COMMENTS
-- ============================================

-- Comment on approved submission
INSERT INTO admin_comments (submission_id, admin_id, comment, is_visible_to_researcher)
SELECT 
  s.id,
  '00000000-0000-0000-0000-000000000001',
  'بحث ممتاز ومنهجية علمية قوية. تمت الموافقة على النشر.',
  true
FROM submissions s WHERE s.reference_number = 'REF-2025-0002';

-- Comment on needs revision submission
INSERT INTO admin_comments (submission_id, admin_id, comment, is_visible_to_researcher)
SELECT 
  s.id,
  '00000000-0000-0000-0000-000000000001',
  'الرجاء تحديث الفصل الثالث وإضافة مراجع حديثة.',
  true
FROM submissions s WHERE s.reference_number = 'REF-2025-0003';

-- Comment on rejected submission
INSERT INTO admin_comments (submission_id, admin_id, comment, is_visible_to_researcher)
SELECT 
  s.id,
  '00000000-0000-0000-0000-000000000001',
  'المحتوى لا يتوافق مع معايير النشر. يرجى مراجعة الإرشادات.',
  true
FROM submissions s WHERE s.reference_number = 'REF-2025-0004';

-- ============================================
-- 5. CREATE STATUS HISTORY
-- ============================================

-- History for approved submission
INSERT INTO status_history (submission_id, admin_id, old_status, new_status, changed_at)
SELECT 
  s.id,
  '00000000-0000-0000-0000-000000000001',
  'pending',
  'approved',
  NOW() - INTERVAL '1 day'
FROM submissions s WHERE s.reference_number = 'REF-2025-0002';

-- History for needs revision submission
INSERT INTO status_history (submission_id, admin_id, old_status, new_status, changed_at)
SELECT 
  s.id,
  '00000000-0000-0000-0000-000000000001',
  'pending',
  'needs_revision',
  NOW() - INTERVAL '2 days'
FROM submissions s WHERE s.reference_number = 'REF-2025-0003';

-- History for rejected submission
INSERT INTO status_history (submission_id, admin_id, old_status, new_status, changed_at)
SELECT 
  s.id,
  '00000000-0000-0000-0000-000000000001',
  'pending',
  'rejected',
  NOW() - INTERVAL '5 days'
FROM submissions s WHERE s.reference_number = 'REF-2025-0004';

-- ============================================
-- 6. CREATE NOTIFICATIONS
-- ============================================

-- Notification for approved submission
INSERT INTO notifications (user_id, submission_id, type, message, is_read)
SELECT 
  s.user_id,
  s.id,
  'status_change',
  'تم قبول بحثك: ' || s.reference_number,
  false
FROM submissions s WHERE s.reference_number = 'REF-2025-0002';

-- Notification for needs revision
INSERT INTO notifications (user_id, submission_id, type, message, is_read)
SELECT 
  s.user_id,
  s.id,
  'status_change',
  'طلبك يحتاج مراجعة: ' || s.reference_number,
  false
FROM submissions s WHERE s.reference_number = 'REF-2025-0003';

-- Notification for comment added
INSERT INTO notifications (user_id, submission_id, type, message, is_read)
SELECT 
  s.user_id,
  s.id,
  'comment_added',
  'تم إضافة تعليق جديد على طلبك: ' || s.reference_number,
  false
FROM submissions s WHERE s.reference_number = 'REF-2025-0003';

-- ============================================
-- 7. CREATE AUDIT LOG ENTRIES
-- ============================================

INSERT INTO audit_log (admin_id, action, entity_type, entity_id, details)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  'status_change',
  'submission',
  s.id,
  jsonb_build_object('old_status', 'pending', 'new_status', 'approved')
FROM submissions s WHERE s.reference_number = 'REF-2025-0002';

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify users
SELECT COUNT(*) as total_users, 
       COUNT(*) FILTER (WHERE role = 'admin') as admins,
       COUNT(*) FILTER (WHERE role = 'researcher') as researchers
FROM users;

-- Verify submissions
SELECT COUNT(*) as total_submissions,
       COUNT(*) FILTER (WHERE status = 'pending') as pending,
       COUNT(*) FILTER (WHERE status = 'approved') as approved,
       COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
       COUNT(*) FILTER (WHERE status = 'needs_revision') as needs_revision,
       COUNT(*) FILTER (WHERE is_draft = true) as drafts
FROM submissions;

-- Verify comments
SELECT COUNT(*) as total_comments FROM admin_comments;

-- Verify notifications
SELECT COUNT(*) as total_notifications FROM notifications;

