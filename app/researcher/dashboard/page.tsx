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
              <h3 className="card-title">
                <i className="fas fa-file-alt"></i>
                أحدث الطلبات
              </h3>
              <Link href="/researcher/submissions" className="link-primary">
                عرض الكل
                <i className="fas fa-arrow-left"></i>
              </Link>
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
                  {recentSubmissions.map((submission) => (
                    <div key={submission.id} className="submission-item">
                      <div className="submission-info">
                        <h4>{submission.title || 'بدون عنوان'}</h4>
                        <p className="submission-meta">
                          <span className={`badge badge-${getStatusColor(submission.status)}`}>
                            {getStatusLabel(submission.status)}
                          </span>
                          <span className="submission-date">
                            {new Date(submission.created_at).toLocaleDateString('ar-SA')}
                          </span>
                        </p>
                      </div>
                      <Link
                        href={`/researcher/submissions/${submission.id}`}
                        className="btn btn-outline btn-small"
                      >
                        عرض التفاصيل
                      </Link>
                    </div>
                  ))}
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
    under_review: 'قيد المراجعة',
    revision_requested: 'يحتاج مراجعة',
  };
  return labels[status] || status;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    under_review: 'info',
    revision_requested: 'warning',
  };
  return colors[status] || 'info';
}

