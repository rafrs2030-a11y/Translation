'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';

interface Submission {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  country: string;
  id_number: string;
  gender: string;
  main_researcher: string;
  reference_number: string;
  research_type: string;
  category: string;
  status: string;
  file_url: string | null;
  created_at: string;
  updated_at: string;
  description?: string;
  admin_comment?: string;
  user?: {
    username: string;
    email: string;
    phone?: string;
    country?: string;
  };
}

export default function AdminSubmissionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, role } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [adminReply, setAdminReply] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || (role !== 'admin' && role !== 'super_admin'))) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, role, router]);

  useEffect(() => {
    if (params.id && isAuthenticated && (role === 'admin' || role === 'super_admin')) {
      fetchSubmission();
    }
  }, [params.id, isAuthenticated, role]);

  const fetchSubmission = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          user_id,
          full_name,
          email,
          country,
          id_number,
          gender,
          main_researcher,
          reference_number,
          research_type,
          category,
          status,
          file_url,
          created_at,
          updated_at,
          admin_comment,
          users:user_id(username, email, phone, country)
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;

      setSubmission(data);
      setNewStatus(data.status);
      setAdminNotes(data.admin_comment || '');
      setAdminReply('');
    } catch (error: any) {
      console.error('Error fetching submission:', error);
      setMessage({ type: 'error', text: 'فشل تحميل بيانات الطلب' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!submission || !newStatus) return;

    setUpdating(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (adminNotes) {
        updateData.admin_comment = adminNotes;
      }

      const { error } = await supabase
        .from('submissions')
        .update(updateData)
        .eq('id', submission.id);

      if (error) throw error;

      // Create notification for user (if not already created by trigger)
      if (submission.user_id) {
        await supabase.from('notifications').insert({
          user_id: submission.user_id,
          submission_id: submission.id,
          type: 'status_change',
          message: `تم تحديث حالة طلبك إلى ${getStatusLabel(newStatus)}`,
        });
      }

      setMessage({ type: 'success', text: 'تم تحديث حالة الطلب بنجاح' });
      showToast('تم تحديث حالة الطلب بنجاح', 'success');
      await fetchSubmission();
    } catch (error: any) {
      console.error('Error updating submission:', error);
      setMessage({ type: 'error', text: 'فشل تحديث حالة الطلب' });
      showToast('فشل تحديث حالة الطلب', 'error');
    } finally {
      setUpdating(false);
    }
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

  if (authLoading || loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>جاري تحميل بيانات الطلب...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (role !== 'admin' && role !== 'super_admin') || !submission) {
    return null;
  }

  return (
    <div className="dashboard-page dashboard-layout">
      <AdminSidebar />
      <main className="main-content">
        <AdminTopbar />

        <div className="dashboard-content">
          <div className="page-header">
            <Link href="/admin/submissions" className="btn btn-outline">
              <i className="fas fa-arrow-right"></i>
              العودة إلى القائمة
            </Link>
            <div>
              <h1>مراجعة الطلب</h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                رقم الطلب: {submission.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          {message && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
              <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
              <span>{message.text}</span>
            </div>
          )}

          {/* Submission Header Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(61, 90, 148, 0.05), rgba(81, 118, 184, 0.02))', border: '2px solid rgba(61, 90, 148, 0.1)' }}>
            <div className="card-header" style={{ borderBottom: '2px solid rgba(61, 90, 148, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <h2 className="card-title" style={{ margin: 0, fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                    <i className="fas fa-file-alt" style={{ marginLeft: 'var(--spacing-sm)', color: 'var(--primary-color)' }}></i>
                    {submission.main_researcher || submission.full_name || 'بدون عنوان'}
                  </h2>
                  {submission.reference_number && (
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-hashtag" style={{ marginLeft: '0.25rem' }}></i>
                      رقم المرجع: {submission.reference_number}
                    </p>
                  )}
                </div>
                <span className={`badge badge-${getStatusColor(submission.status)}`} style={{ fontSize: 'var(--font-size-base)', padding: '0.5rem 1rem' }}>
                  <i className={`fas fa-${submission.status === 'approved' ? 'check-circle' : submission.status === 'rejected' ? 'times-circle' : 'clock'}`} style={{ marginLeft: '0.25rem' }}></i>
                  {getStatusLabel(submission.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-lg)' }}>
            {/* Left Column - Main Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
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
                </div>
              </div>

              {/* Researcher Information */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fas fa-user-circle"></i>
                    معلومات الباحث / مقدم الطلب
                  </h2>
                </div>
                <div className="card-body">
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-user" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                        الاسم الكامل:
                      </label>
                      <span style={{ fontWeight: 600 }}>{submission.full_name || submission.user?.username || 'غير محدد'}</span>
                    </div>
                    
                    {submission.main_researcher && submission.main_researcher !== submission.full_name && (
                      <div className="detail-item">
                        <label>
                          <i className="fas fa-user-tie" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                          الباحث الرئيسي:
                        </label>
                        <span style={{ fontWeight: 600 }}>{submission.main_researcher}</span>
                      </div>
                    )}
                    
                    <div className="detail-item">
                      <label>
                        <i className="fas fa-envelope" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                        البريد الإلكتروني:
                      </label>
                      <span>
                        <a href={`mailto:${submission.email || submission.user?.email}`} style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
                          {submission.email || submission.user?.email || 'غير محدد'}
                        </a>
                      </span>
                    </div>
                    
                    {submission.id_number && (
                      <div className="detail-item">
                        <label>
                          <i className="fas fa-id-card" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                          رقم الهوية / السجل التجاري:
                        </label>
                        <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{submission.id_number}</span>
                      </div>
                    )}
                    
                    {submission.gender && (
                      <div className="detail-item">
                        <label>
                          <i className="fas fa-venus-mars" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                          الجنس:
                        </label>
                        <span style={{ fontWeight: 600 }}>{submission.gender}</span>
                      </div>
                    )}
                    
                    {submission.country && (
                      <div className="detail-item">
                        <label>
                          <i className="fas fa-globe" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                          الدولة:
                        </label>
                        <span style={{ fontWeight: 600 }}>{submission.country}</span>
                      </div>
                    )}
                    
                    {submission.user?.phone && (
                      <div className="detail-item">
                        <label>
                          <i className="fas fa-phone" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                          رقم الجوال:
                        </label>
                        <span>
                          <a href={`tel:${submission.user.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
                            {submission.user.phone}
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Admin Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

              {/* Admin Actions Card */}
              <div className="card" style={{ position: 'sticky', top: 'var(--spacing-xl)' }}>
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fas fa-cogs"></i>
                    إجراءات المدير
                  </h2>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="status" className="form-label required" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                      <i className="fas fa-tasks" style={{ color: 'var(--primary-color)' }}></i>
                      حالة الطلب
                    </label>
                    <select
                      id="status"
                      className="form-select"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      disabled={updating}
                      style={{ width: '100%' }}
                    >
                      <option value="pending">
                        <i className="fas fa-clock"></i> قيد المراجعة
                      </option>
                      <option value="under_review">قيد المراجعة الفعلية</option>
                      <option value="revision_requested">يحتاج مراجعة</option>
                      <option value="approved">مقبول</option>
                      <option value="rejected">مرفوض</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="adminNotes" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                      <i className="fas fa-sticky-note" style={{ color: 'var(--warning-color)' }}></i>
                      ملاحظات داخلية (للمدير فقط)
                    </label>
                    <textarea
                      id="adminNotes"
                      className="form-textarea"
                      rows={5}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="ملاحظات داخلية لا يراها الباحث..."
                      disabled={updating}
                    />
                    <small className="form-help-text">
                      <i className="fas fa-lock" style={{ marginLeft: '0.25rem' }}></i>
                      هذه الملاحظات خاصة بالمدير ولا يمكن للباحث رؤيتها
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="adminReply" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                      <i className="fas fa-comment-dots" style={{ color: 'var(--info-color)' }}></i>
                      رد على الباحث
                    </label>
                    <textarea
                      id="adminReply"
                      className="form-textarea"
                      rows={5}
                      value={adminReply}
                      onChange={(e) => setAdminReply(e.target.value)}
                      placeholder="اكتب ردك أو ملاحظاتك للباحث..."
                      disabled={updating}
                    />
                    <small className="form-help-text">
                      <i className="fas fa-bell" style={{ marginLeft: '0.25rem' }}></i>
                      سيتم إرسال هذا الرد إلى الباحث عبر الإشعارات
                    </small>
                  </div>

                  {submission.admin_comment && (
                    <div className="detail-section" style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)', fontWeight: 600, color: 'var(--info-color)' }}>
                        <i className="fas fa-history"></i>
                        التعليق السابق:
                      </label>
                      <div style={{ padding: 'var(--spacing-sm)', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{submission.admin_comment}</p>
                      </div>
                    </div>
                  )}

                  <div className="form-actions" style={{ marginTop: 'var(--spacing-lg)' }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-large"
                      onClick={handleStatusUpdate}
                      disabled={updating || !newStatus}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {updating ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          جاري التحديث...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i>
                          حفظ التغييرات
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

