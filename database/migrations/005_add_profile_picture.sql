-- ============================================
-- Add Profile Picture Support
-- Migration: 005_add_profile_picture
-- Description: إضافة دعم الصور الشخصية للمستخدمين
-- ============================================

-- Add profile_picture column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Add comment
COMMENT ON COLUMN users.profile_picture IS 'رابط الصورة الشخصية للمستخدم';

-- ============================================
-- STORAGE BUCKET FOR PROFILE PICTURES
-- ============================================

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars bucket
-- Policy: Users can upload their own avatar
CREATE POLICY IF NOT EXISTS "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can update their own avatar
CREATE POLICY IF NOT EXISTS "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own avatar
CREATE POLICY IF NOT EXISTS "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Anyone can view avatars (public bucket)
CREATE POLICY IF NOT EXISTS "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Policy: Admins can manage all avatars
CREATE POLICY IF NOT EXISTS "Admins can manage all avatars"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'avatars' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

