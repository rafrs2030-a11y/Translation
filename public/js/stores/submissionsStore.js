/**
 * Submissions Store
 * إدارة حالة الطلبات (البحث المقدمة)
 */

import { supabase } from '../config/supabase.js';
import authStore from './authStore.js';

class SubmissionsStore {
  constructor() {
    this.state = {
      submissions: [],
      currentSubmission: null,
      drafts: [],
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
        pageSize: 10,
        totalCount: 0,
      },
    };

    this.listeners = [];
  }

  /**
   * جلب جميع طلبات الباحث الحالي
   */
  async fetchUserSubmissions() {
    this.setState({ loading: true, error: null });

    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      let query = supabase
        .from('submissions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('is_draft', false)
        .order('created_at', { ascending: false });

      // تطبيق الفلاتر
      query = this.applyFilters(query);

      // تطبيق Pagination
      const { page, pageSize } = this.state.pagination;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      this.setState({
        submissions: data,
        loading: false,
        pagination: { ...this.state.pagination, totalCount: count },
      });

      return { success: true, data };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * جلب طلب محدد
   */
  async fetchSubmissionById(id) {
    this.setState({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      this.setState({ currentSubmission: data, loading: false });
      return { success: true, data };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * إنشاء طلب جديد
   */
  async createSubmission(submissionData) {
    this.setState({ loading: true, error: null });

    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      // إنشاء رقم مرجعي فريد
      const referenceNumber = this.generateReferenceNumber();

      const { data, error } = await supabase
        .from('submissions')
        .insert([{
          ...submissionData,
          user_id: user.id,
          reference_number: referenceNumber,
          status: 'pending',
          is_draft: false,
          declaration_timestamp: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;

      // إضافة الطلب الجديد إلى القائمة
      this.setState({
        submissions: [data, ...this.state.submissions],
        loading: false,
      });

      return { success: true, data };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * حفظ كمسودة
   */
  async saveDraft(draftData) {
    this.setState({ loading: true, error: null });

    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      const { data, error } = await supabase
        .from('submissions')
        .insert([{
          ...draftData,
          user_id: user.id,
          is_draft: true,
          status: 'draft',
        }])
        .select()
        .single();

      if (error) throw error;

      this.setState({
        drafts: [data, ...this.state.drafts],
        loading: false,
      });

      return { success: true, data };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * جلب المسودات
   */
  async fetchDrafts() {
    this.setState({ loading: true, error: null });

    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_draft', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      this.setState({ drafts: data, loading: false });
      return { success: true, data };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * حذف مسودة
   */
  async deleteDraft(id) {
    this.setState({ loading: true, error: null });

    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id)
        .eq('is_draft', true);

      if (error) throw error;

      this.setState({
        drafts: this.state.drafts.filter(d => d.id !== id),
        loading: false,
      });

      return { success: true };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * رفع ملف
   */
  async uploadFile(file, submissionId) {
    this.setState({ loading: true, error: null });

    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      // إنشاء مسار الملف
      const fileExt = file.name.split('.').pop();
      const fileName = `${submissionId}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${submissionId}/${fileName}`;

      // رفع الملف إلى Supabase Storage
      const { data, error } = await supabase.storage
        .from('research-files')
        .upload(filePath, file);

      if (error) throw error;

      // الحصول على رابط الملف
      const { data: urlData } = supabase.storage
        .from('research-files')
        .getPublicUrl(filePath);

      this.setState({ loading: false });
      return {
        success: true,
        fileUrl: urlData.publicUrl,
        fileName: file.name,
        fileSize: file.size,
      };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * تحميل ملف
   */
  async downloadFile(fileUrl, fileName) {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return { success: true };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * تطبيق الفلاتر
   */
  applyFilters(query) {
    const { status, researchType, category, dateFrom, dateTo, searchTerm } = this.state.filters;

    if (status) {
      query = query.eq('status', status);
    }

    if (researchType) {
      query = query.eq('research_type', researchType);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    if (searchTerm) {
      query = query.or(`reference_number.ilike.%${searchTerm}%,main_researcher.ilike.%${searchTerm}%`);
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
    this.fetchUserSubmissions();
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
    this.fetchUserSubmissions();
  }

  /**
   * تغيير الصفحة
   */
  setPage(page) {
    this.setState({
      pagination: { ...this.state.pagination, page },
    });
    this.fetchUserSubmissions();
  }

  /**
   * توليد رقم مرجعي
   */
  generateReferenceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `REF-${year}-${random}`;
  }

  /**
   * حساب الإحصائيات
   */
  getStats() {
    const total = this.state.submissions.length;
    const pending = this.state.submissions.filter(s => s.status === 'pending').length;
    const approved = this.state.submissions.filter(s => s.status === 'approved').length;
    const rejected = this.state.submissions.filter(s => s.status === 'rejected').length;
    const needsRevision = this.state.submissions.filter(s => s.status === 'needs_revision').length;
    const acceptanceRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;

    return {
      total,
      pending,
      approved,
      rejected,
      needsRevision,
      acceptanceRate,
    };
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
const submissionsStore = new SubmissionsStore();

export default submissionsStore;

