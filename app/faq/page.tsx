import Link from 'next/link';
import Image from 'next/image';

export default function FAQPage() {
    return (
        <>
            {/* Navigation */}
            <nav className="navbar">
                <div className="container">
                    <div className="nav-brand">
                        <Link href="/">
                            <Image
                                src="/images/logo_web.jpeg"
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

            {/* FAQ Content */}
            <div className="legal-page">
                <div className="container">
                    <div className="legal-container">
                        <div className="legal-header">
                            <h1>الأسئلة الشائعة</h1>
                            <p>إجابات على أكثر الأسئلة تكراراً حول خدماتنا</p>
                        </div>
                        <div className="legal-content">
                            <div className="faq-item" style={{ marginBottom: '2rem' }}>
                                <h3 style={{ color: '#3D5A94' }}>كيف يمكنني تقديم بحث جديد؟</h3>
                                <p>عن طريق إنشاء حساب باحث، ثم الانتقال إلى لوحة التحكم والضغط على "تقديم بحث جديد".</p>
                            </div>
                            <div className="faq-item" style={{ marginBottom: '2rem' }}>
                                <h3 style={{ color: '#3D5A94' }}>كم يستغرق وقت المراجعة؟</h3>
                                <p>تختلف المدة حسب نوع البحث والمجلة المستهدفة، ولكن فريقنا يسعى للرد المختص خلال 3-7 أيام عمل.</p>
                            </div>
                            <div className="faq-item" style={{ marginBottom: '2rem' }}>
                                <h3 style={{ color: '#3D5A94' }}>هل يتم ضمان النشر؟</h3>
                                <p>نحن نضمن جودة المراجعة العلمية وتجهيز البحث وفق معايير المجلات العالمية، مما يزيد فرص القبول بشكل كبير.</p>
                            </div>
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
                                src="/images/logo_web.jpeg"
                                alt="Research Assistant Logo"
                                className="footer-logo"
                                style={{ maxWidth: '200px', marginBottom: '1rem', aspectRatio: '3/1', height: 'auto', objectFit: 'contain' }}
                                width={200}
                                height={67}
                                loading="lazy"
                            />
                            <h4 style={{ marginBottom: '1rem', color: 'white' }}>المنصة العالمية لنشر الأبحاث والدراسات العربية إلى الإنجليزية</h4>
                            <p>تتشرف المنصة العالمية لنشر الأبحاث العربية إلى الإنجليزية الخاصة بشركة مساعد البحث للبحوث والدراسات باستقبال طلباتكم وأبحاثكم لنشرها في مجلات عالمية علمية محكمة <span className="no-break-text">ISI- Scopus (Q1-Q2-Q3-Q4)</span>.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
