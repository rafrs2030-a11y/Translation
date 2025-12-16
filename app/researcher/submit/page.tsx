'use client';

import { useState, useEffect, useCallback, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmissions } from '@/contexts/SubmissionsContext';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { createClient } from '@/lib/supabase/client';
import { RESEARCH_CATEGORIES } from '@/config/constants';
import { ALL_COUNTRIES } from '@/config/constants';

function SubmitPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { createSubmission, loading, saveDraft, fetchSubmissionById } = useSubmissions();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    research_type: '',
    category: '',
    description: '',
    country: '',
    submitter_type: 'فرد',
    full_name: '',
    email: '',
    organization_name: '',
    organization_type: '',
    main_researcher: '',
    file: null as File | null,
  });
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [draftId, setDraftId] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        full_name: user.username || '',
      }));
    }
  }, [user]);

  // دالة لمسح الكاش وإعادة تعيين النموذج
  const clearCacheAndReset = () => {
    // مسح localStorage المتعلق بالنموذج
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('submit') || key.includes('draft') || key.includes('form'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // إعادة تعيين النموذج
    setFormData({
      title: '',
      research_type: '',
      category: '',
      description: '',
      country: '',
      submitter_type: 'فرد',
      full_name: user?.username || '',
      email: user?.email || '',
      organization_name: '',
      organization_type: '',
      main_researcher: '',
      file: null,
    });
    setFileUrl(null);
    setFileName(null);
    setFileSize(null);
    setError('');
    setSuccess('');
    setDraftId(null);
    setDeclarationAccepted(false);
    setCurrentStep(1);
    setIsSubmitting(false);
    
    // مسح معاملات URL
    router.replace('/researcher/submit', { scroll: false });
  };

  const loadDraft = useCallback(async (id: string) => {
    setLoadingDraft(true);
    try {
      const draft = await fetchSubmissionById(id);
      if (draft && draft.is_draft) {
        setDraftId(id);
        setFormData(prev => ({
          ...prev,
          title: draft.title || '',
          research_type: draft.research_type || '',
          category: draft.category || '',
          description: draft.description || '',
          country: draft.country || '',
          submitter_type: draft.submitter_type || 'فرد',
          full_name: draft.full_name || prev.full_name,
          email: draft.email || prev.email,
          organization_name: draft.organization_name || '',
          organization_type: draft.organization_type || '',
          main_researcher: draft.main_researcher || '',
        }));
        if (draft.file_url) {
          setFileUrl(draft.file_url);
          // استخراج اسم الملف وحجمه من بيانات المسودة
          if (draft.file_name) {
            setFileName(draft.file_name);
          }
          if (draft.file_size) {
            setFileSize(draft.file_size);
          }
        }
        setSuccess('تم تحميل المسودة بنجاح');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError('فشل تحميل المسودة: ' + (err.message || 'حدث خطأ'));
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoadingDraft(false);
    }
  }, [fetchSubmissionById]);

  // Load draft if draft ID is provided in URL
  useEffect(() => {
    const draftIdParam = searchParams.get('draft');
    if (draftIdParam && isAuthenticated && user) {
      loadDraft(draftIdParam);
    }
  }, [searchParams, isAuthenticated, user, loadDraft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // منع الإرسال التلقائي عند الضغط على Enter في الحقول
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && currentStep < 4) {
      // في الخطوات الأولى، Enter ينتقل للخطوة التالية
      e.preventDefault();
      handleNext();
      } else if (e.key === 'Enter' && currentStep === 4) {
        // في الخطوة الأخيرة، Enter لا يرسل تلقائياً إلا إذا كان الزر مفعلاً
        if (isSubmitting || !fileUrl || !declarationAccepted) {
          e.preventDefault();
        }
      }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('حجم الملف يجب أن يكون أقل من 10 ميجابايت');
      return;
    }

    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setError('نوع الملف غير مدعوم. يرجى رفع ملف PDF أو Word');
      return;
    }

    setFormData(prev => ({ ...prev, file }));
    setError('');

    // حفظ اسم الملف وحجمه
    setFileName(file.name);
    setFileSize(file.size);

    // Upload file to Supabase Storage
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('research-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('research-files')
        .getPublicUrl(fileName);

      setFileUrl(publicUrl);
    } catch (err: any) {
      setError('فشل رفع الملف: ' + err.message);
    }
  };

  const validateStep = (step: number): boolean => {
    setError('');

    if (step === 1) {
      if (!formData.submitter_type) {
        setError('يرجى اختيار نوع مقدم البحث');
        return false;
      }
      if (formData.submitter_type === 'فرد' && !formData.full_name) {
        setError('الاسم الكامل مطلوب');
        return false;
      }
      if (formData.submitter_type === 'جهة' && (!formData.organization_name || !formData.organization_type)) {
        setError('اسم الجهة ونوع الجهة مطلوبان');
        return false;
      }
      if (!formData.email) {
        setError('البريد الإلكتروني مطلوب');
        return false;
      }
      if (!formData.country) {
        setError('الدولة مطلوبة');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.title) {
        setError('عنوان البحث مطلوب');
        return false;
      }
      if (!formData.research_type) {
        setError('نوع البحث مطلوب');
        return false;
      }
      if (!formData.category) {
        setError('فئة البحث مطلوبة');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.file && !fileUrl) {
        setError('يرجى رفع ملف البحث');
        return false;
      }
    }

    if (step === 4) {
      if (!fileUrl) {
        setError('يجب رفع الملف قبل الإرسال');
        return false;
      }
      if (!declarationAccepted) {
        setError('يجب الموافقة على التعهد قبل الإرسال');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = async () => {
    try {
      // إعداد البيانات للمسودة
      const fullName = (formData.submitter_type === 'فرد') 
        ? (formData.full_name || '').trim()
        : (formData.organization_name || '').trim();
      
      const mainResearcher = (formData.main_researcher || '').trim() || fullName;

      // الحصول على معلومات المستخدم
      const supabase = createClient();
      let userData = null;
      try {
        const { data } = await supabase
          .from('users')
          .select('gender, national_id, email')
          .eq('id', user?.id)
          .single();
        userData = data;
      } catch (userErr) {
        console.warn('خطأ في جلب بيانات المستخدم:', userErr);
      }

      const result = await saveDraft({
        ...(draftId ? { id: draftId } : {}),
        full_name: fullName || 'مسودة',
        email: formData.email || userData?.email || '',
        country: formData.country || '',
        gender: userData?.gender || 'ذكر',
        id_number: userData?.national_id || '',
        research_type: formData.research_type || '',
        category: formData.category || '',
        main_researcher: mainResearcher || fullName || '',
        general_specialization: formData.category || '',
        detailed_specialization: formData.description || '',
        file_url: fileUrl || '',
        file_name: fileName || formData.file?.name || 'draft-file',
        file_size: fileSize || formData.file?.size || 0,
        submitter_type: formData.submitter_type === 'فرد' ? 'أفراد' : formData.submitter_type === 'جهة' ? 'أعمال' : formData.submitter_type,
        organization_name: formData.organization_name || null,
        organization_type: formData.organization_type || null,
        declaration_accepted: false,
        declaration_timestamp: new Date().toISOString(),
        reference_number: draftId ? undefined : `DRAFT-${Date.now()}`,
        status: 'draft',
        is_draft: true,
      });

      if (result.success) {
        setSuccess('تم حفظ المسودة بنجاح');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('فشل حفظ المسودة: ' + (result.error || 'حدث خطأ غير معروف'));
      }
    } catch (err: any) {
      console.error('Error saving draft:', err);
      setError('فشل حفظ المسودة: ' + (err.message || 'حدث خطأ غير معروف'));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // منع الإرسال المتعدد - استخدام isSubmitting فقط
    if (isSubmitting) {
      console.log('الإرسال قيد التنفيذ بالفعل');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // التحقق الشامل من جميع الحقول المطلوبة
    if (!validateStep(4)) {
      setIsSubmitting(false);
      return;
    }

    // التحقق من وجود الملف
    if (!fileUrl) {
      setError('يجب رفع ملف البحث قبل الإرسال');
      setIsSubmitting(false);
      return;
    }

    // التحقق من التعهد
    if (!declarationAccepted) {
      setError('يجب الموافقة على التعهد قبل الإرسال');
      setIsSubmitting(false);
      return;
    }

    // التحقق من الحقول المطلوبة
    if (!formData.research_type || !formData.category || !formData.email || !formData.country) {
      setError('يرجى التأكد من ملء جميع الحقول المطلوبة');
      setIsSubmitting(false);
      return;
    }

    // التحقق من نوع مقدم البحث
    if (formData.submitter_type === 'جهة' && (!formData.organization_name || !formData.organization_type)) {
      setError('يرجى إدخال اسم الجهة ونوع الجهة');
      setIsSubmitting(false);
      return;
    }

    if (formData.submitter_type === 'فرد' && !formData.full_name) {
      setError('يرجى إدخال الاسم الكامل');
      setIsSubmitting(false);
      return;
    }

    try {
      // الحصول على معلومات المستخدم من قاعدة البيانات
      const supabase = createClient();
      let userData = null;
      try {
        const { data, error: userError } = await supabase
          .from('users')
          .select('gender, national_id')
          .eq('id', user?.id)
          .single();
        
        if (userError) {
          console.warn('خطأ في جلب بيانات المستخدم:', userError);
        } else {
          userData = data;
        }
      } catch (userErr: any) {
        console.warn('خطأ في جلب بيانات المستخدم:', userErr);
      }

      // إنشاء رقم مرجعي فريد
      let referenceNumber = '';
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        referenceNumber = `REF-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
        const { data: existing, error: checkError } = await supabase
          .from('submissions')
          .select('id')
          .eq('reference_number', referenceNumber)
          .maybeSingle();
        
        // إذا لم يوجد خطأ ولم يوجد سجل بهذا الرقم، فهو فريد
        if (!checkError && !existing) {
          isUnique = true;
        } else if (checkError && checkError.code !== 'PGRST116') {
          // PGRST116 يعني عدم وجود نتائج، وهو ما نريده
          console.warn('خطأ في التحقق من الرقم المرجعي:', checkError);
        }
        attempts++;
      }

      if (!isUnique) {
        // استخدام timestamp كبديل لضمان التفرد
        referenceNumber = `REF-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
      }

      // إعداد البيانات حسب نوع مقدم البحث
      const fullName = (formData.submitter_type === 'فرد') 
        ? (formData.full_name || '').trim()
        : (formData.organization_name || '').trim();
      
      if (!fullName || fullName.length > 255) {
        setError('اسم مقدم البحث مطلوب ولا يجب أن يتجاوز 255 حرف');
        setIsSubmitting(false);
        return;
      }

      const mainResearcher = (formData.main_researcher || '').trim() || 
        ((formData.submitter_type === 'فرد') 
          ? (formData.full_name || '').trim()
          : (formData.organization_name || '').trim());

      if (!mainResearcher || mainResearcher.length > 255) {
        setError('اسم الباحث الرئيسي مطلوب ولا يجب أن يتجاوز 255 حرف');
        setIsSubmitting(false);
        return;
      }

      // تقصير النصوص الطويلة لتتوافق مع قيود قاعدة البيانات
      const truncateText = (text: string, maxLength: number): string => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
      };

      const generalSpecialization = truncateText(formData.category || '', 255);
      const detailedSpecialization = truncateText(formData.description || '', 255);
      const file_name_truncated = truncateText(fileName || formData.file?.name || 'research-file', 255);
      const country_truncated = truncateText(formData.country || '', 100);
      const email_truncated = truncateText(formData.email || '', 255);
      const research_type_truncated = truncateText(formData.research_type || '', 50);
      const category_truncated = truncateText(formData.category || '', 100);
      const id_number_truncated = truncateText(userData?.national_id || 'N/A', 50);

      // التحقق من أن جميع الحقول المطلوبة موجودة
      if (!generalSpecialization || !detailedSpecialization || !file_name_truncated) {
        setError('يرجى التأكد من ملء جميع الحقول المطلوبة');
        setIsSubmitting(false);
        return;
      }

      const result = await createSubmission({
        // الحقول المطلوبة في جدول submissions (بدون user_id - سيتم إضافته في الـ context)
        research_type: research_type_truncated,
        category: category_truncated,
        file_url: fileUrl || '',
        file_name: file_name_truncated,
        file_size: fileSize || formData.file?.size || 0,
        full_name: fullName,
        email: email_truncated,
        country: country_truncated,
        gender: (userData?.gender === 'ذكر' || userData?.gender === 'أنثى') ? userData.gender : 'ذكر',
        id_number: id_number_truncated,
        main_researcher: mainResearcher,
        general_specialization: generalSpecialization,
        detailed_specialization: detailedSpecialization,
        submitter_type: formData.submitter_type === 'فرد' ? 'أفراد' : formData.submitter_type === 'جهة' ? 'أعمال' : formData.submitter_type,
        organization_name: formData.organization_name ? truncateText(formData.organization_name, 255) : null,
        organization_type: formData.organization_type ? truncateText(formData.organization_type, 50) : null,
        declaration_accepted: true,
        declaration_timestamp: new Date().toISOString(),
        reference_number: referenceNumber,
        status: 'pending',
        is_draft: false,
      });

      if (result.success) {
        setSuccess('تم تقديم البحث بنجاح! الرقم المرجعي: ' + referenceNumber);
        setIsSubmitting(false);
        // مسح الكاش بعد النجاح
        setTimeout(() => {
          clearCacheAndReset();
          router.push('/researcher/submissions');
        }, 2000);
      } else {
        const errorMessage = result.error || 'فشل تقديم البحث';
        console.error('خطأ في إرسال الطلب:', errorMessage);
        setError(errorMessage);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error('خطأ في إرسال الطلب:', err);
      let errorMessage = 'حدث خطأ أثناء إرسال الطلب';
      
      // معالجة أخطاء محددة
      if (err.message) {
        if (err.message.includes('duplicate key') || err.message.includes('unique constraint')) {
          errorMessage = 'رقم مرجعي موجود مسبقاً. يرجى المحاولة مرة أخرى';
        } else if (err.message.includes('violates check constraint')) {
          errorMessage = 'قيمة غير صحيحة في أحد الحقول. يرجى التحقق من البيانات المدخلة';
        } else if (err.message.includes('violates not-null constraint')) {
          errorMessage = 'حقل مطلوب مفقود. يرجى التأكد من ملء جميع الحقول المطلوبة';
        } else if (err.message.includes('value too long')) {
          errorMessage = 'أحد الحقول طويل جداً. يرجى تقصير النص';
        } else {
          errorMessage = 'حدث خطأ: ' + err.message;
        }
      }
      
      setError(errorMessage);
      setIsSubmitting(false);
    } finally {
      // التأكد من إعادة تعيين الحالة في جميع الحالات
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="dashboard-page">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard-page dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar />

        <div className="dashboard-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
            <div>
              <h1>{draftId ? 'تعديل مسودة' : 'تقديم بحث جديد'}</h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {draftId ? 'جاري تعديل مسودة موجودة' : 'املأ جميع الحقول المطلوبة لتقديم بحثك للمراجعة'}
              </p>
            </div>
            {currentStep < 4 && (
              <button
                type="button"
                onClick={clearCacheAndReset}
                className="btn btn-outline"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-sm)',
                  fontSize: 'var(--font-size-sm)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  whiteSpace: 'nowrap'
                }}
                title="مسح الكاش وإعادة تعيين النموذج"
              >
                <i className="fas fa-trash-alt"></i>
                مسح الكاش
              </button>
            )}
          </div>

          {/* Progress Steps */}
          <div className="progress-steps" data-step={currentStep} style={{ marginBottom: 'var(--spacing-xl)' }}>
            {[
              { number: 1, label: 'المعلومات الأساسية', icon: 'fa-user' },
              { number: 2, label: 'تفاصيل البحث', icon: 'fa-file-alt' },
              { number: 3, label: 'رفع الملف', icon: 'fa-cloud-upload-alt' },
              { number: 4, label: 'المراجعة والإرسال', icon: 'fa-check-circle' },
            ].map((step) => (
              <div
                key={step.number}
                className={`step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
              >
                <div className="step-number">
                  {currentStep > step.number ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <i className={`fas ${step.icon}`}></i>
                  )}
                </div>
                <div className="step-label">{step.label}</div>
              </div>
            ))}
          </div>

          {/* Alerts */}
          {error && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle"></i>
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              // التأكد من أن الإرسال يتم فقط عند الضغط على زر الإرسال
              if (currentStep === 4 && !isSubmitting && fileUrl && declarationAccepted) {
                handleSubmit(e);
              }
            }} 
            className="multi-step-form"
            onKeyDown={(e) => {
              // منع الإرسال التلقائي عند الضغط على Enter في النموذج
              if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.type !== 'submit') {
                e.preventDefault();
              }
            }}
          >
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="card form-step">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fas fa-user-circle"></i>
                    المعلومات الأساسية
                  </h2>
                  <p style={{ margin: 'var(--spacing-sm) 0 0 0', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    أدخل معلومات مقدم البحث الأساسية
                  </p>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="submitter_type" className="form-label required">
                      <i className="fas fa-users" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                      نوع مقدم البحث
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
                      <label
                        style={{
                          padding: 'var(--spacing-lg)',
                          border: `2px solid ${formData.submitter_type === 'فرد' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                          borderRadius: 'var(--radius-lg)',
                          cursor: 'pointer',
                          background: formData.submitter_type === 'فرد' ? 'rgba(61, 90, 148, 0.05)' : 'var(--bg-primary)',
                          transition: 'all var(--transition-base)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)',
                        }}
                        onClick={() => setFormData(prev => ({ ...prev, submitter_type: 'فرد' }))}
                      >
                        <input
                          type="radio"
                          name="submitter_type"
                          value="فرد"
                          checked={formData.submitter_type === 'فرد'}
                          onChange={handleInputChange}
                          style={{ display: 'none' }}
                        />
                        <i className="fas fa-user" style={{ fontSize: '2rem', color: formData.submitter_type === 'فرد' ? 'var(--primary-color)' : 'var(--text-secondary)' }}></i>
                        <span style={{ fontWeight: 600, color: formData.submitter_type === 'فرد' ? 'var(--primary-color)' : 'var(--text-primary)' }}>فرد</span>
                      </label>
                      <label
                        style={{
                          padding: 'var(--spacing-lg)',
                          border: `2px solid ${formData.submitter_type === 'جهة' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                          borderRadius: 'var(--radius-lg)',
                          cursor: 'pointer',
                          background: formData.submitter_type === 'جهة' ? 'rgba(61, 90, 148, 0.05)' : 'var(--bg-primary)',
                          transition: 'all var(--transition-base)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)',
                        }}
                        onClick={() => setFormData(prev => ({ ...prev, submitter_type: 'جهة' }))}
                      >
                        <input
                          type="radio"
                          name="submitter_type"
                          value="جهة"
                          checked={formData.submitter_type === 'جهة'}
                          onChange={handleInputChange}
                          style={{ display: 'none' }}
                        />
                        <i className="fas fa-building" style={{ fontSize: '2rem', color: formData.submitter_type === 'جهة' ? 'var(--primary-color)' : 'var(--text-secondary)' }}></i>
                        <span style={{ fontWeight: 600, color: formData.submitter_type === 'جهة' ? 'var(--primary-color)' : 'var(--text-primary)' }}>جهة</span>
                      </label>
                    </div>
                  </div>

                  {formData.submitter_type === 'فرد' && (
                    <>
                      <div className="form-group">
                        <label htmlFor="full_name" className="form-label required">
                          <i className="fas fa-user" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                          الاسم الكامل
                        </label>
                        <input
                          type="text"
                          id="full_name"
                          name="full_name"
                          className="form-input"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="أدخل اسمك الكامل"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email" className="form-label required">
                          <i className="fas fa-envelope" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-input"
                          value={formData.email}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="example@email.com"
                          required
                        />
                      </div>
                    </>
                  )}

                  {formData.submitter_type === 'جهة' && (
                    <>
                      <div className="form-group">
                        <label htmlFor="organization_name" className="form-label required">اسم الجهة</label>
                        <input
                          type="text"
                          id="organization_name"
                          name="organization_name"
                          className="form-input"
                          value={formData.organization_name}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="organization_type" className="form-label required">نوع الجهة</label>
                        <select
                          id="organization_type"
                          name="organization_type"
                          className="form-select"
                          value={formData.organization_type}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">اختر نوع الجهة</option>
                          <option value="جامعة">جامعة</option>
                          <option value="هيئة">هيئة</option>
                          <option value="جهات حكومية">جهات حكومية</option>
                          <option value="قطاع خاص">قطاع خاص</option>
                          <option value="قطاع غير ربحي">قطاع غير ربحي</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="email" className="form-label required">البريد الإلكتروني</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-input"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label htmlFor="country" className="form-label required">
                      <i className="fas fa-globe" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                      الدولة
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      className="form-input"
                      value={formData.country}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      list="countries-list"
                      placeholder="اختر أو اكتب اسم الدولة"
                      required
                    />
                    <datalist id="countries-list">
                      {ALL_COUNTRIES.map((country) => (
                        <option key={country} value={country} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Research Details */}
            {currentStep === 2 && (
              <div className="card form-step">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fas fa-file-alt"></i>
                    تفاصيل البحث
                  </h2>
                  <p style={{ margin: 'var(--spacing-sm) 0 0 0', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    أدخل تفاصيل البحث الذي تريد تقديمه
                  </p>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="title" className="form-label required">
                      <i className="fas fa-heading" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                      عنوان البحث
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="form-input"
                      value={formData.title}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="أدخل عنوان البحث الكامل"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
                    <div className="form-group">
                      <label htmlFor="research_type" className="form-label required">
                        <i className="fas fa-microscope" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                        نوع البحث
                      </label>
                      <select
                        id="research_type"
                        name="research_type"
                        className="form-select"
                        value={formData.research_type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">اختر نوع البحث</option>
                        <option value="بحث علمي">بحث علمي</option>
                        <option value="كتاب">كتاب</option>
                        <option value="رسالة علمية">رسالة علمية</option>
                        <option value="مقال">مقال</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="category" className="form-label required">
                        <i className="fas fa-folder" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                        الفئة
                      </label>
                      <select
                        id="category"
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">اختر الفئة</option>
                        {RESEARCH_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="main_researcher" className="form-label">
                      <i className="fas fa-user-graduate" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                      الباحث الرئيسي
                    </label>
                    <input
                      type="text"
                      id="main_researcher"
                      name="main_researcher"
                      className="form-input"
                      value={formData.main_researcher}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="اسم الباحث الرئيسي (اختياري)"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description" className="form-label">
                      <i className="fas fa-align-right" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                      وصف البحث
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-textarea"
                      rows={6}
                      value={formData.description}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="أدخل وصفاً مختصراً عن البحث..."
                    />
                    <small className="form-help-text">
                      <i className="fas fa-info-circle" style={{ marginLeft: '0.25rem' }}></i>
                      اكتب وصفاً مختصراً عن البحث وأهدافه الرئيسية
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: File Upload */}
            {currentStep === 3 && (
              <div className="card form-step">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fas fa-cloud-upload-alt"></i>
                    رفع الملف
                  </h2>
                  <p style={{ margin: 'var(--spacing-sm) 0 0 0', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    ارفع ملف البحث بصيغة PDF أو Word
                  </p>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="file" className="form-label required" style={{ display: 'block', marginBottom: 'var(--spacing-md)' }}>
                      <i className="fas fa-file" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}></i>
                      ملف البحث
                    </label>
                    <div
                      style={{
                        border: '2px dashed var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-2xl)',
                        textAlign: 'center',
                        background: fileUrl ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.02))' : 'var(--bg-secondary)',
                        borderColor: fileUrl ? 'var(--success-color)' : 'var(--border-color)',
                        transition: 'all var(--transition-base)',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                      onClick={() => document.getElementById('file')?.click()}
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDrop={(e) => { e.preventDefault(); }}
                    >
                      <input
                        type="file"
                        id="file"
                        name="file"
                        className="form-input"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        required={!fileUrl}
                        style={{ display: 'none' }}
                      />
                      {fileUrl ? (
                        <div>
                          <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: 'var(--success-color)', marginBottom: 'var(--spacing-md)' }}></i>
                          <p style={{ margin: 0, fontWeight: 600, color: 'var(--success-color)' }}>تم رفع الملف بنجاح</p>
                          <p style={{ margin: 'var(--spacing-sm) 0 0 0', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                            {formData.file?.name || 'الملف المرفوع'}
                          </p>
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ marginTop: 'var(--spacing-md)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFileUrl(null);
                              setFileName(null);
                              setFileSize(null);
                              setFormData(prev => ({ ...prev, file: null }));
                              const input = document.getElementById('file') as HTMLInputElement;
                              if (input) input.value = '';
                            }}
                          >
                            <i className="fas fa-times"></i>
                            إزالة الملف
                          </button>
                        </div>
                      ) : (
                        <div>
                          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}></i>
                          <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>انقر أو اسحب الملف هنا</p>
                          <p style={{ margin: 'var(--spacing-sm) 0 0 0', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                            PDF أو Word (حد أقصى 10 ميجابايت)
                          </p>
                        </div>
                      )}
                    </div>
                    <small className="form-help-text" style={{ marginTop: 'var(--spacing-sm)', display: 'block' }}>
                      <i className="fas fa-info-circle" style={{ marginLeft: '0.25rem' }}></i>
                      الحجم الأقصى: 10 ميجابايت | الصيغ المدعومة: PDF, DOC, DOCX
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="card form-step">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fas fa-check-circle"></i>
                    المراجعة والإرسال
                  </h2>
                  <p style={{ margin: 'var(--spacing-sm) 0 0 0', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    راجع المعلومات قبل إرسال البحث
                  </p>
                </div>
                <div className="card-body">
                  <div className="review-section" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)', color: 'var(--primary-color)' }}>
                      <i className="fas fa-user-circle"></i>
                      المعلومات الأساسية
                    </h4>
                    <div className="details-grid">
                      <div className="detail-item">
                        <label>نوع مقدم البحث:</label>
                        <span style={{ fontWeight: 600 }}>{formData.submitter_type}</span>
                      </div>
                      {formData.submitter_type === 'فرد' ? (
                        <>
                          <div className="detail-item">
                            <label>الاسم:</label>
                            <span style={{ fontWeight: 600 }}>{formData.full_name}</span>
                          </div>
                          <div className="detail-item">
                            <label>البريد:</label>
                            <span style={{ fontWeight: 600 }}>{formData.email}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="detail-item">
                            <label>اسم الجهة:</label>
                            <span style={{ fontWeight: 600 }}>{formData.organization_name}</span>
                          </div>
                          <div className="detail-item">
                            <label>نوع الجهة:</label>
                            <span style={{ fontWeight: 600 }}>{formData.organization_type}</span>
                          </div>
                          <div className="detail-item">
                            <label>البريد:</label>
                            <span style={{ fontWeight: 600 }}>{formData.email}</span>
                          </div>
                        </>
                      )}
                      <div className="detail-item">
                        <label>الدولة:</label>
                        <span style={{ fontWeight: 600 }}>{formData.country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="review-section" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)', color: 'var(--primary-color)' }}>
                      <i className="fas fa-file-alt"></i>
                      تفاصيل البحث
                    </h4>
                    <div className="details-grid">
                      <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                        <label>العنوان:</label>
                        <span style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>{formData.title}</span>
                      </div>
                      <div className="detail-item">
                        <label>النوع:</label>
                        <span style={{ fontWeight: 600 }}>{formData.research_type}</span>
                      </div>
                      <div className="detail-item">
                        <label>الفئة:</label>
                        <span style={{ fontWeight: 600 }}>{formData.category}</span>
                      </div>
                      {formData.main_researcher && (
                        <div className="detail-item">
                          <label>الباحث الرئيسي:</label>
                          <span style={{ fontWeight: 600 }}>{formData.main_researcher}</span>
                        </div>
                      )}
                      {formData.description && (
                        <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                          <label>الوصف:</label>
                          <div style={{ marginTop: 'var(--spacing-sm)', padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                            <p style={{ margin: 0, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{formData.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="review-section">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)', color: 'var(--primary-color)' }}>
                      <i className="fas fa-cloud-upload-alt"></i>
                      الملف
                    </h4>
                    {fileUrl ? (
                      <div style={{ padding: 'var(--spacing-lg)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))', borderRadius: 'var(--radius-lg)', border: '2px solid rgba(16, 185, 129, 0.3)' }}>
                        <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--success-color)', fontWeight: 600 }}>
                          <i className="fas fa-check-circle"></i>
                          تم رفع الملف بنجاح
                        </p>
                        <p style={{ margin: 'var(--spacing-sm) 0 0 0', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                          {fileName || formData.file?.name || 'الملف المرفوع'}
                        </p>
                      </div>
                    ) : (
                      <div style={{ padding: 'var(--spacing-lg)', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))', borderRadius: 'var(--radius-lg)', border: '2px solid rgba(239, 68, 68, 0.3)' }}>
                        <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--error-color)', fontWeight: 600 }}>
                          <i className="fas fa-exclamation-circle"></i>
                          لم يتم رفع ملف - يجب رفع الملف قبل الإرسال
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Declaration Section */}
                  <div className="review-section" style={{ marginTop: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '2px solid var(--border-color)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', color: 'var(--primary-color)' }}>
                      <i className="fas fa-file-contract"></i>
                      التعهد والموافقة
                    </h4>
                    <div style={{ 
                      padding: 'var(--spacing-md)', 
                      background: 'var(--bg-primary)', 
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--spacing-md)',
                      border: '1px solid var(--border-color)',
                      lineHeight: 1.8,
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-primary)'
                    }}>
                      {(formData.submitter_type === 'فرد') ? (
                        <p style={{ margin: 0, textAlign: 'right' }}>
                          أتعهد بأن جميع البيانات والمعلومات المقدمة ضمن هذا الطلب/العمل صحيحة ودقيقة، وأن المحتوى مستخدم لغرض مشروع ومتوافق مع الأنظمة والتعليمات. كما أقرّ بأنني أتحمل المسؤولية الكاملة عن أي استخدام غير نظامي أو مخالف، دون تضمين أي ادعاء بملكية بحث أو مادة علمية ما لم يُذكر ذلك بشكل مستقل وواضح.
                        </p>
                      ) : (
                        <p style={{ margin: 0, textAlign: 'right' }}>
                          نقرّ بأن جميع البيانات والمعلومات المقدمة ضمن هذا الطلب/العمل صحيحة وتمثل الجهة مقدمة الطلب، كما نلتزم باستخدام المحتوى فيما يتوافق مع سياسات الجهة والأنظمة ذات العلاقة. {formData.main_researcher && `ونقرّ بأن هذا البحث ملك ل${formData.main_researcher}.`} ولا يُعتبر هذا التعهّد إثباتًا لملكية بحث أو مادة علمية لأي فرد أو جهة إلا إذا تم إرفاق ما يثبت ذلك بشكل مستقل. ونقرّ بتحمل المسؤولية الكاملة عن أي استخدام مخالف.
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
                      <input
                        type="checkbox"
                        id="declaration"
                        name="declaration"
                        checked={declarationAccepted}
                        onChange={(e) => setDeclarationAccepted(e.target.checked)}
                        required
                        style={{ 
                          marginTop: '0.25rem',
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: 'var(--primary-color)'
                        }}
                      />
                      <label htmlFor="declaration" style={{ 
                        cursor: 'pointer',
                        userSelect: 'none',
                        fontSize: 'var(--font-size-sm)',
                        color: declarationAccepted ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: declarationAccepted ? 600 : 400,
                        lineHeight: 1.6
                      }}>
                        {(formData.submitter_type === 'فرد') ? (
                          <>أقرّ وأوافق على التعهد أعلاه وأتحمل المسؤولية الكاملة عن صحة البيانات والمعلومات المقدمة</>
                        ) : (
                          <>نقرّ ونوافق على التعهد أعلاه ونتحمل المسؤولية الكاملة عن صحة البيانات والمعلومات المقدمة</>
                        )}
                      </label>
                    </div>
                    {error && !declarationAccepted && currentStep === 4 && (
                      <p style={{ 
                        marginTop: 'var(--spacing-sm)', 
                        color: 'var(--error-color)', 
                        fontSize: 'var(--font-size-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)'
                      }}>
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-md)', padding: 'var(--spacing-xl)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', marginTop: 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                {currentStep > 1 && (
                  <button type="button" className="btn btn-outline" onClick={handlePrevious} style={{ minWidth: '120px' }}>
                    <i className="fas fa-arrow-right"></i>
                    السابق
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginRight: 'auto' }}>
                {currentStep < 4 && (
                  <button type="button" className="btn btn-primary" onClick={handleNext} style={{ minWidth: '120px' }}>
                    التالي
                    <i className="fas fa-arrow-left"></i>
                  </button>
                )}
                {currentStep === 4 && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      onClick={handleSaveDraft} 
                      disabled={isSubmitting || loadingDraft} 
                      style={{ 
                        minWidth: '140px',
                        cursor: (isSubmitting || loadingDraft) ? 'not-allowed !important' : 'pointer !important',
                        pointerEvents: (isSubmitting || loadingDraft) ? 'none' : 'auto'
                      }}
                    >
                      <i className="fas fa-save"></i>
                      {loadingDraft ? 'جاري الحفظ...' : 'حفظ مسودة'}
                    </button>
                    <button 
                      type="button"
                      className="btn btn-primary" 
                      disabled={isSubmitting || !fileUrl || !declarationAccepted} 
                      style={{ 
                        minWidth: '160px',
                        opacity: (isSubmitting || !fileUrl || !declarationAccepted) ? 0.6 : 1,
                        cursor: (isSubmitting || !fileUrl || !declarationAccepted) ? 'not-allowed !important' : 'pointer !important',
                        pointerEvents: (isSubmitting || !fileUrl || !declarationAccepted) ? 'none' : 'auto'
                      }}
                      onMouseEnter={(e) => {
                        // التأكد من أن الـ cursor صحيح عند hover
                        const isDisabled = isSubmitting || !fileUrl || !declarationAccepted;
                        if (isDisabled) {
                          e.currentTarget.style.setProperty('cursor', 'not-allowed', 'important');
                        } else {
                          e.currentTarget.style.setProperty('cursor', 'pointer', 'important');
                        }
                      }}
                      onMouseLeave={(e) => {
                        // إعادة تعيين الـ cursor عند مغادرة الزر
                        const isDisabled = isSubmitting || !fileUrl || !declarationAccepted;
                        if (isDisabled) {
                          e.currentTarget.style.setProperty('cursor', 'not-allowed', 'important');
                        } else {
                          e.currentTarget.style.setProperty('cursor', 'pointer', 'important');
                        }
                      }}
                      title={!fileUrl ? 'يجب رفع الملف أولاً' : !declarationAccepted ? 'يجب الموافقة على التعهد أولاً' : isSubmitting ? 'جاري الإرسال...' : 'إرسال البحث'}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // منع النقر إذا كان الزر معطلاً
                        if (isSubmitting || !fileUrl || !declarationAccepted) {
                          return;
                        }
                        
                        if (isSubmitting) {
                          console.log('الإرسال قيد التنفيذ بالفعل');
                          return;
                        }
                        
                        if (!fileUrl) {
                          setError('يجب رفع الملف قبل الإرسال');
                          return;
                        }
                        
                        if (!declarationAccepted) {
                          setError('يجب الموافقة على التعهد قبل الإرسال');
                          return;
                        }
                        
                        // استدعاء handleSubmit مباشرة
                        const fakeEvent = {
                          preventDefault: () => {},
                          stopPropagation: () => {},
                        } as FormEvent<HTMLFormElement>;
                        
                        handleSubmit(fakeEvent);
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i>
                          إرسال البحث
                        </>
                      )}
                    </button>
                    {isSubmitting && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitting(false);
                          // إعادة تحميل الصفحة لإعادة تعيين جميع الحالات
                          window.location.reload();
                        }}
                        className="btn btn-outline"
                        style={{
                          marginTop: 'var(--spacing-sm)',
                          fontSize: 'var(--font-size-sm)',
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: 'var(--error-color)',
                          borderColor: 'var(--error-color)'
                        }}
                      >
                        <i className="fas fa-times-circle"></i>
                        إيقاف الإرسال وإعادة التحميل
                      </button>
                    )}
                    {(!fileUrl || !declarationAccepted) && !isSubmitting && (
                      <div style={{ 
                        marginTop: 'var(--spacing-sm)', 
                        padding: 'var(--spacing-sm)', 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--error-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                        width: '100%',
                        marginRight: 'var(--spacing-md)'
                      }}>
                        <i className="fas fa-exclamation-circle"></i>
                        {!fileUrl && !declarationAccepted ? 'يجب رفع الملف والموافقة على التعهد أولاً' : !fileUrl ? 'يجب رفع الملف أولاً' : 'يجب الموافقة على التعهد أولاً'}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={
      <div className="dashboard-page">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>جاري التحميل...</p>
        </div>
      </div>
    }>
      <SubmitPageContent />
    </Suspense>
  );
}

