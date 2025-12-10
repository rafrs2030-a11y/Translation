'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmissions } from '@/contexts/SubmissionsContext';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { createClient } from '@/lib/supabase/client';

export default function SubmitPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { createSubmission, loading, saveDraft } = useSubmissions();
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      await saveDraft({
        ...formData,
        file_url: fileUrl,
        is_draft: true,
      });
      setSuccess('تم حفظ المسودة بنجاح');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('فشل حفظ المسودة: ' + err.message);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateStep(4)) return;

    try {
      const result = await createSubmission({
        title: formData.title,
        research_type: formData.research_type,
        category: formData.category,
        description: formData.description,
        file_url: fileUrl,
        submitter_type: formData.submitter_type,
        full_name: formData.full_name,
        email: formData.email,
        organization_name: formData.organization_name,
        organization_type: formData.organization_type,
        main_researcher: formData.main_researcher,
        country: formData.country,
        status: 'pending',
        is_draft: false,
      });

      if (result.success) {
        setSuccess('تم تقديم البحث بنجاح!');
        setTimeout(() => {
          router.push('/researcher/submissions');
        }, 2000);
      } else {
        setError(result.error || 'فشل تقديم البحث');
      }
    } catch (err: any) {
      setError('حدث خطأ: ' + err.message);
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
          <div className="page-header">
            <div>
              <h1>تقديم بحث جديد</h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                املأ جميع الحقول المطلوبة لتقديم بحثك للمراجعة
              </p>
            </div>
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
          <form onSubmit={handleSubmit} className="multi-step-form">
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
                      list="countries-list"
                      placeholder="اختر أو اكتب اسم الدولة"
                      required
                    />
                    <datalist id="countries-list">
                      <option value="المملكة العربية السعودية" />
                      <option value="الإمارات العربية المتحدة" />
                      <option value="مصر" />
                      <option value="الأردن" />
                      <option value="لبنان" />
                      <option value="العراق" />
                      <option value="سوريا" />
                      <option value="المغرب" />
                      <option value="الجزائر" />
                      <option value="تونس" />
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
                        <option value="علوم طبيعية">علوم طبيعية</option>
                        <option value="علوم إنسانية">علوم إنسانية</option>
                        <option value="علوم اجتماعية">علوم اجتماعية</option>
                        <option value="هندسة">هندسة</option>
                        <option value="طب">طب</option>
                        <option value="أخرى">أخرى</option>
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
                          {formData.file?.name || 'الملف المرفوع'}
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
                    <button type="button" className="btn btn-outline" onClick={handleSaveDraft} disabled={loading} style={{ minWidth: '140px' }}>
                      <i className="fas fa-save"></i>
                      حفظ مسودة
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading || !fileUrl} style={{ minWidth: '160px' }}>
                      {loading ? (
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

