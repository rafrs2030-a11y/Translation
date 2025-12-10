'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';

interface Submission {
  id: string;
  user_id: string;
  title: string;
  research_type: string;
  category: string;
  status: string;
  file_url: string | null;
  created_at: string;
  updated_at: string;
  is_draft: boolean;
  user?: {
    username: string;
    email: string;
  };
}

export default function AdminSubmissionsPage() {
  const { isAuthenticated, loading: authLoading, role } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || (role !== 'admin' && role !== 'super_admin'))) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, role, router]);

  useEffect(() => {
    if (isAuthenticated && (role === 'admin' || role === 'super_admin')) {
      fetchSubmissions();
    }
  }, [isAuthenticated, role, statusFilter, page, searchTerm]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('submissions')
        .select('*, users:user_id(username, email)', { count: 'exact' })
        .eq('is_draft', false)
        .order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setSubmissions(data || []);
      setTotalCount(count || 0);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSubmissions();
  };

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    setPage(1);
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

  if (!isAuthenticated || (role !== 'admin' && role !== 'super_admin')) {
    return null;
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="dashboard-page dashboard-layout">
      <AdminSidebar />
      <main className="main-content">
        <AdminTopbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>إدارة الطلبات</h1>
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
                    className={`btn btn-small ${statusFilter === null ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilter(null)}
                  >
                    الكل
                  </button>
                  <button
                    type="button"
                    className={`btn btn-small ${statusFilter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilter('pending')}
                  >
                    قيد المراجعة
                  </button>
                  <button
                    type="button"
                    className={`btn btn-small ${statusFilter === 'under_review' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilter('under_review')}
                  >
                    قيد المراجعة الفعلية
                  </button>
                  <button
                    type="button"
                    className={`btn btn-small ${statusFilter === 'approved' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilter('approved')}
                  >
                    مقبول
                  </button>
                  <button
                    type="button"
                    className={`btn btn-small ${statusFilter === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilter('rejected')}
                  >
                    مرفوض
                  </button>
                  <button
                    type="button"
                    className={`btn btn-small ${statusFilter === 'revision_requested' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilter('revision_requested')}
                  >
                    يحتاج مراجعة
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
                </div>
              ) : (
                <>
                  <div className="submissions-list">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="submission-item">
                        <div className="submission-info">
                          <h3>
                            <Link href={`/admin/submissions/${submission.id}`}>
                              {submission.title || 'بدون عنوان'}
                            </Link>
                          </h3>
                          <div className="submission-meta">
                            <span className={`badge badge-${getStatusColor(submission.status)}`}>
                              {getStatusLabel(submission.status)}
                            </span>
                            <span className="submission-type">{submission.research_type}</span>
                            <span className="submission-category">{submission.category}</span>
                            {submission.user && (
                              <span className="submission-user">
                                <i className="fas fa-user"></i>
                                {submission.user.username || submission.user.email}
                              </span>
                            )}
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
                            href={`/admin/submissions/${submission.id}`}
                            className="btn btn-primary btn-small"
                          >
                            <i className="fas fa-eye"></i>
                            مراجعة
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
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        <i className="fas fa-chevron-right"></i>
                        السابق
                      </button>
                      <span className="pagination-info">
                        صفحة {page} من {totalPages}
                      </span>
                      <button
                        className="btn btn-outline btn-small"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
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

