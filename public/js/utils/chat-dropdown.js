/**
 * Chat Dropdown Component
 * مكون قائمة الدردشة المنسدلة
 */

import chatStore from '../stores/chatStore.js';
import { formatRelativeTime } from './helpers.js';
import authStore from '../stores/authStore.js';
import { updateAvatarDisplay } from './avatar-helper.js';

let chatDropdown = null;
let chatBtn = null;
let chatBadge = null;
let chatContainer = null;
let isInitialized = false;

/**
 * Initialize chat dropdown
 */
export async function initChatDropdown() {
    if (isInitialized) return;
    
    chatBtn = document.getElementById('chat-btn');
    chatBadge = document.getElementById('chat-badge');
    
    if (!chatBtn) return;
    
    // Request notification permission
    requestNotificationPermission();
    
    // Initialize chat store
    await chatStore.initialize();
    
    // Subscribe to store updates
    chatStore.subscribe(handleStoreUpdate);
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup realtime event listeners
    setupRealtimeListeners();
    
    // Load initial badge count
    const user = authStore.getState().user;
    if (user) {
        await chatStore.updateUnreadCount();
    }
    
    isInitialized = true;
}

/**
 * Request notification permission
 */
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            console.log('Notification permission:', permission);
        });
    }
}

/**
 * Setup realtime event listeners
 */
function setupRealtimeListeners() {
    // Listen for new chat messages
    window.addEventListener('chat:new-message', async (event) => {
        const { message } = event.detail;
        
        // تحديث العداد
        await chatStore.updateUnreadCount();
        
        // تحديث قائمة المحادثات إذا كانت مفتوحة
        if (chatDropdown && chatDropdown.style.display !== 'none') {
            await loadConversations();
        }
        
        // تحديث الرسائل في نافذة الدردشة إذا كانت مفتوحة
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
            const currentConversation = chatStore.getState().currentConversation;
            if (currentConversation && message.conversation_id === currentConversation.id) {
                // الرسالة ستظهر تلقائياً عبر Realtime
                // لكن نحدث الواجهة للتأكد
                const messages = chatStore.getState().messages;
                updateMessages(messages);
            }
        }
    });
}

/**
 * Create dropdown HTML
 */
function createDropdown() {
    const user = authStore.getState().user;
    const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin');
    
    const dropdownHTML = `
        <div id="chat-dropdown" class="chat-dropdown" style="display: none;">
            <div class="chat-dropdown-header">
                <h3>الدردشة</h3>
                <button class="btn btn-ghost btn-sm" id="new-chat-btn">
                    <i class="fas fa-plus"></i>
                    ${isAdmin ? 'محادثة جديدة' : 'ابدأ محادثة'}
                </button>
            </div>
            <div class="chat-dropdown-body">
                <div id="chat-conversations-list" class="chat-conversations-list">
                    <div class="chat-loading">
                        <div class="loading-spinner"></div>
                        <p>جاري التحميل...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insert after chat button (inside topbar-actions container)
    const topbarActions = chatBtn.closest('.topbar-actions');
    if (topbarActions) {
        topbarActions.insertAdjacentHTML('beforeend', dropdownHTML);
    } else {
        // Fallback: insert after button
        chatBtn.insertAdjacentHTML('afterend', dropdownHTML);
    }
    
    chatDropdown = document.getElementById('chat-dropdown');
    chatContainer = document.getElementById('chat-conversations-list');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Toggle dropdown on click
    chatBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (chatDropdown && !chatDropdown.contains(e.target) && !chatBtn.contains(e.target)) {
            closeDropdown();
        }
    });
    
    // New chat button
    const newChatBtn = document.getElementById('new-chat-btn');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const user = authStore.getState().user;
            // للباحث والإدمن: عرض قائمة المستخدمين للاختيار
            await showUserSelection();
        });
    }
}

/**
 * Toggle dropdown
 */
function toggleDropdown() {
    if (!chatDropdown) {
        createDropdown();
    }
    
    const isVisible = chatDropdown.style.display !== 'none';
    
    if (isVisible) {
        closeDropdown();
    } else {
        openDropdown();
    }
}

/**
 * Open dropdown
 */
function openDropdown() {
    if (!chatDropdown) {
        createDropdown();
    }
    
    // Prevent body scroll on mobile when dropdown is open
    if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
    }
    
    chatDropdown.style.display = 'block';
    chatDropdown.style.opacity = '0';
    chatDropdown.style.transform = 'translateY(-10px)';
    
    // Trigger animation
    requestAnimationFrame(() => {
        chatDropdown.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        chatDropdown.style.opacity = '1';
        chatDropdown.style.transform = 'translateY(0)';
    });
    
    loadConversations();
}

/**
 * Close dropdown
 */
function closeDropdown() {
    if (!chatDropdown) return;
    
    // Restore body scroll on mobile
    if (window.innerWidth <= 768) {
        document.body.style.overflow = '';
    }
    
    chatDropdown.style.transition = 'all 0.2s ease';
    chatDropdown.style.opacity = '0';
    chatDropdown.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        chatDropdown.style.display = 'none';
    }, 200);
}

/**
 * Load conversations
 */
async function loadConversations() {
    if (!chatContainer) return;
    
    try {
        const result = await chatStore.fetchConversations();
        
        if (result.success && result.data) {
            renderConversations(result.data);
        } else {
            renderEmpty();
        }
    } catch (error) {
        console.error('Error loading conversations:', error);
        renderError();
    }
}

/**
 * Render conversations
 */
function renderConversations(conversations) {
    if (!chatContainer) return;
    
    if (!conversations || conversations.length === 0) {
        renderEmpty();
        return;
    }
    
    const user = authStore.getState().user;
    
    chatContainer.innerHTML = conversations.map(conversation => {
        // تحديد المستخدم الآخر
        const otherUser = user.role === 'researcher' 
            ? conversation.admin 
            : conversation.user;
        
        const lastMessageTime = conversation.last_message_at 
            ? formatRelativeTime(conversation.last_message_at)
            : '';
        
        const unreadCount = conversation.unread_count || 0;
        const hasUnread = unreadCount > 0;
        
        return `
            <div class="chat-conversation-item ${hasUnread ? 'has-unread' : ''}" data-id="${conversation.id}">
                <div class="chat-conversation-avatar" data-user-id="${otherUser?.id}">
                    ${otherUser?.profile_picture 
                        ? `<img src="${escapeHtml(otherUser.profile_picture)}" alt="الصورة الشخصية" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                           <div style="display: none; width: 40px; height: 40px; border-radius: 50%; background: var(--chat-gradient); color: white; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem;">
                               ${escapeHtml((otherUser?.username || otherUser?.email || 'م')[0].toUpperCase())}
                           </div>`
                        : `<div style="width: 40px; height: 40px; border-radius: 50%; background: var(--chat-gradient); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem;">
                               ${escapeHtml((otherUser?.username || otherUser?.email || 'م')[0].toUpperCase())}
                           </div>`
                    }
                    ${hasUnread ? `<span class="chat-conversation-unread-badge">${unreadCount > 99 ? '99+' : unreadCount}</span>` : ''}
                </div>
                <div class="chat-conversation-content">
                    <h4 class="chat-conversation-name">${escapeHtml(otherUser?.username || otherUser?.email || 'مستخدم')}</h4>
                    <p class="chat-conversation-time">${lastMessageTime}</p>
                </div>
            </div>
        `;
    }).join('');
    
    // Add click listeners
    chatContainer.querySelectorAll('.chat-conversation-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.stopPropagation();
            const conversationId = item.dataset.id;
            if (conversationId) {
                await openChatWindow(conversationId);
            }
        });
    });
}

/**
 * Show user selection for admin and researcher
 */
async function showUserSelection() {
    // Close dropdown first
    closeDropdown();
    
    const user = authStore.getState().user;
    const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin');
    const title = isAdmin ? 'اختر باحث للمراسلة' : 'اختر إدمن للمراسلة';
    
    // Fetch users
    const result = await chatStore.fetchUsersForChat();
    if (!result.success || !result.data || result.data.length === 0) {
        alert(isAdmin ? 'لا يوجد باحثين متاحين للمراسلة' : 'لا يوجد إدمن متاح للمراسلة');
        return;
    }
    
    // Create user selection modal with search
    const modalHTML = `
        <div id="user-selection-modal" class="chat-user-selection-modal">
            <div class="chat-user-selection-content">
                <div class="chat-user-selection-header">
                    <h3>${title}</h3>
                    <button class="chat-user-selection-close" id="user-selection-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chat-user-selection-search">
                    <input type="text" id="user-search-input" placeholder="ابحث بالاسم أو البريد الإلكتروني..." />
                    <i class="fas fa-search"></i>
                </div>
                <div class="chat-user-selection-list" id="user-selection-list">
                    ${result.data.map(user => `
                        <div class="chat-user-selection-item" data-user-id="${user.id}" data-username="${escapeHtml((user.username || '').toLowerCase())}" data-email="${escapeHtml((user.email || '').toLowerCase())}">
                            <div class="chat-user-selection-avatar">
                                ${user.profile_picture 
                                    ? `<img src="${escapeHtml(user.profile_picture)}" alt="الصورة الشخصية" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                       <div style="display: none; width: 40px; height: 40px; border-radius: 50%; background: var(--chat-gradient); color: white; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem;">
                                           ${escapeHtml((user.username || user.email || 'م')[0].toUpperCase())}
                                       </div>`
                                    : `<div style="width: 40px; height: 40px; border-radius: 50%; background: var(--chat-gradient); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem;">
                                           ${escapeHtml((user.username || user.email || 'م')[0].toUpperCase())}
                                       </div>`
                                }
                            </div>
                            <div class="chat-user-selection-info">
                                <h4>${escapeHtml(user.username || user.email)}</h4>
                                <p>${escapeHtml(user.email)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Setup listeners
    const modal = document.getElementById('user-selection-modal');
    const closeBtn = document.getElementById('user-selection-close');
    const searchInput = document.getElementById('user-search-input');
    const userList = document.getElementById('user-selection-list');
    const userItems = document.querySelectorAll('.chat-user-selection-item');
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
    }
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            userItems.forEach(item => {
                const username = item.dataset.username || '';
                const email = item.dataset.email || '';
                const matches = username.includes(searchTerm) || email.includes(searchTerm);
                item.style.display = matches ? '' : 'none';
            });
            
            // Show empty state if no results
            const visibleItems = Array.from(userItems).filter(item => item.style.display !== 'none');
            if (visibleItems.length === 0 && searchTerm) {
                if (!userList.querySelector('.chat-user-selection-empty')) {
                    userList.insertAdjacentHTML('afterbegin', `
                        <div class="chat-user-selection-empty" style="text-align: center; padding: 2rem; color: #666;">
                            <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                            <p>لا توجد نتائج للبحث</p>
                        </div>
                    `);
                }
            } else {
                const emptyState = userList.querySelector('.chat-user-selection-empty');
                if (emptyState) emptyState.remove();
            }
        });
    }
    
    // User selection
    userItems.forEach(item => {
        item.addEventListener('click', async () => {
            const selectedUserId = item.dataset.userId;
            modal.remove();
            
            // للباحث: userId هو adminId
            // للإدمن: userId هو researcherId
            await openChatWindow(null, selectedUserId);
        });
    });
}

/**
 * Open chat window
 */
async function openChatWindow(conversationId = null, userId = null) {
    try {
        // Close dropdown
        closeDropdown();
        
        // Create or get conversation
        let conversation;
        if (conversationId) {
            const conversations = chatStore.getState().conversations;
            conversation = conversations.find(c => c.id === conversationId);
            if (conversation) {
                chatStore.setState({ currentConversation: conversation });
                await chatStore.fetchMessages(conversation.id);
            } else {
                console.error('Conversation not found:', conversationId);
                alert('المحادثة غير موجودة');
                return;
            }
        } else {
            const result = await chatStore.getOrCreateConversation(userId);
            if (!result.success) {
                console.error('Failed to get or create conversation:', result.error);
                alert(result.error || 'فشل فتح المحادثة');
                return;
            }
            conversation = result.conversation;
        }
        
        // Create chat window
        if (conversation) {
            createChatWindow(conversation);
        } else {
            console.error('No conversation available');
            alert('فشل فتح المحادثة');
        }
    } catch (error) {
        console.error('Error opening chat window:', error);
        alert('حدث خطأ أثناء فتح المحادثة: ' + (error.message || error));
    }
}

/**
 * Create chat window
 */
function createChatWindow(conversation) {
    try {
        // Remove existing chat window
        const existing = document.getElementById('chat-window');
        if (existing) existing.remove();
        
        // Prevent body scroll on mobile when chat window is open
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
        
        const user = authStore.getState().user;
        if (!user) {
            console.error('User not found');
            alert('المستخدم غير مسجل الدخول');
            return;
        }
        
        const otherUser = user.role === 'researcher' 
            ? conversation.admin 
            : conversation.user;
        
        if (!otherUser) {
            console.error('Other user not found in conversation:', conversation);
            alert('معلومات المستخدم غير متوفرة');
            return;
        }
        
        const chatWindowHTML = `
            <div id="chat-window" class="chat-window">
                <div class="chat-window-header">
                    <div class="chat-window-user">
                        <div class="chat-window-avatar">
                            ${otherUser?.profile_picture 
                                ? `<img src="${escapeHtml(otherUser.profile_picture)}" alt="الصورة الشخصية" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                   <div style="display: none; width: 40px; height: 40px; border-radius: 50%; background: var(--chat-gradient); color: white; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem;">
                                       ${escapeHtml((otherUser?.username || otherUser?.email || 'م')[0].toUpperCase())}
                                   </div>`
                                : `<div style="width: 40px; height: 40px; border-radius: 50%; background: var(--chat-gradient); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem;">
                                       ${escapeHtml((otherUser?.username || otherUser?.email || 'م')[0].toUpperCase())}
                                   </div>`
                            }
                        </div>
                        <div>
                            <h4>${escapeHtml(otherUser?.username || otherUser?.email || 'مستخدم')}</h4>
                            <span class="chat-window-status">متصل</span>
                        </div>
                    </div>
                    <button class="chat-window-close" id="chat-window-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chat-window-messages" id="chat-window-messages">
                    ${renderMessages(chatStore.getState().messages)}
                </div>
                <div class="chat-window-input">
                    <input type="text" id="chat-message-input" placeholder="اكتب رسالتك هنا..." />
                    <button id="chat-send-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatWindowHTML);
        
        // Setup chat window listeners
        setupChatWindowListeners();
        
        // Auto-focus input
        const messageInput = document.getElementById('chat-message-input');
        if (messageInput) {
            setTimeout(() => {
                messageInput.focus();
            }, 200);
        }
        
        // Scroll to bottom with animation
        setTimeout(() => {
            scrollToBottom();
        }, 150);
        
        // Subscribe to new messages
        chatStore.subscribe((state) => {
            if (state.currentConversation?.id === conversation.id) {
                updateMessages(state.messages);
            }
        });
    } catch (error) {
        console.error('Error creating chat window:', error);
        alert('حدث خطأ أثناء إنشاء نافذة الدردشة: ' + (error.message || error));
    }
}

/**
 * Setup chat window listeners
 */
function setupChatWindowListeners() {
    // Close button
    const closeBtn = document.getElementById('chat-window-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const chatWindow = document.getElementById('chat-window');
            if (chatWindow) {
                // Restore body scroll on mobile
                if (window.innerWidth <= 768) {
                    document.body.style.overflow = '';
                }
                
                chatWindow.style.transition = 'all 0.3s ease';
                chatWindow.style.opacity = '0';
                chatWindow.style.transform = 'translateY(20px) scale(0.95)';
                
                setTimeout(() => {
                    chatWindow.remove();
                }, 300);
            }
        });
    }
    
    // Send button
    const sendBtn = document.getElementById('chat-send-btn');
    const messageInput = document.getElementById('chat-message-input');
    
    if (sendBtn && messageInput) {
        const sendMessage = async () => {
            const message = messageInput.value.trim();
            if (!message) return;
            
            // Disable input while sending
            messageInput.disabled = true;
            sendBtn.disabled = true;
            sendBtn.style.opacity = '0.6';
            
            // Clear input immediately for better UX
            messageInput.value = '';
            
            try {
                const result = await chatStore.sendMessage(message);
                
                if (result.success) {
                    // Scroll to bottom after a short delay to allow message to render
                    setTimeout(() => {
                        scrollToBottom();
                    }, 100);
                } else {
                    // Restore message if sending failed
                    messageInput.value = message;
                    alert(result.error || 'فشل إرسال الرسالة');
                }
            } catch (error) {
                // Restore message if error occurred
                messageInput.value = message;
                alert('حدث خطأ أثناء إرسال الرسالة');
            } finally {
                // Re-enable input
                messageInput.disabled = false;
                sendBtn.disabled = false;
                sendBtn.style.opacity = '1';
                messageInput.focus();
            }
        };
        
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Add input animation on focus
        messageInput.addEventListener('focus', () => {
            messageInput.style.transform = 'translateY(-1px)';
        });
        
        messageInput.addEventListener('blur', () => {
            messageInput.style.transform = 'translateY(0)';
        });
    }
}

/**
 * Render messages
 */
function renderMessages(messages) {
    if (!messages || messages.length === 0) {
        return `
            <div class="chat-empty" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; padding: 2rem;">
                <i class="fas fa-comments" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p style="color: var(--text-secondary); font-size: 0.9375rem;">لا توجد رسائل بعد</p>
                <p style="color: var(--text-tertiary); font-size: 0.8125rem; margin-top: 0.5rem;">ابدأ المحادثة بإرسال رسالة</p>
            </div>
        `;
    }
    
    const user = authStore.getState().user;
    let lastSenderId = null;
    let lastDate = null;
    
    return messages.map((message, index) => {
        const isOwn = message.sender_id === user.id;
        const messageDate = new Date(message.created_at);
        const showDateSeparator = !lastDate || 
            messageDate.toDateString() !== new Date(lastDate).toDateString();
        
        const showAvatar = !isOwn && (lastSenderId !== message.sender_id || index === 0);
        lastSenderId = message.sender_id;
        lastDate = message.created_at;
        
        const isRead = message.is_read === true;
        const statusClass = isRead ? 'read' : 'unread';
        const statusIcon = isOwn 
            ? (isRead ? '<i class="fas fa-check-double chat-message-status-icon"></i>' : '<i class="fas fa-check chat-message-status-icon"></i>')
            : (isRead ? '' : '<span class="chat-message-status-unread-dot"></span>');
        
        return `
            ${showDateSeparator ? `
                <div style="text-align: center; margin: 1rem 0; position: relative;">
                    <span style="background: var(--chat-bg-secondary); padding: 0.375rem 0.75rem; border-radius: 12px; font-size: 0.75rem; color: var(--text-secondary); font-weight: 500;">
                        ${formatDateSeparator(message.created_at)}
                    </span>
                </div>
            ` : ''}
            <div class="chat-message ${isOwn ? 'own' : 'other'}" style="animation-delay: ${index * 0.05}s;" data-message-id="${message.id}" data-is-read="${isRead}">
                <div class="chat-message-content">
                    <p>${escapeHtml(message.message)}</p>
                    <div style="display: flex; align-items: center; justify-content: ${isOwn ? 'flex-end' : 'flex-start'}; gap: 0.5rem; margin-top: 0.375rem;">
                        <span class="chat-message-time">${formatRelativeTime(message.created_at)}</span>
                        ${isOwn ? `
                            <span class="chat-message-status ${statusClass}">
                                ${statusIcon}
                            </span>
                        ` : `
                            ${!isRead ? `
                                <span class="chat-message-status ${statusClass}">
                                    <i class="fas fa-circle chat-message-status-icon" style="font-size: 0.5rem; color: var(--chat-primary);"></i>
                                </span>
                            ` : ''}
                        `}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Format date separator
 */
function formatDateSeparator(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'اليوم';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'أمس';
    } else {
        return date.toLocaleDateString('ar-SA', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
}

/**
 * Update messages in chat window
 */
function updateMessages(messages) {
    const messagesContainer = document.getElementById('chat-window-messages');
    if (messagesContainer) {
        const wasAtBottom = isScrolledToBottom(messagesContainer);
        const currentScrollTop = messagesContainer.scrollTop;
        const currentScrollHeight = messagesContainer.scrollHeight;
        
        messagesContainer.innerHTML = renderMessages(messages);
        
        // إذا كان المستخدم في الأسفل، التمرير للأسفل
        // وإلا الحفاظ على موضع التمرير
        if (wasAtBottom) {
            scrollToBottom();
        } else {
            // الحفاظ على موضع التمرير النسبي
            const newScrollHeight = messagesContainer.scrollHeight;
            const heightDifference = newScrollHeight - currentScrollHeight;
            messagesContainer.scrollTop = currentScrollTop + heightDifference;
        }
    }
}

/**
 * Check if scrolled to bottom
 */
function isScrolledToBottom(element) {
    const threshold = 100; // pixels from bottom
    return element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
}

/**
 * Scroll to bottom with smooth animation
 */
function scrollToBottom() {
    const messagesContainer = document.getElementById('chat-window-messages');
    if (messagesContainer) {
        messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: 'smooth'
        });
    }
}

/**
 * Render empty state
 */
function renderEmpty() {
    if (!chatContainer) return;
    
    chatContainer.innerHTML = `
        <div class="chat-empty">
            <i class="fas fa-comments"></i>
            <p>لا توجد محادثات</p>
            <button class="btn btn-primary btn-sm" id="start-chat-btn">بدء محادثة جديدة</button>
        </div>
    `;
    
    const startChatBtn = document.getElementById('start-chat-btn');
    if (startChatBtn) {
        startChatBtn.addEventListener('click', async () => {
            await openChatWindow();
        });
    }
}

/**
 * Render error state
 */
function renderError() {
    if (!chatContainer) return;
    
    chatContainer.innerHTML = `
        <div class="chat-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>حدث خطأ أثناء تحميل المحادثات</p>
        </div>
    `;
}

/**
 * Update badge count
 */
function handleStoreUpdate(state) {
    // Update badge with animation
    if (chatBadge) {
        const unreadCount = state.unreadCount || 0;
        if (unreadCount > 0) {
            const newCount = unreadCount > 99 ? '99+' : unreadCount;
            
            // Animate badge if count changed
            if (chatBadge.textContent !== String(newCount)) {
                chatBadge.style.transform = 'scale(0)';
                setTimeout(() => {
                    chatBadge.textContent = newCount;
                    chatBadge.style.display = '';
                    chatBadge.style.transform = 'scale(1)';
                    chatBadge.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 150);
            } else {
                chatBadge.style.display = '';
            }
        } else {
            chatBadge.style.transform = 'scale(0)';
            setTimeout(() => {
                chatBadge.style.display = 'none';
            }, 200);
        }
    }
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Cleanup
 */
export function cleanupChatDropdown() {
    if (chatDropdown) {
        chatDropdown.remove();
    }
    
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) chatWindow.remove();
    
    chatDropdown = null;
    chatBtn = null;
    chatBadge = null;
    chatContainer = null;
    isInitialized = false;
}

