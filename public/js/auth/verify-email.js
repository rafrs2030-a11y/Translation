/**
 * Email Verification Page JavaScript
 * صفحة التحقق من البريد الإلكتروني
 */

import authStore from '../stores/authStore.js';
import { supabase } from '../config/supabase.js';

// DOM Elements
let loadingState, successState, errorState, errorMessage, resendLink;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    initElements();
    await handleEmailVerification();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    loadingState = document.getElementById('loading-state');
    successState = document.getElementById('success-state');
    errorState = document.getElementById('error-state');
    errorMessage = document.getElementById('error-message');
    resendLink = document.getElementById('resend-link');
}

/**
 * Handle email verification
 */
async function handleEmailVerification() {
    try {
        // Get token from URL hash or query params
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Supabase sends tokens in hash format: #access_token=...&type=email
        const accessToken = hashParams.get('access_token') || urlParams.get('token');
        const type = hashParams.get('type') || urlParams.get('type');
        
        if (!accessToken) {
            // Check if we're coming from a redirect
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (session && session.user) {
                // User is already authenticated, check if email is verified
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('email_verified')
                    .eq('id', session.user.id)
                    .single();
                
                if (!userError && userData) {
                    if (userData.email_verified) {
                        showSuccess();
                        return;
                    } else {
                        // Try to verify using the session
                        await verifyWithSession(session);
                        return;
                    }
                }
            }
            
            showError('لم يتم العثور على رابط التحقق. يرجى التحقق من البريد الإلكتروني والنقر على الرابط الصحيح.');
            return;
        }
        
        // Verify email with token
        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: accessToken,
            type: type || 'email'
        });
        
        if (verifyError) {
            console.error('Verification error:', verifyError);
            showError(verifyError.message || 'فشل التحقق من البريد الإلكتروني. يرجى المحاولة مرة أخرى.');
            return;
        }
        
        // Update email_verified in users table
        if (verifyData && verifyData.user) {
            const { error: updateError } = await supabase
                .from('users')
                .update({ 
                    email_verified: true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', verifyData.user.id);
            
            if (updateError) {
                console.error('Error updating email_verified:', updateError);
                // Don't fail the verification if update fails, as Supabase auth is already verified
            }
            
            showSuccess();
        } else {
            showError('فشل التحقق من البريد الإلكتروني. يرجى المحاولة مرة أخرى.');
        }
        
    } catch (error) {
        console.error('Email verification error:', error);
        showError('حدث خطأ غير متوقع أثناء التحقق من البريد الإلكتروني: ' + (error.message || 'خطأ غير معروف'));
    }
}

/**
 * Verify email using existing session
 */
async function verifyWithSession(session) {
    try {
        const { data: { user } } = session;
        
        // Check if email is already verified in Supabase Auth
        if (user && user.email_confirmed_at) {
            // Update email_verified in users table
            const { error: updateError } = await supabase
                .from('users')
                .update({ 
                    email_verified: true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);
            
            if (!updateError) {
                showSuccess();
                return;
            }
        }
        
        showError('لم يتم التحقق من البريد الإلكتروني بعد. يرجى النقر على رابط التحقق في البريد الإلكتروني.');
        if (resendLink) {
            resendLink.style.display = 'inline-flex';
        }
    } catch (error) {
        console.error('Session verification error:', error);
        showError('حدث خطأ أثناء التحقق من الجلسة.');
    }
}

/**
 * Show success state
 */
function showSuccess() {
    loadingState.style.display = 'none';
    successState.style.display = 'block';
    errorState.style.display = 'none';
    
    // Clear URL hash/params for security
    if (window.history.replaceState) {
        window.history.replaceState(null, '', '/pages/verify-email.html?verified=true');
    }
}

/**
 * Show error state
 */
function showError(message) {
    loadingState.style.display = 'none';
    successState.style.display = 'none';
    errorState.style.display = 'block';
    
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    
    // Check if user is logged in to show resend link
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && resendLink) {
            resendLink.style.display = 'inline-flex';
        }
    });
}

