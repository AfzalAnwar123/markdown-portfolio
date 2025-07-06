// Service Worker for Bandwidth Optimized App
const CACHE_NAME = 'bandwidth-optimized-v1';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Resources to cache immediately
const STATIC_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json'
];

// Dynamic cache patterns for efficient storage
const CACHE_STRATEGIES = {
    'same-origin': 'cache-first',
    'cross-origin': 'network-first',
    'images': 'cache-first',
    'api': 'network-first'
};

// Install event - cache static resources
self.addEventListener('install', event => {
    console.log('SW: Installing and caching static resources');
    
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_CACHE);
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    console.log('SW: Activated, cleaning old caches');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('SW: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Determine cache strategy based on request type
    const strategy = getCacheStrategy(request, url);
    
    event.respondWith(
        handleRequest(request, strategy)
    );
});

// Determine appropriate cache strategy
function getCacheStrategy(request, url) {
    // API requests - prefer network for fresh data
    if (url.pathname.startsWith('/api/')) {
        return 'network-first';
    }
    
    // Images - cache aggressively
    if (request.destination === 'image') {
        return 'cache-first';
    }
    
    // Same origin resources - cache first for speed
    if (url.origin === self.location.origin) {
        return 'cache-first';
    }
    
    // Cross-origin - network first for updates
    return 'network-first';
}

// Handle requests based on strategy
async function handleRequest(request, strategy) {
    const cache = await caches.open(CACHE_NAME);
    
    switch (strategy) {
        case 'cache-first':
            return cacheFirst(request, cache);
        case 'network-first':
            return networkFirst(request, cache);
        case 'cache-only':
            return cacheOnly(request, cache);
        case 'network-only':
            return networkOnly(request);
        default:
            return cacheFirst(request, cache);
    }
}

// Cache-first strategy - fastest for static resources
async function cacheFirst(request, cache) {
    try {
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // Check if cache is expired
            const cacheTime = cachedResponse.headers.get('sw-cache-time');
            if (cacheTime && Date.now() - parseInt(cacheTime) > CACHE_EXPIRY) {
                // Cache expired, try to update in background
                updateCacheInBackground(request, cache);
            }
            
            return cachedResponse;
        }
        
        // Not in cache, fetch from network
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            await cacheResponse(request, networkResponse.clone(), cache);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('SW: Cache-first failed, trying cache:', error);
        return cache.match(request) || createFallbackResponse(request);
    }
}

// Network-first strategy - best for dynamic content
async function networkFirst(request, cache) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            await cacheResponse(request, networkResponse.clone(), cache);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('SW: Network failed, trying cache:', error);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return createFallbackResponse(request);
    }
}

// Cache-only strategy
async function cacheOnly(request, cache) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || createFallbackResponse(request);
}

// Network-only strategy
async function networkOnly(request) {
    try {
        return await fetch(request);
    } catch (error) {
        return createFallbackResponse(request);
    }
}

// Cache response with compression info
async function cacheResponse(request, response, cache) {
    // Add cache timestamp
    const responseToCache = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
            ...Object.fromEntries(response.headers.entries()),
            'sw-cache-time': Date.now().toString()
        }
    });
    
    await cache.put(request, responseToCache);
    
    // Update cache statistics
    updateCacheStats();
}

// Update cache in background (for expired resources)
function updateCacheInBackground(request, cache) {
    fetch(request).then(response => {
        if (response.ok) {
            cacheResponse(request, response, cache);
        }
    }).catch(error => {
        console.log('SW: Background update failed:', error);
    });
}

// Create fallback response for offline scenarios
function createFallbackResponse(request) {
    const url = new URL(request.url);
    
    // HTML fallback
    if (request.headers.get('accept')?.includes('text/html')) {
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Offline</title>
                <style>
                    body { font-family: sans-serif; text-align: center; padding: 50px; }
                    .offline { color: #666; }
                </style>
            </head>
            <body>
                <div class="offline">
                    <h1>You're Offline</h1>
                    <p>This page isn't available offline, but you can still use cached content.</p>
                    <button onclick="history.back()">Go Back</button>
                </div>
            </body>
            </html>
        `, {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    // JSON API fallback
    if (request.headers.get('accept')?.includes('application/json')) {
        return new Response(JSON.stringify({
            error: 'offline',
            message: 'This request is not available offline',
            cached: false
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Generic fallback
    return new Response('Resource not available offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
    });
}

// Update cache statistics
function updateCacheStats() {
    // Send message to main thread about cache updates
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'cache-updated',
                timestamp: Date.now()
            });
        });
    });
}

// Handle messages from main thread
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'skip-waiting':
            self.skipWaiting();
            break;
            
        case 'cache-size':
            getCacheSize().then(size => {
                event.ports[0].postMessage({ size });
            });
            break;
            
        case 'clear-cache':
            clearExpiredCache().then(() => {
                event.ports[0].postMessage({ cleared: true });
            });
            break;
    }
});

// Get total cache size
async function getCacheSize() {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    let totalSize = 0;
    
    for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
            const text = await response.clone().text();
            totalSize += new Blob([text]).size;
        }
    }
    
    return totalSize;
}

// Clear expired cache entries
async function clearExpiredCache() {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    
    for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
            const cacheTime = response.headers.get('sw-cache-time');
            if (cacheTime && Date.now() - parseInt(cacheTime) > CACHE_EXPIRY) {
                await cache.delete(request);
                console.log('SW: Deleted expired cache entry:', request.url);
            }
        }
    }
}

// Background sync for data efficiency
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(performBackgroundSync());
    }
});

// Perform background sync operations
async function performBackgroundSync() {
    console.log('SW: Performing background sync for data efficiency');
    
    // Sync any pending offline actions
    // Update critical cached resources
    // Clean up expired cache entries
    
    await clearExpiredCache();
    
    // Notify main thread
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({
            type: 'sync-complete',
            timestamp: Date.now()
        });
    });
}

// Push notifications for critical updates (bandwidth-aware)
self.addEventListener('push', event => {
    if (!event.data) return;
    
    const data = event.data.json();
    
    // Only show notifications for critical updates to save bandwidth
    if (data.priority === 'high') {
        const options = {
            body: data.message,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            data: data.url,
            requireInteraction: data.urgent
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.notification.data) {
        event.waitUntil(
            self.clients.openWindow(event.notification.data)
        );
    }
});