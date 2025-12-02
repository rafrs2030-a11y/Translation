/**
 * Researcher Cache Clear Utility
 * وظيفة مسح الكاش في صفحات الباحث - Real-time Cache Clearing
 */

// حالة مسح الكاش التلقائي
let autoCacheClearInterval = null;
let isAutoCacheClearing = false;

/**
 * مسح الكاش القديم في صفحات الباحث - شامل وكامل
 * يشمل: localStorage, sessionStorage, CSS cache, Service Worker cache, IndexedDB
 */
export async function clearResearcherCache(options = {}) {
    try {
        const {
            silent = false, // لا تظهر logs إذا كان true
            clearAll = true, // مسح كل الكاش المتعلق بالباحث
            preserveAuth = true // الحفاظ على tokens المصادقة
        } = options;

        if (!silent) {
            console.log('🧹 بدء مسح كاش صفحات الباحث (Real-time)...');
        }
        
        let clearedCount = 0;
        const clearedItems = {
            localStorage: 0,
            sessionStorage: 0,
            css: 0,
            serviceWorker: 0,
            indexedDB: 0,
            fetchCache: 0
        };
        
        // أنماط البحث للمفاتيح المتعلقة بصفحات الباحث - موسعة
        const researcherPatterns = [
            /^researcher_/i,
            /^submission/i,
            /submissions/i,
            /submission.*details/i,
            /researcher.*store/i,
            /researcher.*cache/i,
            /researcher.*state/i,
            /^sb-.*researcher/i,
            /^sb-.*submission/i,
            /supabase.*researcher/i,
            /supabase.*submission/i,
            /dashboard.*researcher/i,
            /notifications.*researcher/i,
            /profile.*researcher/i,
            /submit.*research/i,
            /researcher.*data/i,
            /researcher.*list/i,
            /researcher.*filter/i
        ];
        
        /**
         * التحقق من تطابق المفتاح مع أي نمط
         */
        const matchesPattern = (key) => {
            return researcherPatterns.some(pattern => pattern.test(key));
        };
        
        /**
         * مسح المفاتيح من storage معين
         */
        const clearFromStorage = (storage, storageName) => {
            try {
                const allKeys = Object.keys(storage);
                let storageCleared = 0;
                
                allKeys.forEach(key => {
                    // إذا كان clearAll = true، امسح كل شيء عدا auth tokens
                    const shouldClear = clearAll 
                        ? (preserveAuth && !key.match(/^(sb-|supabase\.auth\.|auth_token|refresh_token)/i))
                            ? !key.match(/^(sb-|supabase\.auth\.|auth_token|refresh_token)/i)
                            : true
                        : matchesPattern(key);
                    
                    if (shouldClear) {
                        try {
                            storage.removeItem(key);
                            storageCleared++;
                            clearedCount++;
                            if (!silent) {
                                console.log(`🗑️ تم مسح ${storageName}: ${key}`);
                            }
                        } catch (err) {
                            if (!silent) {
                                console.warn(`⚠️ خطأ في مسح ${storageName} key: ${key}`, err);
                            }
                        }
                    }
                });
                
                clearedItems[storageName === 'localStorage' ? 'localStorage' : 'sessionStorage'] = storageCleared;
                return storageCleared;
            } catch (err) {
                if (!silent) {
                    console.error(`❌ خطأ في الوصول إلى ${storageName}:`, err);
                }
                return 0;
            }
        };
        
        // مسح من localStorage
        clearFromStorage(localStorage, 'localStorage');
        
        // مسح من sessionStorage
        if (clearAll) {
            try {
                sessionStorage.clear();
                clearedItems.sessionStorage = Object.keys(sessionStorage).length;
            } catch (err) {
                clearFromStorage(sessionStorage, 'sessionStorage');
            }
        } else {
            clearFromStorage(sessionStorage, 'sessionStorage');
        }
        
        // مسح من IndexedDB
        if ('indexedDB' in window) {
            try {
                const dbNames = [
                    'researcher', 'researcher_submissions', 'researcher_cache',
                    'researcher_dashboard', 'researcher_notifications',
                    'submissions_cache', 'submission_details'
                ];
                
                for (const dbName of dbNames) {
                    try {
                        const deleteRequest = indexedDB.deleteDatabase(dbName);
                        await new Promise((resolve) => {
                            deleteRequest.onsuccess = () => {
                                clearedItems.indexedDB++;
                                clearedCount++;
                                if (!silent) {
                                    console.log(`🗑️ تم مسح IndexedDB: ${dbName}`);
                                }
                                resolve();
                            };
                            deleteRequest.onerror = () => {
                                if (!silent) {
                                    console.warn(`⚠️ خطأ في مسح IndexedDB: ${dbName}`);
                                }
                                resolve();
                            };
                            deleteRequest.onblocked = () => {
                                if (!silent) {
                                    console.warn(`⚠️ IndexedDB محظور: ${dbName}`);
                                }
                                resolve();
                            };
                        });
                    } catch (err) {
                        if (!silent) {
                            console.warn(`⚠️ خطأ في محاولة مسح IndexedDB: ${dbName}`, err);
                        }
                    }
                }
            } catch (err) {
                if (!silent) {
                    console.warn('⚠️ خطأ في الوصول إلى IndexedDB:', err);
                }
            }
        }
        
        // مسح كاش Service Workers المتعلق بصفحات الباحث
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                const researcherCacheNames = cacheNames.filter(name => 
                    /researcher|submission|dashboard|notification|profile/i.test(name) || clearAll
                );
                
                await Promise.all(
                    researcherCacheNames.map(async (cacheName) => {
                        try {
                            const deleted = await caches.delete(cacheName);
                            if (deleted) {
                                clearedItems.serviceWorker++;
                                clearedCount++;
                                if (!silent) {
                                    console.log(`🗑️ تم مسح Service Worker cache: ${cacheName}`);
                                }
                            }
                        } catch (err) {
                            if (!silent) {
                                console.warn(`⚠️ خطأ في مسح Service Worker cache: ${cacheName}`, err);
                            }
                        }
                    })
                );
            } catch (err) {
                if (!silent) {
                    console.warn('⚠️ خطأ في الوصول إلى Service Worker caches:', err);
                }
            }
        }
        
        // مسح Fetch Cache (Network Cache)
        try {
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                for (const cacheName of cacheNames) {
                    try {
                        const cache = await caches.open(cacheName);
                        const requests = await cache.keys();
                        const researcherRequests = requests.filter(req => 
                            req.url.includes('/researcher/') || 
                            req.url.includes('/api/researcher/') ||
                            req.url.includes('submissions') ||
                            clearAll
                        );
                        
                        await Promise.all(
                            researcherRequests.map(req => cache.delete(req))
                        );
                        
                        clearedItems.fetchCache += researcherRequests.length;
                    } catch (err) {
                        // تجاهل الأخطاء
                    }
                }
            }
        } catch (err) {
            // تجاهل الأخطاء
        }
        
        // إعادة تحميل ملفات CSS
        await reloadResearcherCSS({ silent });
        clearedItems.css = 1;
        
        // تقرير النتائج
        if (!silent) {
            if (clearedCount > 0) {
                console.log(`✅ تم مسح ${clearedCount} عنصر من كاش صفحات الباحث (Real-time):`);
                console.log(`   - localStorage: ${clearedItems.localStorage}`);
                console.log(`   - sessionStorage: ${clearedItems.sessionStorage}`);
                console.log(`   - IndexedDB: ${clearedItems.indexedDB}`);
                console.log(`   - Service Worker: ${clearedItems.serviceWorker}`);
                console.log(`   - Fetch Cache: ${clearedItems.fetchCache}`);
                console.log(`   - CSS: ${clearedItems.css}`);
            } else {
                console.log('✅ لا يوجد كاش قديم لصفحات الباحث');
            }
        }
        
        return {
            success: true,
            cleared: clearedCount,
            details: clearedItems,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('❌ خطأ في مسح كاش صفحات الباحث:', error);
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * بدء مسح الكاش التلقائي بشكل Real-time
 * @param {number} intervalMinutes - عدد الدقائق بين كل مسح (افتراضي: 5 دقائق)
 */
export function startAutoCacheClearing(intervalMinutes = 5) {
    // إيقاف أي interval سابق
    if (autoCacheClearInterval) {
        stopAutoCacheClearing();
    }
    
    // مسح الكاش فوراً عند البدء
    clearResearcherCache({ silent: true, clearAll: true, preserveAuth: true });
    
    // إنشاء interval للمسح التلقائي
    const intervalMs = intervalMinutes * 60 * 1000;
    autoCacheClearInterval = setInterval(() => {
        if (!isAutoCacheClearing) {
            isAutoCacheClearing = true;
            clearResearcherCache({ silent: true, clearAll: true, preserveAuth: true })
                .finally(() => {
                    isAutoCacheClearing = false;
                });
        }
    }, intervalMs);
    
    console.log(`✅ تم تفعيل مسح الكاش التلقائي (Real-time) كل ${intervalMinutes} دقيقة`);
    
    // مسح الكاش عند تغيير الصفحة
    window.addEventListener('beforeunload', () => {
        clearResearcherCache({ silent: true, clearAll: false, preserveAuth: true });
    });
    
    // مسح الكاش عند العودة للصفحة
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            clearResearcherCache({ silent: true, clearAll: false, preserveAuth: true });
        }
    });
}

/**
 * إيقاف مسح الكاش التلقائي
 */
export function stopAutoCacheClearing() {
    if (autoCacheClearInterval) {
        clearInterval(autoCacheClearInterval);
        autoCacheClearInterval = null;
        console.log('⏸️ تم إيقاف مسح الكاش التلقائي');
    }
}

/**
 * مسح الكاش عند تحميل الصفحة (للصفحات الجديدة)
 */
export async function clearCacheOnPageLoad() {
    // التحقق من وجود timestamp في URL
    const urlParams = new URLSearchParams(window.location.search);
    const hasNoCache = urlParams.has('_nocache');
    
    // إذا كان هناك _nocache في URL، امسح كل الكاش
    if (hasNoCache) {
        await clearResearcherCache({ silent: false, clearAll: true, preserveAuth: true });
        // إزالة _nocache من URL
        urlParams.delete('_nocache');
        const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
        window.history.replaceState({}, '', newUrl);
    } else {
        // مسح الكاش العادي
        await clearResearcherCache({ silent: true, clearAll: false, preserveAuth: true });
    }
}

/**
 * إعادة تحميل ملفات CSS لصفحات الباحث
 */
async function reloadResearcherCSS(options = {}) {
    const { silent = false } = options;
    
    try {
        if (!silent) {
            console.log('🔄 بدء إعادة تحميل ملفات CSS لصفحات الباحث...');
        }
        
        // قائمة ملفات CSS المتعلقة بصفحات الباحث
        const cssFiles = [
            '/css/main.css',
            '/css/dashboard.css',
            '/css/chat.css'
        ];
        
        // مسح كاش CSS من Service Worker
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                const cssCacheNames = cacheNames.filter(name => 
                    /css|style|researcher|dashboard/i.test(name)
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
                            
                            if (!silent) {
                                console.log(`🗑️ تم مسح كاش CSS من: ${cacheName}`);
                            }
                        } catch (err) {
                            if (!silent) {
                                console.warn(`⚠️ خطأ في مسح كاش CSS من: ${cacheName}`, err);
                            }
                        }
                    })
                );
            } catch (err) {
                if (!silent) {
                    console.warn('⚠️ خطأ في الوصول إلى Service Worker caches:', err);
                }
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
                        if (!silent) {
                            console.log(`✅ تم تحميل CSS جديد: ${fileName}`);
                        }
                        
                        // إزالة الملف القديم بعد تحميل الجديد
                        setTimeout(() => {
                            try {
                                if (link.parentNode) {
                                    link.parentNode.removeChild(link);
                                }
                            } catch (removeError) {
                                if (!silent) {
                                    console.warn('⚠️ خطأ في إزالة CSS القديم:', removeError);
                                }
                            }
                        }, 100);
                    };
                    
                    newLink.onerror = () => {
                        const fileName = href.split('/').pop() || href;
                        if (!silent) {
                            console.warn(`⚠️ خطأ في تحميل CSS: ${fileName}`);
                        }
                    };
                    
                    // إضافة الملف الجديد
                    if (link.parentNode) {
                        link.parentNode.insertBefore(newLink, link.nextSibling);
                        const fileName = href.split('/').pop() || href;
                        if (!silent) {
                            console.log(`🔄 إعادة تحميل CSS: ${fileName}`);
                        }
                    }
                } catch (err) {
                    if (!silent) {
                        console.warn(`⚠️ خطأ في إعادة تحميل CSS: ${href}`, err);
                    }
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
                const researcherElements = document.querySelectorAll('.dashboard-layout, .researcher-content, .submissions-list');
                researcherElements.forEach(el => {
                    el.style.display = 'none';
                    el.offsetHeight; // Force reflow
                    el.style.display = '';
                });
                
                if (!silent) {
                    console.log(`✅ تم إعادة تطبيق الأنماط على ${researcherElements.length} عنصر`);
                }
            } catch (err) {
                if (!silent) {
                    console.warn('⚠️ خطأ في إعادة تطبيق الأنماط:', err);
                }
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
 * @param {string} pageName - اسم الصفحة (dashboard, submissions, submit, etc.)
 */
export async function clearPageCache(pageName) {
    try {
        console.log(`🧹 بدء مسح كاش صفحة: ${pageName}`);
        
        const pagePatterns = {
            'dashboard': [/dashboard/i, /researcher.*dashboard/i],
            'submissions': [/submission/i, /submissions/i],
            'submission-details': [/submission.*detail/i, /submission.*details/i],
            'submit': [/submit/i, /submission.*form/i],
            'notifications': [/notification/i, /notifications/i],
            'profile': [/profile/i, /researcher.*profile/i]
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

