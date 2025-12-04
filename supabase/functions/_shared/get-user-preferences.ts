/**
 * Get User Notification Preferences from Supabase
 * الحصول على تفضيلات إشعارات المستخدم من Supabase
 * 
 * This utility function retrieves user-specific notification preferences from the notification_preferences table.
 * يمكن استخدام هذه الدالة في Edge Functions للتحقق من تفضيلات المستخدم قبل إرسال البريد.
 */

import { SupabaseClient } from 'jsr:@supabase/supabase-js@2';

export interface UserPreferences {
  email_enabled: boolean;           // تفعيل إشعارات البريد الإلكتروني (التحكم الرئيسي)
  in_app_enabled: boolean;          // تفعيل الإشعارات داخل التطبيق
  status_change_email: boolean;     // إشعار عند تغيير حالة البحث
  comments_email: boolean;          // إشعار عند إضافة تعليق
  reminders_email: boolean;         // إشعارات التذكيرات
  news_email: boolean;              // إشعارات الأخبار
}

/**
 * Get user notification preferences from notification_preferences table
 * @param supabase - Supabase client instance
 * @param userId - User ID to fetch preferences for
 * @returns User preferences object with boolean values (defaults to all enabled if not found)
 */
export async function getUserPreferences(
  supabase: SupabaseClient,
  userId: string
): Promise<UserPreferences> {
  try {
    // Fetch user preferences from notification_preferences
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If preferences don't exist, return default values (all enabled)
      if (error.code === 'PGRST116') {
        console.log(`No preferences found for user ${userId}, using defaults (all enabled)`);
        return {
          email_enabled: true,
          in_app_enabled: true,
          status_change_email: true,
          comments_email: true,
          reminders_email: true,
          news_email: true,
        };
      }
      
      console.error('Error fetching user preferences:', error);
      // Return default values (all enabled) if there's an error
      return {
        email_enabled: true,
        in_app_enabled: true,
        status_change_email: true,
        comments_email: true,
        reminders_email: true,
        news_email: true,
      };
    }

    // Return preferences with defaults if any field is null
    return {
      email_enabled: data.email_enabled ?? true,
      in_app_enabled: data.in_app_enabled ?? true,
      status_change_email: data.status_change_email ?? true,
      comments_email: data.comments_email ?? true,
      reminders_email: data.reminders_email ?? true,
      news_email: data.news_email ?? true,
    };
  } catch (error) {
    console.error('Exception fetching user preferences:', error);
    // Return default values (all enabled) on exception
    return {
      email_enabled: true,
      in_app_enabled: true,
      status_change_email: true,
      comments_email: true,
      reminders_email: true,
      news_email: true,
    };
  }
}

/**
 * Check if email should be sent to user based on their preferences and email type
 * @param preferences - User preferences object
 * @param emailType - Type of email ('new_submission' | 'status_change' | 'comment_added' | 'reminder' | 'system')
 * @returns true if email should be sent, false otherwise
 */
export function shouldSendEmailToUser(
  preferences: UserPreferences,
  emailType: 'new_submission' | 'status_change' | 'comment_added' | 'reminder' | 'system'
): boolean {
  // Master toggle: if email_enabled is disabled, don't send any emails
  if (!preferences.email_enabled) {
    return false;
  }

  // Check specific preference based on email type
  switch (emailType) {
    case 'status_change':
      return preferences.status_change_email;
    
    case 'comment_added':
      return preferences.comments_email;
    
    case 'reminder':
      return preferences.reminders_email;
    
    case 'system':
      return preferences.news_email;
    
    case 'new_submission':
      // For new submissions, use the master toggle
      return preferences.email_enabled;
    
    default:
      // Default to master toggle
      return preferences.email_enabled;
  }
}

/**
 * Get user email address from users table
 * @param supabase - Supabase client instance
 * @param userId - User ID to fetch email for
 * @returns User email address or null if not found
 */
export async function getUserEmail(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Error fetching user email:', error);
      return null;
    }

    return data.email || null;
  } catch (error) {
    console.error('Exception fetching user email:', error);
    return null;
  }
}

