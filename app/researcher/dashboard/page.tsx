'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmissions } from '@/contexts/SubmissionsContext';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useRouter } from 'next/navigation';

export default function ResearcherDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { submissions, loading: submissionsLoading, getStats } = useSubmissions();
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadStats();
    }
  }, [isAuthenticated, user, getStats]);

  const loadStats = async () => {
    try {
      const statsData = await getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="dashboard-page">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const recentSubmissions = submissions.slice(0, 5);

  return (
    <div className="dashboard-page dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar />

        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div>
              <h2>مرحباً، <span>{user?.username || 'الباحث'}!</span></h2>
              <p>نتمنى لك يوماً مثمراً في رحلتك البحثية</p>
            </div>
            <Link href="/researcher/submit" className="btn btn-primary">
              <i className="fas fa-plus"></i>
              تقديم بحث جديد
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <i className="fas fa-file-alt" style={{ color: '#3b82f6' }}></i>
              </div>
              <div className="stat-details">
                <h3>{stats.total}</h3>
                <p>إجمالي الطلبات</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
              </div>
              <div className="stat-details">
                <h3>{stats.approved}</h3>
                <p>المقبولة</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <i className="fas fa-clock" style={{ color: '#f59e0b' }}></i>
              </div>
              <div className="stat-details">
                <h3>{stats.pending}</h3>
                <p>قيد المراجعة</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <i className="fas fa-times-circle" style={{ color: '#ef4444' }}></i>
              </div>
              <div className="stat-details">
                <h3>{stats.rejected}</h3>
                <p>المرفوضة</p>
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <i className="fas fa-file-alt"></i>
                  أحدث الطلبات
                </h3>
                {submissions.length > 0 && (
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    عرض {recentSubmissions.length} من {submissions.length} طلب
                  </p>
                )}
              </div>
              {submissions.length > 5 && (
                <Link href="/researcher/submissions" className="link-primary">
                  عرض الكل
                  <i className="fas fa-arrow-left"></i>
                </Link>
              )}
            </div>
            <div className="card-body">
              {submissionsLoading ? (
                <div className="loading-placeholder">
                  <div className="loading-spinner"></div>
                  <p>جاري التحميل...</p>
                </div>
              ) : recentSubmissions.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <p>لا توجد طلبات بعد</p>
                  <Link href="/researcher/submit" className="btn btn-primary btn-small">
                    تقديم بحث جديد
                  </Link>
                </div>
              ) : (
                <div className="submissions-list">
                  {recentSubmissions.map((submission: any) => {
                    // إنشاء عنوان للعرض من الحقول المتاحة
                    const displayTitle = submission.main_researcher || submission.full_name || submission.reference_number || 'بدون عنوان';
                    const displaySubtitle = submission.detailed_specialization || submission.general_specialization || '';
                    
                    return (
                      <div 
                        key={submission.id} 
                        className="submission-item"
                        style={{
                          padding: 'var(--spacing-md)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-lg)',
                          marginBottom: 'var(--spacing-md)',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 'var(--spacing-md)',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div className="submission-info" style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xs)' }}>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ 
                                margin: 0, 
                                marginBottom: '0.25rem', 
                                fontSize: 'var(--font-size-base)', 
                                fontWeight: 600,
                                color: 'var(--text-primary)'
                              }}>
                                <Link 
                                  href={`/researcher/submissions/${submission.id}`}
                                  style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                                >
                                  {displayTitle}
                                </Link>
                              </h4>
                              {displaySubtitle && (
                                <p style={{ 
                                  margin: 0, 
                                  color: 'var(--text-secondary)', 
                                  fontSize: 'var(--font-size-sm)',
                                  marginTop: '0.25rem'
                                }}>
                                  <i className="fas fa-book" style={{ marginLeft: '0.25rem', color: 'var(--primary-color)', fontSize: '0.75rem' }}></i>
                                  {displaySubtitle}
                                </p>
                              )}
                              {submission.reference_number && (
                                <p style={{ 
                                  margin: '0.5rem 0 0 0', 
                                  fontSize: 'var(--font-size-xs)', 
                                  color: 'var(--text-secondary)',
                                  fontFamily: 'monospace'
                                }}>
                                  <i className="fas fa-hashtag" style={{ marginLeft: '0.25rem', fontSize: '0.7rem' }}></i>
                                  رقم المرجع: {submission.reference_number}
                                </p>
                              )}
                            </div>
                            <span className={`badge badge-${getStatusColor(submission.status)}`} style={{ 
                              fontSize: 'var(--font-size-xs)', 
                              padding: '0.375rem 0.75rem',
                              whiteSpace: 'nowrap'
                            }}>
                              {getStatusLabel(submission.status)}
                            </span>
                          </div>
                          
                          <div className="submission-meta" style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 'var(--spacing-md)',
                            alignItems: 'center',
                            paddingTop: 'var(--spacing-xs)',
                            borderTop: '1px solid var(--border-color)',
                            marginTop: 'var(--spacing-xs)'
                          }}>
                            {submission.research_type && (
                              <span style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.25rem',
                                fontSize: 'var(--font-size-xs)',
                                color: 'var(--text-secondary)'
                              }}>
                                <i className="fas fa-microscope" style={{ color: 'var(--primary-color)', fontSize: '0.7rem' }}></i>
                                {submission.research_type}
                              </span>
                            )}
                            
                            {submission.category && (
                              <span style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.25rem',
                                fontSize: 'var(--font-size-xs)',
                                color: 'var(--text-secondary)'
                              }}>
                                <i className="fas fa-folder" style={{ color: 'var(--info-color)', fontSize: '0.7rem' }}></i>
                                {submission.category}
                              </span>
                            )}
                            
                            <span className="submission-date" style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '0.25rem',
                              fontSize: 'var(--font-size-xs)',
                              color: 'var(--text-secondary)',
                              marginRight: 'auto'
                            }}>
                              <i className="fas fa-calendar" style={{ color: 'var(--warning-color)', fontSize: '0.7rem' }}></i>
                              {new Date(submission.created_at).toLocaleDateString('ar-SA', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <Link
                          href={`/researcher/submissions/${submission.id}`}
                          className="btn btn-outline btn-small"
                          style={{ 
                            alignSelf: 'center',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <i className="fas fa-eye" style={{ marginLeft: '0.25rem' }}></i>
                          عرض التفاصيل
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>
              <i className="fas fa-bolt"></i>
              إجراءات سريعة
            </h3>
            <div className="actions-grid">
              <Link href="/researcher/submit" className="action-card">
                <i className="fas fa-plus-circle"></i>
                <span>تقديم بحث جديد</span>
              </Link>
              <Link href="/researcher/submissions" className="action-card">
                <i className="fas fa-list"></i>
                <span>عرض جميع الطلبات</span>
              </Link>
              <Link href="/researcher/profile" className="action-card">
                <i className="fas fa-user-edit"></i>
                <span>تعديل الملف الشخصي</span>
              </Link>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="developer-credit">
            <a
              href="https://wa.me/966533189111"
              target="_blank"
              rel="noopener noreferrer"
              className="developer-credit-content"
            >
              <img
                src="/images/logob.png"
                alt="باكورة التقنيات"
                className="developer-logo"
                width="24"
                height="24"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span>تم تطوير المنصة بواسطة الحاضنة الرقمية باكورة التقنيات</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'قيد المراجعة',
    approved: 'مقبول',
    rejected: 'مرفوض',
    needs_revision: 'يحتاج مراجعة',
    draft: 'مسودة',
  };
  return labels[status] || status;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    needs_revision: 'warning',
    draft: 'info',
  };
  return colors[status] || 'info';
}

