'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (token && type === 'signup') {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email',
          });

          if (error) {
            setStatus('error');
            setMessage('فشل التحقق من البريد الإلكتروني. يرجى المحاولة مرة أخرى.');
          } else {
            setStatus('success');
            setMessage('تم التحقق من بريدك الإلكتروني بنجاح! سيتم توجيهك إلى لوحة التحكم.');
            
            // Get user role and redirect to appropriate dashboard
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data: userData } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single();
              
              const userRole = userData?.role || 'researcher';
              setTimeout(() => {
                // Handle all role types including super_admin
                if (userRole === 'admin' || userRole === 'super_admin') {
                  router.push('/admin/dashboard');
                } else if (userRole === 'researcher') {
                  router.push('/researcher/dashboard');
                } else {
                  // Fallback to researcher dashboard
                  router.push('/researcher/dashboard');
                }
              }, 2000);
            } else {
              setTimeout(() => {
                router.push('/login');
              }, 2000);
            }
          }
        } catch (err) {
          setStatus('error');
          setMessage('حدث خطأ أثناء التحقق من البريد الإلكتروني.');
        }
      } else {
        setStatus('error');
        setMessage('رابط التحقق غير صحيح أو منتهي الصلاحية.');
      }
    };

    verifyEmail();
  }, [searchParams, router, supabase]);

  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <Link href="/">
              <img src="/images/logo.png" alt="Research Assistant Logo" className="brand-logo" width="120" height="28" loading="eager" />
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
              <img src="/images/logo.png" alt="Logo" className="auth-logo" />
              <h1>التحقق من البريد الإلكتروني</h1>
            </div>

          {status === 'loading' && (
            <div className="text-center">
              <div className="loading-spinner" style={{ margin: '2rem auto' }}></div>
              <p>جاري التحقق من بريدك الإلكتروني...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle"></i>
              <div>
                <p>{message}</p>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                  سيتم توجيهك إلى صفحة تسجيل الدخول تلقائياً...
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <>
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle"></i>
                <p>{message}</p>
              </div>
              <div className="auth-footer">
                <Link href="/login" className="btn btn-primary">
                  <i className="fas fa-sign-in-alt"></i>
                  تسجيل الدخول
                </Link>
                <Link href="/register" className="btn btn-outline">
                  <i className="fas fa-user-plus"></i>
                  إنشاء حساب جديد
                </Link>
              </div>
            </>
          )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <img src="/images/logo.png" alt="Research Assistant Logo" className="footer-logo" style={{ maxWidth: '200px', marginBottom: '1rem', aspectRatio: '3/1', height: 'auto', objectFit: 'contain' }} width="200" height="67" loading="lazy" />
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

export default function VerifyEmailPage() {
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
      <VerifyEmailContent />
    </Suspense>
  );
}

