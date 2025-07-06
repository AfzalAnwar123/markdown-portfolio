// Bandwidth Optimized App - Main JavaScript
class BandwidthOptimizer {
    constructor() {
        this.dataUsage = {
            session: 0,
            requests: 0,
            cached: 0
        };
        this.isOffline = !navigator.onLine;
        this.connectionType = this.getConnectionType();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.monitorConnection();
        this.updateUI();
        this.loadInitialContent();
        this.startDataUsageMonitoring();
    }

    setupEventListeners() {
        // Network status monitoring
        window.addEventListener('online', () => {
            this.isOffline = false;
            this.updateConnectionStatus();
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOffline = true;
            this.updateConnectionStatus();
            this.showOfflineBanner();
        });

        // Connection change monitoring
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                this.connectionType = this.getConnectionType();
                this.adaptToConnection();
            });
        }
    }

    getConnectionType() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                effectiveType: conn.effectiveType,
                saveData: conn.saveData,
                downlink: conn.downlink
            };
        }
        return { effectiveType: '4g', saveData: false, downlink: 10 };
    }

    adaptToConnection() {
        const { effectiveType, saveData } = this.connectionType;
        
        if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
            document.body.classList.add('bandwidth-saver');
            this.enableDataSaverMode();
        } else {
            document.body.classList.remove('bandwidth-saver');
            this.disableDataSaverMode();
        }
        
        this.updateConnectionStatus();
    }

    enableDataSaverMode() {
        // Reduce image quality, disable autoplay, etc.
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src && !img.dataset.compressed) {
                img.dataset.original = img.src;
                img.dataset.compressed = 'true';
                // In a real app, you'd switch to compressed versions
            }
        });
    }

    disableDataSaverMode() {
        const images = document.querySelectorAll('img[data-compressed]');
        images.forEach(img => {
            if (img.dataset.original) {
                img.src = img.dataset.original;
                delete img.dataset.compressed;
            }
        });
    }

    updateConnectionStatus() {
        const statusEl = document.getElementById('connection-status');
        const { effectiveType, saveData } = this.connectionType;
        
        if (this.isOffline) {
            statusEl.className = 'status offline';
            statusEl.textContent = 'Offline - Using Cached Content';
        } else if (saveData || effectiveType === '2g' || effectiveType === 'slow-2g') {
            statusEl.className = 'status limited';
            statusEl.textContent = `Online - Data Saver Mode (${effectiveType})`;
        } else {
            statusEl.className = 'status online';
            statusEl.textContent = `Online - Low Data Mode (${effectiveType})`;
        }
    }

    showOfflineBanner() {
        let banner = document.querySelector('.offline-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.className = 'offline-banner';
            banner.textContent = 'You are offline. Using cached content.';
            document.body.appendChild(banner);
        }
        banner.classList.add('show');
        
        setTimeout(() => {
            banner.classList.remove('show');
        }, 3000);
    }

    startDataUsageMonitoring() {
        // Monitor fetch requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch.apply(this, args);
            this.trackDataUsage(response);
            return response;
        };

        // Update UI every second
        setInterval(() => this.updateDataUsageUI(), 1000);
    }

    trackDataUsage(response) {
        this.dataUsage.requests++;
        
        // Estimate data usage from content-length header
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
            this.dataUsage.session += parseInt(contentLength);
        } else {
            // Estimate based on response type
            this.dataUsage.session += 1024; // 1KB estimate
        }

        this.updateDataUsageUI();
    }

    updateDataUsageUI() {
        document.getElementById('session-data').textContent = 
            this.formatBytes(this.dataUsage.session);
        document.getElementById('request-count').textContent = 
            this.dataUsage.requests;
        document.getElementById('cached-count').textContent = 
            this.dataUsage.cached;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    async loadInitialContent() {
        const contentArea = document.getElementById('content-area');
        
        // Simulate efficient content loading
        setTimeout(() => {
            contentArea.innerHTML = `
                <div class="content-item compressed">
                    <h3>Welcome to Bandwidth Optimized App</h3>
                    <p>This content is optimized for minimal data usage. Images are compressed, requests are batched, and everything is cached aggressively.</p>
                </div>
                <div class="content-item compressed">
                    <h3>Data Usage Features</h3>
                    <p>• Compressed transfers • Smart caching • Offline support • Progressive loading</p>
                    <div class="data-meter">
                        <div class="data-meter-fill" style="width: 25%"></div>
                    </div>
                </div>
            `;
        }, 500);
    }

    syncOfflineData() {
        // Sync any offline changes when coming back online
        console.log('Syncing offline data...');
        
        // In a real app, you'd sync stored offline actions
        setTimeout(() => {
            console.log('Offline data synced successfully');
        }, 1000);
    }

    updateUI() {
        this.updateConnectionStatus();
        this.adaptToConnection();
    }
}

// Global functions for UI interactions
function loadContent() {
    const contentArea = document.getElementById('content-area');
    const loadBtn = event.target;
    
    loadBtn.disabled = true;
    loadBtn.textContent = 'Loading...';
    
    // Simulate efficient content loading with compression
    setTimeout(() => {
        const newContent = document.createElement('div');
        newContent.className = 'content-item compressed';
        newContent.innerHTML = `
            <h3>Efficiently Loaded Content #${Date.now()}</h3>
            <p>This content was loaded using minimal bandwidth with smart compression and caching.</p>
            <div class="usage-chart">
                ${Array(8).fill(0).map((_, i) => 
                    `<div class="usage-bar ${i < 3 ? 'active' : ''}" style="height: ${Math.random() * 50 + 10}px"></div>`
                ).join('')}
            </div>
        `;
        
        contentArea.appendChild(newContent);
        
        loadBtn.disabled = false;
        loadBtn.textContent = 'Load More (Efficient)';
        
        // Update data usage
        window.bandwidthOptimizer.dataUsage.session += 2048; // 2KB simulated
        window.bandwidthOptimizer.updateDataUsageUI();
    }, 800);
}

function refreshContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '<div class="loading">Refreshing optimized content<span class="loading-dots"></span></div>';
    
    setTimeout(() => {
        window.bandwidthOptimizer.loadInitialContent();
    }, 1000);
}

function testOffline() {
    // Simulate offline mode for testing
    window.bandwidthOptimizer.isOffline = true;
    window.bandwidthOptimizer.updateConnectionStatus();
    window.bandwidthOptimizer.showOfflineBanner();
    
    setTimeout(() => {
        window.bandwidthOptimizer.isOffline = navigator.onLine;
        window.bandwidthOptimizer.updateConnectionStatus();
    }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bandwidthOptimizer = new BandwidthOptimizer();
    
    // Check for updates periodically (efficient polling)
    setInterval(() => {
        if (navigator.onLine && !window.bandwidthOptimizer.connectionType.saveData) {
            // Only check for updates when online and not in data saver mode
            console.log('Checking for updates (bandwidth aware)...');
        }
    }, 60000); // Check every minute instead of constantly
});

// Efficient image lazy loading
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Performance monitoring for bandwidth optimization
function trackPerformance() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'navigation') {
                    console.log(`Page load time: ${entry.loadEventEnd - entry.loadEventStart}ms`);
                }
            });
        });
        observer.observe({ entryTypes: ['navigation'] });
    }
}