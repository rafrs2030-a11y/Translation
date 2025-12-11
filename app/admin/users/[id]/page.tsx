'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import { ALL_COUNTRIES } from '@/config/constants';

interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  country?: string;
  role: 'researcher' | 'admin' | 'super_admin';
  email_verified: boolean;
  account_type?: string;
  // Individual fields
  full_name?: string;
  national_id?: string;
  gender?: string;
  // Business fields
  organization_name?: string;
  organization_type?: string;
  commercial_registration_number?: string;
  created_at: string;
  updated_at?: string;
}

export default function AdminUserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, role } = useAuth();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    country: '',
    role: 'researcher' as 'researcher' | 'admin' | 'super_admin',
    // Individual fields
    full_name: '',
    national_id: '',
    gender: '',
    // Business fields
    organization_name: '',
    organization_type: '',
    commercial_registration_number: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || (role !== 'admin' && role !== 'super_admin'))) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, role, router]);

  useEffect(() => {
    if (params.id && isAuthenticated && (role === 'admin' || role === 'super_admin')) {
      fetchUser();
    }
  }, [params.id, isAuthenticated, role]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      setUser(data);
      setFormData({
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        country: data.country || '',
        role: data.role || 'researcher',
        // Individual fields
        full_name: data.full_name || '',
        national_id: data.national_id || '',
        gender: data.gender || '',
        // Business fields
        organization_name: data.organization_name || '',
        organization_type: data.organization_type || '',
        commercial_registration_number: data.commercial_registration_number || '',
      });
    } catch (error: any) {
      console.error('Error fetching user:', error);
      setMessage({ type: 'error', text: 'فشل تحميل بيانات المستخدم' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    setMessage(null);

    try {
      const supabase = createClient();
      
      // بناء بيانات التحديث
      const updateData: any = {
        username: formData.username,
        phone: formData.phone || null,
        country: formData.country || null,
        role: formData.role,
        updated_at: new Date().toISOString(),
      };

      const accountType = user.account_type || 'فرد';
      const isBusiness = accountType === 'أعمال';

      if (isBusiness) {
        // بيانات الأعمال
        updateData.organization_name = formData.organization_name || null;
        updateData.organization_type = formData.organization_type || null;
        updateData.commercial_registration_number = formData.commercial_registration_number || null;
      } else {
        // بيانات الأفراد
        updateData.full_name = formData.full_name || null;
        updateData.national_id = formData.national_id || null;
        updateData.gender = formData.gender || null;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) throw updateError;

      setMessage({ type: 'success', text: 'تم تحديث بيانات المستخدم بنجاح' });
      showToast('تم تحديث بيانات المستخدم بنجاح', 'success');
      await fetchUser();
    } catch (error: any) {
      console.error('Error updating user:', error);
      setMessage({ type: 'error', text: 'فشل تحديث بيانات المستخدم' });
      showToast('فشل تحديث بيانات المستخدم', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>جاري تحميل بيانات المستخدم...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (role !== 'admin' && role !== 'super_admin') || !user) {
    return null;
  }

  const accountType = user.account_type || 'فرد';
  const isBusiness = accountType === 'أعمال';

  return (
    <div className="dashboard-page dashboard-layout">
      <AdminSidebar />
      <main className="main-content">
        <AdminTopbar />

        <div className="dashboard-content">
          <div className="page-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <Link href="/admin/users" className="btn btn-outline">
              <i className="fas fa-arrow-right"></i>
              العودة إلى القائمة
            </Link>
            <div>
              <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>تفاصيل المستخدم</h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                <span className={`badge badge-${isBusiness ? 'info' : 'primary'}`} style={{ fontSize: 'var(--font-size-xs)', marginLeft: '0.5rem' }}>
                  {isBusiness ? 'حساب أعمال' : 'حساب أفراد'}
                </span>
                <span className={`badge badge-${user.role === 'admin' || user.role === 'super_admin' ? 'error' : 'info'}`} style={{ fontSize: 'var(--font-size-xs)', marginLeft: '0.5rem' }}>
                  {user.role === 'admin' || user.role === 'super_admin' ? 'مدير' : 'باحث'}
                </span>
              </p>
            </div>
          </div>

          {message && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
              <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
              <span>{message.text}</span>
            </div>
          )}

          {/* Main Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-lg)' }}>
            {/* Left Column - User Details Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fas fa-user-edit"></i>
                    تعديل بيانات المستخدم
                  </h2>
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

                    <div className="form-group">
                      <label htmlFor="role" className="form-label required">الدور</label>
                      <div className="input-with-icon">
                        <i className="fas fa-user-shield"></i>
                        <select
                          id="role"
                          name="role"
                          className="form-select"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="researcher">باحث</option>
                          <option value="admin">مدير</option>
                          {role === 'super_admin' && (
                            <option value="super_admin">مدير عام</option>
                          )}
                        </select>
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
                              placeholder="أدخل الاسم الكامل"
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
                          <label htmlFor="organization_name" className="form-label">اسم الجهة</label>
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
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="organization_type" className="form-label">نوع الجهة</label>
                          <div className="input-with-icon">
                            <i className="fas fa-briefcase"></i>
                            <select
                              id="organization_type"
                              name="organization_type"
                              className="form-select"
                              value={formData.organization_type}
                              onChange={handleInputChange}
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
                          <label htmlFor="commercial_registration_number" className="form-label">رقم السجل التجاري</label>
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
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="form-actions" style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-color)' }}>
                      <button type="submit" className="btn btn-primary btn-large" disabled={updating}>
                        {updating ? (
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

            {/* Right Column - User Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {/* Account Info */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fas fa-info-circle"></i>
                    معلومات الحساب
                  </h2>
                </div>
                <div className="card-body">
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-envelope" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                        البريد الإلكتروني:
                      </label>
                      <span style={{ fontWeight: 600 }}>{user.email}</span>
                    </div>
                    
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-shield-alt" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                        حالة البريد:
                      </label>
                      <span>
                        {user.email_verified ? (
                          <span className="badge badge-success">
                            <i className="fas fa-check"></i> مفعّل
                          </span>
                        ) : (
                          <span className="badge badge-warning">
                            <i className="fas fa-times"></i> غير مفعّل
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="detail-item">
                      <label>
                        <i className="fas fa-calendar-plus" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                        تاريخ التسجيل:
                      </label>
                      <span style={{ fontWeight: 600 }}>
                        {new Date(user.created_at).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {user.updated_at && (
                      <div className="detail-item">
                        <label>
                          <i className="fas fa-clock" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                          آخر تحديث:
                        </label>
                        <span style={{ fontWeight: 600 }}>
                          {new Date(user.updated_at).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fas fa-bolt"></i>
                    إجراءات سريعة
                  </h2>
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        if (confirm('هل أنت متأكد من تغيير دور المستخدم؟')) {
                          const newRole = user.role === 'admin' || user.role === 'super_admin' ? 'researcher' : 'admin';
                          setFormData(prev => ({ ...prev, role: newRole }));
                        }
                      }}
                    >
                      <i className={`fas fa-${user.role === 'admin' || user.role === 'super_admin' ? 'user' : 'user-shield'}`}></i>
                      {user.role === 'admin' || user.role === 'super_admin' ? 'تحويل إلى باحث' : 'تحويل إلى مدير'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

