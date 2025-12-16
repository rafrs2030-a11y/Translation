'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmissions } from '@/contexts/SubmissionsContext';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function SubmissionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { fetchSubmissionById, currentSubmission, loading } = useSubmissions();
  const [submission, setSubmission] = useState(currentSubmission);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const loadSubmission = useCallback(async () => {
    if (params.id && typeof params.id === 'string') {
      await fetchSubmissionById(params.id);
    }
  }, [params.id, fetchSubmissionById]);

  useEffect(() => {
    if (params.id && isAuthenticated) {
      loadSubmission();
    }
  }, [params.id, isAuthenticated, loadSubmission]);

  useEffect(() => {
    if (currentSubmission) {
      setSubmission(currentSubmission);
    }
  }, [currentSubmission]);

  if (authLoading || loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !submission) {
    return null;
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'قيد المراجعة',
      approved: 'مقبول',
      rejected: 'مرفوض',
      needs_revision: 'يحتاج مراجعة',
      draft: 'مسودة',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
      needs_revision: 'warning',
      draft: 'info',
    };
    return colors[status] || 'info';
  };

  return (
    <div className="dashboard-page dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar />

        <div className="dashboard-content">
          <div className="page-header">
            <Link href="/researcher/submissions" className="btn btn-outline">
              <i className="fas fa-arrow-right"></i>
              العودة إلى القائمة
            </Link>
            <div>
              <h1>تفاصيل الطلب</h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                رقم الطلب: {submission.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Submission Header Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(61, 90, 148, 0.05), rgba(81, 118, 184, 0.02))', border: '2px solid rgba(61, 90, 148, 0.1)' }}>
            <div className="card-header" style={{ borderBottom: '2px solid rgba(61, 90, 148, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <h2 className="card-title" style={{ margin: 0, fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                    <i className="fas fa-file-alt" style={{ marginLeft: 'var(--spacing-sm)', color: 'var(--primary-color)' }}></i>
                    {submission.title || 'بدون عنوان'}
                  </h2>
                </div>
                <span className={`badge badge-${getStatusColor(submission.status)}`} style={{ fontSize: 'var(--font-size-base)', padding: '0.5rem 1rem' }}>
                  <i className={`fas fa-${submission.status === 'approved' ? 'check-circle' : submission.status === 'rejected' ? 'times-circle' : 'clock'}`} style={{ marginLeft: '0.25rem' }}></i>
                  {getStatusLabel(submission.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Status explanation for researcher */}
          {submission.status === 'needs_revision' && (
            <div className="card" style={{ marginTop: 'var(--spacing-md)', borderColor: 'rgba(59,130,246,0.35)', background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(37,99,235,0.02))' }}>
              <div className="card-body" style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                <i className="fas fa-info-circle" style={{ color: 'var(--info-color)', marginTop: '0.2rem' }}></i>
                <p style={{ margin: 0, lineHeight: 1.8, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                  تم وضع حالتك على <strong>يحتاج مراجعة</strong>، يرجى قراءة رد الإدارة بعناية وإجراء التعديلات المطلوبة على البحث ثم إعادة التقديم
                  (أو تقديم طلب جديد محدث) وفق التعليمات الواردة في الرد.
                </p>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)', marginTop: 'var(--spacing-lg)' }}>
            {/* Submission Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fas fa-info-circle"></i>
                  معلومات الطلب
                </h2>
              </div>
              <div className="card-body">
                <div className="details-grid">
                  <div className="detail-item">
                    <label>
                      <i className="fas fa-microscope" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                      نوع البحث:
                    </label>
                    <span style={{ fontWeight: 600 }}>{submission.research_type || 'غير محدد'}</span>
                  </div>
                  <div className="detail-item">
                    <label>
                      <i className="fas fa-folder" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                      الفئة:
                    </label>
                    <span style={{ fontWeight: 600 }}>{submission.category || 'غير محدد'}</span>
                  </div>
                  <div className="detail-item">
                    <label>
                      <i className="fas fa-calendar-plus" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                      تاريخ التقديم:
                    </label>
                    <span style={{ fontWeight: 600 }}>
                      {new Date(submission.created_at).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>
                      <i className="fas fa-clock" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                      آخر تحديث:
                    </label>
                    <span style={{ fontWeight: 600 }}>
                      {new Date(submission.updated_at).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {submission.description && (
                  <div className="detail-section" style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-lg)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', fontWeight: 700 }}>
                      <i className="fas fa-align-right" style={{ color: 'var(--primary-color)' }}></i>
                      الوصف:
                    </label>
                    <p style={{ lineHeight: 1.8, color: 'var(--text-primary)', margin: 0, whiteSpace: 'pre-wrap' }}>{submission.description}</p>
                  </div>
                )}

                {submission.file_url && (
                  <div className="detail-section" style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-lg)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.02))', borderRadius: 'var(--radius-lg)', border: '2px solid rgba(16, 185, 129, 0.1)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', fontWeight: 700 }}>
                      <i className="fas fa-paperclip" style={{ color: 'var(--success-color)' }}></i>
                      الملف المرفق:
                    </label>
                    <a
                      href={submission.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
                    >
                      <i className="fas fa-download"></i>
                      تحميل الملف
                      <i className="fas fa-external-link-alt" style={{ fontSize: '0.75rem' }}></i>
                    </a>
                    <p style={{ margin: 'var(--spacing-sm) 0 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-info-circle" style={{ marginLeft: '0.25rem' }}></i>
                      انقر للتحميل أو المعاينة في علامة تبويب جديدة
                    </p>
                  </div>
                )}

                {submission.admin_reply && (
                  <div className="detail-section" style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-lg)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))', borderRadius: 'var(--radius-lg)', border: '2px solid rgba(59, 130, 246, 0.3)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', fontWeight: 700, color: 'var(--info-color)' }}>
                      <i className="fas fa-comment-dots"></i>
                      رد الإدارة:
                    </label>
                    <div style={{ padding: 'var(--spacing-md)', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <p style={{ margin: 0, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>{submission.admin_reply}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

