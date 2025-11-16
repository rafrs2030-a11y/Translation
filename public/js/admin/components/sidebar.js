/**
 * Admin Sidebar Component
 * مكون القائمة الجانبية للأدمن
 */

import { handleLogout } from '../../utils/logout.js';
import { supabase } from '../../config/supabase.js';

/**
 * Initialize admin sidebar
 */
export function initAdminSidebar(activePage = 'dashboard') {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // Set active nav item
    const navItems = sidebar.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href.includes(activePage)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Setup mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const overlay = createOverlay();
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            toggleSidebar(sidebar, overlay);
        });
    }

    // Close sidebar on overlay click
    overlay.addEventListener('click', () => {
        closeSidebar(sidebar, overlay);
    });

    // Update pending submissions badge
    updatePendingBadge();
}

/**
 * Create overlay for mobile
 */
function createOverlay() {
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }
    return overlay;
}

/**
 * Toggle sidebar
 */
function toggleSidebar(sidebar, overlay) {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('sidebar-open');
}

/**
 * Close sidebar
 */
function closeSidebar(sidebar, overlay) {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
}

/**
 * Update pending submissions badge
 */
async function updatePendingBadge() {
    try {
        // استخدام Supabase مباشرة لجلب عدد الطلبات المعلقة
        const { count, error } = await supabase
            .from('submissions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')
            .eq('is_draft', false);

        if (!error && count !== null) {
            const badge = document.querySelector('.sidebar .badge');
            if (badge && count > 0) {
                badge.textContent = count;
                badge.style.display = 'inline';
            } else if (badge) {
                badge.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error updating pending badge:', error);
    }
}

/**
 * Generate admin sidebar HTML
 */
export function generateAdminSidebarHTML(activePage = 'dashboard') {
    return `
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <img src="/images/logo.png" alt="Research Assistant Logo" class="sidebar-logo">
                <h2>لوحة المسؤول</h2>
            </div>
            
            <nav class="sidebar-nav">
                <a href="/pages/admin/dashboard.html" class="nav-item ${activePage === 'dashboard' ? 'active' : ''}">
                    <i class="fas fa-home"></i>
                    <span>الرئيسية</span>
                </a>
                <a href="/pages/admin/submissions.html" class="nav-item ${activePage === 'submissions' ? 'active' : ''}">
                    <i class="fas fa-folder-open"></i>
                    <span>إدارة الطلبات</span>
                    <span class="badge" id="pending-badge" style="display: none;">0</span>
                </a>
                <a href="/pages/admin/users.html" class="nav-item ${activePage === 'users' ? 'active' : ''}">
                    <i class="fas fa-users"></i>
                    <span>إدارة المستخدمين</span>
                </a>
                <a href="/pages/admin/statistics.html" class="nav-item ${activePage === 'statistics' ? 'active' : ''}">
                    <i class="fas fa-chart-bar"></i>
                    <span>الإحصائيات</span>
                </a>
                <a href="/pages/admin/reports.html" class="nav-item ${activePage === 'reports' ? 'active' : ''}">
                    <i class="fas fa-file-export"></i>
                    <span>التقارير</span>
                </a>
                <a href="/pages/admin/settings.html" class="nav-item ${activePage === 'settings' ? 'active' : ''}">
                    <i class="fas fa-cog"></i>
                    <span>الإعدادات</span>
                </a>
            </nav>
            
            <div class="sidebar-footer">
                <button id="logout-btn" class="btn-logout">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    `;
}

/**
 * Generate admin topbar HTML
 */
export function generateAdminTopbarHTML(title = 'لوحة التحكم', additionalActions = '') {
    return `
        <div class="topbar">
            <div class="topbar-left">
                <button class="btn btn-ghost mobile-menu-btn" id="mobile-menu-btn">
                    <i class="fas fa-bars"></i>
                </button>
                <h1>${title}</h1>
            </div>
            <div class="topbar-actions">
                ${additionalActions}
                <div class="user-menu" id="user-menu-btn">
                    <div class="user-avatar">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <span id="user-name-display" class="user-name">المسؤول</span>
                </div>
            </div>
        </div>
    `;
}

export default {
    initAdminSidebar,
    generateAdminSidebarHTML,
    generateAdminTopbarHTML
};

