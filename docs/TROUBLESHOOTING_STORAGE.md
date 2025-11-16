# Troubleshooting Storage Issues

## Common Storage Errors and Solutions

### Error: "null value in column 'file_url' violates not-null constraint"

**Cause:** The storage bucket is not properly configured or doesn't exist.

**Solution:**

1. **Verify the bucket exists:**
   ```bash
   # Go to Supabase Dashboard
   # Navigate to: Storage → Buckets
   # Check if 'research-files' bucket exists
   ```

2. **Create the bucket if missing:**
   - Click "New bucket"
   - Name: `research-files`
   - Public: `false` (unchecked)
   - Click "Create bucket"

3. **Run the storage policies:**
   - Go to SQL Editor in Supabase Dashboard
   - Run the storage section from `database/schema.sql`:

   ```sql
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
   ```

### Error: "فشل رفع الملف" (File upload failed)

**Possible Causes:**
1. File size exceeds 10MB limit
2. File type not supported (only PDF and DOCX allowed)
3. Network connection issue
4. Storage bucket permissions issue

**Solutions:**

1. **Check file size:**
   - Maximum allowed: 10MB
   - Compress large files before uploading

2. **Check file type:**
   - Allowed: `.pdf`, `.docx`, `.doc`
   - Convert other formats to PDF or DOCX

3. **Check network:**
   - Ensure stable internet connection
   - Try again after a few moments

4. **Check permissions:**
   - Verify user is authenticated
   - Check storage policies in Supabase Dashboard

### Error: "فشل الحصول على رابط الملف من التخزين"

**Cause:** Storage returned null URL after upload.

**Solutions:**

1. **Verify storage bucket configuration:**
   ```sql
   -- Check if bucket exists
   SELECT * FROM storage.buckets WHERE id = 'research-files';
   ```

2. **Check Supabase project status:**
   - Ensure project is not paused
   - Verify API keys are correct in environment

3. **Test storage connection:**
   ```javascript
   // In browser console
   const { data, error } = await supabase.storage
     .from('research-files')
     .list();
   console.log('Storage test:', { data, error });
   ```

### Error: "Storage object not found" when downloading

**Cause:** File path doesn't exist or user doesn't have permission.

**Solutions:**

1. **Check file exists:**
   ```sql
   SELECT * FROM storage.objects 
   WHERE bucket_id = 'research-files' 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

2. **Verify storage policies:**
   - Users should be able to view their own files
   - Admins should be able to view all files

3. **Check file path format:**
   - Should be: `{user_id}/temp/{filename}` for uploads
   - Or: `{user_id}/{submission_id}/{filename}` for submissions

## Verification Steps

### 1. Test Storage Access

```javascript
// Run in browser console (when logged in)
async function testStorage() {
  const user = await supabase.auth.getUser();
  console.log('Current user:', user.data.user?.id);
  
  // List buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  console.log('Buckets:', buckets, bucketsError);
  
  // Test file upload
  const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('research-files')
    .upload(`${user.data.user.id}/temp/test-${Date.now()}.txt`, testFile);
  console.log('Upload test:', uploadData, uploadError);
  
  if (uploadData) {
    // Test getting URL
    const { data: urlData } = supabase.storage
      .from('research-files')
      .getPublicUrl(uploadData.path);
    console.log('URL:', urlData.publicUrl);
  }
}

testStorage();
```

### 2. Check Database Configuration

```sql
-- Verify submissions table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'submissions' AND column_name = 'file_url';

-- Should show: file_url | text | NO

-- Check recent submissions
SELECT id, reference_number, file_url, created_at 
FROM submissions 
ORDER BY created_at DESC 
LIMIT 5;
```

### 3. Monitor Storage Usage

```sql
-- Check storage objects
SELECT 
  COUNT(*) as total_files,
  SUM(metadata->>'size')::bigint as total_size_bytes,
  ROUND(SUM((metadata->>'size')::numeric) / 1024 / 1024, 2) as total_size_mb
FROM storage.objects
WHERE bucket_id = 'research-files';
```

## Best Practices

1. **Always validate file before upload:**
   - Check file size
   - Check file type
   - Check file name format

2. **Handle errors gracefully:**
   - Show user-friendly error messages
   - Log errors for debugging
   - Provide retry options

3. **Monitor storage usage:**
   - Set up alerts for storage limits
   - Clean up old temp files
   - Archive old submissions if needed

4. **Security:**
   - Keep bucket private (public: false)
   - Use RLS policies for access control
   - Validate user authentication before uploads
   - Don't expose file URLs publicly

## Getting Help

If you still encounter issues:

1. Check Supabase project logs: Dashboard → Logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Review the deployment guide: `docs/DEPLOYMENT.md`
5. Check the database setup: `docs/DATABASE_SETUP_COMPLETE.md`

## Related Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Database Setup](./DATABASE_SETUP_COMPLETE.md)
- [File URL Fix](./FILE_URL_NULL_FIX.md)
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)

