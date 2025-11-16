/**
 * Stores Index
 * تصدير مركزي لجميع الـ Stores
 */

import authStore from './authStore';
import submissionsStore from './submissionsStore';
import adminStore from './adminStore';
import notificationsStore from './notificationsStore';

// تصدير جميع الـ Stores
export {
  authStore,
  submissionsStore,
  adminStore,
  notificationsStore,
};

// تصدير كـ Default Object
export default {
  auth: authStore,
  submissions: submissionsStore,
  admin: adminStore,
  notifications: notificationsStore,
};

