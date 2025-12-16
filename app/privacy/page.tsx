import Link from 'next/link';
import Image from 'next/image';
import { readFile } from 'fs/promises';
import { join } from 'path';

async function getPrivacyContent() {
  try {
    const filePath = join(process.cwd(), 'docs', 'سياسة الخصوصية.md');
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch {
    return null;
  }
}

export default async function PrivacyPage() {
  const content = await getPrivacyContent();

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

      {/* Legal Content */}
      <div className="legal-page">
        <div className="container">
          <div className="legal-container">
            <div className="legal-header">
              <h1>سياسة الخصوصية</h1>
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
                  <h2>نطاق السياسة</h2>
                  <p>تلتزم شركة مساعد البحث للبحوث والدراسات (&quot;RAFRS&quot;) بحماية خصوصية مستخدميها والحفاظ على سرية بياناتهم.</p>

                  <h2>أولًا: البيانات التي نجمعها</h2>
                  <h3>1) بيانات التعريف الشخصية</h3>
                  <p>مثل الاسم، البريد الإلكتروني، موقع الدراسة أو العمل، رقم الهاتف، والجهة التي تتبع لها إن وجدت.</p>

                  <h3>2) بيانات الدفع</h3>
                  <p>مثل معلومات الدفع عند شراء خدمات. لا نقوم بتخزين أرقام البطاقات الكاملة؛ تتم المعالجة عبر مزود الدفع الموثوق.</p>

                  <h3>3) بيانات المحتوى التفاعلي</h3>
                  <p>مثل مشاركاتك في الأنشطة، مساهماتك البحثية، أو أنشطتك ضمن المنصة.</p>

                  <h3>4) بيانات الجهاز والتصفح</h3>
                  <p>مثل نوع الجهاز، نظام التشغيل، الصفحات التي تمت زيارتها، أوقات الزيارة، والإحالات.</p>

                  <h2>ثانيًا: كيف نستخدم البيانات</h2>
                  <p>نستخدم بياناتك من أجل:</p>
                  <ul>
                    <li>إتاحة الخدمات على أجهزتك بأفضل صورة ممكنة</li>
                    <li>تلبية الطلبات، تقديم الدعم الفني، ومعالجة الفواتير</li>
                    <li>تحسين خدماتنا وتجربة المستخدم</li>
                    <li>إرسال الإشعارات والتحديثات المهمة</li>
                  </ul>

                  <h2>ثالثًا: حماية البيانات</h2>
                  <p>نستخدم تقنيات أمنية متقدمة لحماية بياناتك من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير.</p>

                  <h2>رابعًا: مشاركة البيانات</h2>
                  <p>لا نبيع أو نؤجر بياناتك الشخصية لأطراف ثالثة. قد نشارك البيانات فقط مع مزودي الخدمات الموثوقين الذين يساعدوننا في تشغيل موقعنا.</p>

                  <h2>خامسًا: حقوقك</h2>
                  <p>لديك الحق في الوصول إلى بياناتك الشخصية وتصحيحها أو حذفها أو تقييد معالجتها في أي وقت.</p>

                  <h2>سادسًا: التعديلات</h2>
                  <p>قد نحدث هذه السياسة من وقت لآخر. سيتم إشعارك بأي تغييرات جوهرية.</p>

                  <h2>سابعًا: الاتصال بنا</h2>
                  <p>إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى الاتصال بنا على: info@rafrs.com</p>
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

