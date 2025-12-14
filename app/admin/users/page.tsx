'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'researcher' | 'admin';
  email_verified: boolean;
  created_at: string;
  phone?: string;
  country?: string;
}

export default function AdminUsersPage() {
  const { isAuthenticated, loading: authLoading, role } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
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
      fetchUsers();
    }
  }, [isAuthenticated, role, roleFilter, page, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }

      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setUsers(data || []);
      setTotalCount(count || 0);
    } catch (error: any) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleRoleFilter = (role: string | null) => {
    setRoleFilter(role);
    setPage(1);
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    if (!confirm('هل أنت متأكد من تغيير دور المستخدم؟')) return;

    try {
      const supabase = createClient();
      const newRole = currentRole === 'admin' ? 'researcher' : 'admin';
      
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      showToast('تم تحديث دور المستخدم بنجاح', 'success');
    } catch (error: any) {
      console.error('Error updating user role:', error);
      showToast('فشل تحديث دور المستخدم', 'error');
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

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="dashboard-page dashboard-layout">
      <AdminSidebar />
      <main className="main-content">
        <AdminTopbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>إدارة المستخدمين</h1>
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
                      placeholder="ابحث بالاسم أو البريد الإلكتروني..."
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
                    className={`btn btn-small ${roleFilter === null ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleRoleFilter(null)}
                  >
                    <i className="fas fa-users"></i>
                    الكل
                  </button>
                  <button
                    type="button"
                    className={`btn btn-small ${roleFilter === 'researcher' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleRoleFilter('researcher')}
                  >
                    <i className="fas fa-user-graduate"></i>
                    باحثين
                  </button>
                  <button
                    type="button"
                    className={`btn btn-small ${roleFilter === 'admin' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleRoleFilter('admin')}
                  >
                    <i className="fas fa-user-shield"></i>
                    مدراء
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Users List */}
          <div className="card card-with-table">
            <div className="card-body">
              {loading ? (
                <div className="loading-placeholder">
                  <div className="loading-spinner"></div>
                  <p>جاري التحميل...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-users"></i>
                  <p>لا توجد مستخدمين</p>
                </div>
              ) : (
                <>
                  <div className="data-table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>الاسم</th>
                          <th>البريد الإلكتروني</th>
                          <th>الدور</th>
                          <th>حالة البريد</th>
                          <th>تاريخ التسجيل</th>
                          <th>الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge badge-${user.role === 'admin' ? 'error' : 'info'}`}>
                                {user.role === 'admin' ? 'مدير' : 'باحث'}
                              </span>
                            </td>
                            <td>
                              {user.email_verified ? (
                                <span className="badge badge-success">
                                  <i className="fas fa-check"></i> مفعّل
                                </span>
                              ) : (
                                <span className="badge badge-warning">
                                  <i className="fas fa-times"></i> غير مفعّل
                                </span>
                              )}
                            </td>
                            <td>
                              {new Date(user.created_at).toLocaleDateString('ar-SA', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td>
                              <div className="table-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <Link
                                  href={`/admin/users/${user.id}`}
                                  className="btn btn-primary btn-small"
                                  title="عرض وتعديل التفاصيل"
                                >
                                  <i className="fas fa-eye"></i>
                                  <span className="action-text">عرض التفاصيل</span>
                                </Link>
                                <button
                                  className="btn btn-outline btn-small"
                                  onClick={() => toggleUserRole(user.id, user.role)}
                                  title={user.role === 'admin' ? 'تحويل إلى باحث' : 'تحويل إلى مدير'}
                                >
                                  <i className={`fas fa-${user.role === 'admin' ? 'user' : 'user-shield'}`}></i>
                                  <span className="action-text">{user.role === 'admin' ? 'تحويل إلى باحث' : 'تحويل إلى مدير'}</span>
                                </button>
                              </div>
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
        </div>
      </main>
    </div>
  );
}

