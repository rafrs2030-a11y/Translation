'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, loading, error, isAuthenticated, role } = useAuth();
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('البريد الإلكتروني وكلمة المرور مطلوبان');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      // Router will be handled by AuthContext
    } else {
      setLocalError(result.error || 'حدث خطأ أثناء تسجيل الدخول');
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  // Show loading only during initial auth check (first render)
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // After initial check, stop showing loading overlay
    if (!loading) {
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Show loading if checking authentication (only during initial load)
  if (initialLoading && loading && !isAuthenticated) {
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
  if (isAuthenticated && role) {
    return null;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link href="/" className="auth-logo">
              <Image
                src="/images/logo.png"
                alt="Research Assistant Logo"
                className="auth-logo-img"
                width={200}
                height={60}
                style={{ height: 'auto', objectFit: 'contain' }}
                priority
              />
            </Link>
            <h1>تسجيل الدخول</h1>
            <p>مرحباً بعودتك! سجل دخولك للوصول إلى حسابك</p>
          </div>

          {(error || localError) && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error || localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label required">البريد الإلكتروني</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="example@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label required">كلمة المرور</label>
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </button>
              </div>
            </div>

            <div className="form-options">
              <div className="checkbox-group">
                <input type="checkbox" id="remember" name="remember" />
                <label htmlFor="remember">تذكرني</label>
              </div>
              <Link href="/forgot-password" className="link-primary">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>أو</span>
          </div>

          <div className="auth-footer">
            <p>ليس لديك حساب؟</p>
            <Link href="/register" className="btn btn-outline btn-block">
              <i className="fas fa-user-plus"></i>
              إنشاء حساب جديد
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
          <Image
            src="/images/logob.png"
            alt="باكورة التقنيات"
            className="developer-logo"
            width={24}
            height={24}
            loading="lazy"
          />
          <span>تم تطوير المنصة بواسطة الحاضنة الرقمية باكورة التقنيات</span>
        </a>
      </div>
    </div>
  );
}

