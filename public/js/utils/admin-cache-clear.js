/**
 * Admin Cache Clear Utility
 * وظيفة مسح الكاش في صفحات الإدمن
 */

/**
 * مسح الكاش القديم في صفحات الإدمن
 * يشمل: localStorage, sessionStorage, CSS cache, Service Worker cache
 */
export async function clearAdminCache() {
    try {
        console.log('🧹 بدء مسح كاش صفحات الإدمن...');
        
        let clearedCount = 0;
        const clearedItems = {
            localStorage: 0,
            sessionStorage: 0,
            css: 0,
            serviceWorker: 0,
            indexedDB: 0
        };
        
        // أنماط البحث للمفاتيح المتعلقة بصفحات الإدمن
        const adminPatterns = [
            /^admin_/i,
            /^submission/i,
            /submissions/i,
            /submission.*details/i,
            /admin.*store/i,
            /admin.*cache/i,
            /admin.*state/i,
            /^sb-.*admin/i,
            /^sb-.*submission/i,
            /supabase.*admin/i,
            /supabase.*submission/i
        ];
        
        /**
         * التحقق من تطابق المفتاح مع أي نمط
         */
        const matchesPattern = (key) => {
            return adminPatterns.some(pattern => pattern.test(key));
        };
        
        /**
         * مسح المفاتيح من storage معين
         */
        const clearFromStorage = (storage, storageName) => {
            try {
                const allKeys = Object.keys(storage);
                let storageCleared = 0;
                
                allKeys.forEach(key => {
                    if (matchesPattern(key)) {
                        try {
                            storage.removeItem(key);
                            storageCleared++;
                            clearedCount++;
                            console.log(`🗑️ تم مسح ${storageName}: ${key}`);
                        } catch (err) {
                            console.warn(`⚠️ خطأ في مسح ${storageName} key: ${key}`, err);
                        }
                    }
                });
                
                clearedItems[storageName === 'localStorage' ? 'localStorage' : 'sessionStorage'] = storageCleared;
                return storageCleared;
            } catch (err) {
                console.error(`❌ خطأ في الوصول إلى ${storageName}:`, err);
                return 0;
            }
        };
        
        // مسح من localStorage
        clearFromStorage(localStorage, 'localStorage');
        
        // مسح من sessionStorage
        clearFromStorage(sessionStorage, 'sessionStorage');
        
        // مسح من IndexedDB
        if ('indexedDB' in window) {
            try {
                const dbNames = ['admin', 'submissions', 'submission_details', 'admin_store'];
                
                for (const dbName of dbNames) {
                    try {
                        const deleteRequest = indexedDB.deleteDatabase(dbName);
                        deleteRequest.onsuccess = () => {
                            clearedItems.indexedDB++;
                            clearedCount++;
                            console.log(`🗑️ تم مسح IndexedDB: ${dbName}`);
                        };
                        deleteRequest.onerror = () => {
                            console.warn(`⚠️ خطأ في مسح IndexedDB: ${dbName}`);
                        };
                    } catch (err) {
                        console.warn(`⚠️ خطأ في محاولة مسح IndexedDB: ${dbName}`, err);
                    }
                }
            } catch (err) {
                console.warn('⚠️ خطأ في الوصول إلى IndexedDB:', err);
            }
        }
        
        // مسح كاش Service Workers المتعلق بصفحات الإدمن
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                const adminCacheNames = cacheNames.filter(name => 
                    /admin|submission|dashboard/i.test(name)
                );
                
                await Promise.all(
                    adminCacheNames.map(async (cacheName) => {
                        try {
                            const deleted = await caches.delete(cacheName);
                            if (deleted) {
                                clearedItems.serviceWorker++;
                                clearedCount++;
                                console.log(`🗑️ تم مسح Service Worker cache: ${cacheName}`);
                            }
                        } catch (err) {
                            console.warn(`⚠️ خطأ في مسح Service Worker cache: ${cacheName}`, err);
                        }
                    })
                );
            } catch (err) {
                console.warn('⚠️ خطأ في الوصول إلى Service Worker caches:', err);
            }
        }
        
        // إعادة تحميل ملفات CSS
        await reloadAdminCSS();
        clearedItems.css = 1;
        
        // تقرير النتائج
        if (clearedCount > 0) {
            console.log(`✅ تم مسح ${clearedCount} عنصر من كاش صفحات الإدمن:`);
            console.log(`   - localStorage: ${clearedItems.localStorage}`);
            console.log(`   - sessionStorage: ${clearedItems.sessionStorage}`);
            console.log(`   - IndexedDB: ${clearedItems.indexedDB}`);
            console.log(`   - Service Worker: ${clearedItems.serviceWorker}`);
            console.log(`   - CSS: ${clearedItems.css}`);
        } else {
            console.log('✅ لا يوجد كاش قديم لصفحات الإدمن');
        }
        
        return {
            success: true,
            cleared: clearedCount,
            details: clearedItems
        };
        
    } catch (error) {
        console.error('❌ خطأ في مسح كاش صفحات الإدمن:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * إعادة تحميل ملفات CSS لصفحات الإدمن
 */
async function reloadAdminCSS() {
    try {
        console.log('🔄 بدء إعادة تحميل ملفات CSS لصفحات الإدمن...');
        
        // قائمة ملفات CSS المتعلقة بصفحات الإدمن
        const cssFiles = [
            '/css/main.css',
            '/css/dashboard.css',
            '/css/admin-enhanced.css',
            '/css/chat.css'
        ];
        
        // مسح كاش CSS من Service Worker
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                const cssCacheNames = cacheNames.filter(name => 
                    /css|style|admin|dashboard/i.test(name)
                );
                
                await Promise.all(
                    cssCacheNames.map(async (cacheName) => {
                        try {
                            const cache = await caches.open(cacheName);
                            const requests = await cache.keys();
                            
                            // مسح جميع ملفات CSS من الكاش
                            await Promise.all(
                                requests
                                    .filter(request => cssFiles.some(cssFile => request.url.includes(cssFile)))
                                    .map(request => cache.delete(request))
                            );
                            
                            console.log(`🗑️ تم مسح كاش CSS من: ${cacheName}`);
                        } catch (err) {
                            console.warn(`⚠️ خطأ في مسح كاش CSS من: ${cacheName}`, err);
                        }
                    })
                );
            } catch (err) {
                console.warn('⚠️ خطأ في الوصول إلى Service Worker caches:', err);
            }
        }
        
        // إعادة تحميل ملفات CSS ديناميكياً
        const timestamp = Date.now();
        const styleSheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
        let reloadedCount = 0;
        
        styleSheets.forEach(link => {
            const href = link.getAttribute('href');
            if (href && cssFiles.some(cssFile => href.includes(cssFile))) {
                try {
                    // إنشاء رابط جديد
                    const newLink = document.createElement('link');
                    newLink.rel = 'stylesheet';
                    newLink.type = 'text/css';
                    
                    // إضافة timestamp جديد لإجبار المتصفح على تحميل النسخة الجديدة
                    try {
                        const url = new URL(href, window.location.origin);
                        url.searchParams.set('v', timestamp);
                        newLink.href = url.toString();
                    } catch (urlError) {
                        // إذا فشل إنشاء URL، استخدم href مباشرة مع timestamp
                        const separator = href.includes('?') ? '&' : '?';
                        newLink.href = `${href}${separator}v=${timestamp}`;
                    }
                    
                    // إضافة event listeners
                    newLink.onload = () => {
                        reloadedCount++;
                        const fileName = href.split('/').pop() || href;
                        console.log(`✅ تم تحميل CSS جديد: ${fileName}`);
                        
                        // إزالة الملف القديم بعد تحميل الجديد
                        setTimeout(() => {
                            try {
                                if (link.parentNode) {
                                    link.parentNode.removeChild(link);
                                }
                            } catch (removeError) {
                                console.warn('⚠️ خطأ في إزالة CSS القديم:', removeError);
                            }
                        }, 100);
                    };
                    
                    newLink.onerror = () => {
                        const fileName = href.split('/').pop() || href;
                        console.warn(`⚠️ خطأ في تحميل CSS: ${fileName}`);
                    };
                    
                    // إضافة الملف الجديد
                    if (link.parentNode) {
                        link.parentNode.insertBefore(newLink, link.nextSibling);
                        const fileName = href.split('/').pop() || href;
                        console.log(`🔄 إعادة تحميل CSS: ${fileName}`);
                    }
                } catch (err) {
                    console.warn(`⚠️ خطأ في إعادة تحميل CSS: ${href}`, err);
                }
            }
        });
        
        // إجبار المتصفح على إعادة تطبيق الأنماط
        setTimeout(() => {
            try {
                // إعادة تطبيق CSS variables
                const root = document.documentElement;
                root.style.setProperty('--primary-color', '#3D5A94');
                root.style.setProperty('--primary-dark', '#2A4070');
                root.style.setProperty('--primary-light', '#5176B8');
                
                // إجبار إعادة حساب الأنماط
                const adminElements = document.querySelectorAll('.dashboard-layout, .admin-content, .submissions-table');
                adminElements.forEach(el => {
                    el.style.display = 'none';
                    el.offsetHeight; // Force reflow
                    el.style.display = '';
                });
                
                console.log(`✅ تم إعادة تطبيق الأنماط على ${adminElements.length} عنصر`);
            } catch (err) {
                console.warn('⚠️ خطأ في إعادة تطبيق الأنماط:', err);
            }
        }, 300);
        
        return { 
            success: true, 
            message: `تم إعادة تحميل ${reloadedCount} ملف CSS بنجاح`,
            reloaded: reloadedCount
        };
        
    } catch (error) {
        console.error('❌ خطأ في إعادة تحميل CSS:', error);
        return { success: false, error: error.message };
    }
}

/**
 * مسح كاش صفحة محددة
 * @param {string} pageName - اسم الصفحة (submissions, submission-details, dashboard)
 */
export async function clearPageCache(pageName) {
    try {
        console.log(`🧹 بدء مسح كاش صفحة: ${pageName}`);
        
        const pagePatterns = {
            'submissions': [/submission/i, /submissions/i],
            'submission-details': [/submission.*detail/i, /submission.*details/i],
            'dashboard': [/dashboard/i, /admin.*dashboard/i]
        };
        
        const patterns = pagePatterns[pageName] || [];
        let clearedCount = 0;
        
        // مسح من localStorage
        Object.keys(localStorage).forEach(key => {
            if (patterns.some(pattern => pattern.test(key))) {
                try {
                    localStorage.removeItem(key);
                    clearedCount++;
                    console.log(`🗑️ تم مسح localStorage: ${key}`);
                } catch (err) {
                    console.warn(`⚠️ خطأ في مسح localStorage: ${key}`, err);
                }
            }
        });
        
        // مسح من sessionStorage
        Object.keys(sessionStorage).forEach(key => {
            if (patterns.some(pattern => pattern.test(key))) {
                try {
                    sessionStorage.removeItem(key);
                    clearedCount++;
                    console.log(`🗑️ تم مسح sessionStorage: ${key}`);
                } catch (err) {
                    console.warn(`⚠️ خطأ في مسح sessionStorage: ${key}`, err);
                }
            }
        });
        
        console.log(`✅ تم مسح ${clearedCount} عنصر من كاش صفحة ${pageName}`);
        
        return { success: true, cleared: clearedCount };
        
    } catch (error) {
        console.error(`❌ خطأ في مسح كاش صفحة ${pageName}:`, error);
        return { success: false, error: error.message };
    }
}

