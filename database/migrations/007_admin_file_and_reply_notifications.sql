-- Migration: 007_admin_file_and_reply_notifications
-- Description: Add admin notifications for file updates and researcher replies
-- Date: 2025-11-26

BEGIN;

-- ============================================
-- 1. Notify admins when a submission file is updated
-- ============================================

CREATE OR REPLACE FUNCTION notify_admin_on_file_update()
RETURNS trigger AS $$
DECLARE
  admin_record RECORD;
BEGIN
  -- Only act when file_url actually changes (extra safety in addition to WHEN clause)
  IF NEW.file_url IS DISTINCT FROM OLD.file_url THEN
    FOR admin_record IN
      SELECT id
      FROM users
      WHERE role IN ('admin', 'super_admin')
    LOOP
      INSERT INTO notifications (user_id, submission_id, type, message)
      VALUES (
        admin_record.id,
        NEW.id,
        'system',
        'قام الباحث بتحديث ملف البحث رقم المرجع ' || NEW.reference_number
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_admin_on_file_update ON submissions;

CREATE TRIGGER trg_notify_admin_on_file_update
AFTER UPDATE OF file_url ON submissions
FOR EACH ROW
WHEN (OLD.file_url IS DISTINCT FROM NEW.file_url)
EXECUTE FUNCTION notify_admin_on_file_update();


-- ============================================
-- 2. (Optional) Notify admins when a researcher replies via chat
-- ============================================
-- ملاحظة: هذا الجزء يفترض وجود جدول chat_messages وعمود sender_id
-- وجداول وأدوار مستخدمين تسمح بالتمييز بين الباحث والإدمن.
-- إذا لم يكن جدول chat_messages موجوداً في قاعدة البيانات، فلن يتم تنفيذ هذا الجزء بنجاح.

DO $do$
BEGIN
  -- نحاول فقط إنشاء الوظيفة والتريغر إذا كان جدول chat_messages موجوداً
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'chat_messages'
  ) THEN

    CREATE OR REPLACE FUNCTION notify_admin_on_researcher_reply()
    RETURNS trigger AS $fn$
    DECLARE
      is_researcher BOOLEAN;
      admin_rec RECORD;
    BEGIN
      -- التحقق من أن المرسل باحث (وليس إدمن)
      SELECT (u.role = 'researcher') INTO is_researcher
      FROM users u
      WHERE u.id = NEW.sender_id;

      IF is_researcher THEN
        FOR admin_rec IN
          SELECT id
          FROM users
          WHERE role IN ('admin', 'super_admin')
        LOOP
          INSERT INTO notifications (user_id, submission_id, type, message)
          VALUES (
            admin_rec.id,
            NULL,
            'system',
            'قام الباحث بإرسال رد جديد في نظام الدردشة'
          );
        END LOOP;
      END IF;

      RETURN NEW;
    END;
    $fn$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_notify_admin_on_researcher_reply ON chat_messages;

    CREATE TRIGGER trg_notify_admin_on_researcher_reply
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION notify_admin_on_researcher_reply();

  END IF;
END;
$do$;

COMMIT;


