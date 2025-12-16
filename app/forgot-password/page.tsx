'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email) {
      setError('البريد الإلكتروني مطلوب');
      setLoading(false);
      return;
    }

    try {
      // Get the full origin including protocol
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/reset-password`
        : 'https://res-assistant.com/reset-password';

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
        emailRedirectTo: redirectUrl,
      });

      if (error) {
        console.error('Password reset error:', error);
        // Provide more helpful error messages
        if (error.message.includes('rate limit')) {
          setError('تم إرسال الكثير من الطلبات. يرجى المحاولة مرة أخرى لاحقاً.');
        } else if (error.message.includes('email')) {
          setError('البريد الإلكتروني غير صحيح أو غير مسجل.');
        } else {
          setError(error.message || 'حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.');
        }
      } else {
        setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.');
        setEmail(''); // Clear email after success
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.');
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
              <h1>نسيت كلمة المرور</h1>
              <p>أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</p>
            </div>

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
              <label htmlFor="email" className="form-label required">
                البريد الإلكتروني
              </label>
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
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  إرسال رابط إعادة التعيين
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              تذكرت كلمة المرور؟{' '}
              <Link href="/login" className="auth-link">
                سجل الدخول
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

