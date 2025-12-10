'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { href: '/admin/dashboard', icon: 'fa-home', label: 'الرئيسية' },
    { href: '/admin/submissions', icon: 'fa-folder-open', label: 'إدارة الطلبات' },
    { href: '/admin/users', icon: 'fa-users', label: 'إدارة المستخدمين' },
    { href: '/admin/verification-requests', icon: 'fa-user-check', label: 'طلبات التوثيق' },
    { href: '/admin/statistics', icon: 'fa-chart-bar', label: 'الإحصائيات' },
    { href: '/admin/reports', icon: 'fa-file-export', label: 'التقارير' },
    { href: '/admin/settings', icon: 'fa-cog', label: 'الإعدادات' },
    { href: '/admin/profile', icon: 'fa-user', label: 'الملف الشخصي' },
  ];

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <img src="/images/logo.png" alt="Research Assistant Logo" className="sidebar-logo" style={{ maxWidth: '120px' }} />
        <h2>لوحة المسؤول</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => logout()} id="logout-btn">
          <i className="fas fa-sign-out-alt"></i>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}

