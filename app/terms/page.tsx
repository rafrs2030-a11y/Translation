import Link from 'next/link';
import { readFile } from 'fs/promises';
import { join } from 'path';

async function getTermsContent() {
  try {
    const filePath = join(process.cwd(), 'docs', 'الشروط و الاحكام.md');
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch {
    return null;
  }
}

export default async function TermsPage() {
  const content = await getTermsContent();

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

      {/* Legal Content */}
      <div className="legal-page">
        <div className="container">
          <div className="legal-container">
            <div className="legal-header">
              <h1>الشروط والأحكام</h1>
              <div className="company-info">
                <strong>شركة مساعد البحث للبحوث والدراسات (RAFRS)</strong><br />
                الموقع: com.rafrs<br />
                البريد: info@rafrs.com
              </div>
            </div>
            <div className="legal-content">
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
              ) : (
                <>
                  <h2>أولًا: الوصول إلى الموقع</h2>
                  <p>أنت المسؤول عن جميع المتطلبات اللازمة للوصول إلى الموقع. تحتفظ RAFRS بحق تعديل أو تعليق أو إيقاف الموقع أو أي جزء منه في أي وقت دون إشعار.</p>

                  <h2>ثانيًا: حقوق الملكية الفكرية</h2>
                  <p>جميع المحتوى والخدمات والمعلومات والتصاميم والصور والميزات مملوكة لـ RAFRS أو مرخّصة لها ومحمية بقوانين الملكية الفكرية.</p>

                  <h2>ثالثًا: التزامات المستخدم</h2>
                  <p>يتعهد المستخدم باستخدام الموقع بشكل قانوني ومتوافق مع الأنظمة وعدم إرسال أو تحميل مواد مخالفة أو مسيئة أو غير قانونية.</p>

                  <h2>رابعًا: معايير المحتوى</h2>
                  <p>يجب أن يكون المحتوى المقدم دقيقاً وصحيحاً ومتوافقاً مع المعايير الأكاديمية والعلمية.</p>

                  <h2>خامسًا: الخدمات والدفع</h2>
                  <p>جميع الخدمات المقدمة تخضع للشروط والأحكام المتفق عليها. يتم الدفع وفقاً للطرق المحددة في الموقع.</p>

                  <h2>سادسًا: إخلاء المسؤولية</h2>
                  <p>لا تضمن RAFRS أن المحتوى كامل أو خالٍ من الأخطاء. يتم تقديم الخدمات "كما هي" دون أي ضمانات.</p>

                  <h2>سابعًا: التعديلات</h2>
                  <p>تحتفظ RAFRS بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم إشعار المستخدمين بأي تغييرات جوهرية.</p>

                  <h2>ثامنًا: القانون الحاكم</h2>
                  <p>تخضع هذه الشروط والأحكام لقوانين المملكة العربية السعودية.</p>
                </>
              )}
            </div>
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

