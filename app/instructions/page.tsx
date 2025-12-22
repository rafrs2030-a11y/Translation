'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function InstructionsPage() {
  const [activeTab, setActiveTab] = useState<'researcher' | 'admin'>('researcher');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['register']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
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

      {/* Instructions Content */}
      <div className="instructions-page" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '2rem 0',
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="instructions-container" style={{
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div className="instructions-header" style={{
              background: 'linear-gradient(135deg, #3D5A94 0%, #2d4370 100%)',
              color: 'white',
              padding: '3rem 2rem',
              textAlign: 'center',
            }}>
              <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                <i className="fas fa-book-reader" style={{ marginLeft: '1rem' }}></i>
                دليل استخدام المنصة
              </h1>
              <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>
                دليل مبسّط لاستخدام المنصة من قبل الباحثين والمسؤولين
              </p>
            </div>

            {/* Tabs */}
            <div className="instructions-tabs" style={{
              display: 'flex',
              borderBottom: '2px solid #e5e7eb',
              background: '#f9fafb',
            }}>
              <button
                onClick={() => setActiveTab('researcher')}
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  background: activeTab === 'researcher' ? 'white' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'researcher' ? '3px solid #3D5A94' : '3px solid transparent',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: activeTab === 'researcher' ? 600 : 400,
                  color: activeTab === 'researcher' ? '#3D5A94' : '#6b7280',
                  transition: 'all 0.3s ease',
                }}
              >
                <i className="fas fa-user-graduate" style={{ marginLeft: '0.5rem' }}></i>
                دليل الباحث
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  background: activeTab === 'admin' ? 'white' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'admin' ? '3px solid #3D5A94' : '3px solid transparent',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: activeTab === 'admin' ? 600 : 400,
                  color: activeTab === 'admin' ? '#3D5A94' : '#6b7280',
                  transition: 'all 0.3s ease',
                }}
              >
                <i className="fas fa-user-shield" style={{ marginLeft: '0.5rem' }}></i>
                دليل المسؤول
              </button>
            </div>

            {/* Content */}
            <div className="instructions-content" style={{ padding: '2rem' }}>
              {activeTab === 'researcher' ? (
                <ResearcherGuide expandedSections={expandedSections} toggleSection={toggleSection} />
              ) : (
                <AdminGuide expandedSections={expandedSections} toggleSection={toggleSection} />
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div style={{
            marginTop: '2rem',
            textAlign: 'center',
            padding: '2rem',
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#3D5A94' }}>
              <i className="fas fa-link" style={{ marginLeft: '0.5rem' }}></i>
              روابط مفيدة
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              <Link href="/register" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                <i className="fas fa-user-plus" style={{ marginLeft: '0.5rem' }}></i>
                إنشاء حساب
              </Link>
              <Link href="/login" className="btn btn-outline" style={{ textDecoration: 'none', display: 'inline-block' }}>
                <i className="fas fa-sign-in-alt" style={{ marginLeft: '0.5rem' }}></i>
                تسجيل الدخول
              </Link>
              <Link href="/terms" className="btn btn-outline" style={{ textDecoration: 'none', display: 'inline-block' }}>
                <i className="fas fa-file-contract" style={{ marginLeft: '0.5rem' }}></i>
                الشروط والأحكام
              </Link>
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
                <li><Link href="/instructions">دليل الاستخدام</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>الدعم</h4>
              <ul>
                <li><Link href="/instructions">دليل الاستخدام</Link></li>
                <li><a href="#">الأسئلة الشائعة</a></li>
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

function ResearcherGuide({ expandedSections, toggleSection }: { expandedSections: Set<string>, toggleSection: (section: string) => void }) {
  const sections = [
    {
      id: 'register',
      title: 'التسجيل وتسجيل الدخول',
      icon: 'fa-user-plus',
      content: (
        <div>
          <h4 style={{ color: '#3D5A94', marginBottom: '1rem' }}>خطوات التسجيل:</h4>
          <ol style={{ lineHeight: '2', paddingRight: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>الانتقال إلى صفحة التسجيل</strong>
              <ul style={{ marginTop: '0.5rem', paddingRight: '1.5rem' }}>
                <li>اضغط على زر "تسجيل" أو "إنشاء حساب"</li>
                <li>املأ البيانات المطلوبة (اسم المستخدم، البريد الإلكتروني، رقم الهوية، رقم الهاتف، كلمة المرور)</li>
              </ul>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>التحقق من البريد الإلكتروني</strong>
              <ul style={{ marginTop: '0.5rem', paddingRight: '1.5rem' }}>
                <li>ستتلقى رسالة بريد إلكتروني للتحقق</li>
                <li>افتح البريد واضغط على رابط التحقق</li>
              </ul>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>تسجيل الدخول</strong>
              <ul style={{ marginTop: '0.5rem', paddingRight: '1.5rem' }}>
                <li>بعد التحقق، يمكنك تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور</li>
              </ul>
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: 'submit',
      title: 'تقديم بحث جديد',
      icon: 'fa-file-upload',
      content: (
        <div>
          <h4 style={{ color: '#3D5A94', marginBottom: '1rem' }}>خطوات تقديم البحث:</h4>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem', borderRight: '4px solid #3D5A94' }}>
              <h5 style={{ color: '#3D5A94', marginBottom: '0.5rem' }}>الخطوة 1: المعلومات الأساسية</h5>
              <ul style={{ margin: 0, paddingRight: '1.5rem', lineHeight: '1.8' }}>
                <li>اختر نوع مقدم البحث (فرد أو جهة)</li>
                <li>أدخل البيانات المطلوبة حسب النوع</li>
                <li>أدخل الدولة</li>
              </ul>
            </div>
            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem', borderRight: '4px solid #3D5A94' }}>
              <h5 style={{ color: '#3D5A94', marginBottom: '0.5rem' }}>الخطوة 2: تفاصيل البحث</h5>
              <ul style={{ margin: 0, paddingRight: '1.5rem', lineHeight: '1.8' }}>
                <li>أدخل عنوان البحث</li>
                <li>اختر نوع البحث (بحث علمي، كتاب، رسالة علمية، مقال)</li>
                <li>اختر فئة البحث</li>
                <li>أدخل اسم الباحث الرئيسي (اختياري)</li>
                <li>أدخل وصفاً مختصراً (اختياري)</li>
              </ul>
            </div>
            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem', borderRight: '4px solid #3D5A94' }}>
              <h5 style={{ color: '#3D5A94', marginBottom: '0.5rem' }}>الخطوة 3: رفع الملف</h5>
              <ul style={{ margin: 0, paddingRight: '1.5rem', lineHeight: '1.8' }}>
                <li>ارفع ملف البحث بصيغة PDF أو Word</li>
                <li>الحد الأقصى لحجم الملف: 10 ميجابايت</li>
                <li>بعد الرفع الناجح، ستظهر رسالة تأكيد</li>
              </ul>
            </div>
            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem', borderRight: '4px solid #3D5A94' }}>
              <h5 style={{ color: '#3D5A94', marginBottom: '0.5rem' }}>الخطوة 4: المراجعة والإرسال</h5>
              <ul style={{ margin: 0, paddingRight: '1.5rem', lineHeight: '1.8' }}>
                <li>راجع جميع المعلومات المدخلة</li>
                <li>اقرأ التعهد والموافقة بعناية</li>
                <li>ضع علامة ✓ في مربع الموافقة</li>
                <li>اضغط "إرسال البحث"</li>
              </ul>
            </div>
          </div>
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#e0f2fe', borderRadius: '0.5rem', borderRight: '4px solid #0ea5e9' }}>
            <strong><i className="fas fa-lightbulb" style={{ marginLeft: '0.5rem', color: '#0ea5e9' }}></i>نصيحة:</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>يمكنك حفظ الطلب كمسودة في أي خطوة قبل الإرسال للعودة لاحقاً لإكماله.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'track',
      title: 'متابعة الطلبات',
      icon: 'fa-list-alt',
      content: (
        <div>
          <h4 style={{ color: '#3D5A94', marginBottom: '1rem' }}>كيفية متابعة الطلبات:</h4>
          <ol style={{ lineHeight: '2', paddingRight: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>الوصول إلى صفحة الطلبات</strong>
              <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>من القائمة الجانبية، اضغط على "طلباتي" أو "الطلبات"</p>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>معلومات الطلبات</strong>
              <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>ستظهر قائمة بجميع طلباتك مع الحالة الحالية (قيد المراجعة، مقبول، مرفوض، يحتاج مراجعة)</p>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>فلترة الطلبات</strong>
              <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>يمكنك البحث في الطلبات أو تصفيتها حسب الحالة</p>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>عرض التفاصيل</strong>
              <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>اضغط على أي طلب لرؤية التفاصيل الكاملة والتعليقات من المسؤول</p>
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: 'notifications',
      title: 'الإشعارات',
      icon: 'fa-bell',
      content: (
        <div>
          <h4 style={{ color: '#3D5A94', marginBottom: '1rem' }}>متابعة الإشعارات:</h4>
          <ul style={{ lineHeight: '2', paddingRight: '1.5rem' }}>
            <li>اضغط على أيقونة الجرس 🔔 في الشريط العلوي</li>
            <li>ستظهر قائمة بجميع الإشعارات</li>
            <li>أنواع الإشعارات:
              <ul style={{ marginTop: '0.5rem', paddingRight: '1.5rem' }}>
                <li>تغيير حالة الطلب</li>
                <li>تعليق جديد من المسؤول</li>
                <li>تأكيد تقديم البحث</li>
                <li>تذكيرات مهمة</li>
              </ul>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div>
      {sections.map((section) => (
        <SectionCard
          key={section.id}
          id={section.id}
          title={section.title}
          icon={section.icon}
          content={section.content}
          isExpanded={expandedSections.has(section.id)}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  );
}

function AdminGuide({ expandedSections, toggleSection }: { expandedSections: Set<string>, toggleSection: (section: string) => void }) {
  const sections = [
    {
      id: 'login',
      title: 'تسجيل الدخول',
      icon: 'fa-sign-in-alt',
      content: (
        <div>
          <ol style={{ lineHeight: '2', paddingRight: '1.5rem' }}>
            <li>استخدم بيانات المسؤول (البريد الإلكتروني وكلمة المرور)</li>
            <li>بعد تسجيل الدخول، ستظهر لك لوحة تحكم المسؤول تلقائياً</li>
            <li>سيتم التحقق تلقائياً من صلاحياتك</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'review',
      title: 'مراجعة الطلبات',
      icon: 'fa-eye',
      content: (
        <div>
          <h4 style={{ color: '#3D5A94', marginBottom: '1rem' }}>خطوات المراجعة:</h4>
          <ol style={{ lineHeight: '2', paddingRight: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>الوصول إلى صفحة الطلبات</strong>
              <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>من القائمة الجانبية، اضغط على "الطلبات"</p>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>البحث والفلترة</strong>
              <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>استخدم شريط البحث للبحث بالاسم أو رقم المرجع، أو فلتر حسب الحالة</p>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>فتح تفاصيل الطلب</strong>
              <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>اضغط على "مراجعة" لفتح صفحة تفاصيل الطلب</p>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>مراجعة المحتوى</strong>
              <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>راجع جميع بيانات الطلب ويمكنك تحميل الملف للمراجعة</p>
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: 'update',
      title: 'تحديث حالة الطلب',
      icon: 'fa-edit',
      content: (
        <div>
          <h4 style={{ color: '#3D5A94', marginBottom: '1rem' }}>خطوات تحديث الحالة:</h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', borderRight: '4px solid #10b981' }}>
              <strong style={{ color: '#10b981' }}>مقبول:</strong> البحث يلبي جميع المتطلبات
            </div>
            <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '0.5rem', borderRight: '4px solid #ef4444' }}>
              <strong style={{ color: '#ef4444' }}>مرفوض:</strong> البحث لا يلبي المتطلبات
            </div>
            <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: '0.5rem', borderRight: '4px solid #f59e0b' }}>
              <strong style={{ color: '#f59e0b' }}>يحتاج مراجعة:</strong> البحث يحتاج تعديلات أو معلومات إضافية
            </div>
          </div>
          <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
            يمكنك إضافة تعليق يشرح سبب تغيير الحالة. هذا التعليق سيكون مرئياً للباحث وسيتم إرسال إشعار له.
          </p>
        </div>
      ),
    },
    {
      id: 'comments',
      title: 'إضافة التعليقات',
      icon: 'fa-comments',
      content: (
        <div>
          <h4 style={{ color: '#3D5A94', marginBottom: '1rem' }}>أنواع التعليقات:</h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem', borderRight: '4px solid #3b82f6' }}>
              <strong style={{ color: '#3b82f6' }}>تعليقات مرئية للباحث:</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingRight: '1.5rem', lineHeight: '1.8' }}>
                <li>سيتم إرسال إشعار للباحث</li>
                <li>ستظهر في صفحة تفاصيل الطلب للباحث</li>
                <li>مفيدة للتواصل مع الباحث</li>
              </ul>
            </div>
            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem', borderRight: '4px solid #6b7280' }}>
              <strong style={{ color: '#6b7280' }}>تعليقات خاصة:</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingRight: '1.5rem', lineHeight: '1.8' }}>
                <li>مرئية فقط للمسؤولين</li>
                <li>مفيدة للملاحظات الداخلية</li>
                <li>لا يتم إرسال إشعار للباحث</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'stats',
      title: 'الإحصائيات والتقارير',
      icon: 'fa-chart-bar',
      content: (
        <div>
          <h4 style={{ color: '#3D5A94', marginBottom: '1rem' }}>الإحصائيات المتاحة:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3D5A94' }}>📊</div>
              <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>إجمالي الطلبات</div>
            </div>
            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>✅</div>
              <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>المقبولة</div>
            </div>
            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>⏳</div>
              <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>قيد المراجعة</div>
            </div>
            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>❌</div>
              <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>المرفوضة</div>
            </div>
          </div>
          <p style={{ lineHeight: '1.8' }}>
            يمكنك أيضاً تصدير البيانات بصيغة CSV أو JSON من صفحة الطلبات لإنشاء تقارير مفصلة.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div>
      {sections.map((section) => (
        <SectionCard
          key={section.id}
          id={section.id}
          title={section.title}
          icon={section.icon}
          content={section.content}
          isExpanded={expandedSections.has(section.id)}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  );
}

function SectionCard({ id, title, icon, content, isExpanded, onToggle }: {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{
      marginBottom: '1rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '1.5rem',
          background: isExpanded ? '#f9fafb' : 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'right',
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#1f2937',
          transition: 'all 0.3s ease',
        }}
      >
        <span>
          <i className={`fas ${icon}`} style={{ marginLeft: '0.5rem', color: '#3D5A94' }}></i>
          {title}
        </span>
        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`} style={{ color: '#6b7280' }}></i>
      </button>
      {isExpanded && (
        <div style={{
          padding: '1.5rem',
          background: 'white',
          borderTop: '1px solid #e5e7eb',
          animation: 'slideDown 0.3s ease',
        }}>
          {content}
        </div>
      )}
    </div>
  );
}

