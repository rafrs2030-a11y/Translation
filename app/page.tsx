import Link from 'next/link';
import Image from 'next/image';
import './globals.css';

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <Image
              src="/images/logo.png"
              alt="Research Assistant Logo"
              className="brand-logo"
              width={150}
              height={45}
              style={{ height: 'auto', objectFit: 'contain', maxHeight: '50px' }}
              priority
            />
            <span className="commercial-registry">
              <i className="fas fa-certificate" aria-hidden="true"></i>
              <span className="cr-label">سجل تجاري:</span>
              <span className="cr-number">1009007814</span>
            </span>
          </div>
          <ul className="nav-menu" role="navigation" aria-label="القائمة الرئيسية">
            <li><a href="#features" aria-label="انتقل إلى قسم الميزات"><i className="fas fa-star" aria-hidden="true"></i> <span>الميزات</span></a></li>
            <li><a href="#how-it-works" aria-label="انتقل إلى قسم كيف يعمل"><i className="fas fa-cogs" aria-hidden="true"></i> <span>كيف يعمل</span></a></li>
            <li><a href="#contact" aria-label="انتقل إلى قسم التواصل معنا"><i className="fas fa-envelope" aria-hidden="true"></i> <span>تواصل معنا</span></a></li>
          </ul>
          <div className="nav-actions">
            <Link href="/login" className="btn btn-outline" aria-label="تسجيل الدخول إلى حسابك">تسجيل الدخول</Link>
            <Link href="/register" className="btn btn-primary" aria-label="إنشاء حساب جديد">حساب جديد</Link>
          </div>
          <button className="mobile-menu-toggle" aria-label="فتح القائمة">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="highlight">المنصة العالمية لنشر الأبحاث والدراسات العربية إلى الإنجليزية</span>
            </h1>
            <p className="hero-description">
              تتشرف المنصة العالمية لنشر الأبحاث والدراسات العربية إلى الإنجليزية الخاصة بشركة مساعد البحث للبحوث والدراسات باستقبال طلباتكم وأبحاثكم لنشرها في مجلات عالمية علمية محكمة <span className="no-break-text">ISI- Scopus (Q1-Q2-Q3-Q4)</span>.<br /><br />
              وذلك لتمكين الهيئات والجامعات والمؤسسات والباحث الأكاديمي من النشر العالمي لأبحاثهم العلمية العربية عالمياً.
            </p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary btn-large" aria-label="ابدأ معنا لتحقيق هذا المشروع علمياً وعالمياً - إنشاء حساب جديد">
                <i className="fas fa-rocket" aria-hidden="true"></i>
                ابدأ معنا لتحقيق هذا المشروع علمياً وعالمياً
              </Link>
              <a href="#how-it-works" className="btn btn-secondary btn-large" aria-label="تعرف على كيفية عمل النظام">
                <i className="fas fa-play-circle" aria-hidden="true"></i>
                كيف يعمل؟
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">
              <i className="fas fa-file-alt"></i>
              <span>تقديم سهل</span>
            </div>
            <div className="floating-card card-2">
              <i className="fas fa-check-circle"></i>
              <span>مراجعة سريعة</span>
            </div>
            <div className="floating-card card-3">
              <i className="fas fa-globe"></i>
              <span>نشر عالمي</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">لماذا تختار منصتنا؟</h2>
            <p className="section-description">
              نوفر لك جميع الأدوات والميزات التي تحتاجها لنشر بحثك بشكل احترافي
            </p>
          </div>
          <div className="features-grid" role="list" aria-label="ميزات المنصة">
            <div className="feature-card" role="listitem">
              <div className="feature-icon" aria-hidden="true">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>نظام آمن ومحمي</h3>
              <p>حماية كاملة لبياناتك وأبحاثك مع أعلى معايير الأمان</p>
            </div>
            <div className="feature-card" role="listitem">
              <div className="feature-icon" aria-hidden="true">
                <i className="fas fa-paper-plane"></i>
              </div>
              <h3>تقديم سريع وسهل</h3>
              <p>نموذج مبسط لتقديم بحثك في دقائق معدودة</p>
            </div>
            <div className="feature-card" role="listitem">
              <div className="feature-icon" aria-hidden="true">
                <i className="fas fa-clock"></i>
              </div>
              <h3>متابعة فورية</h3>
              <p>تابع حالة بحثك في أي وقت من لوحة التحكم</p>
            </div>
            <div className="feature-card" role="listitem">
              <div className="feature-icon" aria-hidden="true">
                <i className="fas fa-bell"></i>
              </div>
              <h3>إشعارات ذكية</h3>
              <p>تنبيهات فورية عبر البريد والإشعارات الداخلية</p>
            </div>
            <div className="feature-card" role="listitem">
              <div className="feature-icon" aria-hidden="true">
                <i className="fas fa-comments"></i>
              </div>
              <h3>تواصل مباشر</h3>
              <p>تواصل مع فريق المراجعة واستقبل الملاحظات</p>
            </div>
            <div className="feature-card" role="listitem">
              <div className="feature-icon" aria-hidden="true">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>إحصائيات تفصيلية</h3>
              <p>تقارير شاملة عن طلباتك وإنجازاتك</p>
            </div>
            <div className="feature-card" role="listitem">
              <div className="feature-icon" aria-hidden="true">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>خبرة علمية عالمية</h3>
              <p>فريق من الخبراء والباحثين ذوي الخبرة العالمية في النشر العلمي</p>
            </div>
            <div className="feature-card" role="listitem">
              <div className="feature-icon" aria-hidden="true">
                <i className="fas fa-pen-fancy"></i>
              </div>
              <h3>كتابة احترافية Q1-Q4</h3>
              <p>خدمات كتابة وترجمة احترافية لمجلات Q1-Q4 العالمية المحكمة</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">كيف يعمل النظام؟</h2>
            <p className="section-description">
              أربع خطوات بسيطة لنشر بحثك العلمي
            </p>
          </div>
          <div className="steps" role="list" aria-label="خطوات النشر">
            <div className="step" role="listitem">
              <div className="step-number" aria-hidden="true">1</div>
              <div className="step-content">
                <h3>سجل حساب الباحث</h3>
                <p>أنشئ حسابك في دقائق بمعلومات بسيطة وآمنة</p>
              </div>
            </div>
            <div className="step" role="listitem">
              <div className="step-number" aria-hidden="true">2</div>
              <div className="step-content">
                <h3>قدم بحثك</h3>
                <p>املأ النموذج وارفع ملف البحث (PDF أو Word)</p>
              </div>
            </div>
            <div className="step" role="listitem">
              <div className="step-number" aria-hidden="true">3</div>
              <div className="step-content">
                <h3>المراجعة العلمية</h3>
                <p>فريقنا يراجع بحثك بدقة واحترافية</p>
              </div>
            </div>
            <div className="step" role="listitem">
              <div className="step-number" aria-hidden="true">4</div>
              <div className="step-content">
                <h3>النشر العالمي</h3>
                <p>استلم الموافقة وانشر بحثك عالمياً</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <Image
                src="/images/logo.png"
                alt="Research Assistant Logo"
                className="footer-logo"
                style={{ maxWidth: '200px', marginBottom: '1rem', height: 'auto', objectFit: 'contain' }}
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
                <li><a href="#features" aria-label="انتقل إلى قسم الميزات">الميزات</a></li>
                <li><a href="#how-it-works" aria-label="انتقل إلى قسم كيف يعمل">كيف يعمل</a></li>
                <li><Link href="/register" aria-label="إنشاء حساب جديد">التسجيل</Link></li>
                <li><Link href="/login" aria-label="تسجيل الدخول">تسجيل الدخول</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>الدعم</h4>
              <ul>
                <li><Link href="/instructions">دليل الاستخدام</Link></li>
                <li><Link href="/faq">الأسئلة الشائعة</Link></li>
                <li><Link href="/help">المساعدة</Link></li>
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

