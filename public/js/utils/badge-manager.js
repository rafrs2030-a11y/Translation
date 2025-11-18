/**
 * Badge Manager
 * إدارة علامات الإشعارات في جميع أقسام التطبيق
 */

import chatStore from '../stores/chatStore.js';
import notificationsStore from '../stores/notificationsStore.js';
import adminStore from '../stores/adminStore.js';
import submissionsStore from '../stores/submissionsStore.js';
import authStore from '../stores/authStore.js';

class BadgeManager {
  constructor() {
    this.isInitialized = false;
    this.updateInterval = null;
  }

  /**
   * تهيئة مدير العلامات
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      const user = authStore.getState().user;
      if (!user) return;

      // تحديث العلامات الأولية
      await this.updateAllBadges();

      // الاشتراك في تحديثات الـ stores
      this.subscribeToStores();

      // تحديث دوري كل 30 ثانية
      this.startPeriodicUpdate();

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing badge manager:', error);
    }
  }

  /**
   * الاشتراك في تحديثات الـ stores
   */
  subscribeToStores() {
    // الاشتراك في تحديثات الدردشة
    chatStore.subscribe((state) => {
      this.updateChatBadge(state.unreadCount || 0);
    });

    // الاشتراك في تحديثات الإشعارات
    notificationsStore.subscribe((state) => {
      this.updateNotificationBadge(state.unreadCount || 0);
    });
  }

  /**
   * تحديث جميع العلامات
   */
  async updateAllBadges() {
    try {
      const user = authStore.getState().user;
      if (!user) return;

      // تحديث علامات الدردشة
      await this.updateChatBadgeFromStore();

      // تحديث علامات الإشعارات
      await this.updateNotificationBadgeFromStore();

      // تحديث علامات القوائم الجانبية حسب دور المستخدم
      if (user.role === 'admin' || user.role === 'super_admin') {
        await this.updateAdminSidebarBadges();
      } else if (user.role === 'researcher') {
        await this.updateResearcherSidebarBadges();
      }
    } catch (error) {
      console.error('Error updating all badges:', error);
    }
  }

  /**
   * تحديث علامة الدردشة من الـ store
   */
  async updateChatBadgeFromStore() {
    try {
      await chatStore.updateUnreadCount();
      const state = chatStore.getState();
      this.updateChatBadge(state.unreadCount || 0);
    } catch (error) {
      console.error('Error updating chat badge:', error);
    }
  }

  /**
   * تحديث علامة الدردشة
   */
  updateChatBadge(count) {
    // تحديث في الـ topbar
    const topbarBadge = document.getElementById('chat-badge');
    if (topbarBadge) {
      if (count > 0) {
        topbarBadge.textContent = count > 99 ? '99+' : count;
        topbarBadge.style.display = '';
      } else {
        topbarBadge.style.display = 'none';
      }
    }

    // تحديث في القائمة الجانبية
    const sidebarBadge = document.querySelector('[data-badge="chat"]');
    if (sidebarBadge) {
      if (count > 0) {
        sidebarBadge.textContent = count > 99 ? '99+' : count;
        sidebarBadge.style.display = '';
      } else {
        sidebarBadge.style.display = 'none';
      }
    }
  }

  /**
   * تحديث علامة الإشعارات من الـ store
   */
  async updateNotificationBadgeFromStore() {
    try {
      const user = authStore.getState().user;
      if (!user) return;

      await notificationsStore.initialize();
      const state = notificationsStore.getState();
      this.updateNotificationBadge(state.unreadCount || 0);
    } catch (error) {
      console.error('Error updating notification badge:', error);
    }
  }

  /**
   * تحديث علامة الإشعارات
   */
  updateNotificationBadge(count) {
    // تحديث في الـ topbar
    const topbarBadge = document.getElementById('notification-badge');
    if (topbarBadge) {
      if (count > 0) {
        topbarBadge.textContent = count > 99 ? '99+' : count;
        topbarBadge.style.display = '';
      } else {
        topbarBadge.style.display = 'none';
      }
    }

    // تحديث في القائمة الجانبية
    const sidebarBadge = document.querySelector('[data-badge="notifications"]');
    if (sidebarBadge) {
      if (count > 0) {
        sidebarBadge.textContent = count > 99 ? '99+' : count;
        sidebarBadge.style.display = '';
      } else {
        sidebarBadge.style.display = 'none';
      }
    }
  }

  /**
   * تحديث علامات القائمة الجانبية للإدمن
   */
  async updateAdminSidebarBadges() {
    try {
      // تحديث علامة الطلبات المعلقة
      const stats = await adminStore.getStatistics();
      if (stats) {
        const pendingCount = stats.pending || 0;
        this.updateSidebarBadge('submissions', pendingCount, '/pages/admin/submissions.html');
      }
    } catch (error) {
      console.error('Error updating admin sidebar badges:', error);
    }
  }

  /**
   * تحديث علامات القائمة الجانبية للباحث
   */
  async updateResearcherSidebarBadges() {
    try {
      // استخدام fetchStats() للحصول على الإحصائيات الصحيحة من قاعدة البيانات
      const stats = await submissionsStore.fetchStats();
      if (stats) {
        // حساب الطلبات التي تغيرت حالتها (approved, rejected, needs_revision)
        const changedCount = (stats.approved || 0) + (stats.rejected || 0) + (stats.needsRevision || 0);
        this.updateSidebarBadge('submissions', changedCount, '/pages/researcher/submissions.html');
      }
    } catch (error) {
      console.error('Error updating researcher sidebar badges:', error);
    }
  }

  /**
   * تحديث علامة في القائمة الجانبية
   */
  updateSidebarBadge(badgeType, count, linkHref) {
    // البحث عن الرابط في القائمة الجانبية
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-item');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === linkHref) {
        // البحث عن علامة موجودة أو إنشاء واحدة جديدة
        let badge = link.querySelector('.nav-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'nav-badge';
          badge.setAttribute('data-badge', badgeType);
          link.appendChild(badge);
        }

        if (count > 0) {
          badge.textContent = count > 99 ? '99+' : count;
          badge.style.display = '';
        } else {
          badge.style.display = 'none';
        }
      }
    });
  }

  /**
   * بدء التحديث الدوري
   */
  startPeriodicUpdate() {
    // تحديث كل 30 ثانية
    this.updateInterval = setInterval(() => {
      this.updateAllBadges();
    }, 30000);
  }

  /**
   * إيقاف التحديث الدوري
   */
  stopPeriodicUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * تنظيف
   */
  cleanup() {
    this.stopPeriodicUpdate();
    this.isInitialized = false;
  }
}

// إنشاء نسخة واحدة (Singleton)
const badgeManager = new BadgeManager();

export default badgeManager;

