-- ============================================
-- Setup Avatars Storage Bucket
-- إعداد مجلد تخزين الصور الشخصية
-- ============================================
-- 
-- تعليمات:
-- 1. افتح Supabase Dashboard
-- 2. اذهب إلى SQL Editor
-- 3. انسخ والصق هذا الكود
-- 4. اضغط Run
-- ============================================

-- إنشاء bucket للصور الشخصية
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true,  -- Public bucket
  2097152,  -- 2 MB بالبايت
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- ============================================
-- Storage Policies (سياسات الأمان)
-- ============================================

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

-- ============================================
-- التحقق من الإنشاء
-- ============================================
-- بعد التنفيذ، تحقق من:
-- 1. اذهب إلى Storage في Supabase Dashboard
-- 2. تأكد من وجود bucket باسم "avatars"
-- 3. تأكد من أنه Public
-- ============================================

