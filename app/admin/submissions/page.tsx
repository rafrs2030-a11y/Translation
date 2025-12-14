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
  main_researcher: string;
  full_name: string;
  reference_number: string;
  research_type: string;
  category: string;
  status: string;
  file_url: string | null;
  created_at: string;
  updated_at: string;
  is_draft: boolean;
  detailed_specialization?: string;
  general_specialization?: string;
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
        // البحث في عدة حقول: main_researcher, full_name, reference_number, detailed_specialization
        query = query.or(`main_researcher.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,reference_number.ilike.%${searchTerm}%,detailed_specialization.ilike.%${searchTerm}%`);
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
          <div className="page-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>إدارة الطلبات</h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                <i className="fas fa-file-alt" style={{ marginLeft: '0.5rem' }}></i>
                إجمالي الطلبات: <strong>{totalCount}</strong> طلب
              </p>
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
              <form onSubmit={handleSearch} className="filters-form users-filters">
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
                    {submissions.map((submission) => {
                      // إنشاء عنوان للعرض من الحقول المتاحة
                      const displayTitle = submission.main_researcher || submission.full_name || submission.reference_number || 'بدون عنوان';
                      const displaySubtitle = submission.detailed_specialization || submission.general_specialization || '';
                      
                      return (
                        <div key={submission.id} className="submission-item" style={{ 
                          padding: 'var(--spacing-lg)', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: 'var(--radius-lg)',
                          marginBottom: 'var(--spacing-md)',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                          <div className="submission-info" style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                              <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
                                  <Link 
                                    href={`/admin/submissions/${submission.id}`}
                                    style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                                  >
                                    {displayTitle}
                                  </Link>
                                </h3>
                                {displaySubtitle && (
                                  <p style={{ 
                                    margin: 0, 
                                    color: 'var(--text-secondary)', 
                                    fontSize: 'var(--font-size-sm)',
                                    marginTop: '0.25rem'
                                  }}>
                                    <i className="fas fa-book" style={{ marginLeft: '0.25rem', color: 'var(--primary-color)' }}></i>
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
                                    <i className="fas fa-hashtag" style={{ marginLeft: '0.25rem' }}></i>
                                    رقم المرجع: {submission.reference_number}
                                  </p>
                                )}
                              </div>
                              <span className={`badge badge-${getStatusColor(submission.status)}`} style={{ 
                                fontSize: 'var(--font-size-sm)', 
                                padding: '0.5rem 1rem',
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
                              paddingTop: 'var(--spacing-sm)',
                              borderTop: '1px solid var(--border-color)'
                            }}>
                              <span className="submission-type" style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.25rem',
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--text-secondary)'
                              }}>
                                <i className="fas fa-microscope" style={{ color: 'var(--primary-color)' }}></i>
                                {submission.research_type || 'غير محدد'}
                              </span>
                              
                              {submission.category && (
                                <span className="submission-category" style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '0.25rem',
                                  fontSize: 'var(--font-size-sm)',
                                  color: 'var(--text-secondary)'
                                }}>
                                  <i className="fas fa-folder" style={{ color: 'var(--info-color)' }}></i>
                                  {submission.category}
                                </span>
                              )}
                              
                              {submission.user && (
                                <span className="submission-user" style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '0.25rem',
                                  fontSize: 'var(--font-size-sm)',
                                  color: 'var(--text-secondary)'
                                }}>
                                  <i className="fas fa-user" style={{ color: 'var(--success-color)' }}></i>
                                  {submission.user.username || submission.user.email}
                                </span>
                              )}
                              
                              <span className="submission-date" style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.25rem',
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--text-secondary)',
                                marginRight: 'auto'
                              }}>
                                <i className="fas fa-calendar" style={{ color: 'var(--warning-color)' }}></i>
                                {new Date(submission.created_at).toLocaleDateString('ar-SA', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              
                              {submission.file_url && (
                                <a
                                  href={submission.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '0.25rem',
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--primary-color)',
                                    textDecoration: 'none'
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <i className="fas fa-file-pdf"></i>
                                  الملف
                                </a>
                              )}
                            </div>
                          </div>
                          
                          <div className="submission-actions" style={{ 
                            display: 'flex', 
                            gap: 'var(--spacing-sm)',
                            marginTop: 'var(--spacing-md)',
                            paddingTop: 'var(--spacing-md)',
                            borderTop: '1px solid var(--border-color)'
                          }}>
                            <Link
                              href={`/admin/submissions/${submission.id}`}
                              className="btn btn-primary btn-small"
                              style={{ flex: 1, justifyContent: 'center' }}
                            >
                              <i className="fas fa-eye"></i>
                              مراجعة
                            </Link>
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

