'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';

export default function Topbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
  };

  return (
    <header className="topbar">
      <button className="mobile-menu-btn" id="mobile-menu-btn" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      <div className="topbar-title">
        <h1>لوحة التحكم</h1>
      </div>

      <div className="topbar-actions">
        {/* Chat */}
        <button className="topbar-icon-btn" id="chat-btn">
          <i className="fas fa-comments"></i>
          {unreadCount > 0 && (
            <span className="notification-badge" id="chat-badge">{unreadCount}</span>
          )}
        </button>

        {/* Notifications */}
        <Link href="/researcher/notifications" className="topbar-icon-btn" id="notifications-btn">
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && (
            <span className="notification-badge" id="notification-badge">{unreadCount}</span>
          )}
        </Link>

        {/* User Menu */}
        <div className="user-menu">
          <button
            className="user-menu-btn"
            id="user-menu-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <span className="user-name" id="user-name">
              {user?.username || 'الباحث'}
            </span>
            <i className="fas fa-chevron-down"></i>
          </button>
          {userMenuOpen && (
            <div className="user-menu-dropdown" id="user-menu-dropdown">
              <Link href="/researcher/profile" onClick={() => setUserMenuOpen(false)}>
                <i className="fas fa-user"></i>
                الملف الشخصي
              </Link>
              <button onClick={() => { logout(); setUserMenuOpen(false); }}>
                <i className="fas fa-sign-out-alt"></i>
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

