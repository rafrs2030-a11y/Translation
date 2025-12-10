'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  if (authLoading) {
    return (
      <div className="dashboard-page">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard-page dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>الإشعارات</h1>
            {notifications.length > 0 && (
              <button className="btn btn-outline" onClick={handleMarkAllAsRead}>
                <i className="fas fa-check-double"></i>
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-placeholder">
              <div className="loading-spinner"></div>
              <p>جاري التحميل...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="card">
              <div className="card-body">
                <div className="empty-state">
                  <i className="fas fa-bell-slash"></i>
                  <p>لا توجد إشعارات</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    <i className={`fas ${
                      notification.type === 'success' ? 'fa-check-circle' :
                      notification.type === 'error' ? 'fa-exclamation-circle' :
                      notification.type === 'warning' ? 'fa-exclamation-triangle' :
                      'fa-info-circle'
                    }`}></i>
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-date">
                      {new Date(notification.created_at).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {!notification.read && (
                    <div className="notification-badge-dot"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

