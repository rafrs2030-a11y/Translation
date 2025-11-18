/**
 * Avatar Helper Utility
 * مساعد عرض الصور الشخصية
 */

import { supabase } from '../config/supabase.js';

/**
 * Update avatar display in an element
 * @param {HTMLElement} element - The element to update
 * @param {Object} user - User object with profile_picture and username
 * @param {Object} options - Options for display
 */
export function updateAvatarDisplay(element, user, options = {}) {
    if (!element || !user) return;
    
    const {
        size = 40,
        showInitials = true,
        fontSize = '1rem',
        className = ''
    } = options;
    
    if (user.profile_picture) {
        // Show image
        element.innerHTML = `
            <img src="${user.profile_picture}" 
                 alt="الصورة الشخصية" 
                 style="width: ${size}px; height: ${size}px; border-radius: 50%; object-fit: cover;"
                 class="${className}"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div style="display: none; width: ${size}px; height: ${size}px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; align-items: center; justify-content: center; font-weight: 700; font-size: ${fontSize};">
                ${getInitials(user.username)}
            </div>
        `;
    } else if (showInitials) {
        // Show initials
        const initials = getInitials(user.username);
        element.innerHTML = `
            <div style="width: ${size}px; height: ${size}px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: ${fontSize}; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);" class="${className}">
                ${initials}
            </div>
        `;
    } else {
        // Show icon
        element.innerHTML = `
            <div style="width: ${size}px; height: ${size}px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; justify-content: center; font-size: ${fontSize};" class="${className}">
                <i class="fas fa-user"></i>
            </div>
        `;
    }
}

/**
 * Get user initials from username
 * @param {string} username - Username
 * @returns {string} Initials
 */
export function getInitials(username) {
    if (!username) return '?';
    const parts = username.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
}

/**
 * Load user profile picture from database
 * @param {string} userId - User ID
 * @returns {Promise<string|null>} Profile picture URL or null
 */
export async function loadUserProfilePicture(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('profile_picture')
            .eq('id', userId)
            .single();
        
        if (error) throw error;
        return data?.profile_picture || null;
    } catch (error) {
        console.error('Error loading profile picture:', error);
        return null;
    }
}

