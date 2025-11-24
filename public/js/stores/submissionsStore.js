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
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      let query = supabase
        .from('submissions')
        .select('*')
        .eq('id', id);

      // Filter by user_id to ensure researchers can only see their own submissions
      // Admins can see all submissions, but this store is for researchers
      query = query.eq('user_id', user.id);

      const { data, error } = await query.single();

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

      // إرسال إيميل تأكيد (غير متزامن - لا ننتظر النتيجة)
      this.sendSubmissionConfirmationEmail(data, user).catch(err => {
        console.error('Failed to send confirmation email:', err);
        // لا نرمي خطأ هنا لأن الإيميل ليس ضرورياً لعملية التقديم
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
  /**
   * رفع ملف قبل إنشاء البحث (بدون submissionId)
   */
  async uploadFileBeforeSubmission(file, onProgress = null) {
    this.setState({ loading: true, error: null });

    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      // إنشاء مسار الملف مع timestamp
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${user.id}/temp/${fileName}`;

      // رفع الملف إلى Supabase Storage
      // Supabase handles large files automatically with chunked upload
      const { data, error } = await supabase.storage
        .from('research-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'application/octet-stream'
        });

      if (error) {
        // Handle specific error for file size limit
        if (error.message && error.message.includes('File size exceeds')) {
          throw new Error('حجم الملف يتجاوز الحد المسموح (200MB)');
        }
        throw error;
      }
      
      // Update progress to 100% if callback provided
      if (onProgress) {
        onProgress(100);
      }

      // الحصول على رابط الملف
      const { data: urlData } = supabase.storage
        .from('research-files')
        .getPublicUrl(filePath);

      // Validate that we got a valid URL
      if (!urlData || !urlData.publicUrl) {
        throw new Error('فشل الحصول على رابط الملف من التخزين');
      }

      this.setState({ loading: false });
      return {
        success: true,
        url: urlData.publicUrl,
        fileName: file.name,
        fileSize: file.size,
      };

    } catch (error) {
      console.error('Upload error:', error);
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

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
      // For large files, use chunked upload
      const { data, error } = await supabase.storage
        .from('research-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'application/octet-stream'
        });

      if (error) throw error;

      // الحصول على رابط الملف
      const { data: urlData } = supabase.storage
        .from('research-files')
        .getPublicUrl(filePath);

      // Validate that we got a valid URL
      if (!urlData || !urlData.publicUrl) {
        throw new Error('فشل الحصول على رابط الملف من التخزين');
      }

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
   * حساب الإحصائيات من الحالة المحلية
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
   * جلب الإحصائيات من قاعدة البيانات مباشرة
   * هذا يضمن الحصول على جميع الطلبات وليس فقط الصفحة الحالية
   */
  async fetchStats() {
    this.setState({ loading: true, error: null });

    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      // جلب جميع طلبات المستخدم (بدون pagination) للحصول على الإحصائيات الصحيحة
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select('status')
        .eq('user_id', user.id)
        .eq('is_draft', false);

      if (error) throw error;

      // حساب الإحصائيات
      const total = submissions.length;
      const pending = submissions.filter(s => s.status === 'pending').length;
      const approved = submissions.filter(s => s.status === 'approved').length;
      const rejected = submissions.filter(s => s.status === 'rejected').length;
      const needsRevision = submissions.filter(s => s.status === 'needs_revision').length;
      const acceptanceRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;

      const stats = {
        total,
        pending,
        approved,
        rejected,
        needsRevision,
        acceptanceRate,
      };

      this.setState({ loading: false });
      return stats;

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      console.error('Error fetching stats:', error);
      // إرجاع إحصائيات فارغة في حالة الخطأ
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        needsRevision: 0,
        acceptanceRate: 0,
      };
    }
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
   * إرسال إيميل تأكيد تقديم البحث
   */
  async sendSubmissionConfirmationEmail(submission, user) {
    try {
      // التحقق من وجود البريد الإلكتروني
      const recipientEmail = submission.email || user.email;
      if (!recipientEmail) {
        console.warn('No email address found for submission confirmation');
        return { success: false, error: 'No email address found' };
      }

      // الحصول على معلومات البحث
      const researcherName = submission.full_name || user.username || 'عزيزي الباحث';
      const referenceNumber = submission.reference_number;
      const researchType = this.getResearchTypeLabel(submission.research_type);
      const category = submission.category;
      const specialization = `${submission.general_specialization || ''} - ${submission.detailed_specialization || ''}`.trim();
      const submissionDate = new Date(submission.created_at).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // إنشاء محتوى الإيميل
      const emailHtml = this.generateSubmissionConfirmationEmail({
        researcherName,
        referenceNumber,
        researchType,
        category,
        specialization,
        submissionDate
      });

      // التحقق من أن محتوى الإيميل تم إنشاؤه بشكل صحيح
      if (!emailHtml || emailHtml.trim().length === 0) {
        console.error('Email HTML content is empty');
        throw new Error('Failed to generate email content');
      }

      console.log('Sending confirmation email to:', recipientEmail);

      // استدعاء Edge Function لإرسال الإيميل
      const { data, error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          emailData: {
            to: recipientEmail,
            subject: `تم تقديم بحثك بنجاح - ${referenceNumber}`,
            html: emailHtml,
            type: 'new_submission',
            userId: user.id,
            submissionId: submission.id,
          }
        }
      });

      if (error) {
        console.error('Error invoking email function:', error);
        throw error;
      }

      // التحقق من استجابة Edge Function
      if (data && data.success) {
        console.log('Confirmation email sent successfully:', data);
        return { success: true, data };
      } else if (data && data.message) {
        // Edge Function قد يعيد رسالة حتى لو لم يتم الإرسال (مثل: Email queued)
        console.log('Email function response:', data.message);
        return { success: true, data, message: data.message };
      } else {
        console.warn('Unexpected response from email function:', data);
        return { success: false, error: 'Unexpected response from email function' };
      }

    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // لا نرمي الخطأ هنا لأن الإيميل ليس ضرورياً لعملية التقديم
      return { success: false, error: error.message || 'Failed to send email' };
    }
  }

  /**
   * توليد محتوى إيميل تأكيد التقديم
   */
  generateSubmissionConfirmationEmail(data) {
    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تأكيد تقديم البحث</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
      direction: rtl;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 40px 30px;
    }
    .success-icon {
      font-size: 60px;
      text-align: center;
      margin: 20px 0;
    }
    .ref-number {
      background-color: #e7f5e9;
      border: 2px dashed #28a745;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
      border-radius: 5px;
    }
    .ref-number strong {
      font-size: 24px;
      color: #28a745;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .details-table td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .details-table td:first-child {
      font-weight: bold;
      color: #666;
      width: 40%;
    }
    .button {
      display: inline-block;
      background-color: #28a745;
      color: white;
      text-decoration: none;
      padding: 15px 40px;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ تم تقديم بحثك بنجاح!</h1>
    </div>
    
    <div class="content">
      <div class="success-icon">🎉</div>
      
      <h2>عزيزي ${data.researcherName}،</h2>
      
      <p>تم استلام طلب تقديم بحثك بنجاح. شكراً لثقتك في منصتنا!</p>
      
      <div class="ref-number">
        <p style="margin: 0; color: #666;">رقم المرجع الخاص بك</p>
        <strong>${data.referenceNumber}</strong>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">احتفظ بهذا الرقم للمتابعة</p>
      </div>
      
      <h3>📋 تفاصيل الطلب:</h3>
      <table class="details-table">
        <tr>
          <td>نوع البحث:</td>
          <td>${data.researchType}</td>
        </tr>
        <tr>
          <td>الفئة:</td>
          <td>${data.category}</td>
        </tr>
        <tr>
          <td>التخصص:</td>
          <td>${data.specialization || '-'}</td>
        </tr>
        <tr>
          <td>تاريخ التقديم:</td>
          <td>${data.submissionDate}</td>
        </tr>
        <tr>
          <td>الحالة:</td>
          <td><strong style="color: #ff9800;">قيد المراجعة</strong></td>
        </tr>
      </table>
      
      <h3>📬 ماذا بعد؟</h3>
      <ul>
        <li>سيتم مراجعة بحثك من قبل فريقنا المختص</li>
        <li>ستصلك إشعارات عبر البريد الإلكتروني عند أي تحديث</li>
        <li>يمكنك متابعة حالة الطلب في أي وقت من لوحة التحكم</li>
        <li>مدة المراجعة المتوقعة: 5-7 أيام عمل</li>
      </ul>
      
      <div style="text-align: center;">
        <a href="/pages/researcher/dashboard.html" class="button">عرض لوحة التحكم</a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p>إذا كان لديك أي استفسارات، لا تتردد في التواصل معنا.</p>
      
      <p>مع أطيب التحيات،<br><strong>فريق منصة نشر الأبحاث العربية</strong></p>
    </div>
    
    <div class="footer">
      <p>© 2025 منصة نشر الأبحاث العربية. جميع الحقوق محفوظة.</p>
      <p>support@arabresearch.com | www.arabresearch.com</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * الحصول على تسمية نوع البحث
   */
  getResearchTypeLabel(type) {
    const labels = {
      'scientific_paper': 'ورقة علمية',
      'masters_thesis': 'رسالة ماجستير',
      'phd_dissertation': 'أطروحة دكتوراه',
      'book': 'كتاب'
    };
    return labels[type] || type;
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

