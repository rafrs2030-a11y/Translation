# إصلاح مشكلة RLS على جدول notifications
# Fix RLS Policy for notifications table

## المشكلة

عند محاولة تغيير حالة الطلب، كان يظهر الخطأ التالي:

```
Error: new row violates row-level security policy for table "notifications"
```

### السبب

كانت سياسات RLS على جدول `notifications` تسمح بـ:
- ✅ SELECT (قراءة الإشعارات)
- ✅ UPDATE (تحديث الإشعارات)
- ✅ DELETE (حذف الإشعارات)
- ❌ INSERT (إنشاء إشعارات) - **مفقودة!**

لذلك عندما يحاول المسؤول إنشاء إشعار للمستخدم، يفشل بسبب عدم وجود سياسة INSERT.

---

## الحل

تم إضافة سياستين INSERT:

### 1. سياسة للمسؤولين
```sql
CREATE POLICY "Admins can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
```

**الوظيفة:** تسمح للمسؤولين بإنشاء إشعارات لأي مستخدم.

### 2. سياسة للمستخدمين
```sql
CREATE POLICY "Users can insert their own notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**الوظيفة:** تسمح للمستخدمين بإنشاء إشعارات لأنفسهم (للحالات الخاصة).

---

## التحقق من الإصلاح

### 1. التحقق من السياسات:
```sql
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'notifications' 
ORDER BY cmd;
```

**النتيجة المتوقعة:**
- ✅ Admins can insert notifications (INSERT)
- ✅ Users can insert their own notifications (INSERT)
- ✅ Users can view their own notifications (SELECT)
- ✅ Users can update their own notifications (UPDATE)
- ✅ Users can delete their own notifications (DELETE)

### 2. اختبار الإصلاح:

1. سجل دخول كمسؤول
2. غيّر حالة أحد الطلبات
3. يجب أن:
   - ✅ يتم إنشاء الإشعار بنجاح
   - ✅ لا يظهر خطأ RLS
   - ✅ يظهر الإشعار في جدول `notifications`

---

## السياسات الكاملة على notifications

| العملية | السياسة | الوصف |
|---------|--------|-------|
| INSERT | Admins can insert notifications | المسؤولون يمكنهم إنشاء إشعارات لأي مستخدم |
| INSERT | Users can insert their own notifications | المستخدمون يمكنهم إنشاء إشعارات لأنفسهم |
| SELECT | Users can view their own notifications | المستخدمون يمكنهم رؤية إشعاراتهم فقط |
| UPDATE | Users can update their own notifications | المستخدمون يمكنهم تحديث إشعاراتهم |
| DELETE | Users can delete their own notifications | المستخدمون يمكنهم حذف إشعاراتهم |

---

## ملاحظات أمنية

### ✅ الأمان محفوظ:
- المسؤولون فقط يمكنهم إنشاء إشعارات للمستخدمين الآخرين
- المستخدمون يمكنهم فقط إنشاء إشعارات لأنفسهم
- كل مستخدم يرى إشعاراته فقط

### ⚠️ تحذيرات من Supabase Advisors:
- Functions تحتاج إلى إصلاح `search_path` (غير حرج)
- Views تستخدم SECURITY DEFINER (سلوك افتراضي)

---

## الملفات المعدلة

- ✅ Migration: `fix_notifications_rls_insert_policy`
- ✅ تم تطبيق Migration على قاعدة البيانات

---

## الخطوات التالية

بعد إصلاح RLS، يجب:

1. ✅ اختبار تغيير حالة الطلب
2. ✅ التحقق من إنشاء الإشعارات
3. ⏳ نشر Edge Function لإرسال البريد الإلكتروني
4. ⏳ إعداد Resend API Key

---

**تاريخ الإصلاح:** 2025-01-27  
**الحالة:** ✅ تم الإصلاح

