'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Supabase sends tokens as URL fragments (#access_token=...&type=recovery)
    // We need to check both URL fragments and query parameters
    const checkToken = async () => {
      try {
        // Check URL fragments (hash) first - this is how Supabase sends recovery links
        if (typeof window !== 'undefined') {
          const hash = window.location.hash;
          const hashParams = new URLSearchParams(hash.substring(1)); // Remove #
          const accessToken = hashParams.get('access_token');
          const type = hashParams.get('type');

          // Also check query parameters (for backward compatibility)
          const tokenFromQuery = searchParams.get('token');
          const tokenFromHash = hashParams.get('token');

          // If we have access_token in hash, Supabase will handle it automatically
          // Just verify we have a valid session or token
          if (accessToken && type === 'recovery') {
            setIsValidToken(true);
            setError('');
            return;
          }

          // Check for token in query params (legacy support)
          if (tokenFromQuery || tokenFromHash) {
            setIsValidToken(true);
            setError('');
            return;
          }

          // Check if we have a session (user might have clicked the link and been redirected)
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsValidToken(true);
            setError('');
            return;
          }

          // No valid token found
          setIsValidToken(false);
          setError('رابط إعادة تعيين كلمة المرور غير صحيح أو منتهي الصلاحية. يرجى طلب رابط جديد.');
        }
      } catch (err: any) {
        console.error('Error checking token:', err);
        setIsValidToken(false);
        setError('حدث خطأ أثناء التحقق من الرابط. يرجى المحاولة مرة أخرى.');
      }
    };

    checkToken();
  }, [searchParams, supabase]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('يرجى إدخال كلمة المرور وتأكيدها');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      // First, check if we need to verify a token from URL
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        // If we have access_token in hash, Supabase will exchange it for a session automatically
        // We just need to update the password
        if (accessToken && type === 'recovery') {
          // The session should already be established by Supabase, but let's verify
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError || !session) {
            // Try to verify the OTP manually
            const tokenFromQuery = searchParams.get('token');
            const tokenFromHash = hashParams.get('token');

            if (tokenFromQuery || tokenFromHash) {
              const { error: verifyError } = await supabase.auth.verifyOtp({
                token_hash: tokenFromQuery || tokenFromHash || '',
                type: 'recovery',
              });

              if (verifyError) {
                setError(verifyError.message || 'فشل التحقق من الرابط. الرابط قد يكون منتهي الصلاحية.');
                setLoading(false);
                return;
              }
            } else {
              setError('رابط إعادة تعيين كلمة المرور غير صحيح أو منتهي الصلاحية.');
              setLoading(false);
              return;
            }
          }
        } else {
          // Check for token in query params (legacy support)
          const token = searchParams.get('token');
          if (token) {
            const { error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'recovery',
            });

            if (verifyError) {
              setError(verifyError.message || 'فشل التحقق من الرابط. الرابط قد يكون منتهي الصلاحية.');
              setLoading(false);
              return;
            }
          } else {
            // Check if we have an active session
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
              setError('رابط إعادة تعيين كلمة المرور غير صحيح أو منتهي الصلاحية. يرجى طلب رابط جديد.');
              setLoading(false);
              return;
            }
          }
        }
      }

      // Update password - this requires an active session
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message || 'فشل تحديث كلمة المرور. يرجى المحاولة مرة أخرى.');
      } else {
        setMessage('تم تحديث كلمة المرور بنجاح! سيتم توجيهك إلى صفحة تسجيل الدخول...');
        // Clear the hash from URL
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', window.location.pathname);
        }
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Research Assistant Logo"
                className="brand-logo"
                width={120}
                height={28}
                priority
              />
            </Link>
            <span className="commercial-registry">
              <i className="fas fa-certificate" aria-hidden="true"></i>
              <span className="cr-label">سجل تجاري:</span>
              <span className="cr-number">1009007814</span>
            </span>
          </div>
          <div className="nav-actions">
            <Link href="/login" className="btn btn-outline">تسجيل الدخول</Link>
            <Link href="/register" className="btn btn-primary">حساب جديد</Link>
          </div>
        </div>
      </nav>

      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <Image
                src="/images/logo.png"
                alt="Logo"
                className="auth-logo"
                width={160}
                height={40}
                priority
              />
              <h1>إعادة تعيين كلمة المرور</h1>
              <p>أدخل كلمة المرور الجديدة</p>
            </div>

            {isValidToken === false && !error && (
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle"></i>
                <span>رابط إعادة تعيين كلمة المرور غير صحيح أو منتهي الصلاحية. يرجى طلب رابط جديد من <Link href="/forgot-password">صفحة نسيت كلمة المرور</Link>.</span>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="alert alert-success">
                <i className="fas fa-check-circle"></i>
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="password" className="form-label required">
                  كلمة المرور الجديدة
                </label>
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
                    placeholder="6 أحرف على الأقل"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label required">
                  تأكيد كلمة المرور
                </label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="أعد إدخال كلمة المرور"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    <i className={showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={loading || isValidToken === false}
              >
                {loading ? (
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
            </form>

            <div className="auth-footer">
              <p>
                <Link href="/login" className="auth-link">
                  <i className="fas fa-arrow-right"></i>
                  العودة إلى تسجيل الدخول
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <Image
                src="/images/logo.png"
                alt="Research Assistant Logo"
                className="footer-logo"
                style={{ maxWidth: '200px', marginBottom: '1rem', aspectRatio: '3/1', height: 'auto', objectFit: 'contain' }}
                width={200}
                height={67}
                loading="lazy"
              />
              <h4 style={{ marginBottom: '1rem', color: 'white' }}>المنصة العالمية لنشر الأبحاث والدراسات العربية إلى الإنجليزية</h4>
              <p>تتشرف المنصة العالمية لنشر الأبحاث العربية إلى الإنجليزية الخاصة بشركة مساعد البحث للبحوث والدراسات باستقبال طلباتكم وأبحاثكم لنشرها في مجلات عالمية علمية محكمة <span className="no-break-text">ISI- Scopus (Q1-Q2-Q3-Q4)</span>.<br /><br />
                وذلك لتمكين الهيئات والجامعات والمؤسسات والباحث الأكاديمي من النشر العالمي لأبحاثهم العلمية العربية عالمياً.</p>
            </div>
            <div className="footer-section">
              <h4>روابط سريعة</h4>
              <ul>
                <li><Link href="/">الرئيسية</Link></li>
                <li><Link href="/register">التسجيل</Link></li>
                <li><Link href="/login">تسجيل الدخول</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>الدعم</h4>
              <ul>
                <li><a href="#">الأسئلة الشائعة</a></li>
                <li><a href="#">المساعدة</a></li>
                <li><Link href="/terms">الشروط والأحكام</Link></li>
                <li><Link href="/privacy">سياسة الخصوصية</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>تواصل معنا</h4>
              <ul className="contact-info">
                <li>
                  <i className="fas fa-envelope" aria-hidden="true"></i>
                  <a href="mailto:info@rafrs.com" aria-label="أرسل بريد إلكتروني إلى info@rafrs.com">info@rafrs.com</a>
                </li>
                <li>
                  <i className="fas fa-phone" aria-hidden="true"></i>
                  <a href="tel:+966580002284" aria-label="اتصل بنا على +966580002284">+966 58 000 2284</a>
                </li>
                <li>
                  <i className="fab fa-whatsapp" aria-hidden="true"></i>
                  <a href="https://wa.me/966580002284" target="_blank" rel="noopener noreferrer" aria-label="تواصل معنا عبر واتساب">تواصل عبر واتساب</a>
                </li>
                <li>
                  <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                  <span>3727 ريحانة بنت زيد - 8602 حي النرجس ، 13339</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2025 منصة نشر الأبحاث العربية. جميع الحقوق محفوظة.</p>
              <div className="developer-credit-inline">
                <a href="https://wa.me/966533189111" target="_blank" rel="noopener noreferrer" className="developer-credit-content" aria-label="تواصل مع باكورة التقنيات - مطور المنصة">
                  <span className="developer-text">تم تطوير المنصة بواسطة الحاضنة الرقمية باكورة التقنيات</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="text-center">
              <div className="loading-spinner" style={{ margin: '2rem auto' }}></div>
              <p>جاري التحميل...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

