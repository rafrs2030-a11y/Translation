/**
 * Clear Cache Utility
 * أداة مسح الكاش القديم
 */

/**
 * مسح جميع أنواع الكاش القديم
 */
export async function clearAllOldCache() {
    try {
        console.log('🔄 بدء مسح الكاش القديم...');
        
        let results = {
            serviceWorker: 0,
            localStorage: 0,
            sessionStorage: 0,
            indexedDB: false,
            total: 0
        };

        // 1. مسح Service Worker Cache
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                console.log(`📦 تم العثور على ${cacheNames.length} كاش من Service Worker`);
                
                await Promise.all(
                    cacheNames.map(async (cacheName) => {
                        try {
                            const deleted = await caches.delete(cacheName);
                            if (deleted) {
                                results.serviceWorker++;
                                console.log(`✅ تم مسح كاش: ${cacheName}`);
                            }
                        } catch (err) {
                            console.error(`❌ خطأ في مسح كاش ${cacheName}:`, err);
                        }
                    })
                );
            } catch (error) {
                console.error('❌ خطأ في مسح Service Worker cache:', error);
            }
        }

        // 2. مسح localStorage (مع الحفاظ على tokens المهمة)
        try {
            const allKeys = Object.keys(localStorage);
            const keysToRemove = [];
            
            allKeys.forEach(key => {
                // الحفاظ على tokens المهمة فقط
                if (
                    !key.startsWith('sb-') && 
                    !key.startsWith('supabase.auth.') &&
                    !key.includes('auth_token') &&
                    !key.includes('refresh_token')
                ) {
                    keysToRemove.push(key);
                }
            });
            
            keysToRemove.forEach(key => {
                try {
                    localStorage.removeItem(key);
                    results.localStorage++;
                } catch (err) {
                    console.error(`❌ خطأ في مسح ${key}:`, err);
                }
            });
            
            console.log(`✅ تم مسح ${results.localStorage} عنصر من localStorage`);
        } catch (error) {
            console.error('❌ خطأ في مسح localStorage:', error);
        }

        // 3. مسح sessionStorage بالكامل
        try {
            const sessionKeys = Object.keys(sessionStorage);
            sessionStorage.clear();
            results.sessionStorage = sessionKeys.length;
            console.log(`✅ تم مسح ${results.sessionStorage} عنصر من sessionStorage`);
        } catch (error) {
            console.error('❌ خطأ في مسح sessionStorage:', error);
        }

        // 4. مسح IndexedDB (إذا كان موجوداً)
        if ('indexedDB' in window) {
            try {
                // محاولة مسح databases معروفة
                const databases = ['chat_cache', 'notifications_cache', 'app_cache'];
                for (const dbName of databases) {
                    try {
                        const deleteReq = indexedDB.deleteDatabase(dbName);
                        await new Promise((resolve, reject) => {
                            deleteReq.onsuccess = () => resolve();
                            deleteReq.onerror = () => reject(deleteReq.error);
                            deleteReq.onblocked = () => resolve(); // تجاهل إذا كان محظوراً
                        });
                        console.log(`✅ تم مسح IndexedDB: ${dbName}`);
                    } catch (err) {
                        // تجاهل الأخطاء
                    }
                }
                results.indexedDB = true;
            } catch (error) {
                console.error('❌ خطأ في مسح IndexedDB:', error);
            }
        }

        // 5. مسح كاش المتصفح (Cache API)
        if ('caches' in window) {
            try {
                // مسح جميع caches مرة أخرى للتأكد
                const allCaches = await caches.keys();
                for (const cacheName of allCaches) {
                    await caches.delete(cacheName);
                }
            } catch (error) {
                console.error('❌ خطأ في مسح Cache API:', error);
            }
        }

        results.total = results.serviceWorker + results.localStorage + results.sessionStorage;
        
        console.log('✅ تم مسح الكاش بنجاح:', results);
        
        return {
            success: true,
            results: results,
            message: `تم مسح ${results.total} عنصر من الكاش`
        };

    } catch (error) {
        console.error('❌ خطأ عام في مسح الكاش:', error);
        return {
            success: false,
            error: error.message,
            results: null
        };
    }
}

/**
 * مسح كاش المحادثات فقط
 */
export function clearChatCache() {
    try {
        const chatKeys = [
            'chat_conversations',
            'chat_messages',
            'chat_unread_count',
            'chat_last_fetch',
            'chat_cache',
            'chat_state'
        ];
        
        let cleared = 0;
        chatKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                cleared++;
            }
            if (sessionStorage.getItem(key)) {
                sessionStorage.removeItem(key);
                cleared++;
            }
        });
        
        console.log(`✅ تم مسح ${cleared} عنصر من كاش المحادثات`);
        return { success: true, cleared };
    } catch (error) {
        console.error('❌ خطأ في مسح كاش المحادثات:', error);
        return { success: false, error: error.message };
    }
}

/**
 * مسح كاش الإشعارات فقط
 */
export function clearNotificationsCache() {
    try {
        const notificationKeys = [
            'notifications',
            'notifications_unread',
            'notifications_last_fetch',
            'notification_cache',
            'notification_preferences'
        ];
        
        let cleared = 0;
        notificationKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                cleared++;
            }
            if (sessionStorage.getItem(key)) {
                sessionStorage.removeItem(key);
                cleared++;
            }
        });
        
        console.log(`✅ تم مسح ${cleared} عنصر من كاش الإشعارات`);
        return { success: true, cleared };
    } catch (error) {
        console.error('❌ خطأ في مسح كاش الإشعارات:', error);
        return { success: false, error: error.message };
    }
}

/**
 * مسح كاش Supabase (مع الحفاظ على auth)
 */
export function clearSupabaseCache() {
    try {
        const supabaseKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('sb-') && 
            !key.includes('auth.token') &&
            !key.includes('auth.refresh')
        );
        
        let cleared = 0;
        supabaseKeys.forEach(key => {
            try {
                localStorage.removeItem(key);
                cleared++;
            } catch (err) {
                console.error(`❌ خطأ في مسح ${key}:`, err);
            }
        });
        
        console.log(`✅ تم مسح ${cleared} عنصر من كاش Supabase`);
        return { success: true, cleared };
    } catch (error) {
        console.error('❌ خطأ في مسح كاش Supabase:', error);
        return { success: false, error: error.message };
    }
}

/**
 * مسح جميع الكاش وإعادة تحميل الصفحة
 */
export async function clearCacheAndReload() {
    const result = await clearAllOldCache();
    
    if (result.success) {
        // إعادة تحميل الصفحة بعد مسح الكاش
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
    
    return result;
}

// جعل الدالة متاحة عالمياً للاستخدام من console
if (typeof window !== 'undefined') {
    window.clearAllCache = clearAllOldCache;
    window.clearChatCache = clearChatCache;
    window.clearNotificationsCache = clearNotificationsCache;
    window.clearSupabaseCache = clearSupabaseCache;
    window.clearCacheAndReload = clearCacheAndReload;
}
