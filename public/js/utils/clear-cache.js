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
        
        let cacheNamesDeleted = [];
        let localStorageItemsDeleted = 0;
        let serviceWorkersUnregistered = 0;
        
        // Clear ALL Service Worker caches (including old versions)
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            console.log('تم العثور على', cacheNames.length, 'كاش:', cacheNames);
            
            // Delete all caches (including old versions)
            await Promise.all(
                cacheNames.map(async (cacheName) => {
                    try {
                        console.log('مسح كاش:', cacheName);
                        const deleted = await caches.delete(cacheName);
                        if (deleted) {
                            cacheNamesDeleted.push(cacheName);
                        }
                        return deleted;
                    } catch (err) {
                        console.error('خطأ في مسح كاش:', cacheName, err);
                        return false;
                    }
                })
            );
            console.log('✓ تم مسح', cacheNamesDeleted.length, 'كاش من Service Worker');
        }
        
        // Clear localStorage (keep auth tokens only)
        const importantKeys = ['supabase.auth.token', 'sb-'];
        const allKeys = Object.keys(localStorage);
        const keysToRemove = allKeys.filter(
            key => !importantKeys.some(important => key.includes(important))
        );
        
        keysToRemove.forEach(key => {
            try {
                console.log('مسح من localStorage:', key);
                localStorage.removeItem(key);
                localStorageItemsDeleted++;
            } catch (err) {
                console.error('خطأ في مسح:', key, err);
            }
        });
        console.log('✓ تم مسح', localStorageItemsDeleted, 'عنصر من localStorage');
        
        // Clear ALL sessionStorage
        try {
            const sessionKeys = Object.keys(sessionStorage);
            sessionStorage.clear();
            console.log('✓ تم مسح', sessionKeys.length, 'عنصر من sessionStorage');
        } catch (err) {
            console.error('خطأ في مسح sessionStorage:', err);
        }
        
        // Unregister ALL Service Workers (including old versions)
        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                console.log('تم العثور على', registrations.length, 'Service Worker مسجل');
                
                await Promise.all(
                    registrations.map(async (registration) => {
                        try {
                            console.log('إلغاء تسجيل Service Worker:', registration.scope);
                            const unregistered = await registration.unregister();
                            if (unregistered) {
                                serviceWorkersUnregistered++;
                            }
                            return unregistered;
                        } catch (err) {
                            console.error('خطأ في إلغاء تسجيل Service Worker:', err);
                            return false;
                        }
                    })
                );
                console.log('✓ تم إلغاء تسجيل', serviceWorkersUnregistered, 'Service Worker');
            } catch (err) {
                console.error('خطأ في جلب Service Workers:', err);
            }
        }
        
        // Force reload to clear any remaining cache
        console.log('✓ تم مسح الكاش بنجاح');
        
        return { 
            success: true, 
            message: 'تم مسح الكاش بنجاح',
            cleared: {
                serviceWorker: cacheNamesDeleted.length,
                localStorage: localStorageItemsDeleted,
                sessionStorage: true,
                serviceWorkersUnregistered: serviceWorkersUnregistered
            },
            details: {
                cacheNames: cacheNamesDeleted
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

