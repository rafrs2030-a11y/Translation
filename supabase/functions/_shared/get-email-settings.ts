/**
 * Get Email Settings from Supabase
 * الحصول على إعدادات البريد الإلكتروني من Supabase
 * 
 * This utility function retrieves email notification settings from the platform_settings table.
 * يمكن استخدام هذه الدالة في Edge Functions للتحقق من إعدادات البريد قبل الإرسال.
 */

import { SupabaseClient } from 'jsr:@supabase/supabase-js@2';

export interface EmailSettings {
  email_notifications: boolean;      // تفعيل إشعارات البريد الإلكتروني
  email_new_submission: boolean;      // إشعار عند طلب جديد
  email_status_change: boolean;       // إشعار عند تغيير الحالة
}

/**
 * Get email settings from platform_settings table
 * @param supabase - Supabase client instance
 * @returns Email settings object with boolean values
 */
export async function getEmailSettings(
  supabase: SupabaseClient
): Promise<EmailSettings> {
  try {
    // Fetch email settings from platform_settings
    const { data, error } = await supabase
      .from('platform_settings')
      .select('setting_key, setting_value')
      .in('setting_key', [
        'email_notifications',
        'email_new_submission',
        'email_status_change'
      ]);

    if (error) {
      console.error('Error fetching email settings:', error);
      // Return default values (all enabled) if there's an error
      return {
        email_notifications: true,
        email_new_submission: true,
        email_status_change: true,
      };
    }

    // Convert settings array to object
    const settingsMap: Record<string, boolean> = {};
    
    if (data && data.length > 0) {
      data.forEach((setting: { setting_key: string; setting_value: string }) => {
        // Convert string 'true'/'false' to boolean
        settingsMap[setting.setting_key] = setting.setting_value === 'true';
      });
    }

    // Return settings with defaults if not found
    return {
      email_notifications: settingsMap['email_notifications'] ?? true,
      email_new_submission: settingsMap['email_new_submission'] ?? true,
      email_status_change: settingsMap['email_status_change'] ?? true,
    };
  } catch (error) {
    console.error('Exception fetching email settings:', error);
    // Return default values (all enabled) on exception
    return {
      email_notifications: true,
      email_new_submission: true,
      email_status_change: true,
    };
  }
}

/**
 * Check if email should be sent based on type and settings
 * @param settings - Email settings object
 * @param emailType - Type of email ('new_submission' | 'status_change' | 'comment_added' | 'reminder' | 'system')
 * @returns true if email should be sent, false otherwise
 */
export function shouldSendEmail(
  settings: EmailSettings,
  emailType: 'new_submission' | 'status_change' | 'comment_added' | 'reminder' | 'system'
): boolean {
  // Master toggle: if email_notifications is disabled, don't send any emails
  if (!settings.email_notifications) {
    return false;
  }

  // Check specific setting based on email type
  switch (emailType) {
    case 'new_submission':
      return settings.email_new_submission;
    
    case 'status_change':
      return settings.email_status_change;
    
    // For other types (comment_added, reminder, system), 
    // respect the master toggle only
    case 'comment_added':
    case 'reminder':
    case 'system':
      return settings.email_notifications;
    
    default:
      return settings.email_notifications;
  }
}

