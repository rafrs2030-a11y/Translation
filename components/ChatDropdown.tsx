'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function ChatDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { conversations, loading, unreadCount, openChat } = useChat();
  const { user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowUserSelection(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return date.toLocaleDateString('ar-SA');
  };

  const handleConversationClick = (conversation: any) => {
    if (conversation.other_user?.id) {
      openChat(conversation.other_user.id);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        className="topbar-icon-btn"
        id="chat-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'relative' }}
      >
        <i className="fas fa-comments"></i>
        {unreadCount > 0 && (
          <span className="notification-badge" id="chat-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="chat-dropdown" ref={dropdownRef}>
          <div className="chat-dropdown-header">
            <h3>المحادثات</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowUserSelection(true)}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              <i className="fas fa-plus" style={{ marginLeft: '0.5rem' }}></i>
              محادثة جديدة
            </button>
          </div>

          <div className="chat-dropdown-body">
            {loading ? (
              <div className="chat-loading">
                <div className="loading-spinner"></div>
                <p>جاري التحميل...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="chat-empty">
                <i className="fas fa-comments"></i>
                <p>لا توجد محادثات</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowUserSelection(true)}
                >
                  بدء محادثة جديدة
                </button>
              </div>
            ) : (
              <div className="chat-conversations-list">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`chat-conversation-item ${conversation.unread_count > 0 ? 'has-unread' : ''}`}
                    onClick={() => handleConversationClick(conversation)}
                  >
                    {conversation.unread_count > 0 && (
                      <span className="chat-conversation-unread-badge">
                        {conversation.unread_count}
                      </span>
                    )}
                    <div className="chat-conversation-avatar">
                      <div className="chat-avatar-fallback">
                        {conversation.other_user?.username?.[0]?.toUpperCase() || 'م'}
                      </div>
                    </div>
                    <div className="chat-conversation-content">
                      <h4 className="chat-conversation-name">
                        {conversation.other_user?.username || 'مستخدم'}
                      </h4>
                      <p className="chat-conversation-time">
                        {formatTime(conversation.last_message_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showUserSelection && (
        <UserSelectionModal
          onSelect={(userId) => {
            openChat(userId);
            setShowUserSelection(false);
            setIsOpen(false);
          }}
          onClose={() => setShowUserSelection(false)}
          currentUserId={user?.id}
        />
      )}
    </>
  );
}

function UserSelectionModal({ onSelect, onClose, currentUserId }: {
  onSelect: (userId: string) => void;
  onClose: () => void;
  currentUserId?: string;
}) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function fetchUsers() {
      try {
        // Get admins if current user is not admin, or get users if current user is admin
        const { data: currentUser } = await supabase
          .from('users')
          .select('role')
          .eq('id', currentUserId)
          .single();

        const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';
        
        const query = supabase
          .from('users')
          .select('id, username, email, role')
          .neq('id', currentUserId || '');

        if (isAdmin) {
          // Admin can chat with any user
          query.eq('role', 'researcher');
        } else {
          // User can chat with admins
          query.in('role', ['admin', 'super_admin']);
        }

        const { data, error } = await query.order('username');

        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    }

    if (currentUserId) {
      fetchUsers();
    }
  }, [currentUserId, supabase]);

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-user-selection-modal" onClick={onClose}>
      <div className="chat-user-selection-content" onClick={(e) => e.stopPropagation()}>
        <div className="chat-user-selection-header">
          <h3>اختر مستخدم للدردشة</h3>
          <button className="chat-user-selection-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="chat-user-selection-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="ابحث عن مستخدم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="chat-user-selection-list">
          {loading ? (
            <div className="chat-loading">
              <div className="loading-spinner"></div>
              <p>جاري التحميل...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="chat-user-selection-empty">
              <i className="fas fa-users"></i>
              <p>لا يوجد مستخدمون</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="chat-user-selection-item"
                onClick={() => onSelect(user.id)}
              >
                <div className="chat-user-selection-avatar">
                  <div className="chat-avatar-fallback">
                    {user.username?.[0]?.toUpperCase() || 'م'}
                  </div>
                </div>
                <div className="chat-user-selection-info">
                  <h4>{user.username || 'مستخدم'}</h4>
                  <p>{user.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

