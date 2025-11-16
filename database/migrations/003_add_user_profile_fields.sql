-- ============================================
-- Add Gender and Country fields to Users Table
-- Migration: 003_add_user_profile_fields
-- ============================================

-- Add gender column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('ذكر', 'أنثى'));

-- Add country column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- Add comment to describe new fields
COMMENT ON COLUMN users.gender IS 'جنس المستخدم (ذكر/أنثى)';
COMMENT ON COLUMN users.country IS 'دولة المستخدم';

-- Add index for country (useful for statistics)
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);

