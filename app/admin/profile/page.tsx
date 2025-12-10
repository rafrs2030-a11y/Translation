'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';

export default function AdminProfilePage() {
  const { user, isAuthenticated, loading: authLoading, role, refreshUserData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    country: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || role !== 'admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, role, router]);

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        country: (user as any).country || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('users')
        .update({
          username: profileData.username,
          phone: profileData.phone || null,
          country: profileData.country || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      await refreshUserData();
      setMessage({ type: 'success', text: 'تم تحديث الملف الشخصي بنجاح' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'فشل تحديث الملف الشخصي' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'كلمات المرور غير متطابقة' });
      setSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
      setSaving(false);
      return;
    }

    try {
      const supabase = createClient();

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'تم تحديث كلمة المرور بنجاح' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      setMessage({ type: 'error', text: 'فشل تحديث كلمة المرور' });
    } finally {
      setSaving(false);
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

  if (!isAuthenticated || role !== 'admin') {
    return null;
  }

  return (
    <div className="dashboard-page dashboard-layout">
      <AdminSidebar />
      <main className="main-content">
        <AdminTopbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>الملف الشخصي</h1>
          </div>

          {message && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
              <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
              <span>{message.text}</span>
            </div>
          )}

          {/* Profile Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">المعلومات الشخصية</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label htmlFor="username" className="form-label required">
                    اسم المستخدم
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-input"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label required">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    value={profileData.email}
                    disabled
                  />
                  <small className="form-help">لا يمكن تغيير البريد الإلكتروني</small>
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    رقم الجوال
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="form-input"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={saving}
                    placeholder="+966 50 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country" className="form-label">
                    الدولة
                  </label>
                  <input
                    type="text"
                    id="country"
                    className="form-input"
                    value={profileData.country}
                    onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                    disabled={saving}
                    placeholder="المملكة العربية السعودية"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary btn-large"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i>
                        حفظ التغييرات
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">تغيير كلمة المرور</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handlePasswordUpdate}>
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label required">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="form-input"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    disabled={saving}
                    minLength={6}
                    placeholder="6 أحرف على الأقل"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label required">
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-input"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    disabled={saving}
                    minLength={6}
                    placeholder="أعد إدخال كلمة المرور"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary btn-large"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        جاري التحديث...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-key"></i>
                        تحديث كلمة المرور
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

