'use client';

/**
 * Notifications Context
 * إدارة حالة الإشعارات والبريد الإلكتروني
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';

interface Notification {
  id: string;
  user_id: string;
  title?: string;
  message: string;
  type: string;
  read: boolean;
  is_read?: boolean;
  created_at: string;
  submission_id?: string;
  [key: string]: any;
}

interface NotificationPreferences {
  email_enabled: boolean;
  in_app_enabled: boolean;
  status_change_email: boolean;
  comments_email: boolean;
  reminders_email: boolean;
  news_email: boolean;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  loading: boolean;
  error: string | null;
}

interface NotificationsContextType extends NotificationsState {
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    unreadCount: 0,
    preferences: {
      email_enabled: true,
      in_app_enabled: true,
      status_change_email: true,
      comments_email: true,
      reminders_email: true,
      news_email: true,
    },
    loading: false,
    error: null,
  });

  const { user, isAuthenticated } = useAuth();
  const supabase = createClient();

  const fetchNotifications = useCallback(async () => {
    if (!user || !isAuthenticated) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // الباحث يرى إشعاراته فقط، أما الإدمن فيمكنه رؤية جميع الإشعارات
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const notifications = (data || []).map((n: any) => ({
        ...n,
        read: n.is_read || n.read || false,
      }));
      const unreadCount = notifications.filter((n: Notification) => !n.read).length;

      setState(prev => ({
        ...prev,
        notifications,
        unreadCount,
        loading: false,
      }));
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'حدث خطأ أثناء جلب الإشعارات',
        loading: false,
      }));
    }
  }, [user, isAuthenticated, supabase]);

  const fetchPreferences = useCallback(async () => {
    if (!user || !isAuthenticated) return;

    try {
      // استخدام maybeSingle بدلاً من single لتجنب خطأ 406 عند عدم وجود سجل
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // معالجة الأخطاء
      if (error) {
        // إذا كان الخطأ 406 أو PGRST116 (لا يوجد سجل)، هذا طبيعي للمرة الأولى
        if (error.code === 'PGRST116' || error.code === '406' || error.message?.includes('406')) {
          console.log('لا توجد تفضيلات موجودة، سيتم استخدام القيم الافتراضية');
          return; // استخدام القيم الافتراضية الموجودة في state
        }
        throw error;
      }

      // إذا وجدت بيانات، قم بتحديث التفضيلات
      if (data) {
        setState(prev => ({
          ...prev,
          preferences: {
            email_enabled: data.email_enabled ?? true,
            in_app_enabled: data.in_app_enabled ?? true,
            status_change_email: data.status_change_email ?? true,
            comments_email: data.comments_email ?? true,
            reminders_email: data.reminders_email ?? true,
            news_email: data.news_email ?? true,
          },
        }));
      } else {
        // إذا لم توجد بيانات، إنشاء تفضيلات افتراضية
        try {
          await supabase
            .from('notification_preferences')
            .insert({
              user_id: user.id,
              email_enabled: true,
              in_app_enabled: true,
              status_change_email: true,
              comments_email: true,
              reminders_email: true,
              news_email: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
        } catch (insertError: any) {
          // تجاهل خطأ الإدراج إذا كان السجل موجود بالفعل
          if (insertError.code !== '23505') { // 23505 = unique violation
            console.warn('خطأ في إنشاء التفضيلات الافتراضية:', insertError);
          }
        }
      }
    } catch (error: any) {
      console.error('Error fetching preferences:', error);
      // لا نرمي الخطأ، فقط نستخدم القيم الافتراضية
    }
  }, [user, isAuthenticated, supabase]);

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setState(prev => {
        const updated = prev.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true, is_read: true } : n
        );
        const unreadCount = updated.filter(n => !n.read).length;
        return {
          ...prev,
          notifications: updated,
          unreadCount,
        };
      });
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  }, [user, supabase]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, read: true, is_read: true })),
        unreadCount: 0,
      }));
    } catch (error: any) {
      console.error('Error marking all as read:', error);
    }
  }, [user, supabase]);

  const updatePreferences = useCallback(async (preferences: Partial<NotificationPreferences>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert(
          {
            user_id: user.id,
            ...preferences,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id',
          }
        );

      if (error) throw error;

      setState(prev => ({
        ...prev,
        preferences: { ...prev.preferences, ...preferences },
      }));
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }, [user, supabase]);

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!user || !isAuthenticated) return;

    // جلب تفضيلات المستخدم دائماً أولاً
    fetchPreferences();

    // إذا عطّل المستخدم الإشعارات داخل التطبيق، لا نقوم بجلب أو الاشتراك
    if (!state.preferences.in_app_enabled) {
      setState(prev => ({
        ...prev,
        notifications: [],
        unreadCount: 0,
      }));
      return;
    }

    // جلب الإشعارات والاشتراك في التحديثات الفورية
    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAuthenticated, state.preferences.in_app_enabled, fetchNotifications, fetchPreferences, supabase]);

  return (
    <NotificationsContext.Provider
      value={{
        ...state,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        updatePreferences,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}

