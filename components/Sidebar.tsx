'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { href: '/researcher/dashboard', icon: 'fa-home', label: 'الرئيسية' },
    { href: '/researcher/submit', icon: 'fa-plus-circle', label: 'تقديم بحث' },
    { href: '/researcher/submissions', icon: 'fa-folder-open', label: 'طلباتي' },
    { href: '/researcher/profile', icon: 'fa-user', label: 'الملف الشخصي' },
    { href: '/researcher/settings', icon: 'fa-cog', label: 'الإعدادات' },
    { href: '/instructions', icon: 'fa-book-reader', label: 'دليل الاستخدام' },
  ];

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <Image
          src="/images/logo.png"
          alt="Research Assistant Logo"
          className="sidebar-logo"
          style={{ maxWidth: '120px', height: 'auto', objectFit: 'contain' }}
          width={120}
          height={35}
          priority
        />
        <h2>لوحة الباحث</h2>
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

