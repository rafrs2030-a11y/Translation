-- ============================================
-- Arab Research Publishing Platform
-- Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  national_id VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  role VARCHAR(20) DEFAULT 'researcher' CHECK (role IN ('researcher', 'admin', 'super_admin')),
  gender VARCHAR(10) CHECK (gender IN ('ذكر', 'أنثى')),
  country VARCHAR(100),
  profile_picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email_verified ON users(email_verified);
CREATE INDEX idx_users_country ON users(country);

-- ============================================
-- 2. SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('ذكر', 'أنثى')),
  id_number VARCHAR(50) NOT NULL,
  research_type VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  research_owner_type VARCHAR(20) CHECK (research_owner_type IN ('أفراد', 'أعمال')),
  business_type VARCHAR(50) CHECK (business_type IN ('جهة حكومية', 'هيئة', 'قطاع خاص', 'قطاع غير ربحي', 'جامعة حكومية', 'جامعة خاصة')),
  main_researcher VARCHAR(255) NOT NULL,
  general_specialization VARCHAR(255) NOT NULL,
  detailed_specialization VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_revision', 'draft')),
  admin_comment TEXT,
  declaration_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  declaration_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  reference_number VARCHAR(50) UNIQUE NOT NULL,
  is_draft BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for submissions table
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_reference_number ON submissions(reference_number);
CREATE INDEX idx_submissions_is_draft ON submissions(is_draft);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_submissions_research_type ON submissions(research_type);
CREATE INDEX idx_submissions_category ON submissions(category);

-- ============================================
-- 3. ADMIN COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  comment TEXT NOT NULL,
  is_visible_to_researcher BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for admin_comments table
CREATE INDEX idx_admin_comments_submission_id ON admin_comments(submission_id);
CREATE INDEX idx_admin_comments_admin_id ON admin_comments(admin_id);
CREATE INDEX idx_admin_comments_created_at ON admin_comments(created_at DESC);

-- ============================================
-- 4. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('status_change', 'comment_added', 'new_submission', 'reminder', 'system')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for notifications table
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ============================================
-- 5. NOTIFICATION PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT TRUE,
  in_app_enabled BOOLEAN DEFAULT TRUE,
  status_change_email BOOLEAN DEFAULT TRUE,
  comments_email BOOLEAN DEFAULT TRUE,
  reminders_email BOOLEAN DEFAULT TRUE,
  news_email BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for notification_preferences table
CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);

-- ============================================
-- 6. STATUS HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for status_history table
CREATE INDEX idx_status_history_submission_id ON status_history(submission_id);
CREATE INDEX idx_status_history_admin_id ON status_history(admin_id);
CREATE INDEX idx_status_history_changed_at ON status_history(changed_at DESC);

-- ============================================
-- 7. AUDIT LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for audit_log table
CREATE INDEX idx_audit_log_admin_id ON audit_log(admin_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_entity_type ON audit_log(entity_type);
CREATE INDEX idx_audit_log_entity_id ON audit_log(entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- ============================================
-- 8. EMAIL LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email_type VARCHAR(50) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed', 'queued')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for email_log table
CREATE INDEX idx_email_log_user_id ON email_log(user_id);
CREATE INDEX idx_email_log_status ON email_log(status);
CREATE INDEX idx_email_log_email_type ON email_log(email_type);
CREATE INDEX idx_email_log_created_at ON email_log(created_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to submissions table
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to admin_comments table
CREATE TRIGGER update_admin_comments_updated_at
  BEFORE UPDATE ON admin_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to notification_preferences table
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Submissions policies
CREATE POLICY "Users can view their own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Users can insert their own submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own draft submissions"
  ON submissions FOR UPDATE
  USING (auth.uid() = user_id AND is_draft = true);

CREATE POLICY "Admins can update submissions"
  ON submissions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Admin comments policies
CREATE POLICY "Researchers can view comments on their submissions"
  ON admin_comments FOR SELECT
  USING (
    is_visible_to_researcher = true AND
    EXISTS (
      SELECT 1 FROM submissions 
      WHERE submissions.id = admin_comments.submission_id 
      AND submissions.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all comments"
  ON admin_comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admins can insert comments"
  ON admin_comments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admins can update their own comments"
  ON admin_comments FOR UPDATE
  USING (admin_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Notification preferences policies
CREATE POLICY "Users can view their own preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Status history policies
CREATE POLICY "Users can view history of their submissions"
  ON status_history FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM submissions 
    WHERE submissions.id = status_history.submission_id 
    AND submissions.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all history"
  ON status_history FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Audit log policies (admin only)
CREATE POLICY "Only admins can view audit logs"
  ON audit_log FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- ============================================
-- STORAGE BUCKET FOR RESEARCH FILES
-- ============================================

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('research-files', 'research-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload files to their own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'research-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'research-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins can view all files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'research-files' AND
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate reference number
CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  random_num TEXT;
BEGIN
  year := EXTRACT(YEAR FROM NOW())::TEXT;
  random_num := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN 'REF-' || year || '-' || random_num;
END;
$$ LANGUAGE plpgsql;

-- Function to get submission statistics
CREATE OR REPLACE FUNCTION get_submission_stats()
RETURNS TABLE (
  total BIGINT,
  pending BIGINT,
  approved BIGINT,
  rejected BIGINT,
  needs_revision BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT AS pending,
    COUNT(*) FILTER (WHERE status = 'approved')::BIGINT AS approved,
    COUNT(*) FILTER (WHERE status = 'rejected')::BIGINT AS rejected,
    COUNT(*) FILTER (WHERE status = 'needs_revision')::BIGINT AS needs_revision
  FROM submissions
  WHERE is_draft = false;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS
-- ============================================

-- View for submission with user info
CREATE OR REPLACE VIEW submissions_with_user AS
SELECT 
  s.*,
  u.username,
  u.email as user_email,
  u.phone as user_phone
FROM submissions s
JOIN users u ON s.user_id = u.id;

-- View for recent notifications
CREATE OR REPLACE VIEW recent_notifications AS
SELECT 
  n.*,
  s.reference_number,
  s.main_researcher
FROM notifications n
LEFT JOIN submissions s ON n.submission_id = s.id
WHERE n.created_at > NOW() - INTERVAL '30 days'
ORDER BY n.created_at DESC;

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Create default admin user (password: Admin@123)
-- Note: You should change this password after first login
INSERT INTO users (username, email, national_id, phone, password_hash, email_verified, role)
VALUES (
  'admin',
  'admin@arabresearch.com',
  '1000000000',
  '0500000000',
  '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', -- Hash for 'Admin@123'
  true,
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- GRANTS (Optional - adjust based on your needs)
-- ============================================

-- Grant appropriate permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'جدول المستخدمين - الباحثين والمسؤولين';
COMMENT ON TABLE submissions IS 'جدول طلبات تقديم الأبحاث';
COMMENT ON TABLE admin_comments IS 'جدول تعليقات المسؤولين على الطلبات';
COMMENT ON TABLE notifications IS 'جدول الإشعارات';
COMMENT ON TABLE notification_preferences IS 'جدول تفضيلات الإشعارات للمستخدمين';
COMMENT ON TABLE status_history IS 'جدول سجل تغييرات حالة الطلبات';
COMMENT ON TABLE audit_log IS 'جدول سجل جميع العمليات للمراجعة';
COMMENT ON TABLE email_log IS 'جدول سجل رسائل البريد الإلكتروني المرسلة';

