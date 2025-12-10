'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import ChatDropdown from './ChatDropdown';
import ChatWindow from './ChatWindow';
import { useChat } from '@/contexts/ChatContext';

export default function AdminTopbar() {
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
      <div className="topbar-left">
        <button className="mobile-menu-btn" id="mobile-menu-btn" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        <h1>مرحباً، <span id="admin-name">{user?.username || 'المسؤول'}</span></h1>
      </div>

      <div className="topbar-actions">
        {/* Chat */}
        <ChatDropdown />

        {/* Notifications */}
        <Link href="/admin/notifications" className="topbar-icon-btn" id="notifications-btn">
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
            <span id="user-email">{user?.email || 'admin@arabresearch.com'}</span>
            <i className="fas fa-chevron-down" style={{ fontSize: '0.75rem', marginRight: '0.5rem' }}></i>
          </button>
          {userMenuOpen && (
            <div className="user-menu-dropdown" id="user-menu-dropdown">
              <Link href="/admin/profile" onClick={() => setUserMenuOpen(false)}>
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
