/**
 * Notifications Store
 * إدارة حالة الإشعارات والبريد الإلكتروني
 */

import { supabase } from '../config/supabase.js';
import authStore from './authStore.js';

class NotificationsStore {
  constructor() {
    this.state = {
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
      realtimeSubscription: null,
    };

    this.listeners = [];
  }

  /**
   * تهيئة الإشعارات الفورية
   */
  async initialize() {
    const user = authStore.getState().user;
    if (!user) return;

    // جلب الإشعارات الأولية
    await this.fetchNotifications();

    // جلب التفضيلات
    await this.fetchPreferences();

    // الاشتراك في الإشعارات الفورية
    this.subscribeToRealtime();
  }

  /**
   * الاشتراك في الإشعارات الفورية
   */
  subscribeToRealtime() {
    const user = authStore.getState().user;
    if (!user) return;

    // إلغاء الاشتراك السابق إن وُجد
    if (this.state.realtimeSubscription) {
      this.state.realtimeSubscription.unsubscribe();
    }

    // الاشتراك الجديد
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        this.handleNewNotification(payload.new);
      })
      .subscribe();

    this.setState({ realtimeSubscription: subscription });
  }

  /**
   * إلغاء الاشتراك في الإشعارات الفورية
   */
  unsubscribeFromRealtime() {
    if (this.state.realtimeSubscription) {
      this.state.realtimeSubscription.unsubscribe();
      this.setState({ realtimeSubscription: null });
    }
  }

  /**
   * معالجة إشعار جديد
   */
  handleNewNotification(notification) {
    // إضافة إلى القائمة
    this.setState({
      notifications: [notification, ...this.state.notifications],
      unreadCount: this.state.unreadCount + 1,
    });

    // عرض إشعار في المتصفح
    if (this.state.preferences.in_app_enabled) {
      this.showBrowserNotification(notification);
    }

    // تشغيل صوت (اختياري)
    this.playNotificationSound();
  }

  /**
   * جلب جميع الإشعارات
   */
  async fetchNotifications(limit = 50) {
    this.setState({ loading: true, error: null });

    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const unreadCount = data.filter(n => !n.is_read).length;

      this.setState({
        notifications: data,
        unreadCount,
        loading: false,
      });

      return { success: true, data };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * وضع علامة مقروء على إشعار
   */
  async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      this.setState({
        notifications: this.state.notifications.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, this.state.unreadCount - 1),
      });

      return { success: true };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * وضع علامة مقروء على جميع الإشعارات
   */
  async markAllAsRead() {
    this.setState({ loading: true, error: null });

    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      this.setState({
        notifications: this.state.notifications.map(n => ({ ...n, is_read: true })),
        unreadCount: 0,
        loading: false,
      });

      return { success: true };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * حذف إشعار
   */
  async deleteNotification(notificationId) {
    try {
      const notification = this.state.notifications.find(n => n.id === notificationId);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      this.setState({
        notifications: this.state.notifications.filter(n => n.id !== notificationId),
        unreadCount: notification && !notification.is_read 
          ? Math.max(0, this.state.unreadCount - 1)
          : this.state.unreadCount,
      });

      return { success: true };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * حذف جميع الإشعارات
   */
  async deleteAllNotifications() {
    this.setState({ loading: true, error: null });

    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      this.setState({
        notifications: [],
        unreadCount: 0,
        loading: false,
      });

      return { success: true };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * جلب تفضيلات الإشعارات
   */
  async fetchPreferences() {
    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // إذا لم توجد تفضيلات، إنشاء افتراضية
        if (error.code === 'PGRST116') {
          await this.createDefaultPreferences();
          return { success: true };
        }
        throw error;
      }

      this.setState({
        preferences: {
          email_enabled: data.email_enabled,
          in_app_enabled: data.in_app_enabled,
          status_change_email: data.status_change_email,
          comments_email: data.comments_email,
          reminders_email: data.reminders_email,
          news_email: data.news_email,
        },
      });

      return { success: true, data };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * إنشاء تفضيلات افتراضية
   */
  async createDefaultPreferences() {
    const user = authStore.getState().user;
    if (!user) return;

    await supabase
      .from('notification_preferences')
      .insert([{ user_id: user.id }]);
  }

  /**
   * تحديث التفضيلات
   */
  async updatePreferences(newPreferences) {
    this.setState({ loading: true, error: null });

    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      const { error } = await supabase
        .from('notification_preferences')
        .update(newPreferences)
        .eq('user_id', user.id);

      if (error) throw error;

      this.setState({
        preferences: { ...this.state.preferences, ...newPreferences },
        loading: false,
      });

      return { success: true };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * إرسال إشعار متصفح
   */
  async showBrowserNotification(notification) {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification('إشعار جديد', {
        body: notification.message,
        icon: '/logo.png',
        tag: notification.id,
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('إشعار جديد', {
          body: notification.message,
          icon: '/logo.png',
          tag: notification.id,
        });
      }
    }
  }

  /**
   * تشغيل صوت الإشعار
   */
  playNotificationSound() {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // فشل تشغيل الصوت (مثلاً بسبب إعدادات المتصفح)
      });
    } catch (error) {
      // تجاهل أخطاء الصوت
    }
  }

  /**
   * طلب إذن الإشعارات
   */
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      return { success: false, error: 'المتصفح لا يدعم الإشعارات' };
    }

    const permission = await Notification.requestPermission();
    return { success: permission === 'granted', permission };
  }

  /**
   * فلترة الإشعارات حسب النوع
   */
  filterByType(type) {
    return this.state.notifications.filter(n => n.type === type);
  }

  /**
   * الحصول على الإشعارات غير المقروءة
   */
  getUnreadNotifications() {
    return this.state.notifications.filter(n => !n.is_read);
  }

  /**
   * الحصول على الإشعارات المقروءة
   */
  getReadNotifications() {
    return this.state.notifications.filter(n => n.is_read);
  }

  /**
   * تنظيف (عند تسجيل الخروج)
   */
  cleanup() {
    this.unsubscribeFromRealtime();
    this.setState({
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null,
    });
  }

  /**
   * تحديث الحالة
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  /**
   * الحصول على الحالة الحالية
   */
  getState() {
    return this.state;
  }

  /**
   * الاشتراك في تغييرات الحالة
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * إشعار جميع المستمعين بالتغييرات
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// إنشاء نسخة واحدة (Singleton)
const notificationsStore = new NotificationsStore();

export default notificationsStore;

