'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmissions } from '@/contexts/SubmissionsContext';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function SubmissionsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    submissions,
    drafts,
    loading,
    filters,
    pagination,
    setFilters,
    setPage,
    fetchUserSubmissions,
    fetchDrafts,
    deleteSubmission,
  } = useSubmissions();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'submissions' | 'drafts'>('submissions');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      if (viewMode === 'submissions') {
        fetchUserSubmissions();
      } else {
        fetchDrafts();
      }
    }
  }, [isAuthenticated, viewMode, fetchUserSubmissions, fetchDrafts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ searchTerm });
  };

  const handleStatusFilter = (status: string | null) => {
    setFilters({ status: status === 'all' ? null : status });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'قيد المراجعة',
      approved: 'مقبول',
      rejected: 'مرفوض',
      under_review: 'قيد المراجعة',
      revision_requested: 'يحتاج مراجعة',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
      under_review: 'info',
      revision_requested: 'warning',
    };
    return colors[status] || 'info';
  };

  if (authLoading) {
    return (
      <div className="dashboard-page">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);

  return (
    <div className="dashboard-page dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>طلباتي</h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="tabs" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className={`btn ${viewMode === 'submissions' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setViewMode('submissions')}
                >
                  <i className="fas fa-file-alt"></i>
                  الطلبات المرسلة ({submissions.length})
                </button>
                <button
                  className={`btn ${viewMode === 'drafts' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setViewMode('drafts')}
                >
                  <i className="fas fa-edit"></i>
                  المسودات ({drafts.length})
                </button>
              </div>
              <Link href="/researcher/submit" className="btn btn-primary">
                <i className="fas fa-plus"></i>
                تقديم بحث جديد
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-filter"></i>
                البحث والتصفية
              </h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSearch} className="filters-form">
                <div className="form-group" style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-end' }}>
                  <div className="search-input-wrapper" style={{ flex: 1 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="ابحث في الطلبات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search"></i>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-search"></i>
                    بحث
                  </button>
                </div>

                <div className="filter-buttons">
                  <button
                    type="button"
                    className={`btn btn-small ${filters.status === null ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilter('all')}
                  >
                    الكل
                  </button>
                  <button
                    type="button"
                    className={`btn btn-small ${filters.status === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilter('pending')}
                  >
                    قيد المراجعة
                  </button>
                  <button
                    type="button"
                    className={`btn btn-small ${filters.status === 'approved' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilter('approved')}
                  >
                    مقبول
                  </button>
                  <button
                    type="button"
                    className={`btn btn-small ${filters.status === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilter('rejected')}
                  >
                    مرفوض
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Submissions List */}
          <div className="card">
            <div className="card-body">
              {loading ? (
                <div className="loading-placeholder">
                  <div className="loading-spinner"></div>
                  <p>جاري التحميل...</p>
                  <div style={{ width: '100%', marginTop: '1rem' }}>
                    <div className="skeleton skeleton-text" style={{ marginBottom: '0.5rem' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '80%', marginBottom: '0.5rem' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
                  </div>
                </div>
              ) : viewMode === 'submissions' && submissions.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <p>لا توجد طلبات مرسلة</p>
                  <Link href="/researcher/submit" className="btn btn-primary">
                    تقديم بحث جديد
                  </Link>
                </div>
              ) : viewMode === 'drafts' && drafts.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-edit"></i>
                  <p>لا توجد مسودات</p>
                  <Link href="/researcher/submit" className="btn btn-primary">
                    إنشاء مسودة جديدة
                  </Link>
                </div>
              ) : (
                <>
                  <div className="submissions-list">
                    {(viewMode === 'submissions' ? submissions : drafts).map((item: any) => {
                      // إنشاء عنوان للعرض من الحقول المتاحة
                      const displayTitle = item.main_researcher || item.full_name || 'بدون عنوان';
                      const displaySubtitle = item.detailed_specialization || item.general_specialization || '';
                      
                      return (
                        <div key={item.id} className="submission-item">
                          <div className="submission-info">
                            <h3>
                              {viewMode === 'drafts' ? (
                                <Link href={`/researcher/submit?draft=${item.id}`}>
                                  {displayTitle}
                                </Link>
                              ) : (
                                <Link href={`/researcher/submissions/${item.id}`}>
                                  {displayTitle}
                                </Link>
                              )}
                              {viewMode === 'drafts' && (
                                <span className="badge badge-info" style={{ marginRight: '0.5rem', fontSize: '0.75rem' }}>
                                  مسودة
                                </span>
                              )}
                            </h3>
                            {displaySubtitle && (
                              <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {displaySubtitle}
                              </p>
                            )}
                            <div className="submission-meta">
                              {viewMode === 'submissions' && (
                                <span className={`badge badge-${getStatusColor(item.status)}`}>
                                  {getStatusLabel(item.status)}
                                </span>
                              )}
                              <span className="submission-type">{item.research_type || 'غير محدد'}</span>
                              {item.category && (
                                <span className="submission-category">{item.category}</span>
                              )}
                              {item.reference_number && (
                                <span className="submission-ref" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                  رقم المرجع: {item.reference_number}
                                </span>
                              )}
                              <span className="submission-date">
                                {new Date(item.updated_at || item.created_at).toLocaleDateString('ar-SA', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        <div className="submission-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                          {viewMode === 'drafts' ? (
                            <>
                              <Link
                                href={`/researcher/submit?draft=${item.id}`}
                                className="btn btn-primary btn-small"
                              >
                                <i className="fas fa-edit"></i>
                                تعديل
                              </Link>
                              <button
                                className="btn btn-outline btn-small"
                                onClick={async () => {
                                  if (confirm('هل أنت متأكد من حذف هذه المسودة؟')) {
                                    const result = await deleteSubmission(item.id);
                                    if (result.success) {
                                      fetchDrafts();
                                    }
                                  }
                                }}
                                style={{ color: 'var(--error)' }}
                              >
                                <i className="fas fa-trash"></i>
                                حذف
                              </button>
                            </>
                          ) : (
                            <Link
                              href={`/researcher/submissions/${item.id}`}
                              className="btn btn-outline btn-small"
                            >
                              <i className="fas fa-eye"></i>
                              عرض التفاصيل
                            </Link>
                          )}
                        </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="btn btn-outline btn-small"
                        disabled={pagination.page === 1}
                        onClick={() => setPage(pagination.page - 1)}
                      >
                        <i className="fas fa-chevron-right"></i>
                        السابق
                      </button>
                      <span className="pagination-info">
                        صفحة {pagination.page} من {totalPages}
                      </span>
                      <button
                        className="btn btn-outline btn-small"
                        disabled={pagination.page >= totalPages}
                        onClick={() => setPage(pagination.page + 1)}
                      >
                        التالي
                        <i className="fas fa-chevron-left"></i>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

