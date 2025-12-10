'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { preferences, updatePreferences, loading } = useNotifications();
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updatePreferences(localPreferences);
      setSuccess('تم حفظ الإعدادات بنجاح');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error updating preferences:', err);
    }
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
            <h1>الإعدادات</h1>
          </div>

          {success && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle"></i>
              <span>{success}</span>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h3>إعدادات الإشعارات</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={localPreferences.email_enabled}
                    onChange={(e) => handlePreferenceChange('email_enabled', e.target.checked)}
                  />
                  <span>تفعيل الإشعارات عبر البريد الإلكتروني</span>
                </label>
              </div>

              <div className="form-group">
                <label className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={localPreferences.in_app_enabled}
                    onChange={(e) => handlePreferenceChange('in_app_enabled', e.target.checked)}
                  />
                  <span>تفعيل الإشعارات داخل التطبيق</span>
                </label>
              </div>

              <div className="form-group">
                <label className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={localPreferences.status_change_email}
                    onChange={(e) => handlePreferenceChange('status_change_email', e.target.checked)}
                  />
                  <span>إشعارات تغيير حالة الطلب</span>
                </label>
              </div>

              <div className="form-group">
                <label className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={localPreferences.comments_email}
                    onChange={(e) => handlePreferenceChange('comments_email', e.target.checked)}
                  />
                  <span>إشعارات التعليقات</span>
                </label>
              </div>

              <div className="form-group">
                <label className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={localPreferences.reminders_email}
                    onChange={(e) => handlePreferenceChange('reminders_email', e.target.checked)}
                  />
                  <span>إشعارات التذكيرات</span>
                </label>
              </div>

              <div className="form-group">
                <label className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={localPreferences.news_email}
                    onChange={(e) => handlePreferenceChange('news_email', e.target.checked)}
                  />
                  <span>إشعارات الأخبار</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-primary" onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      حفظ الإعدادات
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

