-- Migration: 009_monitoring_functions
-- Description: Create helper functions for monitoring and security checks
-- Date: 2025-12-17

BEGIN;

-- ============================================
-- Function: Check if RLS is enabled on tables
-- ============================================
CREATE OR REPLACE FUNCTION check_rls_enabled()
RETURNS TABLE (
  table_name TEXT,
  rls_enabled BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.relname::TEXT AS table_name,
    c.relrowsecurity AS rls_enabled
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relkind = 'r'
    AND c.relname IN (
      'users',
      'submissions',
      'admin_comments',
      'notifications',
      'notification_preferences',
      'status_history',
      'audit_log',
      'conversations',
      'messages',
      'chat_conversations',
      'chat_messages',
      'platform_settings'
    )
  ORDER BY c.relname;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Function: Get system statistics
-- ============================================
CREATE OR REPLACE FUNCTION get_system_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM users),
    'total_submissions', (SELECT COUNT(*) FROM submissions),
    'pending_submissions', (SELECT COUNT(*) FROM submissions WHERE status = 'pending'),
    'approved_submissions', (SELECT COUNT(*) FROM submissions WHERE status = 'approved'),
    'rejected_submissions', (SELECT COUNT(*) FROM submissions WHERE status = 'rejected'),
    'total_notifications', (SELECT COUNT(*) FROM notifications),
    'unread_notifications', (SELECT COUNT(*) FROM notifications WHERE is_read = false),
    'failed_emails_24h', (
      SELECT COUNT(*) 
      FROM email_log 
      WHERE status = 'failed' 
        AND created_at > NOW() - INTERVAL '24 hours'
    ),
    'successful_emails_24h', (
      SELECT COUNT(*) 
      FROM email_log 
      WHERE status = 'sent' 
        AND created_at > NOW() - INTERVAL '24 hours'
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Function: Check for security vulnerabilities
-- ============================================
CREATE OR REPLACE FUNCTION check_security_vulnerabilities()
RETURNS TABLE (
  check_name TEXT,
  status TEXT,
  message TEXT
) AS $$
DECLARE
  rls_count INTEGER;
  unprotected_tables TEXT[];
BEGIN
  -- Check 1: RLS enabled on critical tables
  SELECT COUNT(*)
  INTO rls_count
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relkind = 'r'
    AND c.relname IN (
      'users', 'submissions', 'admin_comments', 
      'notifications', 'status_history', 'audit_log'
    )
    AND c.relrowsecurity = true;
  
  IF rls_count >= 6 THEN
    RETURN QUERY SELECT 
      'RLS Enabled'::TEXT,
      'pass'::TEXT,
      'Row Level Security مفعّل على جميع الجداول الحرجة'::TEXT;
  ELSE
    RETURN QUERY SELECT 
      'RLS Enabled'::TEXT,
      'warning'::TEXT,
      format('RLS مفعّل على %s من 6 جداول حرجة', rls_count)::TEXT;
  END IF;
  
  -- Check 2: Storage policies exist
  RETURN QUERY SELECT 
    'Storage Policies'::TEXT,
    'info'::TEXT,
    'يرجى التحقق من Storage Policies يدويًا في Supabase Dashboard'::TEXT;
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users (for admin monitoring)
GRANT EXECUTE ON FUNCTION check_rls_enabled() TO authenticated;
GRANT EXECUTE ON FUNCTION get_system_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION check_security_vulnerabilities() TO authenticated;

COMMIT;
