/**
 * Research Submission Form JavaScript
 */

import submissionsStore from '../stores/submissionsStore.js';
import authStore from '../stores/authStore.js';
import { requireResearcher } from '../utils/auth-guard.js';
import { handleLogout } from '../utils/logout.js';

// Form state
let currentStep = 1;
let formData = {};
let uploadedFile = null;

// DOM Elements
let form, steps, formSteps;
let prevBtn, nextBtn, submitBtn, saveDraftBtn;
let alertContainer;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireResearcher();
    if (!user) return;
    
    initElements();
    initEventListeners();
    
    // Pre-fill user data before loading draft
    await prefillUserData(user);
    
    // Load draft after prefilling (draft will override prefilled data if exists)
    loadDraftIfExists();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    form = document.getElementById('submission-form');
    steps = document.querySelectorAll('.progress-steps .step');
    formSteps = document.querySelectorAll('.form-step');
    
    prevBtn = document.getElementById('prev-btn');
    nextBtn = document.getElementById('next-btn');
    submitBtn = document.getElementById('submit-btn');
    saveDraftBtn = document.getElementById('save-draft-btn');
    
    alertContainer = document.getElementById('alert-container');
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Navigation buttons
    prevBtn.addEventListener('click', goToPreviousStep);
    nextBtn.addEventListener('click', goToNextStep);
    saveDraftBtn.addEventListener('click', saveDraft);
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // File upload
    const fileInput = document.getElementById('research_file');
    const uploadArea = document.getElementById('file-upload-area');
    
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect({ target: fileInput });
        }
    });
    
    // Auto-save on input change
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('change', () => {
            saveFormData();
        });
    });
    
    // Handle category change to show/hide other category field
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        categorySelect.addEventListener('change', handleCategoryChange);
        // Initialize on load
        handleCategoryChange();
    }
    
    // Handle research owner type change to show/hide business type field
    const researchOwnerTypeSelect = document.getElementById('research_owner_type');
    if (researchOwnerTypeSelect) {
        researchOwnerTypeSelect.addEventListener('change', handleResearchOwnerTypeChange);
        // Initialize on load
        handleResearchOwnerTypeChange();
    }
}

/**
 * Go to next step
 */
function goToNextStep() {
    if (validateCurrentStep()) {
        saveFormData();
        
        if (currentStep < 4) {
            currentStep++;
            updateStepDisplay();
        }
    }
}

/**
 * Go to previous step
 */
function goToPreviousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

/**
 * Update step display
 */
function updateStepDisplay() {
    // Update progress steps
    steps.forEach((step, index) => {
        if (index + 1 < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Update form steps
    formSteps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update navigation buttons
    prevBtn.style.display = currentStep > 1 ? 'flex' : 'none';
    nextBtn.style.display = currentStep < 4 ? 'flex' : 'none';
    submitBtn.style.display = currentStep === 4 ? 'flex' : 'none';
    
    // Update review content on step 4
    if (currentStep === 4) {
        updateReviewContent();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Handle category change
 */
function handleCategoryChange() {
    const categorySelect = document.getElementById('category');
    const otherCategoryGroup = document.getElementById('other-category-group');
    const otherCategoryInput = document.getElementById('other_category');
    
    if (!categorySelect || !otherCategoryGroup || !otherCategoryInput) return;
    
    if (categorySelect.value === 'أخرى') {
        otherCategoryGroup.style.display = 'block';
        otherCategoryInput.setAttribute('required', 'required');
        // Clear category value so we can use other_category instead
        categorySelect.removeAttribute('required');
    } else {
        otherCategoryGroup.style.display = 'none';
        otherCategoryInput.removeAttribute('required');
        otherCategoryInput.value = '';
        categorySelect.setAttribute('required', 'required');
    }
}

/**
 * Handle research owner type change
 */
function handleResearchOwnerTypeChange() {
    const researchOwnerTypeSelect = document.getElementById('research_owner_type');
    const businessTypeGroup = document.getElementById('business-type-group');
    const businessTypeSelect = document.getElementById('business_type');
    
    if (!researchOwnerTypeSelect || !businessTypeGroup || !businessTypeSelect) return;
    
    if (researchOwnerTypeSelect.value === 'أعمال') {
        businessTypeGroup.style.display = 'block';
        businessTypeSelect.setAttribute('required', 'required');
    } else {
        businessTypeGroup.style.display = 'none';
        businessTypeSelect.removeAttribute('required');
        businessTypeSelect.value = '';
    }
}

/**
 * Validate current step
 */
function validateCurrentStep() {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const requiredInputs = currentFormStep.querySelectorAll('[required]');
    
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'هذا الحقل مطلوب');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    // Special validation: if category is "أخرى", other_category must be filled
    const categorySelect = document.getElementById('category');
    const otherCategoryInput = document.getElementById('other_category');
    if (categorySelect && categorySelect.value === 'أخرى') {
        if (!otherCategoryInput || !otherCategoryInput.value.trim()) {
            showFieldError(otherCategoryInput, 'يرجى تحديد المجال الآخر');
            isValid = false;
        }
    }
    
    // Special validation: if research_owner_type is "أعمال", business_type must be filled
    const researchOwnerTypeSelect = document.getElementById('research_owner_type');
    const businessTypeSelect = document.getElementById('business_type');
    if (researchOwnerTypeSelect && researchOwnerTypeSelect.value === 'أعمال') {
        if (!businessTypeSelect || !businessTypeSelect.value.trim()) {
            showFieldError(businessTypeSelect, 'يرجى تحديد نوع الأعمال');
            isValid = false;
        }
    }
    
    // Special validation for file upload on step 3
    if (currentStep === 3 && !uploadedFile) {
        showAlert('يرجى رفع ملف البحث', 'error');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Save form data to state
 */
function saveFormData() {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        } else if (input.type !== 'file') {
            formData[input.name] = input.value;
        }
    });
}

/**
 * Handle file selection
 */
function handleFileSelect(e) {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(file.type)) {
        showAlert('نوع الملف غير مدعوم. يرجى رفع ملف PDF أو DOCX', 'error');
        return;
    }
    
    // Validate file size (200MB)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
        showAlert('حجم الملف كبير جداً. الحد الأقصى 200MB', 'error');
        return;
    }
    
    uploadedFile = file;
    
    // Show file preview
    const preview = document.getElementById('file-preview');
    const uploadArea = document.getElementById('file-upload-area');
    
    preview.style.display = 'block';
    uploadArea.style.display = 'none';
    
    // Update file info
    const fileName = preview.querySelector('.file-name');
    const fileSize = preview.querySelector('.file-size');
    
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
}

/**
 * Remove uploaded file
 */
window.removeFile = function() {
    uploadedFile = null;
    document.getElementById('research_file').value = '';
    document.getElementById('file-preview').style.display = 'none';
    document.getElementById('file-upload-area').style.display = 'block';
};

/**
 * Update review content
 */
function updateReviewContent() {
    saveFormData();
    
    const reviewContent = document.getElementById('review-content');
    const declarationName = document.getElementById('declaration-name');
    
    // Set declaration name
    declarationName.textContent = formData.full_name || '[الاسم]';
    
    // Build review HTML
    reviewContent.innerHTML = `
        <div class="review-section">
            <h4>المعلومات الأساسية</h4>
            <div class="review-item">
                <span class="review-label">الاسم الكامل:</span>
                <span class="review-value">${formData.full_name || '-'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">البريد الإلكتروني:</span>
                <span class="review-value">${formData.email || '-'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">الدولة:</span>
                <span class="review-value">${formData.country || '-'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">الجنس:</span>
                <span class="review-value">${formData.gender || '-'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">رقم الهوية:</span>
                <span class="review-value">${formData.id_number || '-'}</span>
            </div>
        </div>
        
        <div class="review-section">
            <h4>تفاصيل البحث</h4>
            <div class="review-item">
                <span class="review-label">نوع البحث:</span>
                <span class="review-value">${getResearchTypeLabel(formData.research_type)}</span>
            </div>
            <div class="review-item">
                <span class="review-label">تصنيف البحث:</span>
                <span class="review-value">${formData.category === 'أخرى' ? (formData.other_category || '-') : (formData.category || '-')}</span>
            </div>
            <div class="review-item">
                <span class="review-label">مالك البحث:</span>
                <span class="review-value">${formData.research_owner_type || '-'}</span>
            </div>
            ${formData.research_owner_type === 'أعمال' ? `
            <div class="review-item">
                <span class="review-label">نوع الأعمال:</span>
                <span class="review-value">${formData.business_type || '-'}</span>
            </div>
            ` : ''}
            <div class="review-item">
                <span class="review-label">اسم الباحث الرئيسي:</span>
                <span class="review-value">${formData.main_researcher || '-'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">التخصص العام:</span>
                <span class="review-value">${formData.general_specialization || '-'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">التخصص الدقيق:</span>
                <span class="review-value">${formData.detailed_specialization || '-'}</span>
            </div>
        </div>
        
        <div class="review-section">
            <h4>الملف المرفق</h4>
            <div class="review-item">
                <span class="review-label">اسم الملف:</span>
                <span class="review-value">${uploadedFile ? uploadedFile.name : '-'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">حجم الملف:</span>
                <span class="review-value">${uploadedFile ? formatFileSize(uploadedFile.size) : '-'}</span>
            </div>
        </div>
    `;
}

/**
 * Handle form submission
 */
async function handleSubmit(e) {
    e.preventDefault();
    
    saveFormData();
    
    // Validate declaration
    if (!formData.declaration_accepted) {
        showAlert('يجب الموافقة على إقرار الدقة', 'error');
        return;
    }
    
    // Show loading
    setLoading(true);
    
    try {
        // Validate file is uploaded
        if (!uploadedFile) {
            showAlert('يجب رفع ملف البحث', 'error');
            setLoading(false);
            return;
        }

        // Upload file first
        let fileUrl = null;
        const uploadResult = await submissionsStore.uploadFileBeforeSubmission(uploadedFile);
        if (uploadResult.success && uploadResult.url) {
            fileUrl = uploadResult.url;
        } else {
            throw new Error(uploadResult.error || 'فشل رفع الملف');
        }
        
        // Validate that fileUrl is not null before proceeding
        if (!fileUrl) {
            throw new Error('فشل الحصول على رابط الملف. يرجى المحاولة مرة أخرى');
        }
        
        // Prepare submission data
        // If category is "أخرى", use other_category value instead
        const categoryValue = formData.category === 'أخرى' 
            ? (formData.other_category || 'أخرى')
            : formData.category;
        
        const submissionData = {
            full_name: formData.full_name,
            country: formData.country,
            email: formData.email,
            gender: formData.gender,
            id_number: formData.id_number,
            research_type: formData.research_type,
            category: categoryValue,
            research_owner_type: formData.research_owner_type,
            business_type: formData.research_owner_type === 'أعمال' ? formData.business_type : null,
            main_researcher: formData.main_researcher,
            general_specialization: formData.general_specialization,
            detailed_specialization: formData.detailed_specialization,
            file_url: fileUrl,
            file_name: uploadedFile ? uploadedFile.name : null,
            file_size: uploadedFile ? uploadedFile.size : null,
            declaration_accepted: true,
            declaration_timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        // Create submission
        const result = await submissionsStore.createSubmission(submissionData);
        
        if (result.success) {
            showAlert('تم تقديم البحث بنجاح! رقم المرجع: ' + result.data.reference_number, 'success');
            
            // Clear draft
            localStorage.removeItem('submission_draft');
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = '/pages/researcher/dashboard.html';
            }, 2000);
        } else {
            throw new Error(result.error || 'فشل تقديم البحث');
        }
    } catch (error) {
        console.error('Submission error:', error);
        showAlert(error.message || 'حدث خطأ أثناء تقديم البحث', 'error');
    } finally {
        setLoading(false);
    }
}

/**
 * Save as draft
 */
async function saveDraft() {
    saveFormData();
    
    try {
        // Save to local storage
        const draft = {
            formData,
            currentStep,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('submission_draft', JSON.stringify(draft));
        
        showAlert('تم حفظ المسودة بنجاح', 'success');
    } catch (error) {
        console.error('Save draft error:', error);
        showAlert('فشل حفظ المسودة', 'error');
    }
}

/**
 * Load draft if exists
 */
function loadDraftIfExists() {
    try {
        const draftStr = localStorage.getItem('submission_draft');
        if (draftStr) {
            const draft = JSON.parse(draftStr);
            
            // Ask user if they want to restore
            if (confirm('هل تريد استعادة المسودة المحفوظة؟')) {
                formData = draft.formData;
                currentStep = draft.currentStep || 1;
                
                // Fill form fields
                Object.keys(formData).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = formData[key];
                        } else {
                            input.value = formData[key];
                        }
                    }
                });
                
                // Handle category change after loading draft
                // Use setTimeout to ensure DOM is ready
                setTimeout(() => {
                    handleCategoryChange();
                    handleResearchOwnerTypeChange();
                }, 0);
                
                updateStepDisplay();
            }
        }
    } catch (error) {
        console.error('Load draft error:', error);
    }
}

/**
 * Pre-fill form with user data from profile
 */
async function prefillUserData(user) {
    try {
        // Get current user data from authStore
        const currentUser = await authStore.getCurrentUser();
        
        if (!currentUser) {
            console.log('No user data available for prefilling');
            return;
        }
        
        // Pre-fill basic information fields
        const fullNameInput = document.getElementById('full_name');
        const emailInput = document.getElementById('email');
        const idNumberInput = document.getElementById('id_number');
        const genderInput = document.getElementById('gender');
        const countryInput = document.getElementById('country');
        
        // Fill username/full_name
        if (fullNameInput && currentUser.username && !fullNameInput.value) {
            fullNameInput.value = currentUser.username;
            formData.full_name = currentUser.username;
        }
        
        // Fill email
        if (emailInput && currentUser.email && !emailInput.value) {
            emailInput.value = currentUser.email;
            formData.email = currentUser.email;
        }
        
        // Fill national_id
        if (idNumberInput && currentUser.national_id && !idNumberInput.value) {
            idNumberInput.value = currentUser.national_id;
            formData.id_number = currentUser.national_id;
        }
        
        // Fill gender if available
        if (genderInput && currentUser.gender && !genderInput.value) {
            genderInput.value = currentUser.gender;
            formData.gender = currentUser.gender;
        }
        
        // Fill country if available
        if (countryInput && currentUser.country && !countryInput.value) {
            countryInput.value = currentUser.country;
            formData.country = currentUser.country;
        }
        
        console.log('User data prefilled successfully');
    } catch (error) {
        console.error('Error prefilling user data:', error);
        // Don't show error to user, just log it
        // The form will remain empty and user can fill it manually
    }
}

/**
 * Helper functions
 */

function showFieldError(input, message) {
    input.classList.add('error');
    
    const container = input.closest('.form-group');
    let errorDiv = container.querySelector('.form-error');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        container.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
}

function clearFieldError(input) {
    input.classList.remove('error');
    const container = input.closest('.form-group');
    const errorDiv = container.querySelector('.form-error');
    if (errorDiv) errorDiv.remove();
}

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        <span>${message}</span>
    `;
    alertContainer.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => alert.remove(), 5000);
}

function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function setLoading(loading) {
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
            <span>جاري الإرسال...</span>
        `;
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <i class="fas fa-paper-plane"></i>
            <span>إرسال الطلب</span>
        `;
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getResearchTypeLabel(type) {
    const labels = {
        'scientific_paper': 'ورقة علمية',
        'masters_thesis': 'رسالة ماجستير',
        'phd_dissertation': 'أطروحة دكتوراه',
        'book': 'كتاب'
    };
    return labels[type] || type;
}

