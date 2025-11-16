/**
 * Researcher Dashboard JavaScript
 */

import { authStore } from '../stores/authStore.js';
import { submissionsStore } from '../stores/submissionsStore.js';
import { notificationsStore } from '../stores/notificationsStore.js';
import { formatDate, formatRelativeTime } from '../utils/helpers.js';
import { handleLogout } from '../utils/logout.js';

// DOM Elements
let sidebarEl, mobileMenuBtn, sidebarToggleBtn;
let userNameEl, welcomeNameEl, userMenuBtn, userMenuDropdown;
let logoutBtn, logoutLink;
let recentSubmissionsEl;
let statsElements = {};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    if (!await requireAuth()) return;
    
    initElements();
    initEventListeners();
    await loadDashboardData();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    sidebarEl = document.getElementById('sidebar');
    mobileMenuBtn = document.getElementById('mobile-menu-btn');
    sidebarToggleBtn = document.getElementById('sidebar-toggle');
    
    userNameEl = document.getElementById('user-name');
    welcomeNameEl = document.getElementById('welcome-name');
    userMenuBtn = document.getElementById('user-menu-btn');
    userMenuDropdown = document.getElementById('user-menu-dropdown');
    
    logoutBtn = document.getElementById('logout-btn');
    logoutLink = document.getElementById('logout-link');
    
    recentSubmissionsEl = document.getElementById('recent-submissions');
    
    // Stats elements
    statsElements = {
        total: document.getElementById('total-submissions'),
        approved: document.getElementById('approved-submissions'),
        pending: document.getElementById('pending-submissions'),
        rejected: document.getElementById('rejected-submissions'),
        submissionsCount: document.getElementById('submissions-count'),
        unreadCount: document.getElementById('unread-count'),
        notificationBadge: document.getElementById('notification-badge')
    };
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Mobile menu
    mobileMenuBtn?.addEventListener('click', toggleSidebar);
    sidebarToggleBtn?.addEventListener('click', toggleSidebar);
    
    // User menu
    userMenuBtn?.addEventListener('click', toggleUserMenu);
    
    // Logout
    logoutBtn?.addEventListener('click', handleLogout);
    logoutLink?.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!userMenuBtn?.contains(e.target) && !userMenuDropdown?.contains(e.target)) {
            userMenuDropdown.style.display = 'none';
        }
    });
}

/**
 * Load dashboard data
 */
async function loadDashboardData() {
    try {
        // Get current user
        const user = await authStore.getCurrentUser();
        
        if (user) {
            // Update user name
            const displayName = user.user_metadata?.full_name || user.email.split('@')[0];
            if (userNameEl) userNameEl.textContent = displayName;
            if (welcomeNameEl) welcomeNameEl.textContent = displayName;
        }
        
        // Load submissions stats
        await loadSubmissionsStats();
        
        // Load recent submissions
        await loadRecentSubmissions();
        
        // Load notifications count
        await loadNotificationsCount();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('فشل تحميل بيانات لوحة التحكم', 'error');
    }
}

/**
 * Load submissions statistics
 */
async function loadSubmissionsStats() {
    try {
        const stats = await submissionsStore.getStats();
        
        if (stats) {
            statsElements.total.textContent = stats.total || 0;
            statsElements.approved.textContent = stats.approved || 0;
            statsElements.pending.textContent = stats.pending || 0;
            statsElements.rejected.textContent = stats.rejected || 0;
            statsElements.submissionsCount.textContent = stats.total || 0;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

/**
 * Load recent submissions
 */
async function loadRecentSubmissions() {
    try {
        const result = await submissionsStore.fetchUserSubmissions({
            limit: 5,
            sortBy: 'created_at',
            sortOrder: 'desc'
        });
        
        if (result.success && result.data.length > 0) {
            renderSubmissions(result.data);
        } else {
            renderEmptyState();
        }
    } catch (error) {
        console.error('Error loading submissions:', error);
        renderErrorState();
    }
}

/**
 * Render submissions list
 */
function renderSubmissions(submissions) {
    recentSubmissionsEl.innerHTML = submissions.map(submission => `
        <div class="submission-item">
            <div class="submission-header">
                <div>
                    <div class="submission-title">${submission.main_researcher || 'بحث جديد'}</div>
                    <div class="submission-ref">
                        <i class="fas fa-hashtag"></i>
                        ${submission.reference_number || '---'}
                    </div>
                </div>
                <span class="badge badge-${getStatusBadgeType(submission.status)}">
                    ${getStatusLabel(submission.status)}
                </span>
            </div>
            
            <div class="submission-meta">
                <span>
                    <i class="fas fa-calendar"></i>
                    ${formatRelativeTime(submission.created_at)}
                </span>
                <span>
                    <i class="fas fa-folder"></i>
                    ${submission.category || 'غير محدد'}
                </span>
                <span>
                    <i class="fas fa-book"></i>
                    ${getResearchTypeLabel(submission.research_type)}
                </span>
            </div>
            
            <div class="submission-actions">
                <a href="/pages/researcher/submission-details.html?id=${submission.id}" 
                   class="btn btn-primary btn-small">
                    <i class="fas fa-eye"></i>
                    عرض التفاصيل
                </a>
            </div>
        </div>
    `).join('');
}

/**
 * Render empty state
 */
function renderEmptyState() {
    recentSubmissionsEl.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-file-alt"></i>
            <h3>لا توجد طلبات حتى الآن</h3>
            <p>ابدأ بتقديم بحثك الأول!</p>
            <a href="/pages/researcher/submit.html" class="btn btn-primary">
                <i class="fas fa-plus"></i>
                تقديم بحث جديد
            </a>
        </div>
    `;
}

/**
 * Render error state
 */
function renderErrorState() {
    recentSubmissionsEl.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>حدث خطأ أثناء تحميل البيانات</h3>
            <p>يرجى إعادة تحميل الصفحة</p>
            <button class="btn btn-primary" onclick="window.location.reload()">
                <i class="fas fa-redo"></i>
                إعادة التحميل
            </button>
        </div>
    `;
}

/**
 * Load notifications count
 */
async function loadNotificationsCount() {
    try {
        await notificationsStore.initialize();
        
        const unreadCount = notificationsStore.state.unreadCount || 0;
        
        if (unreadCount > 0) {
            statsElements.unreadCount.textContent = unreadCount;
            statsElements.unreadCount.style.display = '';
            statsElements.notificationBadge.textContent = unreadCount;
            statsElements.notificationBadge.style.display = '';
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

/**
 * Toggle sidebar
 */
function toggleSidebar() {
    sidebarEl.classList.toggle('active');
}

/**
 * Toggle user menu
 */
function toggleUserMenu() {
    const isVisible = userMenuDropdown.style.display === 'block';
    userMenuDropdown.style.display = isVisible ? 'none' : 'block';
}

/**
 * Handle logout
 */
// handleLogout is now imported from '../utils/logout.js'

/**
 * Get status label in Arabic
 */
function getStatusLabel(status) {
    const labels = {
        'pending': 'قيد المراجعة',
        'approved': 'مقبول',
        'rejected': 'مرفوض',
        'needs_revision': 'يحتاج مراجعة',
        'draft': 'مسودة'
    };
    return labels[status] || status;
}

/**
 * Get status badge type
 */
function getStatusBadgeType(status) {
    const types = {
        'pending': 'warning',
        'approved': 'success',
        'rejected': 'error',
        'needs_revision': 'info',
        'draft': 'primary'
    };
    return types[status] || 'primary';
}

/**
 * Get research type label
 */
function getResearchTypeLabel(type) {
    const labels = {
        'scientific_paper': 'ورقة علمية',
        'masters_thesis': 'رسالة ماجستير',
        'phd_dissertation': 'أطروحة دكتوراه',
        'book': 'كتاب'
    };
    return labels[type] || type;
}

/**
 * Require authentication
 */
async function requireAuth() {
    const isLoggedIn = await authStore.isLoggedIn();
    
    if (!isLoggedIn) {
        window.location.href = '/pages/login.html';
        return false;
    }
    
    // Check if user is admin
    const user = authStore.state.user;
    if (user?.role === 'admin') {
        window.location.href = '/pages/admin/dashboard.html';
        return false;
    }
    
    return true;
}

