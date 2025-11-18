# 📸 إعداد الصور الشخصية - Avatar Setup Guide

## المشكلة
إذا ظهرت رسالة خطأ: `Bucket not found` أو `StorageApiError: Bucket not found`، فهذا يعني أن الـ bucket `avatars` غير موجود في Supabase Storage.

## الحل: إنشاء Storage Bucket

### الطريقة 1: من Supabase Dashboard (موصى بها)

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. انتقل إلى **Storage** من القائمة الجانبية
4. انقر على **New bucket** أو **Create bucket**
5. املأ البيانات:
   - **Name**: `avatars`
   - **Public bucket**: ✅ فعّل (Public)
   - **File size limit**: 2 MB (أو حسب رغبتك)
   - **Allowed MIME types**: `image/*` (اختياري)
6. انقر **Create bucket**

### الطريقة 2: من SQL Editor

1. اذهب إلى **SQL Editor** في Supabase Dashboard
2. نفّذ الكود التالي:

```sql
-- إنشاء bucket للصور الشخصية
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  2097152,  -- 2 MB بالبايت
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;
```

3. بعد إنشاء الـ bucket، نفّذ سياسات الأمان:

```sql
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
```

## التحقق من الإعداد

بعد إنشاء الـ bucket:

1. اذهب إلى **Storage** في Supabase Dashboard
2. تأكد من وجود bucket باسم `avatars`
3. تأكد من أنه **Public**
4. جرّب رفع صورة شخصية من صفحة البروفيل

## ملاحظات مهمة

- ✅ الـ bucket يجب أن يكون **Public** حتى يمكن عرض الصور
- ✅ حجم الملف الافتراضي: 2 MB
- ✅ الصيغ المدعومة: JPEG, PNG, GIF, WebP
- ✅ كل مستخدم يمكنه رفع/تحديث/حذف صورته فقط
- ✅ الأدمن يمكنه إدارة جميع الصور

## استكشاف الأخطاء

### الخطأ: "Bucket not found"
**الحل**: تأكد من إنشاء الـ bucket `avatars` في Supabase Storage

### الخطأ: "new row violates row-level security policy"
**الحل**: تأكد من تنفيذ سياسات الأمان (Policies) المذكورة أعلاه

### الخطأ: "File size exceeds limit"
**الحل**: تأكد من أن حجم الصورة أقل من 2 MB

### الخطأ: "Invalid file type"
**الحل**: تأكد من أن الملف صورة بصيغة مدعومة (JPEG, PNG, GIF, WebP)

