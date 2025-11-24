/**
 * Clear Cache Utility
 * أداة مسح الكاش
 */

/**
 * Clear all cache (Service Worker, localStorage, sessionStorage)
 * مسح جميع أنواع الكاش
 */
export async function clearAllCache() {
    try {
        console.log('بدء مسح الكاش...');
        
        // Clear Service Worker cache
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => {
                    console.log('مسح كاش:', cacheName);
                    return caches.delete(cacheName);
                })
            );
            console.log('✓ تم مسح كاش Service Worker');
        }
        
        // Clear localStorage (keep auth tokens)
        const importantKeys = ['supabase.auth.token', 'sb-'];
        const keysToRemove = Object.keys(localStorage).filter(
            key => !importantKeys.some(important => key.includes(important))
        );
        keysToRemove.forEach(key => {
            console.log('مسح من localStorage:', key);
            localStorage.removeItem(key);
        });
        console.log('✓ تم مسح localStorage');
        
        // Clear sessionStorage
        sessionStorage.clear();
        console.log('✓ تم مسح sessionStorage');
        
        // Unregister Service Worker if exists
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(
                registrations.map(registration => {
                    console.log('إلغاء تسجيل Service Worker');
                    return registration.unregister();
                })
            );
            console.log('✓ تم إلغاء تسجيل Service Worker');
        }
        
        console.log('✓ تم مسح الكاش بنجاح');
        return { 
            success: true, 
            message: 'تم مسح الكاش بنجاح',
            cleared: {
                serviceWorker: true,
                localStorage: keysToRemove.length,
                sessionStorage: true
            }
        };
    } catch (error) {
        console.error('خطأ في مسح الكاش:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

/**
 * Clear only Service Worker cache
 * مسح كاش Service Worker فقط
 */
export async function clearServiceWorkerCache() {
    try {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            return { success: true, message: 'تم مسح كاش Service Worker' };
        }
        return { success: true, message: 'لا يوجد Service Worker' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Clear only localStorage
 * مسح localStorage فقط
 */
export function clearLocalStorage() {
    try {
        const importantKeys = ['supabase.auth.token', 'sb-'];
        const keysToRemove = Object.keys(localStorage).filter(
            key => !importantKeys.some(important => key.includes(important))
        );
        keysToRemove.forEach(key => localStorage.removeItem(key));
        return { 
            success: true, 
            message: `تم مسح ${keysToRemove.length} عنصر من localStorage` 
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Clear only sessionStorage
 * مسح sessionStorage فقط
 */
export function clearSessionStorage() {
    try {
        sessionStorage.clear();
        return { success: true, message: 'تم مسح sessionStorage' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.clearAllCache = clearAllCache;
    window.clearServiceWorkerCache = clearServiceWorkerCache;
    window.clearLocalStorage = clearLocalStorage;
    window.clearSessionStorage = clearSessionStorage;
}

