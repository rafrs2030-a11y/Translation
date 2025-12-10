'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';

export default function AdminReportsPage() {
  const { isAuthenticated, loading: authLoading, role } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<'submissions' | 'users' | 'all'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || role !== 'admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, role, router]);

  const generateReport = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let submissionsData: any[] = [];
      let usersData: any[] = [];
      let filename = '';

      if (reportType === 'submissions' || reportType === 'all') {
        let query = supabase
          .from('submissions')
          .select('*, users:user_id(username, email)')
          .eq('is_draft', false);

        if (dateFrom) {
          query = query.gte('created_at', dateFrom);
        }
        if (dateTo) {
          query = query.lte('created_at', dateTo);
        }
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }

        const { data: submissions, error } = await query;
        if (error) throw error;

        submissionsData = submissions || [];
        if (reportType === 'submissions') {
          filename = `submissions-report-${new Date().toISOString().split('T')[0]}.csv`;
        }
      }

      if (reportType === 'users' || reportType === 'all') {
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        usersData = users || [];
        if (reportType === 'users') {
          filename = `users-report-${new Date().toISOString().split('T')[0]}.csv`;
        }
      }

      // Convert to CSV
      let csv = '';
      if (reportType === 'all') {
        // Export both as separate sections
        csv = generateSubmissionsCSV(submissionsData) + '\n\n' + generateUsersCSV(usersData);
        filename = `full-report-${new Date().toISOString().split('T')[0]}.csv`;
      } else if (reportType === 'submissions') {
        csv = generateSubmissionsCSV(submissionsData);
      } else {
        csv = generateUsersCSV(usersData);
      }

      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Error generating report:', error);
      alert('فشل إنشاء التقرير');
    } finally {
      setLoading(false);
    }
  };

  const generateSubmissionsCSV = (submissions: any[]): string => {
    const headers = [
      'ID',
      'العنوان',
      'الباحث',
      'البريد الإلكتروني',
      'نوع البحث',
      'الفئة',
      'الحالة',
      'تاريخ التقديم',
      'تاريخ التحديث',
    ];
    const rows = submissions.map((sub) => [
      sub.id,
      sub.title || '',
      sub.users?.username || '',
      sub.users?.email || '',
      sub.research_type || '',
      sub.category || '',
      sub.status || '',
      new Date(sub.created_at).toLocaleDateString('ar-SA'),
      new Date(sub.updated_at).toLocaleDateString('ar-SA'),
    ]);

    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  };

  const generateUsersCSV = (users: any[]): string => {
    const headers = ['ID', 'الاسم', 'البريد الإلكتروني', 'الدور', 'البريد مفعّل', 'تاريخ التسجيل'];
    const rows = users.map((user) => [
      user.id,
      user.username || '',
      user.email || '',
      user.role === 'admin' ? 'مدير' : 'باحث',
      user.email_verified ? 'نعم' : 'لا',
      new Date(user.created_at).toLocaleDateString('ar-SA'),
    ]);

    return [headers, ...rows].map((row) => row.join(',')).join('\n');
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

  return (
    <div className="dashboard-page dashboard-layout">
      <AdminSidebar />
      <main className="main-content">
        <AdminTopbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>التقارير</h1>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">تصدير التقرير</h2>
            </div>
            <div className="card-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  generateReport();
                }}
              >
                <div className="form-group">
                  <label htmlFor="reportType" className="form-label required">
                    نوع التقرير
                  </label>
                  <select
                    id="reportType"
                    className="form-select"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as 'submissions' | 'users' | 'all')}
                    disabled={loading}
                  >
                    <option value="all">تقرير شامل (الطلبات والمستخدمين)</option>
                    <option value="submissions">تقرير الطلبات فقط</option>
                    <option value="users">تقرير المستخدمين فقط</option>
                  </select>
                </div>

                {(reportType === 'submissions' || reportType === 'all') && (
                  <>
                    <div className="form-group">
                      <label htmlFor="statusFilter" className="form-label">
                        تصفية حسب الحالة
                      </label>
                      <select
                        id="statusFilter"
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        disabled={loading}
                      >
                        <option value="all">الكل</option>
                        <option value="pending">قيد المراجعة</option>
                        <option value="under_review">قيد المراجعة الفعلية</option>
                        <option value="revision_requested">يحتاج مراجعة</option>
                        <option value="approved">مقبول</option>
                        <option value="rejected">مرفوض</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="dateFrom" className="form-label">
                          من تاريخ
                        </label>
                        <input
                          type="date"
                          id="dateFrom"
                          className="form-input"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          disabled={loading}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="dateTo" className="form-label">
                          إلى تاريخ
                        </label>
                        <input
                          type="date"
                          id="dateTo"
                          className="form-input"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary btn-large"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        جاري التصدير...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-download"></i>
                        تصدير التقرير (CSV)
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="info-box" style={{ marginTop: '2rem' }}>
                <i className="fas fa-info-circle"></i>
                <p>
                  سيتم تصدير التقرير بصيغة CSV يمكن فتحه في Excel أو أي برنامج جداول بيانات.
                  التقرير الشامل يحتوي على قسمين: الطلبات والمستخدمين.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

