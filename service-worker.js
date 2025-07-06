// Service Worker for TripPlanner App
// Provides offline functionality and caching

const CACHE_NAME = 'tripplanner-v1.0.0';
const STATIC_CACHE = 'tripplanner-static-v1.0.0';
const DYNAMIC_CACHE = 'tripplanner-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    // Add any additional static assets here
];

// Dynamic files that may be cached on request
const DYNAMIC_FILES = [
    // Weather API responses
    // Flight data
    // Hotel information
    // Activity data
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('Service Worker: Error caching static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old cache versions
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim(); // Take control immediately
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip external domains (except for weather APIs, etc.)
    if (!url.origin.includes(self.location.origin) && 
        !isAllowedExternalDomain(url.origin)) {
        return;
    }

    event.respondWith(
        handleFetchRequest(request)
    );
});

// Handle fetch requests with different strategies
async function handleFetchRequest(request) {
    const url = new URL(request.url);
    
    try {
        // Strategy 1: Cache First for static files
        if (isStaticFile(request)) {
            return await cacheFirstStrategy(request);
        }
        
        // Strategy 2: Network First for dynamic content
        if (isDynamicContent(request)) {
            return await networkFirstStrategy(request);
        }
        
        // Strategy 3: Stale While Revalidate for other content
        return await staleWhileRevalidateStrategy(request);
        
    } catch (error) {
        console.error('Service Worker: Fetch error', error);
        return await handleFetchError(request);
    }
}

// Cache First Strategy - for static files
async function cacheFirstStrategy(request) {
    const cacheResponse = await caches.match(request);
    
    if (cacheResponse) {
        return cacheResponse;
    }
    
    // If not in cache, fetch from network and cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Network First Strategy - for dynamic content
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // If network fails, try cache
        const cacheResponse = await caches.match(request);
        return cacheResponse || createOfflineResponse(request);
    }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidateStrategy(request) {
    const cacheResponse = await caches.match(request);
    
    // Fetch from network in background
    const networkResponsePromise = fetch(request)
        .then(async (networkResponse) => {
            if (networkResponse.ok) {
                const cache = await caches.open(DYNAMIC_CACHE);
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => null);
    
    // Return cached version immediately if available
    return cacheResponse || networkResponsePromise || createOfflineResponse(request);
}

// Error handling for failed fetch requests
async function handleFetchError(request) {
    const url = new URL(request.url);
    
    // Try to serve from cache
    const cacheResponse = await caches.match(request);
    if (cacheResponse) {
        return cacheResponse;
    }
    
    // Return appropriate offline response
    return createOfflineResponse(request);
}

// Create offline response for different content types
function createOfflineResponse(request) {
    const url = new URL(request.url);
    
    // For HTML pages, return the main app
    if (request.headers.get('accept').includes('text/html')) {
        return caches.match('/index.html') || new Response(
            createOfflineHTML(),
            { 
                headers: { 'Content-Type': 'text/html' },
                status: 200 
            }
        );
    }
    
    // For API requests, return JSON error
    if (url.pathname.startsWith('/api') || request.headers.get('accept').includes('application/json')) {
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'This feature requires an internet connection',
                offline: true
            }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 503
            }
        );
    }
    
    // For other resources, return basic error
    return new Response(
        'Offline - Content not available',
        { status: 503 }
    );
}

// Create basic offline HTML page
function createOfflineHTML() {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>TripPlanner - Offline</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    margin: 0; padding: 2rem; text-align: center; 
                    background: #f8fafc; color: #1e293b;
                }
                .container { max-width: 400px; margin: 0 auto; }
                .icon { font-size: 4rem; margin-bottom: 1rem; }
                h1 { color: #2563eb; margin-bottom: 1rem; }
                .btn { 
                    display: inline-block; padding: 0.75rem 1.5rem; 
                    background: #2563eb; color: white; text-decoration: none; 
                    border-radius: 0.5rem; margin-top: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">✈️</div>
                <h1>TripPlanner</h1>
                <p>You're currently offline, but your trip planning data is safely stored locally.</p>
                <p>You can continue planning your trip and your changes will be saved.</p>
                <a href="/" class="btn" onclick="window.location.reload()">Return to App</a>
            </div>
        </body>
        </html>
    `;
}

// Utility functions
function isStaticFile(request) {
    const url = new URL(request.url);
    const staticExtensions = ['.html', '.css', '.js', '.json', '.ico', '.png', '.jpg', '.svg'];
    return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
           STATIC_FILES.includes(url.pathname);
}

function isDynamicContent(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api') || 
           url.searchParams.has('dynamic') ||
           request.headers.get('cache-control') === 'no-cache';
}

function isAllowedExternalDomain(origin) {
    const allowedDomains = [
        'https://api.openweathermap.org',
        'https://api.weatherapi.com',
        'https://api.mapbox.com',
        'https://maps.googleapis.com'
        // Add other trusted external APIs here
    ];
    
    return allowedDomains.some(domain => origin.includes(domain));
}

// Background Sync for data synchronization
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'trip-data-sync') {
        event.waitUntil(syncTripData());
    }
    
    if (event.tag === 'weather-data-sync') {
        event.waitUntil(syncWeatherData());
    }
});

// Sync trip data when back online
async function syncTripData() {
    try {
        console.log('Service Worker: Syncing trip data...');
        
        // Get pending sync data from IndexedDB or localStorage
        const pendingData = await getPendingSyncData();
        
        if (pendingData && pendingData.length > 0) {
            // Process pending sync operations
            for (const item of pendingData) {
                await processSyncItem(item);
            }
            
            // Clear pending data after successful sync
            await clearPendingSyncData();
            
            // Notify the app about successful sync
            await notifyClientsOfSync('trip-data-synced');
        }
        
    } catch (error) {
        console.error('Service Worker: Error syncing trip data', error);
        throw error; // Will retry background sync
    }
}

// Sync weather data
async function syncWeatherData() {
    try {
        console.log('Service Worker: Syncing weather data...');
        
        // Implementation for weather data sync
        // This would fetch fresh weather data for saved destinations
        
    } catch (error) {
        console.error('Service Worker: Error syncing weather data', error);
        throw error;
    }
}

// Utility functions for background sync
async function getPendingSyncData() {
    // Implementation would depend on your data storage strategy
    // Could use IndexedDB, localStorage, or other storage mechanisms
    return [];
}

async function processSyncItem(item) {
    // Process individual sync items
    console.log('Processing sync item:', item);
}

async function clearPendingSyncData() {
    // Clear processed sync data
    console.log('Clearing pending sync data');
}

async function notifyClientsOfSync(message) {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({
            type: 'SYNC_COMPLETE',
            message: message
        });
    });
}

// Push notification handling (for future features)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body || 'You have a new travel update!',
            icon: '/icon-192.png',
            badge: '/icon-96.png',
            tag: data.tag || 'trip-update',
            data: data.data || {},
            actions: [
                {
                    action: 'view',
                    title: 'View Details'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(
                data.title || 'TripPlanner Update',
                options
            )
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'view') {
        // Open the app to the relevant section
        event.waitUntil(
            self.clients.openWindow('/?notification=' + event.notification.tag)
        );
    }
});

// Message handling for communication with the main app
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data.type === 'CACHE_WEATHER_DATA') {
        cacheWeatherData(event.data.data);
    }
});

// Cache weather data for offline use
async function cacheWeatherData(weatherData) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = new Response(JSON.stringify(weatherData), {
            headers: { 'Content-Type': 'application/json' }
        });
        
        await cache.put('/weather-data', response);
        console.log('Service Worker: Weather data cached');
    } catch (error) {
        console.error('Service Worker: Error caching weather data', error);
    }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'weather-update') {
        event.waitUntil(updateWeatherCache());
    }
});

async function updateWeatherCache() {
    console.log('Service Worker: Updating weather cache in background');
    // Implementation for periodic weather updates
}

console.log('Service Worker: Loaded successfully');