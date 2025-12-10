'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';

export default function AdminNotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, role } = useAuth();
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || (role !== 'admin' && role !== 'super_admin'))) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, role, router]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return 'fa-exchange-alt';
      case 'comment_added':
        return 'fa-comment';
      case 'new_submission':
        return 'fa-file-plus';
      case 'reminder':
        return 'fa-clock';
      case 'system':
        return 'fa-info-circle';
      default:
        return 'fa-bell';
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'status_change':
        return 'تغيير حالة';
      case 'comment_added':
        return 'تعليق جديد';
      case 'new_submission':
        return 'طلب جديد';
      case 'reminder':
        return 'تذكير';
      case 'system':
        return 'نظام';
      default:
        return type;
    }
  };

  if (authLoading) {
    return (
      <div className="dashboard-page">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (role !== 'admin' && role !== 'super_admin')) {
    return null;
  }

  return (
    <div className="dashboard-page dashboard-layout">
      <AdminSidebar />
      <main className="main-content">
        <AdminTopbar />

        <div className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>
                <i className="fas fa-bell" style={{ marginLeft: '0.5rem' }}></i>
                الإشعارات
              </h1>
              <p className="page-description">عرض جميع الإشعارات والتنبيهات</p>
            </div>
            {notifications.length > 0 && (
              <button className="btn btn-outline" onClick={handleMarkAllAsRead}>
                <i className="fas fa-check-double"></i>
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          {loading ? (
            <div className="card">
              <div className="card-body">
                <div className="loading-placeholder">
                  <div className="loading-spinner"></div>
                  <p>جاري تحميل الإشعارات...</p>
                </div>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="card">
              <div className="card-body">
                <div className="empty-state">
                  <i className="fas fa-bell-slash" style={{ fontSize: '4rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}></i>
                  <h3>لا توجد إشعارات</h3>
                  <p>لم يتم استلام أي إشعارات حتى الآن</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification: any) => {
                const isRead = (notification.is_read === true || notification.read === true);
                const notificationMessage = notification.message || notification.title || 'لا يوجد محتوى';
                const notificationTitle = notification.title || (typeof notificationMessage === 'string' ? notificationMessage.split('\n')[0] : 'إشعار') || 'إشعار';
                
                return (
                  <div
                    key={notification.id}
                    className={`notification-item ${!isRead ? 'unread' : ''}`}
                    onClick={() => !isRead && handleMarkAsRead(notification.id)}
                    style={{
                      cursor: !isRead ? 'pointer' : 'default',
                      display: 'flex',
                      gap: '1rem',
                      padding: '1.25rem',
                      background: !isRead ? 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)' : '#ffffff',
                      border: !isRead ? '2px solid var(--primary)' : '1px solid var(--border)',
                      borderRadius: '12px',
                      marginBottom: '1rem',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                    }}
                  >
                    {!isRead && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.75rem',
                          left: '0.75rem',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          boxShadow: '0 0 8px var(--primary)',
                        }}
                      ></div>
                    )}
                    
                    <div
                      className="notification-icon"
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: !isRead 
                          ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)'
                          : 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: !isRead ? '#ffffff' : 'var(--text-secondary)',
                        flexShrink: 0,
                      }}
                    >
                      <i className={`fas ${getNotificationIcon(notification.type)}`} style={{ fontSize: '1.25rem' }}></i>
                    </div>

                    <div className="notification-content" style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '6px',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-secondary)',
                                fontWeight: 600,
                              }}
                            >
                              {getNotificationTypeLabel(notification.type)}
                            </span>
                            {!isRead && (
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '6px',
                                  background: 'var(--primary)',
                                  color: '#ffffff',
                                  fontWeight: 600,
                                }}
                              >
                                جديد
                              </span>
                            )}
                          </div>
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {notificationTitle}
                          </h4>
                          <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {notificationMessage}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                        <span
                          className="notification-date"
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <i className="fas fa-clock" style={{ marginLeft: '0.25rem' }}></i>
                          {new Date(notification.created_at).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>

                        {notification.submission_id && (
                          <Link
                            href={`/admin/submissions/${notification.submission_id}`}
                            className="btn btn-outline btn-small"
                            onClick={(e) => e.stopPropagation()}
                            style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
                          >
                            <i className="fas fa-eye" style={{ marginLeft: '0.25rem' }}></i>
                            عرض الطلب
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

