# ✈️ TripPlanner Live - Real-time Travel Planning

A cutting-edge, online-first Progressive Web App (PWA) for real-time trip planning with live flight prices, weather updates, hotel availability, and collaborative features. Everything happens in real-time with cloud synchronization!

## 🚀 Features

### 🌐 **Real-time Data**
- Live flight search with current pricing from multiple airlines
- Real-time hotel availability and pricing
- Hourly weather updates and forecasts
- Dynamic activity and restaurant recommendations
- Live price alerts and notifications

### 🤖 **AI-Powered Intelligence**
- Smart trip recommendations based on preferences and budget
- Personalized packing lists based on weather and activities
- Intelligent itinerary generation
- Location-specific travel tips and insights

### 👥 **Collaborative Planning**
- Real-time collaboration with friends and family
- Share trips with live editing capabilities
- Invite collaborators via email
- Track changes and updates from all team members

### ☁️ **Cloud-First Architecture**
- Instant sync across all devices
- Firebase authentication and real-time database
- Automatic backup and recovery
- Cross-platform accessibility

### 📱 **Modern User Experience**
- Progressive Web App (PWA) for native app experience
- Responsive design for all devices
- Real-time notifications and updates
- Dark/light theme support
- Offline capability for viewing saved data

## 🔧 **Technology Stack**

### **Frontend**
- **HTML5**: Modern semantic markup with accessibility features
- **CSS3**: Advanced styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript ES6+**: No framework dependencies for maximum performance
- **Progressive Web App**: Native app experience on any device

### **Backend & APIs**
- **Firebase**: Authentication, Firestore database, real-time sync
- **Weather APIs**: Live weather data and forecasts
- **Flight APIs**: Real-time flight search and pricing
- **Hotel APIs**: Live availability and booking options
- **Google Maps**: Location services and mapping

### **Real-time Features**
- **WebSocket connections**: Live updates and collaboration
- **Push notifications**: Price alerts and trip updates
- **Background sync**: Data synchronization when online
- **Real-time database**: Instant updates across devices

## 📋 Quick Start

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection (required for all features)
- Google account (optional, for easy sign-in)

### API Setup

Before running the app, you'll need to set up the following API keys:

1. **Firebase Project**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Copy your config keys to `app.js`

2. **Weather API**
   - Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Add your key to the `weatherAPI` field in `app.js`

3. **Flight Search API**
   - Sign up for [Amadeus Travel API](https://developers.amadeus.com/)
   - Get your API credentials
   - Add to the `flightAPI` field in `app.js`

4. **Google Maps API**
   - Enable Google Maps JavaScript API in [Google Cloud Console](https://console.cloud.google.com/)
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` in `index.html`

### Installation

1. **Clone or Download**
   ```bash
   git clone <repository-url>
   cd tripplanner-live
   ```

2. **Configure API Keys**
   - Open `app.js`
   - Replace placeholder API keys with your actual keys:
   ```javascript
   this.config = {
       weatherAPI: 'YOUR_ACTUAL_WEATHER_API_KEY',
       flightAPI: 'YOUR_ACTUAL_FLIGHT_API_KEY',
       googleMapsAPI: 'YOUR_ACTUAL_GOOGLE_MAPS_KEY',
       firebase: {
           // Your actual Firebase config
       }
   };
   ```

3. **Serve the Files**
   
   **Option A: Python (if installed)**
   ```bash
   # Python 3
   python -m http.server 8080
   
   # Python 2
   python -m SimpleHTTPServer 8080
   ```
   
   **Option B: Node.js (if installed)**
   ```bash
   npx serve .
   ```
   
   **Option C: VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

4. **Access the App**
   - Open your browser and go to `http://localhost:8080`
   - Sign up or sign in to start using live features
   - Install as PWA for the best experience

### Installing as a PWA

1. **Desktop (Chrome/Edge):**
   - Click the install icon in the address bar
   - Or go to Settings → Install TripPlanner Live

2. **Mobile (Android/iOS):**
   - Chrome: Menu → "Add to Home Screen"
   - Safari: Share → "Add to Home Screen"

## 📖 How to Use

### 🎯 **Getting Started**

1. **Create Account**
   - Sign up with email or Google account
   - All your data will be synced to the cloud

2. **Plan Your Trip**
   - Enter destination and travel dates
   - Get AI-powered recommendations instantly
   - Search live flights and hotels with current prices

3. **Collaborate & Share**
   - Invite friends and family to collaborate
   - Share trip links for real-time planning
   - Track changes and updates from all collaborators

### ✈️ **Live Flight Search**

- **Real-time pricing**: See current flight prices that update automatically
- **Price alerts**: Set target prices and get notified when prices drop
- **Multiple options**: Compare airlines, times, and prices
- **Instant booking**: Direct links to airline websites

### 🏨 **Hotel Search**

- **Live availability**: See real-time room availability
- **Current pricing**: Prices update based on demand and availability
- **Map integration**: View hotels on interactive maps
- **Filter by amenities**: WiFi, pool, gym, breakfast, and more

### 🌤️ **Weather Intelligence**

- **Hourly updates**: Weather data refreshes automatically
- **7-day forecast**: Plan activities based on weather predictions
- **Packing recommendations**: AI suggests what to pack based on weather
- **Travel alerts**: Get notified of weather that might affect travel

### 🤖 **AI Features**

- **Smart recommendations**: Personalized suggestions based on your preferences
- **Itinerary generation**: AI creates day-by-day plans
- **Packing assistant**: Weather and activity-based packing lists
- **Budget optimization**: Suggestions to maximize your travel budget

### 👥 **Collaboration**

- **Real-time editing**: Multiple people can edit the same trip simultaneously
- **Invite system**: Send email invitations to collaborators
- **Activity tracking**: See who made what changes and when
- **Permission control**: Manage who can view or edit your trips

## 🔐 **Privacy & Security**

- **Secure authentication**: Firebase Auth with industry-standard security
- **Encrypted data**: All data encrypted in transit and at rest
- **Privacy controls**: Control who can see and edit your trips
- **GDPR compliant**: Full data portability and deletion rights

## 🌟 **Advanced Features**

### **Price Monitoring**
- Set price alerts for flights and hotels
- Track price changes over time
- Get notified when deals become available
- Historical price data and trends

### **Smart Notifications**
- Weather alerts for your destination
- Flight status updates and delays
- Price drop notifications
- Collaboration updates from team members

### **Data Export & Sharing**
- Export trip data as PDF itineraries
- Share trips via social media or messaging
- Print-friendly trip summaries
- JSON data export for backup

### **Multi-device Sync**
- Instant sync across phone, tablet, and computer
- Cloud backup ensures data is never lost
- Offline viewing of saved trips
- Resume editing on any device

## 🔧 **Browser Support**

- **Chrome/Chromium**: Full support including PWA installation
- **Firefox**: Full support, PWA features available
- **Safari**: Full support on iOS 14.3+, macOS 11.3+
- **Edge**: Full support including PWA installation

### **Required Features**
- ES6+ JavaScript support
- WebSocket support for real-time features
- Local Storage API
- Geolocation API (optional)
- Push Notification API (optional)

## 📱 **Mobile Experience**

The app is optimized for mobile devices:

- Touch-friendly interface with gesture support
- Native-like PWA experience
- Responsive design for all screen sizes
- Location-based features using device GPS
- Push notifications for alerts and updates

## 🏗️ **File Structure**
```
tripplanner-live/
├── index.html          # Main application interface
├── style.css           # Complete styling and responsive design
├── app.js             # Application logic with API integrations
├── manifest.json      # PWA manifest with live features
└── README.md         # Documentation (this file)
```

## 🚀 **API Integration Examples**

### **Weather API Integration**
```javascript
async fetchWeatherAPI(destination) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${this.config.weatherAPI}`
    );
    return await response.json();
}
```

### **Flight Search Integration**
```javascript
async fetchFlightData(searchParams) {
    const response = await fetch('/v2/shopping/flight-offers', {
        headers: {
            'Authorization': `Bearer ${this.config.flightAPI}`
        },
        body: JSON.stringify(searchParams)
    });
    return await response.json();
}
```

## 🎨 **Customization**

### **Styling**
- Modify CSS custom properties in `style.css`
- Update color schemes and themes
- Customize component layouts and animations

### **Features**
- Add new API integrations
- Extend AI recommendation logic
- Add new collaboration features
- Implement additional real-time features

### **Branding**
- Update app name and colors in `manifest.json`
- Replace icons with your own branding
- Customize notification messages and alerts

## 🤝 **Contributing**

We welcome contributions! Here's how you can help:

1. **Report Issues**: Found a bug or have a feature request?
2. **API Integrations**: Help add more travel APIs
3. **UI/UX Improvements**: Enhance the user experience
4. **Performance Optimization**: Make the app faster
5. **Documentation**: Improve guides and documentation

## 🔄 **Version History**

### **Current Version: 2.0.0 - Live Edition**

**New Features:**
- Complete online-first architecture
- Real-time flight and hotel search
- Live weather updates and forecasts
- Firebase authentication and cloud sync
- AI-powered trip recommendations
- Real-time collaboration features
- Price alerts and notifications
- Interactive maps and location services

**Improvements:**
- Modern PWA architecture
- Enhanced responsive design
- Real-time data synchronization
- Advanced user authentication
- Cross-platform cloud sync
- Professional UI/UX design

## 📞 **Support**

- **Documentation**: Check this README for comprehensive information
- **API Issues**: Verify your API keys are correctly configured
- **Browser Issues**: Ensure you're using a supported browser
- **Feature Requests**: Open an issue for new feature suggestions

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🙏 **Acknowledgments**

- **Firebase**: Real-time database and authentication
- **OpenWeatherMap**: Weather data and forecasts
- **Amadeus**: Flight search and travel APIs
- **Google Maps**: Location services and mapping
- **Progressive Web App**: Modern web technologies

---

**Built for the connected world - Real-time travel planning that never stops.**

### 🚀 Start Planning Your Next Adventure Live!

Sign up, connect with APIs, and experience the future of collaborative travel planning with real-time data and AI-powered recommendations.

**Experience the difference of live, connected travel planning!**
