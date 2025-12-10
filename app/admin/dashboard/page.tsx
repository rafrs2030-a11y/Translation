'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';

export default function AdminDashboard() {
  const { user, isAuthenticated, loading: authLoading, role } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || (role !== 'admin' && role !== 'super_admin'))) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, role, router]);

  useEffect(() => {
    if (isAuthenticated && (role === 'admin' || role === 'super_admin')) {
      loadStats();
    }
  }, [isAuthenticated, role]);

  const loadStats = async () => {
    try {
      const supabase = (await import('@/lib/supabase/client')).createClient();
      
      // Get all submissions stats
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select('status')
        .eq('is_draft', false);

      if (error) throw error;

      const stats = {
        total: submissions?.length || 0,
        pending: submissions?.filter((s: any) => s.status === 'pending' || s.status === 'under_review').length || 0,
        approved: submissions?.filter((s: any) => s.status === 'approved').length || 0,
        rejected: submissions?.filter((s: any) => s.status === 'rejected').length || 0,
      };

      setStats(stats);
    } catch (error: any) {
      console.error('Error loading admin stats:', error);
      setStats({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      });
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

  if (!isAuthenticated || (role !== 'admin' && role !== 'super_admin')) {
    return null;
  }

  return (
    <div className="dashboard-page dashboard-layout">
      <AdminSidebar />
      <main className="main-content">
        <AdminTopbar />

        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div>
              <h2>مرحباً، <span>{user?.username || 'المدير'}!</span></h2>
              <p>نظرة عامة سريعة على إحصائيات المنصة</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(61, 90, 148, 0.1)' }}>
                <i className="fas fa-folder-open" style={{ color: '#3D5A94' }}></i>
              </div>
              <div className="stat-details">
                <h3 id="total-submissions">{stats.total}</h3>
                <p>إجمالي الطلبات</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(232, 154, 60, 0.1)' }}>
                <i className="fas fa-clock" style={{ color: '#E89A3C' }}></i>
              </div>
              <div className="stat-details">
                <h3 id="pending-submissions">{stats.pending}</h3>
                <p>قيد المراجعة</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
              </div>
              <div className="stat-details">
                <h3 id="approved-submissions">{stats.approved}</h3>
                <p>المعتمدة</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <i className="fas fa-times-circle" style={{ color: '#ef4444' }}></i>
              </div>
              <div className="stat-details">
                <h3 id="rejected-submissions">{stats.rejected}</h3>
                <p>المرفوضة</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>
              <i className="fas fa-bolt"></i>
              إجراءات سريعة
            </h3>
            <div className="actions-grid">
              <Link href="/admin/submissions" className="action-card">
                <i className="fas fa-folder-open"></i>
                <span>مراجعة الطلبات</span>
              </Link>
              <Link href="/admin/users" className="action-card">
                <i className="fas fa-user-plus"></i>
                <span>إدارة المستخدمين</span>
              </Link>
              <Link href="/admin/reports" className="action-card">
                <i className="fas fa-download"></i>
                <span>تصدير تقرير</span>
              </Link>
              <Link href="/admin/settings" className="action-card">
                <i className="fas fa-cog"></i>
                <span>إعدادات النظام</span>
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

