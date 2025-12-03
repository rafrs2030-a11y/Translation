/**
 * Platform Name Utility
 * أداة لإدارة اسم المنصة
 */

import { supabase } from '../config/supabase.js';

let platformNameCache = null;

// Listen for cache clear event
if (typeof window !== 'undefined') {
    window.addEventListener('clearPlatformNameCache', () => {
        platformNameCache = null;
        localStorage.removeItem('platform_name');
    });
}

/**
 * Get platform name from storage (with Supabase sync)
 */
export async function getPlatformName() {
    // Return cached value if available
    if (platformNameCache) {
        return platformNameCache;
    }
    
    // Try to get from localStorage first (fast)
    const cached = localStorage.getItem('platform_name');
    if (cached) {
        platformNameCache = cached;
        return cached;
    }
    
    // Load from Supabase
    try {
        const { data, error } = await supabase
            .from('platform_settings')
            .select('setting_value')
            .eq('setting_key', 'platform_name')
            .single();
        
        if (!error && data) {
            platformNameCache = data.setting_value;
            localStorage.setItem('platform_name', data.setting_value);
            return data.setting_value;
        }
    } catch (error) {
        console.error('Error loading platform name from Supabase:', error);
    }
    
    // Fallback to default
    const defaultValue = 'منصة نشر الأبحاث العربية';
    platformNameCache = defaultValue;
    return defaultValue;
}

/**
 * Get platform name synchronously (from cache/localStorage)
 */
export function getPlatformNameSync() {
    return localStorage.getItem('platform_name') || 'منصة نشر الأبحاث العربية';
}

/**
 * Update platform name in current page
 */
export function updatePagePlatformName() {
    const platformName = getPlatformNameSync();
    
    // Update document title
    const currentTitle = document.title;
    if (currentTitle.includes(' - ')) {
        const titleParts = currentTitle.split(' - ');
        // Keep the page-specific title and update platform name
        if (titleParts.length > 1 && titleParts[titleParts.length - 1] !== platformName) {
            titleParts[titleParts.length - 1] = platformName;
            document.title = titleParts.join(' - ');
        }
    } else if (!currentTitle.includes(platformName)) {
        document.title = `${currentTitle} - ${platformName}`;
    }
    
    // Update meta description if exists
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        const desc = metaDescription.getAttribute('content');
        if (desc && desc.includes('منصة نشر الأبحاث العربية')) {
            metaDescription.setAttribute('content', desc.replace('منصة نشر الأبحاث العربية', platformName));
        }
    }
    
    // Update footer copyright if exists
    const footerCopyright = document.querySelector('.footer-copyright, footer p, [class*="copyright"]');
    if (footerCopyright) {
        const text = footerCopyright.textContent;
        if (text && text.includes('منصة نشر الأبحاث العربية')) {
            footerCopyright.textContent = text.replace('منصة نشر الأبحاث العربية', platformName);
        }
    }
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('platformNameUpdated', { 
        detail: { name: platformName } 
    }));
}

/**
 * Initialize platform name on page load
 */
export async function initPlatformName() {
    // Load from Supabase on init
    await getPlatformName();
    
    // Update on load
    updatePagePlatformName();
    
    // Listen for storage updates (from other tabs/windows)
    window.addEventListener('storage', (e) => {
        if (e.key === 'platform_name' && e.newValue) {
            platformNameCache = e.newValue;
            updatePagePlatformName();
        }
    });
    
    // Listen for custom events (from same page - real-time updates)
    window.addEventListener('platformNameUpdated', (e) => {
        if (e.detail?.name) {
            platformNameCache = e.detail.name;
        }
        updatePagePlatformName();
    });
}

// Auto-initialize if this is the main module
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlatformName);
    } else {
        initPlatformName();
    }
}

