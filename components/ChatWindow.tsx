'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ChatWindow() {
  const { currentConversation, messages, loading, sendMessage, closeChat, markAsRead } = useChat();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentConversation && user) {
      markAsRead(currentConversation.id);
    }
  }, [currentConversation, user, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim() || !currentConversation) return;

    await sendMessage(messageText);
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentConversation) return null;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="chat-window-user">
          <div className="chat-window-avatar">
            <div className="chat-avatar-fallback">
              {currentConversation.other_user?.username?.[0]?.toUpperCase() || 'م'}
            </div>
          </div>
          <div>
            <h4>{currentConversation.other_user?.username || 'مستخدم'}</h4>
            <div className="chat-window-status">
              <span>متصل</span>
            </div>
          </div>
        </div>
        <button className="chat-window-close" onClick={closeChat}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="chat-window-messages">
        {loading && messages.length === 0 ? (
          <div className="chat-loading">
            <div className="loading-spinner"></div>
            <p>جاري تحميل الرسائل...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            <i className="fas fa-comments"></i>
            <p>لا توجد رسائل بعد</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.7 }}>
              ابدأ المحادثة بإرسال رسالة
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === user?.id;
            return (
              <div key={message.id} className={`chat-message ${isOwn ? 'own' : 'other'}`}>
                {!isOwn && (
                  <div className="chat-message-avatar">
                    <div className="chat-message-avatar-fallback">
                      {message.sender?.username?.[0]?.toUpperCase() || 'م'}
                    </div>
                  </div>
                )}
                {!isOwn && <div className="chat-message-avatar-spacer"></div>}
                <div className="chat-message-content">
                  {!isOwn && (
                    <div className="chat-message-sender-name">
                      {message.sender?.username || 'مستخدم'}
                    </div>
                  )}
                  <p>{message.message}</p>
                  <span className="chat-message-time">{formatTime(message.created_at)}</span>
                  {isOwn && (
                    <div className={`chat-message-status ${message.is_read ? 'read' : 'unread'}`}>
                      <i className={`fas fa-${message.is_read ? 'check-double' : 'check'} chat-message-status-icon`}></i>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-window-input">
        <input
          type="text"
          placeholder="اكتب رسالة..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend} disabled={!messageText.trim()}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}

