'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { createClient } from '@/lib/supabase/client';
import { ALL_COUNTRIES } from '@/config/constants';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    country: '',
    // Individual fields
    full_name: '',
    national_id: '',
    gender: '',
    // Business fields
    organization_name: '',
    organization_type: '',
    commercial_registration_number: '',
  });
  
  const accountType = user?.account_type || 'فرد';
  const isBusiness = accountType === 'أعمال';

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        // Individual fields
        full_name: user.full_name || '',
        national_id: user.national_id || '',
        gender: user.gender || '',
        // Business fields
        organization_name: user.organization_name || '',
        organization_type: user.organization_type || '',
        commercial_registration_number: user.commercial_registration_number || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const supabase = createClient();
      
      // بناء بيانات التحديث حسب نوع الحساب
      const updateData: any = {
        username: formData.username,
        phone: formData.phone,
        country: formData.country,
        updated_at: new Date().toISOString(),
      };

      if (isBusiness) {
        // بيانات الأعمال
        updateData.organization_name = formData.organization_name;
        updateData.organization_type = formData.organization_type;
        updateData.commercial_registration_number = formData.commercial_registration_number;
      } else {
        // بيانات الأفراد
        updateData.full_name = formData.full_name;
        updateData.national_id = formData.national_id;
        updateData.gender = formData.gender;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user?.id);

      if (updateError) throw updateError;

      await refreshUserData();
      setSuccess('تم تحديث الملف الشخصي بنجاح');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('فشل تحديث الملف الشخصي: ' + err.message);
    } finally {
      setLoading(false);
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
            <h1>الملف الشخصي</h1>
          </div>

          {error && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle"></i>
              <span>{success}</span>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h3>معلومات الحساب</h3>
              <span className={`badge badge-${isBusiness ? 'info' : 'primary'}`} style={{ fontSize: 'var(--font-size-sm)' }}>
                {isBusiness ? 'حساب أعمال' : 'حساب أفراد'}
              </span>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* الحقول المشتركة */}
                <div className="form-group">
                  <label htmlFor="username" className="form-label required">اسم المستخدم</label>
                  <div className="input-with-icon">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-input"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
                  <div className="input-with-icon">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      value={formData.email}
                      disabled
                    />
                  </div>
                  <small className="form-help">لا يمكن تغيير البريد الإلكتروني</small>
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">رقم الجوال</label>
                  <div className="input-with-icon">
                    <i className="fas fa-phone"></i>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+966 50 123 4567"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country" className="form-label">الدولة</label>
                  <div className="input-with-icon">
                    <i className="fas fa-globe"></i>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      className="form-input"
                      list="countries-list"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="ابحث عن الدولة أو اختر من القائمة"
                      autoComplete="off"
                    />
                    <datalist id="countries-list">
                      {ALL_COUNTRIES.map((country) => (
                        <option key={country} value={country} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* حقول الأفراد */}
                {!isBusiness && (
                  <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-color)' }}>
                    <h4 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
                      <i className="fas fa-user" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                      معلومات الأفراد
                    </h4>
                    
                    <div className="form-group">
                      <label htmlFor="full_name" className="form-label">الاسم الكامل</label>
                      <div className="input-with-icon">
                        <i className="fas fa-id-card"></i>
                        <input
                          type="text"
                          id="full_name"
                          name="full_name"
                          className="form-input"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="national_id" className="form-label">رقم الهوية / الإقامة / الجواز</label>
                      <div className="input-with-icon">
                        <i className="fas fa-id-badge"></i>
                        <input
                          type="text"
                          id="national_id"
                          name="national_id"
                          className="form-input"
                          value={formData.national_id}
                          onChange={handleInputChange}
                          placeholder="1234567890"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="gender" className="form-label">الجنس</label>
                      <div className="input-with-icon">
                        <i className="fas fa-venus-mars"></i>
                        <select
                          id="gender"
                          name="gender"
                          className="form-select"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="">اختر...</option>
                          <option value="ذكر">ذكر</option>
                          <option value="أنثى">أنثى</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* حقول الأعمال */}
                {isBusiness && (
                  <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-color)' }}>
                    <h4 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
                      <i className="fas fa-building" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                      معلومات المؤسسة
                    </h4>
                    
                    <div className="form-group">
                      <label htmlFor="organization_name" className="form-label required">اسم الجهة</label>
                      <div className="input-with-icon">
                        <i className="fas fa-building"></i>
                        <input
                          type="text"
                          id="organization_name"
                          name="organization_name"
                          className="form-input"
                          value={formData.organization_name}
                          onChange={handleInputChange}
                          placeholder="أدخل اسم الجهة"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="organization_type" className="form-label required">نوع الجهة</label>
                      <div className="input-with-icon">
                        <i className="fas fa-briefcase"></i>
                        <select
                          id="organization_type"
                          name="organization_type"
                          className="form-select"
                          value={formData.organization_type}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">اختر نوع الجهة</option>
                          <option value="جامعة">جامعة</option>
                          <option value="هيئة">هيئة</option>
                          <option value="جهات حكومية">جهات حكومية</option>
                          <option value="قطاع خاص">قطاع خاص</option>
                          <option value="قطاع غير ربحي">قطاع غير ربحي</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="commercial_registration_number" className="form-label required">رقم السجل التجاري</label>
                      <div className="input-with-icon">
                        <i className="fas fa-id-badge"></i>
                        <input
                          type="text"
                          id="commercial_registration_number"
                          name="commercial_registration_number"
                          className="form-input"
                          value={formData.commercial_registration_number}
                          onChange={handleInputChange}
                          placeholder="أدخل رقم السجل التجاري"
                          required
                        />
                      </div>
                      <small className="form-help">رقم السجل التجاري للمؤسسة</small>
                    </div>
                  </div>
                )}

                <div className="form-actions" style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-color)' }}>
                  <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                    {loading ? (
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
        </div>
      </main>
    </div>
  );
}

