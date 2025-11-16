/**
 * Admin Reports Page
 * صفحة التقارير للأدمن
 */

import { supabase } from '../config/supabase.js';
import authStore from '../stores/authStore.js';
import { requireAdmin } from '../utils/auth-guard.js';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAdmin();
    if (!user) return;
    
    initEventListeners();
});

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Quick report buttons
    document.getElementById('submissions-report')?.addEventListener('click', () => {
        generateQuickReport('submissions');
    });
    
    document.getElementById('users-report')?.addEventListener('click', () => {
        generateQuickReport('users');
    });
    
    document.getElementById('statistics-report')?.addEventListener('click', () => {
        generateQuickReport('statistics');
    });
    
    document.getElementById('activity-report')?.addEventListener('click', () => {
        generateQuickReport('activity');
    });
    
    // Custom report form
    document.getElementById('custom-report-form')?.addEventListener('submit', handleCustomReport);
    
    // Reset button
    document.getElementById('reset-form-btn')?.addEventListener('click', () => {
        document.getElementById('custom-report-form')?.reset();
    });
}

/**
 * Generate quick report
 */
async function generateQuickReport(type) {
    try {
        // Show loading
        showLoading();
        
        let data;
        let filename;
        
        switch (type) {
            case 'submissions':
                data = await fetchSubmissionsData();
                filename = `تقرير_الطلبات_${new Date().toISOString().split('T')[0]}.csv`;
                break;
            case 'users':
                data = await fetchUsersData();
                filename = `تقرير_المستخدمين_${new Date().toISOString().split('T')[0]}.csv`;
                break;
            case 'statistics':
                data = await fetchStatisticsData();
                filename = `تقرير_الإحصائيات_${new Date().toISOString().split('T')[0]}.csv`;
                break;
            case 'activity':
                data = await fetchActivityData();
                filename = `تقرير_النشاط_${new Date().toISOString().split('T')[0]}.csv`;
                break;
        }
        
        // Convert to CSV and download
        downloadCSV(data, filename);
        
        // Hide loading
        hideLoading();
        
        // Show success
        showSuccess('تم إنشاء التقرير بنجاح');
        
    } catch (error) {
        console.error('Error generating report:', error);
        hideLoading();
        showError('حدث خطأ أثناء إنشاء التقرير');
    }
}

/**
 * Handle custom report generation
 */
async function handleCustomReport(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reportType = document.getElementById('report-type').value;
    const exportFormat = document.getElementById('export-format').value;
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    
    try {
        showLoading();
        
        let data;
        switch (reportType) {
            case 'submissions':
                data = await fetchSubmissionsData(dateFrom, dateTo);
                break;
            case 'users':
                data = await fetchUsersData(dateFrom, dateTo);
                break;
            case 'statistics':
                data = await fetchStatisticsData(dateFrom, dateTo);
                break;
            case 'activity':
                data = await fetchActivityData(dateFrom, dateTo);
                break;
        }
        
        const filename = `تقرير_${reportType}_${dateFrom}_${dateTo}.${exportFormat}`;
        
        switch (exportFormat) {
            case 'csv':
                downloadCSV(data, filename);
                break;
            case 'excel':
            case 'pdf':
            case 'json':
                alert(`تصدير ${exportFormat} قيد التطوير`);
                break;
        }
        
        hideLoading();
        showSuccess('تم إنشاء التقرير بنجاح');
        
    } catch (error) {
        console.error('Error generating custom report:', error);
        hideLoading();
        showError('حدث خطأ أثناء إنشاء التقرير');
    }
}

/**
 * Fetch submissions data
 */
async function fetchSubmissionsData(dateFrom, dateTo) {
    let query = supabase
        .from('submissions')
        .select(`
            *,
            user:users(full_name, email)
        `);
    
    if (dateFrom && dateTo) {
        query = query
            .gte('created_at', dateFrom)
            .lte('created_at', dateTo);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data;
}

/**
 * Fetch users data
 */
async function fetchUsersData(dateFrom, dateTo) {
    let query = supabase
        .from('users')
        .select('*');
    
    if (dateFrom && dateTo) {
        query = query
            .gte('created_at', dateFrom)
            .lte('created_at', dateTo);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data;
}

/**
 * Fetch statistics data
 */
async function fetchStatisticsData(dateFrom, dateTo) {
    // This would aggregate statistics data
    const submissions = await fetchSubmissionsData(dateFrom, dateTo);
    const users = await fetchUsersData(dateFrom, dateTo);
    
    return {
        total_submissions: submissions.length,
        total_users: users.length,
        // Add more statistics as needed
    };
}

/**
 * Fetch activity data
 */
async function fetchActivityData(dateFrom, dateTo) {
    // This would fetch activity logs
    // For now, return empty array
    return [];
}

/**
 * Download data as CSV
 */
function downloadCSV(data, filename) {
    if (!data || data.length === 0) {
        alert('لا توجد بيانات لتصديرها');
        return;
    }
    
    // Convert to CSV
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => {
        return Object.values(row).map(val => {
            // Escape commas and quotes
            if (typeof val === 'string') {
                return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        }).join(',');
    });
    
    const csv = [headers, ...rows].join('\n');
    
    // Create blob and download
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

/**
 * Show loading state
 */
function showLoading() {
    const btn = document.getElementById('generate-report-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإنشاء...';
    }
}

/**
 * Hide loading state
 */
function hideLoading() {
    const btn = document.getElementById('generate-report-btn');
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-file-download"></i> إنشاء وتحميل التقرير';
    }
}

/**
 * Show success message
 */
function showSuccess(message) {
    alert(message);
}

/**
 * Show error message
 */
function showError(message) {
    alert(message);
}

