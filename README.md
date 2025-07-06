# Bandwidth Optimized Web App

A Progressive Web App (PWA) designed for minimal internet usage with efficient caching, data compression, and offline functionality.

## Features

🚀 **Bandwidth Optimized**
- Intelligent caching strategies
- Compressed data transfers
- Minimal resource loading
- Connection-aware adaptations

📊 **Data Usage Monitoring**
- Real-time bandwidth tracking
- Session data usage display
- Network request counting
- Cache utilization metrics

⚡ **Performance Optimized**
- Critical CSS inlined
- Lazy loading implementation
- Service worker caching
- Background sync capabilities

📱 **Progressive Web App**
- Offline functionality
- Installable on mobile/desktop
- Push notification support
- Responsive design

🔄 **Smart Caching**
- Cache-first for static resources
- Network-first for dynamic content
- Automatic cache expiry
- Background cache updates

## Architecture

- **index.html** - Main application with inline critical CSS
- **styles.css** - Non-critical styles loaded asynchronously
- **app.js** - Core application logic and bandwidth optimization
- **sw.js** - Service worker for caching and offline functionality
- **manifest.json** - PWA configuration

## Bandwidth Optimization Techniques

1. **Resource Optimization**
   - Inline critical CSS (reduces HTTP requests)
   - Compressed SVG icons as data URLs
   - Minified and efficient code

2. **Intelligent Caching**
   - Cache-first strategy for static assets
   - Network-first for API calls
   - 24-hour cache expiry with background updates

3. **Connection Adaptation**
   - Detects slow connections (2G/3G)
   - Enables data saver mode automatically
   - Reduces image quality on slow networks

4. **Efficient Loading**
   - Progressive content loading
   - Lazy loading for images
   - Batched network requests

## Usage

1. Open `index.html` in a web browser
2. The app automatically detects your connection type
3. View real-time data usage in the monitoring panel
4. Test offline functionality with the "Test Offline Mode" button
5. Install as a PWA from your browser menu

## Browser Support

- Modern browsers with Service Worker support
- Progressive enhancement for older browsers
- Mobile-first responsive design

## License

This repository is licensed under [MIT](LICENSE) - optimized for minimal bandwidth usage.
