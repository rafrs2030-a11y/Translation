// Service Worker for PWA (Next.js compatible)
// Note: Next.js handles routing, this SW only caches static assets
const CACHE_NAME = 'arab-research-platform-nextjs-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/images/logo.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.filter(Boolean));
      })
      .then(() => {
        // Delete old caches immediately
        return caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== CACHE_NAME) {
                console.log('Deleting old cache:', cacheName);
                return caches.delete(cacheName);
              }
            })
          );
        });
      })
      .catch((error) => {
        console.warn('Cache installation failed:', error);
      })
  );
  self.skipWaiting();
});

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
// Next.js handles routing, we only cache static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip caching for external resources (CDNs, fonts, etc.)
  const isExternalResource = 
    url.origin.includes('fonts.googleapis.com') ||
    url.origin.includes('fonts.gstatic.com') ||
    url.origin.includes('cdnjs.cloudflare.com') ||
    url.origin.includes('cdn.jsdelivr.net') ||
    url.origin.includes('supabase.co') ||
    url.pathname.startsWith('/_next');
  
  // For external resources or Next.js internal routes, just fetch from network
  if (isExternalResource) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Skip caching for unsupported URL schemes
  const unsupportedSchemes = ['chrome-extension:', 'chrome:', 'moz-extension:', 'data:', 'blob:'];
  const requestScheme = url.protocol;
  const isUnsupportedScheme = unsupportedSchemes.some(scheme => requestScheme.startsWith(scheme));
  
  if (isUnsupportedScheme) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // For static assets only, use network-first strategy
  // Next.js handles all page routing
  event.respondWith(
    fetch(event.request)
      .then((fetchResponse) => {
        if (fetchResponse && fetchResponse.status === 200) {
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          }).catch((error) => {
            console.warn('Failed to cache request:', event.request.url, error);
          });
        }
        return fetchResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
