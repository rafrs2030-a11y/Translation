'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';

interface PlatformSettings {
  email_notifications: boolean;
  email_new_submission: boolean;
  email_status_change: boolean;
  maintenance_mode: boolean;
  allow_registration: boolean;
}

export default function AdminSettingsPage() {
  const { isAuthenticated, loading: authLoading, role } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const [settings, setSettings] = useState<PlatformSettings>({
    email_notifications: true,
    email_new_submission: true,
    email_status_change: true,
    maintenance_mode: false,
    allow_registration: true,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || role !== 'admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, role, router]);

  useEffect(() => {
    if (isAuthenticated && role === 'admin') {
      fetchSettings();
    }
  }, [isAuthenticated, role]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      const settingsMap: Partial<PlatformSettings> = {};
      data?.forEach((item: { setting_key: string; setting_value: string }) => {
        const key = item.setting_key as keyof PlatformSettings;
        settingsMap[key] = item.setting_value === 'true';
      });

      setSettings({
        email_notifications: settingsMap.email_notifications ?? true,
        email_new_submission: settingsMap.email_new_submission ?? true,
        email_status_change: settingsMap.email_status_change ?? true,
        maintenance_mode: settingsMap.maintenance_mode ?? false,
        allow_registration: settingsMap.allow_registration ?? true,
      });
    } catch (error: any) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();

      // Update or insert each setting
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value.toString(),
      }));

      // Delete existing settings
      await supabase.from('platform_settings').delete().in('setting_key', Object.keys(settings));

      // Insert new settings
      const { error } = await supabase.from('platform_settings').insert(updates);

      if (error) throw error;

      setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح' });
      showToast('تم حفظ الإعدادات بنجاح', 'success');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'فشل حفظ الإعدادات' });
      showToast('فشل حفظ الإعدادات', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: keyof PlatformSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
            <h1>إعدادات النظام</h1>
          </div>

          {message && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
              <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
              <span>{message.text}</span>
            </div>
          )}

          {loading ? (
            <div className="loading-placeholder">
              <div className="loading-spinner"></div>
              <p>جاري تحميل الإعدادات...</p>
              <div style={{ width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
                <div className="skeleton skeleton-text" style={{ marginBottom: '0.5rem' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '80%', marginBottom: '0.5rem' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fas fa-envelope"></i>
                  إعدادات البريد الإلكتروني
                </h2>
              </div>
              <div className="card-body">
                <div className="settings-list">
                  <div className="setting-item">
                    <div className="setting-info">
                      <label htmlFor="email_notifications" className="setting-label">
                        تفعيل إشعارات البريد الإلكتروني
                      </label>
                      <p className="setting-description">
                        تفعيل أو تعطيل جميع إشعارات البريد الإلكتروني في النظام
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        id="email_notifications"
                        checked={settings.email_notifications}
                        onChange={(e) => handleSettingChange('email_notifications', e.target.checked)}
                        disabled={saving}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label htmlFor="email_new_submission" className="setting-label">
                        إشعار عند طلب جديد
                      </label>
                      <p className="setting-description">
                        إرسال إشعار بريد إلكتروني عند تقديم طلب جديد
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        id="email_new_submission"
                        checked={settings.email_new_submission}
                        onChange={(e) => handleSettingChange('email_new_submission', e.target.checked)}
                        disabled={saving || !settings.email_notifications}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label htmlFor="email_status_change" className="setting-label">
                        إشعار عند تغيير الحالة
                      </label>
                      <p className="setting-description">
                        إرسال إشعار بريد إلكتروني عند تغيير حالة الطلب
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        id="email_status_change"
                        checked={settings.email_status_change}
                        onChange={(e) => handleSettingChange('email_status_change', e.target.checked)}
                        disabled={saving || !settings.email_notifications}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">إعدادات النظام العامة</h2>
            </div>
            <div className="card-body">
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <label htmlFor="maintenance_mode" className="setting-label">
                      وضع الصيانة
                    </label>
                    <p className="setting-description">
                      تفعيل وضع الصيانة لإيقاف الوصول العام للمنصة
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      id="maintenance_mode"
                      checked={settings.maintenance_mode}
                      onChange={(e) => handleSettingChange('maintenance_mode', e.target.checked)}
                      disabled={saving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label htmlFor="allow_registration" className="setting-label">
                      السماح بالتسجيل
                    </label>
                    <p className="setting-description">
                      السماح للمستخدمين الجدد بالتسجيل في المنصة
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      id="allow_registration"
                      checked={settings.allow_registration}
                      onChange={(e) => handleSettingChange('allow_registration', e.target.checked)}
                      disabled={saving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-primary btn-large"
              onClick={saveSettings}
              disabled={saving || loading}
            >
              {saving ? (
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
      </main>
    </div>
  );
}

