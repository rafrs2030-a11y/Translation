// Service Worker for PWA
const CACHE_NAME = 'arab-research-platform-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/landing.css',
  '/js/main.js',
  '/js/landing.js',
  '/manifest.json',
  '/images/logo.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
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
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip caching for external resources (CDNs, fonts, etc.)
  const isExternalResource = 
    url.origin.includes('fonts.googleapis.com') ||
    url.origin.includes('fonts.gstatic.com') ||
    url.origin.includes('cdnjs.cloudflare.com') ||
    url.origin.includes('cdn.jsdelivr.net') ||
    url.origin.includes('supabase.co');
  
  // For external resources, just fetch from network
  if (isExternalResource) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Skip caching for unsupported URL schemes (chrome-extension, data, blob, etc.)
  const unsupportedSchemes = ['chrome-extension:', 'chrome:', 'moz-extension:', 'data:', 'blob:'];
  const requestScheme = url.protocol;
  const isUnsupportedScheme = unsupportedSchemes.some(scheme => requestScheme.startsWith(scheme));
  
  if (isUnsupportedScheme) {
    // For unsupported schemes, just fetch from network without caching
    event.respondWith(fetch(event.request));
    return;
  }
  
  // For local resources, use network-first strategy to ensure fresh content
  event.respondWith(
    fetch(event.request)
      .then((fetchResponse) => {
        // Cache the response for future use (only for successful responses)
        if (fetchResponse && fetchResponse.status === 200) {
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          }).catch((error) => {
            // Silently fail if caching is not possible (e.g., unsupported scheme)
            console.warn('Failed to cache request:', event.request.url, error);
          });
        }
        return fetchResponse;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request);
      })
  );
});

