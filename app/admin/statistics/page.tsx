'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';

interface Stats {
  totalSubmissions: number;
  totalUsers: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  underReviewSubmissions: number;
  revisionRequestedSubmissions: number;
  submissionsByType: Array<{ type: string; count: number }>;
  submissionsByCategory: Array<{ category: string; count: number }>;
  submissionsByMonth: Array<{ month: string; count: number }>;
  verifiedUsers: number;
  unverifiedUsers: number;
}

export default function AdminStatisticsPage() {
  const { isAuthenticated, loading: authLoading, role } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || role !== 'admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, role, router]);

  useEffect(() => {
    if (isAuthenticated && role === 'admin') {
      fetchStatistics();
    }
  }, [isAuthenticated, role]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Get submissions stats
      const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select('status, research_type, category, created_at')
        .eq('is_draft', false);

      if (submissionsError) throw submissionsError;

      // Get users stats
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('email_verified');

      if (usersError) throw usersError;

      // Calculate stats
      const totalSubmissions = submissions?.length || 0;
      const totalUsers = users?.length || 0;

      const statusCounts = {
        pending: 0,
        approved: 0,
        rejected: 0,
        under_review: 0,
        revision_requested: 0,
      };

      submissions?.forEach((sub) => {
        if (sub.status in statusCounts) {
          statusCounts[sub.status as keyof typeof statusCounts]++;
        }
      });

      // Group by type
      const typeMap = new Map<string, number>();
      submissions?.forEach((sub) => {
        const type = sub.research_type || 'غير محدد';
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
      });
      const submissionsByType = Array.from(typeMap.entries()).map(([type, count]) => ({
        type,
        count,
      }));

      // Group by category
      const categoryMap = new Map<string, number>();
      submissions?.forEach((sub) => {
        const category = sub.category || 'غير محدد';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
      const submissionsByCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
      }));

      // Group by month
      const monthMap = new Map<string, number>();
      submissions?.forEach((sub) => {
        const date = new Date(sub.created_at);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthMap.set(month, (monthMap.get(month) || 0) + 1);
      });
      const submissionsByMonth = Array.from(monthMap.entries())
        .sort()
        .slice(-6)
        .map(([month, count]) => ({
          month,
          count,
        }));

      const verifiedUsers = users?.filter((u) => u.email_verified).length || 0;
      const unverifiedUsers = totalUsers - verifiedUsers;

      setStats({
        totalSubmissions,
        totalUsers,
        pendingSubmissions: statusCounts.pending,
        approvedSubmissions: statusCounts.approved,
        rejectedSubmissions: statusCounts.rejected,
        underReviewSubmissions: statusCounts.under_review,
        revisionRequestedSubmissions: statusCounts.revision_requested,
        submissionsByType,
        submissionsByCategory,
        submissionsByMonth,
        verifiedUsers,
        unverifiedUsers,
      });
    } catch (error: any) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
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
            <h1>الإحصائيات</h1>
          </div>

          {loading ? (
            <div className="loading-placeholder">
              <div className="loading-spinner"></div>
              <p>جاري تحميل الإحصائيات...</p>
            </div>
          ) : stats ? (
            <>
              {/* Overview Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(61, 90, 148, 0.1)' }}>
                    <i className="fas fa-folder-open" style={{ color: '#3D5A94' }}></i>
                  </div>
                  <div className="stat-details">
                    <h3>{stats.totalSubmissions}</h3>
                    <p>إجمالي الطلبات</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                    <i className="fas fa-users" style={{ color: '#10b981' }}></i>
                  </div>
                  <div className="stat-details">
                    <h3>{stats.totalUsers}</h3>
                    <p>إجمالي المستخدمين</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(232, 154, 60, 0.1)' }}>
                    <i className="fas fa-clock" style={{ color: '#E89A3C' }}></i>
                  </div>
                  <div className="stat-details">
                    <h3>{stats.pendingSubmissions + stats.underReviewSubmissions}</h3>
                    <p>قيد المراجعة</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                    <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                  </div>
                  <div className="stat-details">
                    <h3>{stats.approvedSubmissions}</h3>
                    <p>المعتمدة</p>
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">توزيع الطلبات حسب الحالة</h2>
                </div>
                <div className="card-body">
                  <div className="stats-breakdown">
                    <div className="breakdown-item">
                      <span className="breakdown-label">قيد المراجعة:</span>
                      <span className="breakdown-value">{stats.pendingSubmissions}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">قيد المراجعة الفعلية:</span>
                      <span className="breakdown-value">{stats.underReviewSubmissions}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">يحتاج مراجعة:</span>
                      <span className="breakdown-value">{stats.revisionRequestedSubmissions}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">مقبول:</span>
                      <span className="breakdown-value">{stats.approvedSubmissions}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">مرفوض:</span>
                      <span className="breakdown-value">{stats.rejectedSubmissions}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Users Stats */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">إحصائيات المستخدمين</h2>
                </div>
                <div className="card-body">
                  <div className="stats-breakdown">
                    <div className="breakdown-item">
                      <span className="breakdown-label">إجمالي المستخدمين:</span>
                      <span className="breakdown-value">{stats.totalUsers}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">مفعّل البريد:</span>
                      <span className="breakdown-value">{stats.verifiedUsers}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">غير مفعّل البريد:</span>
                      <span className="breakdown-value">{stats.unverifiedUsers}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submissions by Type */}
              {stats.submissionsByType.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">الطلبات حسب نوع البحث</h2>
                  </div>
                  <div className="card-body">
                    <div className="stats-list">
                      {stats.submissionsByType.map((item, index) => (
                        <div key={index} className="stat-list-item">
                          <span>{item.type}</span>
                          <span className="badge badge-info">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Submissions by Category */}
              {stats.submissionsByCategory.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">الطلبات حسب الفئة</h2>
                  </div>
                  <div className="card-body">
                    <div className="stats-list">
                      {stats.submissionsByCategory.map((item, index) => (
                        <div key={index} className="stat-list-item">
                          <span>{item.category}</span>
                          <span className="badge badge-info">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <i className="fas fa-chart-bar"></i>
              <p>لا توجد بيانات للإحصائيات</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

