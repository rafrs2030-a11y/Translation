'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type AccountType = 'أفراد' | 'أعمال' | '';

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<AccountType>('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    // Individual fields
    full_name: '',
    national_id: '',
    gender: '',
    // Business fields
    organization_name: '',
    organization_type: '',
  });
  const [localError, setLocalError] = useState('');
  const { register, loading, error, isAuthenticated, role } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
        if (role === 'admin' || role === 'super_admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/researcher/dashboard');
      }
    }
  }, [isAuthenticated, loading, role, router]);

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
    setLocalError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validation
    if (!accountType) {
      setLocalError('يرجى اختيار نوع الحساب');
      return;
    }

    if (accountType === 'أفراد') {
      if (!formData.full_name || !formData.national_id || !formData.gender) {
        setLocalError('يرجى ملء جميع الحقول المطلوبة للأفراد');
        return;
      }
    } else if (accountType === 'أعمال') {
      if (!formData.organization_name || !formData.organization_type) {
        setLocalError('يرجى ملء جميع الحقول المطلوبة للأعمال');
        return;
      }
    }

    if (!formData.email || !formData.password) {
      setLocalError('البريد الإلكتروني وكلمة المرور مطلوبان');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('كلمات المرور غير متطابقة');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    const userData = {
      username: accountType === 'أعمال' ? formData.organization_name : formData.full_name,
      email: formData.email,
      password: formData.password,
      account_type: accountType,
      phone: formData.phone,
      country: formData.country,
      ...(accountType === 'أفراد' ? {
        full_name: formData.full_name,
        national_id: formData.national_id,
        gender: formData.gender,
      } : {
        organization_name: formData.organization_name,
        organization_type: formData.organization_type,
      }),
    };

    const result = await register(userData);
    if (result.success) {
      router.push('/verify-email');
    } else {
      setLocalError(result.error || 'حدث خطأ أثناء التسجيل');
    }
  };

  // Show loading if checking authentication
  if (loading && !isAuthenticated) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="text-center">
              <div className="loading-spinner" style={{ margin: '2rem auto' }}></div>
              <p>جاري التحقق...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render form if already authenticated (redirect will happen)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card register-card">
            <div className="auth-header">
              <Link href="/" className="auth-logo">
                <img src="/images/logo.png" alt="Research Assistant Logo" className="auth-logo-img" />
              </Link>
              <h1>إنشاء حساب جديد</h1>
              <p>انضم إلى آلاف الباحثين العرب</p>
            </div>

          {(error || localError) && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error || localError}</span>
            </div>
          )}

          {!accountType ? (
            <div className="account-type-selection">
              <h3 className="account-type-title">اختر نوع الحساب</h3>
              <div className="account-type-options">
                <div
                  className="account-type-option"
                  onClick={() => handleAccountTypeSelect('أفراد')}
                >
                  <div className="account-type-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="account-type-label">أفراد</div>
                </div>
                <div
                  className="account-type-option"
                  onClick={() => handleAccountTypeSelect('أعمال')}
                >
                  <div className="account-type-icon">
                    <i className="fas fa-building"></i>
                  </div>
                  <div className="account-type-label">أعمال</div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {accountType === 'أفراد' && (
                <div id="individual-fields">
                  <div className="form-group">
                    <label htmlFor="full_name" className="form-label required">الاسم الكامل</label>
                    <div className="input-with-icon">
                      <i className="fas fa-user"></i>
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        className="form-input"
                        placeholder="أدخل اسمك الكامل"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="national_id" className="form-label required">رقم الهوية / الإقامة / الجواز</label>
                    <div className="input-with-icon">
                      <i className="fas fa-id-card"></i>
                      <input
                        type="text"
                        id="national_id"
                        name="national_id"
                        className="form-input"
                        placeholder="1234567890"
                        value={formData.national_id}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender" className="form-label required">الجنس</label>
                    <div className="input-with-icon">
                      <i className="fas fa-venus-mars"></i>
                      <select
                        id="gender"
                        name="gender"
                        className="form-select"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">اختر...</option>
                        <option value="ذكر">ذكر</option>
                        <option value="أنثى">أنثى</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {accountType === 'أعمال' && (
                <div id="business-fields">
                  <div className="form-group">
                    <label htmlFor="organization_name" className="form-label required">اسم الجهة</label>
                    <div className="input-with-icon">
                      <i className="fas fa-building"></i>
                      <input
                        type="text"
                        id="organization_name"
                        name="organization_name"
                        className="form-input"
                        placeholder="أدخل اسم الجهة"
                        value={formData.organization_name}
                        onChange={handleInputChange}
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
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label required">البريد الإلكتروني</label>
                <div className="input-with-icon">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    autoComplete="email"
                  />
                </div>
                <small className="form-help">سنرسل رابط التحقق إلى هذا البريد</small>
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label required">رقم الجوال</label>
                <div className="input-with-icon">
                  <i className="fas fa-phone"></i>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    placeholder="+966 50 123 4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country" className="form-label required">الدولة</label>
                <div className="input-with-icon">
                  <i className="fas fa-globe"></i>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    className="form-input"
                    list="countries-list"
                    placeholder="ابحث عن الدولة أو اختر من القائمة"
                    value={formData.country}
                    onChange={handleInputChange}
                    autoComplete="off"
                    required
                  />
                  <datalist id="countries-list">
                    <option value="المملكة العربية السعودية" />
                    <option value="الإمارات العربية المتحدة" />
                    <option value="مصر" />
                    <option value="الأردن" />
                    <option value="لبنان" />
                    <option value="العراق" />
                    <option value="سوريا" />
                    <option value="المغرب" />
                    <option value="الجزائر" />
                    <option value="تونس" />
                    <option value="ليبيا" />
                    <option value="السودان" />
                    <option value="الكويت" />
                    <option value="قطر" />
                    <option value="البحرين" />
                    <option value="عمان" />
                    <option value="اليمن" />
                    <option value="فلسطين" />
                  </datalist>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label required">كلمة المرور</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="6 أحرف على الأقل"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label required">تأكيد كلمة المرور</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setAccountType('')}
                  disabled={loading}
                >
                  <i className="fas fa-arrow-right"></i>
                  رجوع
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      جاري التسجيل...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus"></i>
                      إنشاء الحساب
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="auth-footer">
            <p>لديك حساب بالفعل؟</p>
            <Link href="/login" className="btn btn-outline btn-block">
              <i className="fas fa-sign-in-alt"></i>
              سجل الدخول
            </Link>
          </div>

          <div className="auth-back">
            <Link href="/">
              <i className="fas fa-arrow-right"></i>
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="auth-bg">
          <div className="auth-bg-circle circle-1"></div>
          <div className="auth-bg-circle circle-2"></div>
          <div className="auth-bg-circle circle-3"></div>
        </div>
      </div>

      {/* Developer Credit */}
      <div className="developer-credit">
        <a href="https://wa.me/966533189111" target="_blank" rel="noopener noreferrer" className="developer-credit-content">
          <img src="/images/logob.png" alt="باكورة التقنيات" className="developer-logo" width="24" height="24" loading="lazy" />
          <span>تم تطوير المنصة بواسطة الحاضنة الرقمية باكورة التقنيات</span>
        </a>
      </div>
    </div>
  );
}

