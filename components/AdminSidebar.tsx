'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();

  const navItems = [
    { href: '/admin/dashboard', icon: 'fa-home', label: 'الرئيسية' },
    { href: '/admin/submissions', icon: 'fa-folder-open', label: 'إدارة الطلبات' },
    { href: '/admin/users', icon: 'fa-users', label: 'إدارة المستخدمين' },
    { href: '/admin/verification-requests', icon: 'fa-user-check', label: 'طلبات التوثيق' },
    { href: '/admin/statistics', icon: 'fa-chart-bar', label: 'الإحصائيات' },
    { href: '/admin/reports', icon: 'fa-file-export', label: 'التقارير' },
    { href: '/admin/notifications', icon: 'fa-bell', label: 'الإشعارات', badge: 'notifications' as const },
    { href: '/admin/settings', icon: 'fa-cog', label: 'الإعدادات' },
    { href: '/admin/profile', icon: 'fa-user', label: 'الملف الشخصي' },
  ];

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <Image
          src="/images/logo.png"
          alt="Research Assistant Logo"
          className="sidebar-logo"
          style={{ maxWidth: '120px' }}
          width={120}
          height={28}
          priority
        />
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
            {item.badge === 'notifications' && unreadCount > 0 && (
              <span
                className="nav-badge"
                data-badge="notifications"
                style={{ display: 'inline-flex' }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
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

