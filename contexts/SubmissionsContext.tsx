'use client';

/**
 * Submissions Context
 * إدارة حالة الطلبات (البحث المقدمة)
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';

interface Submission {
  id: string;
  user_id: string;
  title: string;
  research_type: string;
  category: string;
  status: string;
  file_url: string | null;
  created_at: string;
  updated_at: string;
  is_draft: boolean;
  [key: string]: any;
}

interface SubmissionFilters {
  status: string | null;
  researchType: string | null;
  category: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  searchTerm: string;
}

interface SubmissionsState {
  submissions: Submission[];
  currentSubmission: Submission | null;
  drafts: Submission[];
  loading: boolean;
  error: string | null;
  filters: SubmissionFilters;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
  };
}

interface SubmissionsContextType extends SubmissionsState {
  fetchUserSubmissions: () => Promise<void>;
  fetchSubmissionById: (id: string) => Promise<Submission | null>;
  createSubmission: (data: Partial<Submission>) => Promise<{ success: boolean; error?: string; data?: Submission }>;
  updateSubmission: (id: string, data: Partial<Submission>) => Promise<{ success: boolean; error?: string }>;
  deleteSubmission: (id: string) => Promise<{ success: boolean; error?: string }>;
  saveDraft: (data: Partial<Submission>) => Promise<{ success: boolean; error?: string }>;
  fetchDrafts: () => Promise<void>;
  setFilters: (filters: Partial<SubmissionFilters>) => void;
  setPage: (page: number) => void;
  getStats: () => Promise<{ total: number; approved: number; pending: number; rejected: number }>;
}

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(undefined);

export function SubmissionsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SubmissionsState>({
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
  });

  const { user, isAuthenticated } = useAuth();
  const supabase = createClient();

  const applyFilters = useCallback((query: any) => {
    let filteredQuery = query;

    if (state.filters.status) {
      filteredQuery = filteredQuery.eq('status', state.filters.status);
    }
    if (state.filters.researchType) {
      filteredQuery = filteredQuery.eq('research_type', state.filters.researchType);
    }
    if (state.filters.category) {
      filteredQuery = filteredQuery.eq('category', state.filters.category);
    }
    if (state.filters.dateFrom) {
      filteredQuery = filteredQuery.gte('created_at', state.filters.dateFrom);
    }
    if (state.filters.dateTo) {
      filteredQuery = filteredQuery.lte('created_at', state.filters.dateTo);
    }
    if (state.filters.searchTerm) {
      filteredQuery = filteredQuery.ilike('title', `%${state.filters.searchTerm}%`);
    }

    return filteredQuery;
  }, [state.filters]);

  const fetchUserSubmissions = useCallback(async () => {
    if (!user || !isAuthenticated) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let query = supabase
        .from('submissions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('is_draft', false)
        .order('created_at', { ascending: false });

      // Apply filters
      const currentFilters = state.filters;
      if (currentFilters.status) {
        query = query.eq('status', currentFilters.status);
      }
      if (currentFilters.researchType) {
        query = query.eq('research_type', currentFilters.researchType);
      }
      if (currentFilters.category) {
        query = query.eq('category', currentFilters.category);
      }
      if (currentFilters.dateFrom) {
        query = query.gte('created_at', currentFilters.dateFrom);
      }
      if (currentFilters.dateTo) {
        query = query.lte('created_at', currentFilters.dateTo);
      }
      if (currentFilters.searchTerm) {
        query = query.ilike('title', `%${currentFilters.searchTerm}%`);
      }

      const { page, pageSize } = state.pagination;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setState(prev => ({
        ...prev,
        submissions: data || [],
        loading: false,
        pagination: { ...prev.pagination, totalCount: count || 0 },
      }));
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'حدث خطأ أثناء جلب الطلبات',
        loading: false,
      }));
    }
  }, [user, isAuthenticated, supabase, state.filters, state.pagination]);

  const fetchSubmissionById = useCallback(async (id: string): Promise<Submission | null> => {
    if (!user) return null;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        currentSubmission: data,
        loading: false,
      }));

      return data;
    } catch (error: any) {
      console.error('Error fetching submission:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'حدث خطأ أثناء جلب الطلب',
        loading: false,
      }));
      return null;
    }
  }, [user, supabase]);

  const createSubmission = useCallback(async (data: Partial<Submission>) => {
    if (!user) {
      return { success: false, error: 'المستخدم غير مسجل الدخول' };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // إزالة الحقول غير الموجودة في الجدول فقط
      const {
        title, // غير موجود في الجدول
        description, // غير موجود في الجدول (يستخدم detailed_specialization)
        user_id, // إزالة user_id إذا كان موجوداً في data (سيتم إضافته لاحقاً)
        ...validData
      } = data;

      // التحقق من الحقول المطلوبة قبل الإرسال
      const requiredFields = {
        full_name: validData.full_name,
        country: validData.country,
        email: validData.email,
        gender: validData.gender,
        id_number: validData.id_number,
        research_type: validData.research_type,
        category: validData.category,
        main_researcher: validData.main_researcher,
        general_specialization: validData.general_specialization,
        detailed_specialization: validData.detailed_specialization,
        file_url: validData.file_url,
        file_name: validData.file_name,
        file_size: validData.file_size,
        declaration_accepted: validData.declaration_accepted,
        declaration_timestamp: validData.declaration_timestamp,
        reference_number: validData.reference_number,
      };

      // التحقق من أن جميع الحقول المطلوبة موجودة
      const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => {
          // التحقق من القيم الفارغة
          if (value === undefined || value === null) return true;
          // التحقق من السلاسل الفارغة
          if (typeof value === 'string' && value.trim() === '') return true;
          // التحقق من الأرقام الصفرية (باستثناء file_size الذي يمكن أن يكون 0)
          if (typeof value === 'number' && key !== 'file_size' && value === 0) return true;
          return false;
        })
        .map(([key]) => key);

      if (missingFields.length > 0) {
        const fieldNames: { [key: string]: string } = {
          full_name: 'الاسم الكامل',
          country: 'الدولة',
          email: 'البريد الإلكتروني',
          gender: 'الجنس',
          id_number: 'رقم الهوية',
          research_type: 'نوع البحث',
          category: 'الفئة',
          main_researcher: 'الباحث الرئيسي',
          general_specialization: 'التخصص العام',
          detailed_specialization: 'التخصص التفصيلي',
          file_url: 'رابط الملف',
          file_name: 'اسم الملف',
          file_size: 'حجم الملف',
          declaration_accepted: 'قبول التعهد',
          declaration_timestamp: 'وقت التعهد',
          reference_number: 'الرقم المرجعي',
        };
        const missingFieldNames = missingFields.map(field => fieldNames[field] || field);
        throw new Error(`الحقول المطلوبة التالية مفقودة: ${missingFieldNames.join(', ')}`);
      }

      const submissionData = {
        ...validData,
        user_id: user.id, // إضافة user_id من المستخدم الحالي
        is_draft: data.is_draft ?? false,
        status: data.status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('إرسال البيانات إلى Supabase:', submissionData);

      const { data: newSubmission, error } = await supabase
        .from('submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) {
        console.error('خطأ Supabase:', error);
        throw error;
      }

      setState(prev => ({
        ...prev,
        submissions: [newSubmission, ...prev.submissions],
        loading: false,
      }));

      return { success: true, data: newSubmission };
    } catch (error: any) {
      console.error('Error creating submission:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'حدث خطأ أثناء إنشاء الطلب',
        loading: false,
      }));
      return { success: false, error: error.message };
    }
  }, [user, supabase]);

  const updateSubmission = useCallback(async (id: string, data: Partial<Submission>) => {
    if (!user) {
      return { success: false, error: 'المستخدم غير مسجل الدخول' };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('submissions')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchUserSubmissions();

      return { success: true };
    } catch (error: any) {
      console.error('Error updating submission:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'حدث خطأ أثناء تحديث الطلب',
        loading: false,
      }));
      return { success: false, error: error.message };
    }
  }, [user, supabase, fetchUserSubmissions]);

  const deleteSubmission = useCallback(async (id: string) => {
    if (!user) {
      return { success: false, error: 'المستخدم غير مسجل الدخول' };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        submissions: prev.submissions.filter(s => s.id !== id),
        loading: false,
      }));

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting submission:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'حدث خطأ أثناء حذف الطلب',
        loading: false,
      }));
      return { success: false, error: error.message };
    }
  }, [user, supabase]);

  const saveDraft = useCallback(async (data: Partial<Submission>) => {
    if (!user) {
      return { success: false, error: 'المستخدم غير مسجل الدخول' };
    }

    try {
      // إزالة الحقول غير الموجودة في الجدول
      const {
        title, // غير موجود في الجدول
        description, // غير موجود في الجدول (يستخدم detailed_specialization)
        file, // كائن File - لا يجب إرساله
        user_id, // سيتم إضافته لاحقاً
        ...cleanData
      } = data;

      // إعداد البيانات للمسودة
      const draftData: any = {
        ...cleanData,
        user_id: user.id,
        is_draft: true,
        updated_at: new Date().toISOString(),
      };

      // إذا كان هناك مسودة موجودة، قم بالتحديث
      if (data.id) {
        // إزالة id من البيانات المرسلة (لا يجب تحديثه)
        const { id, ...updateData } = draftData;
        
        const { error } = await supabase
          .from('submissions')
          .update(updateData)
          .eq('id', data.id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating draft:', error);
          throw new Error(error.message || 'فشل تحديث المسودة');
        }
      } else {
        // إنشاء مسودة جديدة
        // إضافة الحقول المطلوبة بقيم افتراضية إذا كانت مفقودة
        const newDraftData = {
          ...draftData,
          created_at: new Date().toISOString(),
          // قيم افتراضية للحقول المطلوبة إذا كانت مفقودة
          full_name: draftData.full_name || 'مسودة',
          country: draftData.country || '',
          email: draftData.email || user.email || '',
          gender: draftData.gender || 'ذكر',
          id_number: draftData.id_number || '',
          research_type: draftData.research_type || '',
          category: draftData.category || '',
          main_researcher: draftData.main_researcher || draftData.full_name || '',
          general_specialization: draftData.general_specialization || draftData.category || '',
          detailed_specialization: draftData.detailed_specialization || '',
          file_url: draftData.file_url || '',
          file_name: draftData.file_name || 'draft-file',
          file_size: draftData.file_size || 0,
          declaration_accepted: draftData.declaration_accepted || false,
          declaration_timestamp: draftData.declaration_timestamp || new Date().toISOString(),
          reference_number: draftData.reference_number || `DRAFT-${Date.now()}`,
          status: draftData.status || 'draft',
        };

        const { error } = await supabase
          .from('submissions')
          .insert([newDraftData]);

        if (error) {
          console.error('Error creating draft:', error);
          throw new Error(error.message || 'فشل إنشاء المسودة');
        }
      }

      // إعادة تحميل المسودات بعد الحفظ
      try {
        const { data, error: fetchError } = await supabase
          .from('submissions')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_draft', true)
          .order('updated_at', { ascending: false });

        if (!fetchError && data) {
          setState(prev => ({
            ...prev,
            drafts: data || [],
          }));
        }
      } catch (fetchErr) {
        console.warn('خطأ في إعادة تحميل المسودات:', fetchErr);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error saving draft:', error);
      const errorMessage = error?.message || error?.toString() || 'حدث خطأ غير معروف أثناء حفظ المسودة';
      return { success: false, error: errorMessage };
    }
  }, [user, supabase]);

  const fetchDrafts = useCallback(async () => {
    if (!user || !isAuthenticated) return;

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_draft', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        drafts: data || [],
      }));
    } catch (error: any) {
      console.error('Error fetching drafts:', error);
    }
  }, [user, isAuthenticated, supabase]);

  const setFilters = useCallback((newFilters: Partial<SubmissionFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
      pagination: { ...prev.pagination, page: 1 },
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page },
    }));
  }, []);

  const getStats = useCallback(async () => {
    if (!user || !isAuthenticated) {
      return { total: 0, approved: 0, pending: 0, rejected: 0 };
    }

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('status')
        .eq('user_id', user.id)
        .eq('is_draft', false);

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        approved: data?.filter((s: any) => s.status === 'approved').length || 0,
        pending: data?.filter((s: any) => s.status === 'pending').length || 0,
        rejected: data?.filter((s: any) => s.status === 'rejected').length || 0,
      };

      return stats;
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      return { total: 0, approved: 0, pending: 0, rejected: 0 };
    }
  }, [user, isAuthenticated, supabase]);

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchDrafts();
    }
  }, [user, isAuthenticated, fetchDrafts]);

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchUserSubmissions();
    }
  }, [user, isAuthenticated, state.filters.status, state.filters.researchType, state.filters.category, state.filters.dateFrom, state.filters.dateTo, state.filters.searchTerm, state.pagination.page, fetchUserSubmissions]);

  return (
    <SubmissionsContext.Provider
      value={{
        ...state,
        fetchUserSubmissions,
        fetchSubmissionById,
        createSubmission,
        updateSubmission,
        deleteSubmission,
        saveDraft,
        fetchDrafts,
        setFilters,
        setPage,
        getStats,
      }}
    >
      {children}
    </SubmissionsContext.Provider>
  );
}

export function useSubmissions() {
  const context = useContext(SubmissionsContext);
  if (context === undefined) {
    throw new Error('useSubmissions must be used within a SubmissionsProvider');
  }
  return context;
}

