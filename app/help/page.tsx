import Link from 'next/link';
import Image from 'next/image';

export default function HelpPage() {
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

            {/* Help Content */}
            <div className="legal-page">
                <div className="container">
                    <div className="legal-container" style={{ textAlign: 'center' }}>
                        <div className="legal-header">
                            <h1>مركز المساعدة</h1>
                            <p>كيف يمكننا مساعدتك اليوم؟</p>
                        </div>
                        <div className="legal-content" style={{ marginTop: '3rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                                <div style={{ padding: '2rem', background: '#f9fafb', borderRadius: '1rem' }}>
                                    <i className="fas fa-envelope-open-text" style={{ fontSize: '2.5rem', color: '#3D5A94', marginBottom: '1rem' }}></i>
                                    <h3>الدعم الفني</h3>
                                    <p>للمشاكل التقنية والتقنية</p>
                                    <a href="mailto:info@rafrs.com">info@rafrs.com</a>
                                </div>
                                <div style={{ padding: '2rem', background: '#f9fafb', borderRadius: '1rem' }}>
                                    <i className="fab fa-whatsapp" style={{ fontSize: '2.5rem', color: '#25D366', marginBottom: '1rem' }}></i>
                                    <h3>تواصل سريع</h3>
                                    <p>تواصل مع فريق الدعم عبر البريد أو واتساب</p>
                                    <a href="https://wa.me/966580002284" target="_blank" rel="noopener noreferrer">تواصل عبر واتساب</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
