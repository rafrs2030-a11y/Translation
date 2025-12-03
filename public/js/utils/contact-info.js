/**
 * Contact Info Utility
 * أداة لإدارة معلومات الاتصال (الهاتف، الواتساب، العنوان)
 */

import { supabase } from '../config/supabase.js';

let contactInfoCache = {
    phone: null,
    whatsapp: null,
    address: null
};

/**
 * Get contact phone from storage
 */
export async function getContactPhone() {
    if (contactInfoCache.phone) {
        return contactInfoCache.phone;
    }
    
    const cached = localStorage.getItem('contact_phone');
    if (cached) {
        contactInfoCache.phone = cached;
        return cached;
    }
    
    try {
        const { data, error } = await supabase
            .from('platform_settings')
            .select('setting_value')
            .eq('setting_key', 'contact_phone')
            .single();
        
        if (!error && data) {
            contactInfoCache.phone = data.setting_value;
            localStorage.setItem('contact_phone', data.setting_value);
            return data.setting_value;
        }
    } catch (error) {
        console.error('Error loading contact phone from Supabase:', error);
    }
    
    const defaultValue = '+966 58 000 2284';
    contactInfoCache.phone = defaultValue;
    return defaultValue;
}

/**
 * Get WhatsApp number from storage
 */
export async function getWhatsAppNumber() {
    if (contactInfoCache.whatsapp) {
        return contactInfoCache.whatsapp;
    }
    
    const cached = localStorage.getItem('whatsapp_number');
    if (cached) {
        contactInfoCache.whatsapp = cached;
        return cached;
    }
    
    try {
        const { data, error } = await supabase
            .from('platform_settings')
            .select('setting_value')
            .eq('setting_key', 'whatsapp_number')
            .single();
        
        if (!error && data) {
            contactInfoCache.whatsapp = data.setting_value;
            localStorage.setItem('whatsapp_number', data.setting_value);
            return data.setting_value;
        }
    } catch (error) {
        console.error('Error loading WhatsApp number from Supabase:', error);
    }
    
    const defaultValue = '966580002284';
    contactInfoCache.whatsapp = defaultValue;
    return defaultValue;
}

/**
 * Get contact address from storage
 */
export async function getContactAddress() {
    if (contactInfoCache.address) {
        return contactInfoCache.address;
    }
    
    const cached = localStorage.getItem('contact_address');
    if (cached) {
        contactInfoCache.address = cached;
        return cached;
    }
    
    try {
        const { data, error } = await supabase
            .from('platform_settings')
            .select('setting_value')
            .eq('setting_key', 'contact_address')
            .single();
        
        if (!error && data) {
            contactInfoCache.address = data.setting_value;
            localStorage.setItem('contact_address', data.setting_value);
            return data.setting_value;
        }
    } catch (error) {
        console.error('Error loading contact address from Supabase:', error);
    }
    
    const defaultValue = '3727 ريحانة بنت زيد - 8602 حي النرجس ، 13339';
    contactInfoCache.address = defaultValue;
    return defaultValue;
}

/**
 * Get contact info synchronously (from cache/localStorage)
 */
export function getContactInfoSync() {
    return {
        phone: localStorage.getItem('contact_phone') || '+966 58 000 2284',
        whatsapp: localStorage.getItem('whatsapp_number') || '966580002284',
        address: localStorage.getItem('contact_address') || '3727 ريحانة بنت زيد - 8602 حي النرجس ، 13339'
    };
}

/**
 * Update contact info in current page
 */
export function updatePageContactInfo() {
    const contactInfo = getContactInfoSync();
    
    // Update phone links
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.includes('966580002284') || href.includes('+966580002284') || href.includes('+966 58 000 2284'))) {
            // Format phone for tel: link (remove spaces and +)
            const phoneForLink = contactInfo.phone.replace(/\s+/g, '').replace(/\+/g, '');
            link.setAttribute('href', `tel:+${phoneForLink}`);
            
            // Update text if it contains the old phone
            if (link.textContent.includes('966580002284') || 
                link.textContent.includes('+966 58 000 2284') ||
                link.textContent.includes('+966580002284')) {
                link.textContent = link.textContent.replace(/966580002284|\+966580002284|\+966\s*58\s*000\s*2284/g, contactInfo.phone);
            }
        }
    });
    
    // Update WhatsApp links
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me/"]');
    whatsappLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('966580002284')) {
            link.setAttribute('href', `https://wa.me/${contactInfo.whatsapp}`);
        }
    });
    
    // Update address text
    const addressElements = document.querySelectorAll('span, p, div');
    addressElements.forEach(element => {
        const text = element.textContent;
        if (text && (text.includes('3727 ريحانة بنت زيد') || 
                     text.includes('8602 حي النرجس') ||
                     text.includes('13339'))) {
            // Check if this is likely an address element
            if (text.includes('ريحانة') || text.includes('النرجس') || text.includes('13339')) {
                element.textContent = contactInfo.address;
            }
        }
    });
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('contactInfoUpdated', { 
        detail: contactInfo 
    }));
}

/**
 * Initialize contact info on page load
 */
export async function initContactInfo() {
    // Load from Supabase on init
    await Promise.all([
        getContactPhone(),
        getWhatsAppNumber(),
        getContactAddress()
    ]);
    
    // Update on load
    updatePageContactInfo();
    
    // Listen for storage updates (from other tabs/windows)
    window.addEventListener('storage', (e) => {
        if (e.key === 'contact_phone' || e.key === 'whatsapp_number' || e.key === 'contact_address') {
            if (e.key === 'contact_phone') contactInfoCache.phone = e.newValue;
            if (e.key === 'whatsapp_number') contactInfoCache.whatsapp = e.newValue;
            if (e.key === 'contact_address') contactInfoCache.address = e.newValue;
            updatePageContactInfo();
        }
    });
    
    // Listen for custom events (from same page - real-time updates)
    window.addEventListener('contactInfoUpdated', (e) => {
        if (e.detail) {
            if (e.detail.type === 'phone' || e.detail.phone) {
                contactInfoCache.phone = e.detail.value || e.detail.phone;
            }
            if (e.detail.type === 'whatsapp' || e.detail.whatsapp) {
                contactInfoCache.whatsapp = e.detail.value || e.detail.whatsapp;
            }
            if (e.detail.type === 'address' || e.detail.address) {
                contactInfoCache.address = e.detail.value || e.detail.address;
            }
        }
        updatePageContactInfo();
    });
    
    // Listen for cache clear event
    window.addEventListener('clearContactInfoCache', () => {
        contactInfoCache = { phone: null, whatsapp: null, address: null };
        localStorage.removeItem('contact_phone');
        localStorage.removeItem('whatsapp_number');
        localStorage.removeItem('contact_address');
    });
}

// Auto-initialize if this is the main module
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactInfo);
    } else {
        initContactInfo();
    }
}

