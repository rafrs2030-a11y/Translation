/**
 * Admin Store
 * إدارة حالة لوحة تحكم المسؤول ومراجعة الطلبات
 */

import { supabase } from '../config/supabase.js';
import authStore from './authStore.js';

class AdminStore {
  constructor() {
    this.state = {
      allSubmissions: [],
      currentSubmission: null,
      comments: [],
      statusHistory: [],
      stats: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        needsRevision: 0,
        totalResearchers: 0,
        avgReviewTime: 0,
        acceptanceRate: 0,
      },
      categoryStats: [],
      typeStats: [],
      loading: false,
      error: null,
      filters: {
        status: null,
        researchType: null,
        category: null,
        dateFrom: null,
        dateTo: null,
        searchTerm: '',
      },
      pagination: {
        page: 1,
        pageSize: 20,
        totalCount: 0,
      },
      sortBy: {
        field: 'created_at',
        order: 'desc',
      },
    };

    this.listeners = [];
  }

  /**
   * التحقق من صلاحيات المسؤول
   */
  checkAdminAccess() {
    const user = authStore.getState().user;
    if (!user) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      throw new Error('غير مصرح لك بالوصول إلى هذه الصفحة');
    }
  }

  /**
   * جلب جميع الطلبات
   */
  async fetchAllSubmissions() {
    return await this.fetchSubmissions({});
  }

  /**
   * جلب الطلبات مع معاملات مخصصة
   */
  async fetchSubmissions(params = {}) {
    this.setState({ loading: true, error: null });

    try {
      this.checkAdminAccess();

      // دمج المعاملات مع الحالة الحالية
      const page = params.page || this.state.pagination.page;
      const limit = params.limit || this.state.pagination.pageSize;
      const status = params.status || this.state.filters.status;
      const category = params.category || this.state.filters.category;
      const search = params.search || this.state.filters.searchTerm;

      let query = supabase
        .from('submissions')
        .select(`
          *,
          user:users(username, email, phone)
        `, { count: 'exact' })
        .eq('is_draft', false);

      // تطبيق الفلاتر من المعاملات
      if (status) query = query.eq('status', status);
      if (category) query = query.eq('category', category);
      if (search) {
        query = query.or(`reference_number.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // تطبيق الترتيب
      const { field, order } = this.state.sortBy;
      query = query.order(field, { ascending: order === 'asc' });

      // تطبيق Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      const totalPages = Math.ceil(count / limit);

      this.setState({
        allSubmissions: data,
        loading: false,
        pagination: {
          page,
          pageSize: limit,
          totalCount: count,
          total: count,
          totalPages,
        },
      });

      return {
        success: true,
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
        },
      };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * جلب تفاصيل طلب محدد
   */
  async fetchSubmissionDetails(id) {
    this.setState({ loading: true, error: null });

    try {
      this.checkAdminAccess();

      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          user:users(id, username, email, phone, national_id)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // جلب التعليقات
      await this.fetchComments(id);

      // جلب سجل التغييرات
      await this.fetchStatusHistory(id);

      this.setState({ currentSubmission: data, loading: false });
      return { success: true, data };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * تحديث حالة الطلب
   */
  async updateSubmissionStatus(submissionId, newStatus, adminComment = null) {
    this.setState({ loading: true, error: null });

    try {
      this.checkAdminAccess();

      const admin = authStore.getState().user;

      // الحصول على الحالة القديمة
      const { data: oldData } = await supabase
        .from('submissions')
        .select('status, user_id')
        .eq('id', submissionId)
        .single();

      // تحديث الحالة والتعليق
      const updateData = { 
        status: newStatus, 
        updated_at: new Date().toISOString()
      };
      
      if (adminComment) {
        updateData.admin_comment = adminComment;
      }

      const { data, error } = await supabase
        .from('submissions')
        .update(updateData)
        .eq('id', submissionId)
        .select()
        .single();

      if (error) throw error;

      // إضافة إلى سجل التغييرات
      await supabase
        .from('status_history')
        .insert([{
          submission_id: submissionId,
          admin_id: admin.id,
          old_status: oldData.status,
          new_status: newStatus,
        }]);

      // إنشاء إشعار للباحث
      await this.createNotification(
        oldData.user_id,
        submissionId,
        'status_change',
        `تم تغيير حالة طلبك إلى: ${this.getStatusLabel(newStatus)}`
      );

      // إرسال بريد إلكتروني
      await this.sendStatusChangeEmail(oldData.user_id, submissionId, newStatus);

      // تسجيل في Audit Log
      await this.logAuditAction('status_change', 'submission', submissionId, {
        old_status: oldData.status,
        new_status: newStatus,
      });

      // تحديث القائمة المحلية
      this.setState({
        allSubmissions: this.state.allSubmissions.map(s =>
          s.id === submissionId ? { ...s, status: newStatus } : s
        ),
        currentSubmission: data,
        loading: false,
      });

      return { success: true, data };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * إضافة تعليق
   */
  async addComment(submissionId, commentText, isVisibleToResearcher = true) {
    this.setState({ loading: true, error: null });

    try {
      this.checkAdminAccess();

      const admin = authStore.getState().user;

      const { data, error } = await supabase
        .from('admin_comments')
        .insert([{
          submission_id: submissionId,
          admin_id: admin.id,
          comment: commentText,
          is_visible_to_researcher: isVisibleToResearcher,
        }])
        .select(`
          *,
          admin:users(username)
        `)
        .single();

      if (error) throw error;

      // إذا كان مرئياً للباحث، إنشاء إشعار
      if (isVisibleToResearcher) {
        const { data: submission } = await supabase
          .from('submissions')
          .select('user_id')
          .eq('id', submissionId)
          .single();

        await this.createNotification(
          submission.user_id,
          submissionId,
          'comment_added',
          'تم إضافة تعليق جديد على طلبك'
        );

        await this.sendCommentEmail(submission.user_id, submissionId, commentText);
      }

      // تسجيل في Audit Log
      await this.logAuditAction('add_comment', 'submission', submissionId, {
        comment_length: commentText.length,
        visible: isVisibleToResearcher,
      });

      this.setState({
        comments: [data, ...this.state.comments],
        loading: false,
      });

      return { success: true, data };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * جلب التعليقات
   */
  async fetchComments(submissionId) {
    try {
      const { data, error } = await supabase
        .from('admin_comments')
        .select(`
          *,
          admin:users(username, email)
        `)
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      this.setState({ comments: data });
      return { success: true, data };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * تعديل تعليق
   */
  async updateComment(commentId, newText) {
    this.setState({ loading: true, error: null });

    try {
      this.checkAdminAccess();

      const { data, error } = await supabase
        .from('admin_comments')
        .update({ 
          comment: newText, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;

      this.setState({
        comments: this.state.comments.map(c =>
          c.id === commentId ? data : c
        ),
        loading: false,
      });

      return { success: true, data };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * حذف تعليق
   */
  async deleteComment(commentId) {
    this.setState({ loading: true, error: null });

    try {
      this.checkAdminAccess();

      const { error } = await supabase
        .from('admin_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      this.setState({
        comments: this.state.comments.filter(c => c.id !== commentId),
        loading: false,
      });

      return { success: true };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * جلب سجل التغييرات
   */
  async fetchStatusHistory(submissionId) {
    try {
      const { data, error } = await supabase
        .from('status_history')
        .select(`
          *,
          admin:users(username)
        `)
        .eq('submission_id', submissionId)
        .order('changed_at', { ascending: false });

      if (error) throw error;

      this.setState({ statusHistory: data });
      return { success: true, data };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * جلب الإحصائيات
   */
  async fetchStats() {
    this.setState({ loading: true, error: null });

    try {
      this.checkAdminAccess();

      // إحصائيات الطلبات
      const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select('status, research_type, category, created_at')
        .eq('is_draft', false);

      if (submissionsError) throw submissionsError;

      // عدد الباحثين
      const { count: researchersCount, error: researchersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'researcher');

      if (researchersError) throw researchersError;

      // حساب الإحصائيات
      const total = submissions.length;
      const pending = submissions.filter(s => s.status === 'pending').length;
      const approved = submissions.filter(s => s.status === 'approved').length;
      const rejected = submissions.filter(s => s.status === 'rejected').length;
      const needsRevision = submissions.filter(s => s.status === 'needs_revision').length;
      const acceptanceRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;

      // إحصائيات حسب النوع
      const typeStats = this.calculateGroupStats(submissions, 'research_type');

      // إحصائيات حسب الفئة
      const categoryStats = this.calculateGroupStats(submissions, 'category');

      // متوسط وقت المراجعة (تقريبي)
      const avgReviewTime = this.calculateAvgReviewTime(submissions);

      this.setState({
        stats: {
          total,
          pending,
          approved,
          rejected,
          needsRevision,
          totalResearchers: researchersCount,
          avgReviewTime,
          acceptanceRate: parseFloat(acceptanceRate),
        },
        typeStats,
        categoryStats,
        loading: false,
      });

      return { success: true };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * الحصول على الإحصائيات (wrapper method)
   */
  async getStatistics() {
    await this.fetchStats();
    return this.state.stats;
  }

  /**
   * جلب سجل الأنشطة (Audit Log)
   */
  async getAuditLog(params = {}) {
    try {
      this.checkAdminAccess();

      const limit = params.limit || 50;
      
      const { data, error } = await supabase
        .from('audit_log')
        .select(`
          *,
          admin:users(username, email)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];

    } catch (error) {
      console.error('Error fetching audit log:', error);
      return [];
    }
  }

  /**
   * الحصول على بيانات الرسوم البيانية
   */
  async getChartData() {
    try {
      this.checkAdminAccess();

      // جلب الطلبات من آخر 30 يوم
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: submissions, error } = await supabase
        .from('submissions')
        .select('created_at, status')
        .eq('is_draft', false)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // تجميع البيانات حسب اليوم
      const dailyData = {};
      submissions.forEach(submission => {
        const date = new Date(submission.created_at).toLocaleDateString('ar-SA');
        if (!dailyData[date]) {
          dailyData[date] = { total: 0, pending: 0, approved: 0, rejected: 0 };
        }
        dailyData[date].total++;
        if (submission.status === 'pending') dailyData[date].pending++;
        if (submission.status === 'approved') dailyData[date].approved++;
        if (submission.status === 'rejected') dailyData[date].rejected++;
      });

      return {
        labels: Object.keys(dailyData),
        datasets: [
          {
            label: 'إجمالي الطلبات',
            data: Object.values(dailyData).map(d => d.total),
            borderColor: '#3D5A94',
            backgroundColor: 'rgba(61, 90, 148, 0.1)',
          },
        ],
      };

    } catch (error) {
      console.error('Error fetching chart data:', error);
      return { labels: [], datasets: [] };
    }
  }

  /**
   * حساب إحصائيات المجموعات
   */
  calculateGroupStats(submissions, groupBy) {
    const groups = {};

    submissions.forEach(s => {
      const key = s[groupBy];
      if (!groups[key]) {
        groups[key] = { name: key, count: 0 };
      }
      groups[key].count++;
    });

    return Object.values(groups).sort((a, b) => b.count - a.count);
  }

  /**
   * حساب متوسط وقت المراجعة
   */
  calculateAvgReviewTime(submissions) {
    const reviewed = submissions.filter(s => 
      s.status === 'approved' || s.status === 'rejected'
    );

    if (reviewed.length === 0) return 0;

    // حساب تقريبي (بالأيام)
    const totalDays = reviewed.reduce((sum, s) => {
      const created = new Date(s.created_at);
      const now = new Date();
      const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

    return Math.round(totalDays / reviewed.length);
  }

  /**
   * تصدير البيانات
   */
  async exportSubmissions(format = 'csv') {
    try {
      this.checkAdminAccess();

      const submissions = this.state.allSubmissions;

      if (format === 'csv') {
        return this.exportToCSV(submissions);
      } else if (format === 'json') {
        return this.exportToJSON(submissions);
      }

      return { success: false, error: 'صيغة غير مدعومة' };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * تصدير إلى CSV
   */
  exportToCSV(data) {
    const headers = [
      'رقم المرجع', 'اسم الباحث', 'البريد الإلكتروني', 'نوع البحث',
      'الفئة', 'الحالة', 'تاريخ التقديم'
    ];

    const rows = data.map(s => [
      s.reference_number,
      s.main_researcher,
      s.email,
      s.research_type,
      s.category,
      this.getStatusLabel(s.status),
      new Date(s.created_at).toLocaleDateString('ar-SA'),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // تحميل الملف
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `submissions_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  }

  /**
   * تصدير إلى JSON
   */
  exportToJSON(data) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `submissions_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  }

  /**
   * إنشاء إشعار
   */
  async createNotification(userId, submissionId, type, message) {
    try {
      await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          submission_id: submissionId,
          type,
          message,
        }]);
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  }

  /**
   * إرسال بريد تغيير الحالة
   */
  async sendStatusChangeEmail(userId, submissionId, newStatus) {
    // TODO: تنفيذ إرسال البريد الإلكتروني
    console.log('Sending status change email...', { userId, submissionId, newStatus });
  }

  /**
   * إرسال بريد التعليق
   */
  async sendCommentEmail(userId, submissionId, comment) {
    // TODO: تنفيذ إرسال البريد الإلكتروني
    console.log('Sending comment email...', { userId, submissionId, comment });
  }

  /**
   * تسجيل إجراء في Audit Log
   */
  async logAuditAction(action, entityType, entityId, details = {}) {
    try {
      const admin = authStore.getState().user;

      await supabase
        .from('audit_log')
        .insert([{
          admin_id: admin.id,
          action,
          entity_type: entityType,
          entity_id: entityId,
          details,
          ip_address: await this.getClientIP(),
        }]);
    } catch (error) {
      console.error('Failed to log audit action:', error);
    }
  }

  /**
   * الحصول على IP العميل
   */
  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  /**
   * الحصول على تسمية الحالة بالعربية
   */
  getStatusLabel(status) {
    const labels = {
      'pending': 'قيد المراجعة',
      'approved': 'مقبول',
      'rejected': 'مرفوض',
      'needs_revision': 'يحتاج مراجعة',
    };
    return labels[status] || status;
  }

  /**
   * تطبيق الفلاتر
   */
  applyFilters(query) {
    const { status, researchType, category, dateFrom, dateTo, searchTerm } = this.state.filters;

    if (status) query = query.eq('status', status);
    if (researchType) query = query.eq('research_type', researchType);
    if (category) query = query.eq('category', category);
    if (dateFrom) query = query.gte('created_at', dateFrom);
    if (dateTo) query = query.lte('created_at', dateTo);
    if (searchTerm) {
      query = query.or(`reference_number.ilike.%${searchTerm}%,main_researcher.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }

    return query;
  }

  /**
   * تعيين الفلاتر
   */
  setFilters(filters) {
    this.setState({
      filters: { ...this.state.filters, ...filters },
      pagination: { ...this.state.pagination, page: 1 },
    });
    this.fetchAllSubmissions();
  }

  /**
   * إعادة تعيين الفلاتر
   */
  resetFilters() {
    this.setState({
      filters: {
        status: null,
        researchType: null,
        category: null,
        dateFrom: null,
        dateTo: null,
        searchTerm: '',
      },
      pagination: { ...this.state.pagination, page: 1 },
    });
    this.fetchAllSubmissions();
  }

  /**
   * تعيين الترتيب
   */
  setSortBy(field, order = 'desc') {
    this.setState({ sortBy: { field, order } });
    this.fetchAllSubmissions();
  }

  /**
   * تغيير الصفحة
   */
  setPage(page) {
    this.setState({
      pagination: { ...this.state.pagination, page },
    });
    this.fetchAllSubmissions();
  }

  /**
   * تحديث الحالة
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  /**
   * الحصول على الحالة الحالية
   */
  getState() {
    return this.state;
  }

  /**
   * الاشتراك في تغييرات الحالة
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * إشعار جميع المستمعين بالتغييرات
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// إنشاء نسخة واحدة (Singleton)
const adminStore = new AdminStore();

export default adminStore;

