-- Migration: Fix Storage Policies for File Upload
-- Created: 2025-11-16
-- Description: إصلاح سياسات التخزين للسماح برفع الملفات

-- Update bucket to be public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'research-files';

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload files to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all files" ON storage.objects;

-- Policy: Users can upload files to their own folder (including temp folder)
CREATE POLICY "Users can upload their own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'research-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can update their own files
CREATE POLICY "Users can update their own files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'research-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'research-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Anyone can view files (public bucket)
CREATE POLICY "Anyone can view files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'research-files');

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage all files"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'research-files' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

