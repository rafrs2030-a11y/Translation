'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';

interface VerificationRequest {
  id: string;
  username: string;
  email: string;
  email_verified: boolean;
  phone?: string;
  country?: string;
        national_id?: string;
        gender?: string;
        created_at: string;
        verification_status: 'pending' | 'approved' | 'rejected';
}

export default function AdminVerificationRequestsPage() {
  const { isAuthenticated, loading: authLoading, role } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const pageSize = 10;

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || role !== 'admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, role, router]);

  useEffect(() => {
    if (isAuthenticated && role === 'admin') {
      fetchVerificationRequests();
    }
  }, [isAuthenticated, role, statusFilter, page, searchTerm]);

  const fetchVerificationRequests = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Filter by verification status
      if (statusFilter === 'pending') {
        query = query.eq('email_verified', false);
      } else if (statusFilter === 'approved') {
        query = query.eq('email_verified', true);
      }

      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // Map users to verification requests
      const mappedRequests: VerificationRequest[] = (data || []).map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        email_verified: user.email_verified || false,
        phone: user.phone,
        country: user.country,
        national_id: user.national_id,
        gender: user.gender,
        created_at: user.created_at,
        verification_status: user.email_verified ? 'approved' : 'pending',
      }));

      setRequests(mappedRequests);
      setTotalCount(count || 0);
    } catch (error: any) {
      console.error('Error fetching verification requests:', error);
      setMessage({ type: 'error', text: 'فشل تحميل طلبات التوثيق' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (userId: string, action: 'approve' | 'reject', notes?: string) => {
    if (!confirm(`هل أنت متأكد من ${action === 'approve' ? 'الموافقة على' : 'رفض'} طلب التوثيق؟`)) {
      return;
    }

    setProcessing(userId);
    setMessage(null);

    try {
      const supabase = createClient();

      if (action === 'approve') {
        // Approve verification - verify email
        const { error: updateError } = await supabase
          .from('users')
          .update({
            email_verified: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (updateError) throw updateError;

        // Create notification for user
        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'system',
          title: 'تم توثيق حسابك',
          message: 'تم توثيق حسابك بنجاح. يمكنك الآن استخدام جميع ميزات المنصة.',
          related_type: 'verification',
        });

        setMessage({ type: 'success', text: 'تم الموافقة على طلب التوثيق بنجاح' });
      } else {
        // Reject verification - Store notes in notification message
        const { error: updateError } = await supabase
          .from('users')
          .update({
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (updateError) throw updateError;

        // Create notification for user
        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'system',
          title: 'طلب التوثيق مرفوض',
          message: notes || 'تم رفض طلب توثيق حسابك. يرجى التواصل مع الدعم لمزيد من المعلومات.',
          related_type: 'verification',
        });

        setMessage({ type: 'success', text: 'تم رفض طلب التوثيق' });
      }

      await fetchVerificationRequests();
    } catch (error: any) {
      console.error('Error processing verification:', error);
      setMessage({ type: 'error', text: `فشل ${action === 'approve' ? 'الموافقة على' : 'رفض'} طلب التوثيق` });
    } finally {
      setProcessing(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchVerificationRequests();
  };

  const handleStatusFilterChange = (status: 'all' | 'pending' | 'approved' | 'rejected') => {
    setStatusFilter(status);
    setPage(1);
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

  if (!isAuthenticated || role !== 'admin') {
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
            <h1>طلبات التوثيق</h1>
          </div>

          {message && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
              <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
              <span>{message.text}</span>
            </div>
          )}

          {/* Filters */}
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSearch} className="filters-form">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-search"></i>
                    بحث
                  </button>
                </div>

                <div className="filter-buttons">
                  <button
                    type="button"
                    className={`btn btn-small ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilterChange('all')}
                  >
                    الكل
                  </button>
                  <button
                    type="button"
                    className={`btn btn-small ${statusFilter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilterChange('pending')}
                  >
                    قيد الانتظار
                  </button>
                  <button
                    type="button"
                    className={`btn btn-small ${statusFilter === 'approved' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilterChange('approved')}
                  >
                    موثق
                  </button>
                  <button
                    type="button"
                    className={`btn btn-small ${statusFilter === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusFilterChange('rejected')}
                  >
                    مرفوض
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Verification Requests List */}
          <div className="card">
            <div className="card-body">
              {loading ? (
                <div className="loading-placeholder">
                  <div className="loading-spinner"></div>
                  <p>جاري التحميل...</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-user-check"></i>
                  <p>لا توجد طلبات توثيق</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>المستخدم</th>
                          <th>البريد الإلكتروني</th>
                          <th>رقم الهوية</th>
                          <th>رقم الجوال</th>
                          <th>الدولة</th>
                          <th>تاريخ التسجيل</th>
                          <th>الحالة</th>
                          <th>الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((request) => (
                          <tr key={request.id}>
                            <td>
                              <strong>{request.username}</strong>
                              {request.gender && (
                                <span className="text-muted" style={{ display: 'block', fontSize: '0.875rem' }}>
                                  {request.gender}
                                </span>
                              )}
                            </td>
                            <td>{request.email}</td>
                            <td>{request.national_id || 'غير محدد'}</td>
                            <td>{request.phone || 'غير محدد'}</td>
                            <td>{request.country || 'غير محدد'}</td>
                            <td>
                              {new Date(request.created_at).toLocaleDateString('ar-SA', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td>
                              {request.verification_status === 'approved' ? (
                                <span className="badge badge-success">
                                  <i className="fas fa-check"></i> موثق
                                </span>
                              ) : request.verification_status === 'rejected' ? (
                                <span className="badge badge-error">
                                  <i className="fas fa-times"></i> مرفوض
                                </span>
                              ) : (
                                <span className="badge badge-warning">
                                  <i className="fas fa-clock"></i> قيد الانتظار
                                </span>
                              )}
                            </td>
                            <td>
                              {request.verification_status === 'pending' && (
                                <div className="action-buttons">
                                  <button
                                    className="btn btn-success btn-small"
                                    onClick={() => handleVerification(request.id, 'approve')}
                                    disabled={processing === request.id}
                                    title="الموافقة على التوثيق"
                                  >
                                    <i className="fas fa-check"></i>
                                    موافقة
                                  </button>
                                  <button
                                    className="btn btn-error btn-small"
                                    onClick={() => {
                                      const notes = prompt('أدخل سبب الرفض (اختياري):');
                                      if (notes !== null) {
                                        handleVerification(request.id, 'reject', notes);
                                      }
                                    }}
                                    disabled={processing === request.id}
                                    title="رفض التوثيق"
                                  >
                                    <i className="fas fa-times"></i>
                                    رفض
                                  </button>
                                </div>
                              )}
                              {request.verification_status === 'approved' && (
                                <span className="text-muted">تم التوثيق</span>
                              )}
                              {request.verification_status === 'rejected' && (
                                <span className="text-muted">تم الرفض</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

          {/* Info Box */}
          <div className="info-box" style={{ marginTop: '2rem' }}>
            <i className="fas fa-info-circle"></i>
            <div>
              <h4>معلومات حول طلبات التوثيق</h4>
              <ul style={{ marginTop: '0.5rem', paddingRight: '1.5rem' }}>
                <li>طلبات التوثيق هي للمستخدمين الذين لم يتم تفعيل بريدهم الإلكتروني بعد</li>
                <li>عند الموافقة على التوثيق، سيتم تفعيل البريد الإلكتروني تلقائياً</li>
                <li>يمكنك إضافة ملاحظات عند الرفض لتوضيح السبب للمستخدم</li>
                <li>سيتم إرسال إشعار للمستخدم عند الموافقة أو الرفض</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

