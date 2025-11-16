# Fix: File URL Null Value Error

## Problem Description

Users were encountering the following error when submitting research papers:
```
null value in column "file_url" of relation "submissions" violates not-null constraint
```

## Root Cause

The error occurred because the `file_url` was being set to `null` when creating a submission, even though the database schema requires it to be NOT NULL. This happened due to insufficient validation in the file upload flow:

1. The `uploadFileBeforeSubmission` function in `submissionsStore.js` was returning `urlData.publicUrl` without validating it
2. If `publicUrl` was null or undefined (due to storage configuration issues), the function would still return `success: true`
3. The submit handler would then proceed to create a submission with a null `file_url`

## Files Changed

### 1. `public/js/researcher/submit.js`
**Changes:**
- Added validation to check that `uploadResult.url` exists before assigning it
- Added an additional check to ensure `fileUrl` is not null before proceeding with submission
- Better error messages for users

```javascript
// Before:
const uploadResult = await submissionsStore.uploadFileBeforeSubmission(uploadedFile);
if (uploadResult.success) {
    fileUrl = uploadResult.url;
} else {
    throw new Error(uploadResult.error || 'فشل رفع الملف');
}

// After:
const uploadResult = await submissionsStore.uploadFileBeforeSubmission(uploadedFile);
if (uploadResult.success && uploadResult.url) {
    fileUrl = uploadResult.url;
} else {
    throw new Error(uploadResult.error || 'فشل رفع الملف');
}

// Validate that fileUrl is not null before proceeding
if (!fileUrl) {
    throw new Error('فشل الحصول على رابط الملف. يرجى المحاولة مرة أخرى');
}
```

### 2. `public/js/stores/submissionsStore.js`
**Changes:**
- Added validation in `uploadFileBeforeSubmission` to ensure `publicUrl` is valid
- Added validation in `uploadFile` method as well for consistency
- Throws error if URL cannot be obtained from storage

```javascript
// Added validation:
if (!urlData || !urlData.publicUrl) {
    throw new Error('فشل الحصول على رابط الملف من التخزين');
}
```

## How to Prevent This Issue

### For Developers:
1. Always validate that storage bucket exists and is properly configured
2. Check that Supabase storage is set up correctly in your environment
3. Ensure storage policies allow authenticated users to upload files

### For Deployment:
Make sure the storage bucket is created by running the database schema:

```sql
-- This should be in your schema.sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('research-files', 'research-files', false)
ON CONFLICT (id) DO NOTHING;
```

### Verify Storage Setup:

1. **Check Bucket Exists:**
   - Go to Supabase Dashboard → Storage
   - Verify `research-files` bucket exists
   - If not, create it manually or run the schema again

2. **Verify Storage Policies:**
   - Check that RLS policies are in place for the storage bucket
   - Users should be able to upload to their own folders

3. **Test File Upload:**
   ```javascript
   // Test upload in browser console
   const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
   const result = await submissionsStore.uploadFileBeforeSubmission(testFile);
   console.log(result);
   // Should return: { success: true, url: "https://...", fileName: "test.txt", fileSize: 4 }
   ```

## Expected Behavior After Fix

1. If file upload fails, user sees clear error message: "فشل رفع الملف"
2. If URL cannot be obtained, user sees: "فشل الحصول على رابط الملف. يرجى المحاولة مرة أخرى"
3. Submission only proceeds if valid file URL is obtained
4. No more null constraint violations in the database

## Testing Checklist

- [ ] Upload a valid PDF file (< 10MB)
- [ ] Upload a valid DOCX file (< 10MB)
- [ ] Try uploading with no storage bucket configured (should show error)
- [ ] Try uploading with invalid credentials (should show error)
- [ ] Verify submission completes successfully with valid file
- [ ] Check that `file_url` in database is not null
- [ ] Verify file can be downloaded after submission

## Related Files

- `public/js/researcher/submit.js` - Form submission handler
- `public/js/stores/submissionsStore.js` - File upload logic
- `database/schema.sql` - Database schema and storage bucket setup
- `docs/DEPLOYMENT.md` - Deployment instructions including storage setup

## Additional Notes

The storage bucket is configured as private (`public: false`) with Row Level Security (RLS) policies. This means:
- Users can only upload files to their own folders (based on user ID)
- Users can only view their own files
- Admins can view all files
- Files are not publicly accessible without authentication

This is the recommended security approach for sensitive research documents.

