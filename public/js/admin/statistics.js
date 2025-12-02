/**
 * Admin Statistics Page
 * صفحة الإحصائيات للأدمن
 */

import { supabase } from '../config/supabase.js';
import authStore from '../stores/authStore.js';
import { requireAdmin } from '../utils/auth-guard.js';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAdmin();
    if (!user) return;
    
    // مسح الكاش القديم أولاً - Real-time
    const { clearCacheOnPageLoad } = await import('../utils/admin-cache-clear.js');
    await clearCacheOnPageLoad();
    
    await loadStatistics();
    initCharts();
    initEventListeners();
});

/**
 * Load statistics data
 */
async function loadStatistics() {
    try {
        // Get totals
        const { count: totalSubmissions } = await supabase
            .from('submissions')
            .select('*', { count: 'exact', head: true });
            
        const { count: totalUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
        
        // Update UI
        document.getElementById('total-submissions').textContent = totalSubmissions || 0;
        document.getElementById('total-users').textContent = totalUsers || 0;
        
        // Calculate average review time and approval rate
        await calculateMetrics();
        
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

/**
 * Calculate metrics
 */
async function calculateMetrics() {
    try {
        const { data: submissions } = await supabase
            .from('submissions')
            .select('status, created_at, updated_at');
        
        if (!submissions || submissions.length === 0) return;
        
        // Calculate average review time
        const reviewedSubmissions = submissions.filter(s => 
            s.status !== 'pending' && s.updated_at
        );
        
        if (reviewedSubmissions.length > 0) {
            const totalTime = reviewedSubmissions.reduce((sum, s) => {
                const created = new Date(s.created_at);
                const updated = new Date(s.updated_at);
                const days = (updated - created) / (1000 * 60 * 60 * 24);
                return sum + days;
            }, 0);
            
            const avgTime = Math.round(totalTime / reviewedSubmissions.length);
            document.getElementById('avg-review-time').textContent = avgTime;
        }
        
        // Calculate approval rate
        const approvedCount = submissions.filter(s => s.status === 'approved').length;
        const approvalRate = Math.round((approvedCount / submissions.length) * 100);
        document.getElementById('approval-rate').textContent = `${approvalRate}%`;
        
    } catch (error) {
        console.error('Error calculating metrics:', error);
    }
}

/**
 * Initialize charts
 */
function initCharts() {
    // Submissions Over Time Chart
    const submissionsCtx = document.getElementById('submissions-chart');
    if (submissionsCtx) {
        new Chart(submissionsCtx, {
            type: 'line',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                datasets: [{
                    label: 'الطلبات',
                    data: [12, 19, 15, 25, 22, 30],
                    borderColor: 'rgb(61, 90, 148)',
                    backgroundColor: 'rgba(61, 90, 148, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Status Distribution Chart
    const statusCtx = document.getElementById('status-chart');
    if (statusCtx) {
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['قيد المراجعة', 'معتمدة', 'تحتاج مراجعة', 'مرفوضة'],
                datasets: [{
                    data: [30, 45, 15, 10],
                    backgroundColor: [
                        'rgba(232, 154, 60, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // User Activity Chart
    const userActivityCtx = document.getElementById('user-activity-chart');
    if (userActivityCtx) {
        new Chart(userActivityCtx, {
            type: 'bar',
            data: {
                labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
                datasets: [{
                    label: 'النشاطات',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: 'rgba(61, 90, 148, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Categories Distribution Chart
    const categoriesCtx = document.getElementById('categories-chart');
    if (categoriesCtx) {
        new Chart(categoriesCtx, {
            type: 'polarArea',
            data: {
                labels: ['علوم الحاسوب', 'الهندسة', 'الطب', 'الاقتصاد المالي', 'العلوم الاجتماعية'],
                datasets: [{
                    data: [25, 20, 15, 10, 30],
                    backgroundColor: [
                        'rgba(61, 90, 148, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(232, 154, 60, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Period selector
    document.getElementById('period-select')?.addEventListener('change', async (e) => {
        const period = e.target.value;
        // Reload data for selected period
        await loadStatistics();
    });
    
    // Export button
    document.getElementById('export-stats-btn')?.addEventListener('click', () => {
        alert('وظيفة التصدير قيد التطوير');
    });
}

