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
    loading,
    filters,
    pagination,
    setFilters,
    setPage,
    fetchUserSubmissions,
  } = useSubmissions();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserSubmissions();
    }
  }, [isAuthenticated, fetchUserSubmissions]);

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
            <Link href="/researcher/submit" className="btn btn-primary">
              <i className="fas fa-plus"></i>
              تقديم بحث جديد
            </Link>
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
              ) : submissions.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <p>لا توجد طلبات</p>
                  <Link href="/researcher/submit" className="btn btn-primary">
                    تقديم بحث جديد
                  </Link>
                </div>
              ) : (
                <>
                  <div className="submissions-list">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="submission-item">
                        <div className="submission-info">
                          <h3>
                            <Link href={`/researcher/submissions/${submission.id}`}>
                              {submission.title || 'بدون عنوان'}
                            </Link>
                          </h3>
                          <div className="submission-meta">
                            <span className={`badge badge-${getStatusColor(submission.status)}`}>
                              {getStatusLabel(submission.status)}
                            </span>
                            <span className="submission-type">{submission.research_type}</span>
                            <span className="submission-date">
                              {new Date(submission.created_at).toLocaleDateString('ar-SA', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="submission-actions">
                          <Link
                            href={`/researcher/submissions/${submission.id}`}
                            className="btn btn-outline btn-small"
                          >
                            <i className="fas fa-eye"></i>
                            عرض التفاصيل
                          </Link>
                        </div>
                      </div>
                    ))}
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

