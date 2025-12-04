/**
 * Contact Email Utility
 * أداة لإدارة البريد الإلكتروني للتواصل
 */

import { supabase } from '../config/supabase.js';

let contactEmailCache = null;
let isUpdating = false; // Flag to prevent infinite loops

// Listen for cache clear event
if (typeof window !== 'undefined') {
    window.addEventListener('clearContactEmailCache', () => {
        contactEmailCache = null;
        localStorage.removeItem('contact_email');
    });
}

/**
 * Get contact email from storage (with Supabase sync)
 */
export async function getContactEmail() {
    // Return cached value if available
    if (contactEmailCache) {
        return contactEmailCache;
    }
    
    // Try to get from localStorage first (fast)
    const cached = localStorage.getItem('contact_email');
    if (cached) {
        contactEmailCache = cached;
        return cached;
    }
    
    // Load from Supabase
    try {
        const { data, error } = await supabase
            .from('platform_settings')
            .select('setting_value')
            .eq('setting_key', 'contact_email')
            .single();
        
        if (!error && data) {
            contactEmailCache = data.setting_value;
            localStorage.setItem('contact_email', data.setting_value);
            return data.setting_value;
        }
    } catch (error) {
        console.error('Error loading contact email from Supabase:', error);
    }
    
    // Fallback to default
    const defaultValue = 'contact@arabresearch.com';
    contactEmailCache = defaultValue;
    return defaultValue;
}

/**
 * Get contact email synchronously (from cache/localStorage)
 */
export function getContactEmailSync() {
    return localStorage.getItem('contact_email') || 'contact@arabresearch.com';
}

/**
 * Update contact email in current page
 * @param {boolean} skipEvent - Skip dispatching event to prevent infinite loops
 */
export function updatePageContactEmail(skipEvent = false) {
    // Prevent infinite loops
    if (isUpdating) {
        return;
    }
    
    isUpdating = true;
    
    try {
        const contactEmail = getContactEmailSync();
        
        // Update all email links and text
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.includes('contact@arabresearch.com') || href.includes('info@rafrs.com') || href.includes('info@researcha.net'))) {
                link.setAttribute('href', `mailto:${contactEmail}`);
                // Update text if it contains the old email
                if (link.textContent.includes('contact@arabresearch.com') || 
                    link.textContent.includes('info@rafrs.com') || 
                    link.textContent.includes('info@researcha.net')) {
                    link.textContent = link.textContent.replace(/contact@arabresearch\.com|info@rafrs\.com|info@researcha\.net/g, contactEmail);
                }
            }
        });
        
        // Update text content that contains email addresses
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent;
            if (text && (text.includes('contact@arabresearch.com') || 
                         text.includes('info@rafrs.com') || 
                         text.includes('info@researcha.net'))) {
                textNodes.push(node);
            }
        }
        
        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const updatedText = text
                .replace(/contact@arabresearch\.com/g, contactEmail)
                .replace(/info@rafrs\.com/g, contactEmail)
                .replace(/info@researcha\.net/g, contactEmail);
            if (text !== updatedText) {
                textNode.textContent = updatedText;
            }
        });
        
        // Dispatch custom event for other components to listen (only if not skipping)
        if (!skipEvent) {
            window.dispatchEvent(new CustomEvent('contactEmailUpdated', { 
                detail: { email: contactEmail } 
            }));
        }
    } finally {
        isUpdating = false;
    }
}

/**
 * Initialize contact email on page load
 */
export async function initContactEmail() {
    // Load from Supabase on init
    await getContactEmail();
    
    // Update on load
    updatePageContactEmail();
    
    // Listen for storage updates (from other tabs/windows)
    window.addEventListener('storage', (e) => {
        if (e.key === 'contact_email' && e.newValue) {
            contactEmailCache = e.newValue;
            updatePageContactEmail();
        }
    });
    
    // Listen for custom events (from same page - real-time updates)
    window.addEventListener('contactEmailUpdated', (e) => {
        if (e.detail?.email) {
            contactEmailCache = e.detail.email;
        }
        // Skip event dispatch to prevent infinite loop
        updatePageContactEmail(true);
    });
}

// Auto-initialize if this is the main module
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactEmail);
    } else {
        initContactEmail();
    }
}

