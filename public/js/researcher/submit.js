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
    // Clear old cache on page load
    clearOldCache();
    
    const user = await requireResearcher();
    if (!user) return;
    
    initElements();
    initEventListeners();
    
    // Pre-fill user data before loading draft
    await prefillUserData(user);
    
    // Load draft after prefilling (draft will override prefilled data if exists)
    loadDraftIfExists();
    
    // Ensure submitter type fields are shown/hidden correctly after all data is loaded
    setTimeout(() => {
        handleSubmitterTypeChange();
    }, 200);
});

/**
 * Clear old cache and localStorage data
 */
function clearOldCache() {
    try {
        console.log('Starting cache cleanup for submission page...');
        
        // Clear all submission drafts
        const draftKeys = Object.keys(localStorage).filter(key => 
            key.includes('submission_draft') || 
            key.includes('draft') ||
            key.includes('submission')
        );
        draftKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log('Removed draft key:', key);
        });
        
        // Clear any cached form data that might be stale
        const formCacheKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('form_cache_') || 
            key.startsWith('submission_cache_') ||
            key.includes('form_cache') ||
            key.includes('submission_cache')
        );
        formCacheKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log('Removed form cache key:', key);
        });
        
        // DO NOT clear Supabase auth tokens - this would log the user out!
        // Only clear non-auth related Supabase cache if needed
        // Supabase auth tokens are critical for maintaining the session
        
        // Clear sessionStorage completely (but keep auth tokens safe)
        try {
            // Get all sessionStorage keys
            const sessionKeys = Object.keys(sessionStorage);
            // Only clear non-auth related keys
            sessionKeys.forEach(key => {
                // Don't clear auth-related keys
                if (!key.includes('auth') && !key.startsWith('sb-')) {
                    sessionStorage.removeItem(key);
                    console.log('Removed sessionStorage key:', key);
                }
            });
            console.log('SessionStorage cleared (auth keys preserved)');
        } catch (e) {
            console.warn('Could not clear sessionStorage:', e);
        }
        
        // Clear browser cache for this page
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    if (name.includes('submit') || name.includes('submission') || name.includes('form')) {
                        caches.delete(name).then(() => {
                            console.log('Deleted cache:', name);
                        });
                    }
                });
            });
        }
        
        const totalCleared = draftKeys.length + formCacheKeys.length;
        if (totalCleared > 0) {
            console.log(`✅ Cleared ${totalCleared} cache entries total (auth tokens preserved)`);
        } else {
            console.log('✅ No cache entries found to clear');
        }
        
        // Force reload CSS/JS files by adding cache busting
        const timestamp = Date.now();
        
        // Reload CSS files
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
            if (link.href.includes('forms.css') || link.href.includes('dashboard.css') || link.href.includes('main.css')) {
                try {
                    const url = new URL(link.href);
                    url.searchParams.set('v', timestamp);
                    link.href = url.toString();
                    console.log('Updated CSS cache bust:', link.href);
                } catch (e) {
                    console.warn('Could not update CSS URL:', e);
                }
            }
        });
        
        console.log('Cache cleanup completed for submission page');
        
    } catch (error) {
        console.error('Error clearing cache:', error);
        // Try to clear at least the basic localStorage (but preserve auth tokens)
        try {
            const allKeys = Object.keys(localStorage);
            allKeys.forEach(key => {
                // Only clear submission/draft/form related keys, NOT auth tokens
                if ((key.includes('submission') || key.includes('draft') || key.includes('form')) 
                    && !key.includes('auth') && !key.startsWith('sb-')) {
                    localStorage.removeItem(key);
                }
            });
            // Clear sessionStorage but preserve auth keys
            const sessionKeys = Object.keys(sessionStorage);
            sessionKeys.forEach(key => {
                if (!key.includes('auth') && !key.startsWith('sb-')) {
                    sessionStorage.removeItem(key);
                }
            });
            console.log('Emergency cache clear completed (auth tokens preserved)');
        } catch (e) {
            console.error('Could not perform emergency cache clear:', e);
        }
    }
}

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
            // Update declaration text if we're on review step and relevant fields changed
            if (currentStep === 4) {
                const relevantFields = ['submitter_type', 'full_name', 'organization_name', 'main_researcher'];
                if (relevantFields.includes(input.id) || relevantFields.includes(input.name)) {
                    updateReviewContent();
                }
            }
        });
    });
    
    // Handle category change to show/hide other category field
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        categorySelect.addEventListener('change', handleCategoryChange);
        // Initialize on load
        handleCategoryChange();
    }
    
    // Handle submitter type change to show/hide fields
    const submitterTypeSelect = document.getElementById('submitter_type');
    if (submitterTypeSelect) {
        submitterTypeSelect.addEventListener('change', handleSubmitterTypeChange);
        // Initialize on load - use setTimeout to ensure DOM is ready
        setTimeout(() => {
            handleSubmitterTypeChange();
        }, 150);
        // Also trigger after a longer delay to ensure all elements are ready
        setTimeout(() => {
            handleSubmitterTypeChange();
        }, 500);
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
 * Handle submitter type change
 */
function handleSubmitterTypeChange() {
    const submitterTypeSelect = document.getElementById('submitter_type');
    if (!submitterTypeSelect) {
        console.warn('submitter_type element not found');
        return;
    }
    
    const individualFields = document.getElementById('individual-fields');
    const organizationFields = document.getElementById('organization-fields');
    const genderField = document.getElementById('gender-field');
    const idNumberField = document.getElementById('id-number-field');
    const fullNameInput = document.getElementById('full_name');
    const emailInput = document.getElementById('email');
    const emailOrgInput = document.getElementById('email_org');
    
    const submitterType = submitterTypeSelect.value;
    
    console.log('Submitter type changed to:', submitterType);
    console.log('Organization fields element:', organizationFields);
    
    if (submitterType === 'فرد') {
        // Show individual fields
        if (individualFields) {
            individualFields.style.display = 'block';
            console.log('Showing individual fields');
        }
        if (organizationFields) {
            organizationFields.style.display = 'none';
        }
        if (genderField) {
            genderField.style.display = 'block';
        }
        if (idNumberField) {
            idNumberField.style.display = 'block';
        }
        
        // Set required attributes for individual fields
        if (fullNameInput) {
            fullNameInput.setAttribute('required', 'required');
            const fullNameLabel = fullNameInput.closest('.form-group')?.querySelector('.form-label');
            if (fullNameLabel) fullNameLabel.classList.add('required');
        }
        if (emailInput) {
            emailInput.setAttribute('required', 'required');
            const emailLabel = emailInput.closest('.form-group')?.querySelector('.form-label');
            if (emailLabel) emailLabel.classList.add('required');
        }
        if (emailOrgInput) {
            emailOrgInput.removeAttribute('required');
            const emailOrgLabel = emailOrgInput.closest('.form-group')?.querySelector('.form-label');
            if (emailOrgLabel) emailOrgLabel.classList.remove('required');
        }
        
        // Remove required from organization fields
        const orgNameInput = document.getElementById('organization_name');
        const orgTypeSelect = document.getElementById('organization_type');
        
        if (orgNameInput) {
            orgNameInput.removeAttribute('required');
            const orgNameLabel = orgNameInput.closest('.form-group')?.querySelector('.form-label');
            if (orgNameLabel) orgNameLabel.classList.remove('required');
        }
        if (orgTypeSelect) {
            orgTypeSelect.removeAttribute('required');
            const orgTypeLabel = orgTypeSelect.closest('.form-group')?.querySelector('.form-label');
            if (orgTypeLabel) orgTypeLabel.classList.remove('required');
        }
        
    } else if (submitterType === 'أعمال') {
        // Show organization fields
        console.log('Processing أعمال submitter type');
        if (individualFields) {
            individualFields.style.display = 'none';
        }
        if (organizationFields) {
            organizationFields.style.display = 'block';
            console.log('Showing organization fields - display set to block');
        } else {
            console.error('organizationFields element not found!');
        }
        if (genderField) {
            genderField.style.display = 'none';
        }
        if (idNumberField) {
            idNumberField.style.display = 'none';
        }
        
        // Remove required from individual fields
        if (fullNameInput) {
            fullNameInput.removeAttribute('required');
            const fullNameLabel = fullNameInput.closest('.form-group')?.querySelector('.form-label');
            if (fullNameLabel) fullNameLabel.classList.remove('required');
        }
        if (emailInput) {
            emailInput.removeAttribute('required');
            const emailLabel = emailInput.closest('.form-group')?.querySelector('.form-label');
            if (emailLabel) emailLabel.classList.remove('required');
        }
        
        // Set required attributes for organization fields
        const orgNameInput = document.getElementById('organization_name');
        const orgTypeSelect = document.getElementById('organization_type');
        
        if (orgNameInput) {
            orgNameInput.setAttribute('required', 'required');
            const orgNameLabel = orgNameInput.closest('.form-group')?.querySelector('.form-label');
            if (orgNameLabel) orgNameLabel.classList.add('required');
        }
        if (orgTypeSelect) {
            orgTypeSelect.setAttribute('required', 'required');
            const orgTypeLabel = orgTypeSelect.closest('.form-group')?.querySelector('.form-label');
            if (orgTypeLabel) orgTypeLabel.classList.add('required');
        }
        if (emailOrgInput) {
            emailOrgInput.setAttribute('required', 'required');
            const emailOrgLabel = emailOrgInput.closest('.form-group')?.querySelector('.form-label');
            if (emailOrgLabel) emailOrgLabel.classList.add('required');
        }
    } else {
        // Hide all conditional fields
        if (individualFields) individualFields.style.display = 'none';
        if (organizationFields) organizationFields.style.display = 'none';
        if (genderField) genderField.style.display = 'none';
        if (idNumberField) idNumberField.style.display = 'none';
    }
    
    // Update declaration text if we're on the review step (step 4)
    if (currentStep === 4) {
        updateReviewContent();
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
    
    // Special validation for submitter type on step 1
    if (currentStep === 1) {
        const submitterTypeSelect = document.getElementById('submitter_type');
        if (submitterTypeSelect && submitterTypeSelect.value) {
            const submitterType = submitterTypeSelect.value;
            
            if (submitterType === 'فرد') {
                const fullNameInput = document.getElementById('full_name');
                const emailInput = document.getElementById('email');
                if (!fullNameInput || !fullNameInput.value.trim()) {
                    showFieldError(fullNameInput, 'الاسم الكامل مطلوب للأفراد');
                    isValid = false;
                }
                if (!emailInput || !emailInput.value.trim()) {
                    showFieldError(emailInput, 'البريد الإلكتروني مطلوب');
                    isValid = false;
                }
            } else if (submitterType === 'أعمال') {
                const orgNameInput = document.getElementById('organization_name');
                const orgTypeSelect = document.getElementById('organization_type');
                const emailOrgInput = document.getElementById('email_org');
                
                if (!orgNameInput || !orgNameInput.value.trim()) {
                    showFieldError(orgNameInput, 'اسم الأعمال مطلوب');
                    isValid = false;
                }
                if (!orgTypeSelect || !orgTypeSelect.value) {
                    showFieldError(orgTypeSelect, 'نوع الأعمال مطلوب');
                    isValid = false;
                }
                if (!emailOrgInput || !emailOrgInput.value.trim()) {
                    showFieldError(emailOrgInput, 'البريد الإلكتروني مطلوب');
                    isValid = false;
                }
            }
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
    const submitterTypeSelect = document.getElementById('submitter_type');
    const submitterType = submitterTypeSelect?.value || formData.submitter_type || 'فرد';
    
    // Always save submitter_type
    if (submitterTypeSelect && submitterTypeSelect.value) {
        formData.submitter_type = submitterTypeSelect.value;
    }
    
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        } else if (input.type !== 'file' && input.type !== 'hidden') {
            // Handle email field - use the appropriate one based on submitter type
            if (input.id === 'email_org') {
                // Organization email
                if (submitterType === 'أعمال') {
                    formData.email = input.value;
                }
            } else if (input.id === 'email') {
                // Individual email
                if (submitterType === 'فرد') {
                    formData.email = input.value;
                }
            } else {
                formData[input.name] = input.value;
            }
        } else if (input.type === 'hidden') {
            // Save hidden fields too (like submitter_type)
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
    const declarationText = document.getElementById('declaration-text');
    
    // Set declaration text and name based on submitter type
    const submitterType = formData.submitter_type || 'فرد';
    const isIndividual = submitterType === 'فرد';
    
    if (isIndividual) {
        // For individuals: standard declaration
        const fullName = formData.full_name || '[الاسم]';
        declarationName.textContent = fullName;
        declarationText.innerHTML = `أنا <strong>${fullName}</strong> أقر بأن جميع المعلومات المقدمة دقيقة وأن هذا البحث/الكتاب هو من عملي الأصلي. وفي حالة ثبوت خلاف ذلك، أتحمل كامل المسؤولية.`;
    } else {
        // For organizations (universities, institutions): different declaration text
        const orgName = formData.organization_name || '[اسم الأعمال]';
        const mainResearcher = formData.main_researcher || '[اسم الباحث]';
        declarationName.textContent = orgName;
        declarationText.innerHTML = `نحن <strong>${orgName}</strong> نقر بأن جميع المعلومات المقدمة دقيقة وأن هذا البحث/الكتاب هو من عمل الباحث <strong>${mainResearcher}</strong> الذي تم ذكره سابقاً في هذا الطلب. وفي حالة ثبوت خلاف ذلك، نتحمل كامل المسؤولية.`;
    }
    
    // Build review HTML
    let basicInfoHTML = `
        <div class="review-section">
            <h4>المعلومات الأساسية</h4>
            <div class="review-item">
                <span class="review-label">نوع مقدم البحث:</span>
                <span class="review-value">${submitterType || '-'}</span>
            </div>
    `;
    
    // Show account owner info if business account
    if (!isIndividual && formData.submitter_type === 'أعمال') {
        basicInfoHTML += `
            <div class="review-item" style="background: #f0f9ff; padding: 0.75rem; border-radius: 8px; margin: 0.5rem 0;">
                <span class="review-label" style="font-weight: 600;">معلومات صاحب الحساب (مقدم البحث):</span>
                <div style="margin-top: 0.5rem;">
                    <div style="margin: 0.25rem 0;">
                        <span class="review-label">اسم الأعمال:</span>
                        <span class="review-value">${formData.organization_name || '-'}</span>
                    </div>
                    ${formData.organization_type ? `
                    <div style="margin: 0.25rem 0;">
                        <span class="review-label">نوع الأعمال:</span>
                        <span class="review-value">${formData.organization_type}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    if (isIndividual) {
        basicInfoHTML += `
            <div class="review-item">
                <span class="review-label">الاسم الكامل:</span>
                <span class="review-value">${formData.full_name || '-'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">البريد الإلكتروني:</span>
                <span class="review-value">${formData.email || '-'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">الجنس:</span>
                <span class="review-value">${formData.gender || '-'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">رقم الهوية:</span>
                <span class="review-value">${formData.id_number || '-'}</span>
            </div>
        `;
    } else {
        basicInfoHTML += `
            <div class="review-item">
                <span class="review-label">اسم الأعمال:</span>
                <span class="review-value">${formData.organization_name || '-'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">نوع الأعمال:</span>
                <span class="review-value">${formData.organization_type || '-'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">البريد الإلكتروني:</span>
                <span class="review-value">${formData.email || '-'}</span>
            </div>
        `;
    }
    
    basicInfoHTML += `
            <div class="review-item">
                <span class="review-label">الدولة:</span>
                <span class="review-value">${formData.country || '-'}</span>
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
    
    reviewContent.innerHTML = basicInfoHTML;
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
        
        const submitterType = formData.submitter_type || 'فرد';
        const isIndividual = submitterType === 'فرد';
        
        // Validate required fields before submission
        if (isIndividual) {
            if (!formData.full_name || !formData.full_name.trim()) {
                throw new Error('الاسم الكامل مطلوب');
            }
            if (!formData.gender) {
                throw new Error('الجنس مطلوب');
            }
            if (!formData.id_number || !formData.id_number.trim()) {
                throw new Error('رقم الهوية مطلوب');
            }
        } else {
            // For organizations, validate organization fields
            if (!formData.organization_name || !formData.organization_name.trim()) {
                throw new Error('اسم الأعمال مطلوب');
            }
        }
        
        // Ensure submitter_type is saved before creating submission data
        saveFormData();
        const finalSubmitterType = formData.submitter_type || submitterType;
        const finalIsIndividual = finalSubmitterType === 'فرد';
        
        const submissionData = {
            submitter_type: finalSubmitterType,
            country: formData.country,
            email: formData.email,
            research_type: formData.research_type,
            category: categoryValue,
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
        
        // Add fields based on submitter type
        if (finalIsIndividual) {
            // Individual fields
            submissionData.full_name = formData.full_name?.trim() || '';
            submissionData.gender = formData.gender || 'ذكر';
            submissionData.id_number = formData.id_number?.trim() || '';
        } else {
            // Organization fields - ensure all required fields are present
            const orgName = formData.organization_name?.trim() || '';
            const orgType = formData.organization_type || '';
            
            submissionData.organization_name = orgName;
            submissionData.organization_type = orgType;
            
            // For backward compatibility with database schema, also set required fields
            // These are required by the database but we use organization data
            submissionData.full_name = orgName; // Use organization name as full_name
            submissionData.gender = 'ذكر'; // Default value for organizations (required field)
            submissionData.id_number = commercialReg; // Use commercial reg as id_number (required field)
        }
        
        // Create submission
        const result = await submissionsStore.createSubmission(submissionData);
        
        if (result.success) {
            showAlert('تم تقديم البحث بنجاح! رقم المرجع: ' + result.data.reference_number, 'success');
            
            // Clear all form data
            clearFormData();
            
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
 * Clear all form data
 */
function clearFormData() {
    // Reset form state
    formData = {};
    uploadedFile = null;
    currentStep = 1;
    
    // Reset form inputs
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else if (input.type !== 'file') {
                input.value = '';
                input.removeAttribute('required');
            }
        });
    }
    
    // Reset file upload
    const fileInput = document.getElementById('research_file');
    if (fileInput) {
        fileInput.value = '';
    }
    
    const filePreview = document.getElementById('file-preview');
    const uploadArea = document.getElementById('file-upload-area');
    if (filePreview) filePreview.style.display = 'none';
    if (uploadArea) uploadArea.style.display = 'block';
    
    // Reset submitter type fields visibility
    const individualFields = document.getElementById('individual-fields');
    const organizationFields = document.getElementById('organization-fields');
    const genderField = document.getElementById('gender-field');
    const idNumberField = document.getElementById('id-number-field');
    
    if (individualFields) individualFields.style.display = 'none';
    if (organizationFields) organizationFields.style.display = 'none';
    if (genderField) genderField.style.display = 'none';
    if (idNumberField) idNumberField.style.display = 'none';
    
    // Reset other category field
    const otherCategoryGroup = document.getElementById('other-category-group');
    if (otherCategoryGroup) otherCategoryGroup.style.display = 'none';
    
    // Reset submitter type select
    const submitterTypeSelect = document.getElementById('submitter_type');
    if (submitterTypeSelect) {
        submitterTypeSelect.value = '';
    }
    
    // Reset step display
    updateStepDisplay();
    
    // Clear any error messages
    if (form) {
        const errorMessages = form.querySelectorAll('.form-error');
        errorMessages.forEach(error => error.remove());
        
        const errorInputs = form.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
    }
    
    // Clear localStorage draft
    localStorage.removeItem('submission_draft');
    
    console.log('Form data and cache cleared');
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
                    handleSubmitterTypeChange();
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
        
        // Get account type from user profile, default to 'تجريبي' if not set
        const accountType = currentUser.account_type || 'تجريبي';
        
        // Hide submitter type field - it will be set automatically
        const submitterTypeGroup = document.getElementById('submitter-type-group');
        if (submitterTypeGroup) {
            submitterTypeGroup.style.display = 'none';
        }
        
        // Set submitter type based on account type automatically
        const submitterTypeSelect = document.getElementById('submitter_type');
        let submitterType = 'فرد'; // default
        
        if (accountType === 'فرد') {
            submitterType = 'فرد';
        } else if (accountType === 'أعمال') {
            submitterType = 'أعمال';
            // Show account owner info for business accounts - call after a short delay to ensure DOM is ready
            setTimeout(() => {
                showAccountOwnerInfo(currentUser);
            }, 150);
        } else {
            // For 'تجريبي' or unknown, default to 'فرد'
            submitterType = 'فرد';
        }
        
        if (submitterTypeSelect) {
            submitterTypeSelect.value = submitterType;
            submitterTypeSelect.removeAttribute('required'); // Not required since it's auto-set
        }
        formData.submitter_type = submitterType;
        
        // Trigger change event to show/hide appropriate fields
        setTimeout(() => {
            handleSubmitterTypeChange();
        }, 100);
        
        // Pre-fill business fields if account type is 'أعمال'
        if (accountType === 'أعمال') {
            const orgNameInput = document.getElementById('organization_name');
            const orgTypeSelect = document.getElementById('organization_type');
            const emailOrgInput = document.getElementById('email_org');
            
            // Pre-fill organization name
            if (orgNameInput && currentUser.organization_name) {
                orgNameInput.value = currentUser.organization_name;
                formData.organization_name = currentUser.organization_name;
            }
            
            // Pre-fill organization type
            if (orgTypeSelect && currentUser.organization_type) {
                orgTypeSelect.value = currentUser.organization_type;
                formData.organization_type = currentUser.organization_type;
            }
            
            // Pre-fill email for organization
            if (emailOrgInput && currentUser.email) {
                emailOrgInput.value = currentUser.email;
                formData.email = currentUser.email;
            }
        }
        
        // Pre-fill basic information fields
        const fullNameInput = document.getElementById('full_name');
        const emailInput = document.getElementById('email');
        const emailOrgInput = document.getElementById('email_org');
        const idNumberInput = document.getElementById('id_number');
        const genderInput = document.getElementById('gender');
        const countryInput = document.getElementById('country');
        
        // Fill username/full_name (for individual)
        if (fullNameInput && currentUser.username && !fullNameInput.value) {
            fullNameInput.value = currentUser.username;
            formData.full_name = currentUser.username;
        }
        
        // Fill email (for both individual and organization)
        if (emailInput && currentUser.email && !emailInput.value) {
            emailInput.value = currentUser.email;
            formData.email = currentUser.email;
        }
        if (emailOrgInput && currentUser.email && !emailOrgInput.value) {
            emailOrgInput.value = currentUser.email;
            formData.email = currentUser.email;
        }
        
        // Fill national_id (for individual)
        if (idNumberInput && currentUser.national_id && !idNumberInput.value) {
            idNumberInput.value = currentUser.national_id;
            formData.id_number = currentUser.national_id;
        }
        
        // Fill gender if available (for individual)
        if (genderInput && currentUser.gender && !genderInput.value) {
            genderInput.value = currentUser.gender;
            formData.gender = currentUser.gender;
        }
        
        // Fill country if available
        if (countryInput && currentUser.country && !countryInput.value) {
            countryInput.value = currentUser.country;
            formData.country = currentUser.country;
        }
        
        console.log('User data prefilled successfully with account_type:', accountType);
    } catch (error) {
        console.error('Error prefilling user data:', error);
        // Don't show error to user, just log it
        // The form will remain empty and user can fill it manually
    }
}

/**
 * Show account owner information for business accounts
 */
function showAccountOwnerInfo(user) {
    const accountOwnerInfo = document.getElementById('account-owner-info');
    const displayAccountType = document.getElementById('display-account-type');
    const displayOrgName = document.getElementById('display-organization-name');
    const displayOrgType = document.getElementById('display-organization-type');
    const displayOrgNameItem = document.getElementById('display-organization-name-item');
    const displayOrgTypeItem = document.getElementById('display-organization-type-item');
    
    if (!accountOwnerInfo) {
        console.warn('account-owner-info element not found');
        return;
    }
    
    console.log('Showing account owner info for user:', user);
    
    // Show the info box
    accountOwnerInfo.style.display = 'block';
    
    // Set account type - show "أعمال" for business accounts
    if (displayAccountType) {
        const accountType = user.account_type || 'غير محدد';
        displayAccountType.textContent = accountType === 'أعمال' ? 'أعمال' : accountType;
    }
    
    // Set organization info if available
    if (user.account_type === 'أعمال') {
        // Show organization name
        if (user.organization_name && displayOrgName) {
            displayOrgName.textContent = user.organization_name;
            if (displayOrgNameItem) {
                displayOrgNameItem.style.display = 'flex';
            }
        } else if (displayOrgNameItem) {
            displayOrgNameItem.style.display = 'none';
        }
        
        // Show organization type
        if (user.organization_type && displayOrgType) {
            displayOrgType.textContent = user.organization_type;
            if (displayOrgTypeItem) {
                displayOrgTypeItem.style.display = 'flex';
            }
        } else if (displayOrgTypeItem) {
            displayOrgTypeItem.style.display = 'none';
        }
    } else {
        // Hide organization items if not business account
        if (displayOrgNameItem) displayOrgNameItem.style.display = 'none';
        if (displayOrgTypeItem) displayOrgTypeItem.style.display = 'none';
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

