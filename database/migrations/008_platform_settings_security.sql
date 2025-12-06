-- Migration: 008_platform_settings_security
-- Description: Create platform_settings table and add security settings (2FA, session duration, password length)
-- Date: 2025-01-27

BEGIN;

-- ============================================
-- 1. Create platform_settings table if not exists
-- ============================================

CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_platform_settings_key ON platform_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_platform_settings_updated_at ON platform_settings(updated_at DESC);

-- ============================================
-- 2. Add trigger to update updated_at automatically
-- ============================================

CREATE OR REPLACE FUNCTION update_platform_settings_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_platform_settings_updated_at ON platform_settings;

CREATE TRIGGER trg_update_platform_settings_updated_at
BEFORE UPDATE ON platform_settings
FOR EACH ROW
EXECUTE FUNCTION update_platform_settings_updated_at();

-- ============================================
-- 3. Insert default security settings
-- ============================================

-- Two-factor authentication (disabled by default)
INSERT INTO platform_settings (setting_key, setting_value, setting_type, description)
VALUES ('two_factor_auth', 'false', 'boolean', 'تفعيل المصادقة الثنائية عبر البريد الإلكتروني')
ON CONFLICT (setting_key) DO NOTHING;

-- Session duration in hours (default 24 hours)
INSERT INTO platform_settings (setting_key, setting_value, setting_type, description)
VALUES ('session_duration_hours', '24', 'number', 'مدة بقاء المستخدم مسجل الدخول (بالساعات)')
ON CONFLICT (setting_key) DO NOTHING;

-- Minimum password length (default 8 characters)
INSERT INTO platform_settings (setting_key, setting_value, setting_type, description)
VALUES ('minimum_password_length', '8', 'number', 'الحد الأدنى لطول كلمة المرور (عدد الأحرف)')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- 4. Enable RLS on platform_settings
-- ============================================

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read settings (public information)
CREATE POLICY "Anyone can view platform settings"
  ON platform_settings FOR SELECT
  USING (true);

-- Policy: Only admins can insert/update settings
CREATE POLICY "Only admins can manage platform settings"
  ON platform_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

COMMIT;
