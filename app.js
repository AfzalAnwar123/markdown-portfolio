// Online Trip Planning App - Live Data & Cloud Sync
class OnlineTripPlannerApp {
    constructor() {
        this.user = null;
        this.currentTrip = {};
        this.firebaseInitialized = false;
        this.isOnline = navigator.onLine;
        
        // API Keys (replace with your actual keys)
        this.config = {
            weatherAPI: 'YOUR_WEATHER_API_KEY',
            flightAPI: 'YOUR_AMADEUS_API_KEY',
            googleMapsAPI: 'YOUR_GOOGLE_MAPS_API_KEY',
            firebase: {
                apiKey: "YOUR_FIREBASE_API_KEY",
                authDomain: "your-project.firebaseapp.com",
                projectId: "your-project-id",
                storageBucket: "your-project.appspot.com",
                messagingSenderId: "123456789",
                appId: "your-app-id"
            }
        };
        
        this.init();
    }

    async init() {
        try {
            await this.initializeFirebase();
            this.setupEventListeners();
            this.setupOnlineDetection();
            this.setupRealtimeUpdates();
            this.checkAuthState();
            this.loadUserTrips();
            this.setupCollaboration();
        } catch (error) {
            console.error('App initialization failed:', error);
            this.showNotification('App initialization failed. Some features may not work.', 'error');
        }
    }

    // Firebase & Authentication
    async initializeFirebase() {
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(this.config.firebase);
            }
            this.db = firebase.firestore();
            this.auth = firebase.auth();
            this.firebaseInitialized = true;
            console.log('Firebase initialized successfully');
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            // Fallback to local storage for basic functionality
        }
    }

    checkAuthState() {
        if (this.auth) {
            this.auth.onAuthStateChanged((user) => {
                this.user = user;
                this.updateUserInterface();
                if (user) {
                    this.loadUserTrips();
                    this.setupRealtimeSync();
                }
            });
        }
    }

    async signIn(email, password) {
        try {
            const result = await this.auth.signInWithEmailAndPassword(email, password);
            this.showNotification('Signed in successfully!', 'success');
            this.closeModal('loginModal');
            return result;
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    async signUp(email, password) {
        try {
            const result = await this.auth.createUserWithEmailAndPassword(email, password);
            this.showNotification('Account created successfully!', 'success');
            this.closeModal('loginModal');
            return result;
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await this.auth.signInWithPopup(provider);
            this.showNotification('Signed in with Google!', 'success');
            this.closeModal('loginModal');
            return result;
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    async signOut() {
        try {
            await this.auth.signOut();
            this.showNotification('Signed out successfully', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Authentication
        document.getElementById('loginBtn')?.addEventListener('click', () => {
            this.openModal('loginModal');
        });

        document.getElementById('authForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuthentication();
        });

        // Budget slider
        const budgetRange = document.getElementById('budgetRange');
        if (budgetRange) {
            budgetRange.addEventListener('input', (e) => {
                document.getElementById('budgetValue').textContent = e.target.value;
            });
        }

        // Trip type selection
        document.querySelectorAll('.trip-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.trip-type-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.trip-type-btn').classList.add('active');
            });
        });

        // Real-time form updates
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => this.debounceAutoSave());
            input.addEventListener('change', () => this.autoSave());
        });

        // Destination autocomplete
        this.setupAutocomplete();

        // Live search triggers
        document.getElementById('destination')?.addEventListener('input', 
            this.debounce(() => this.updateLiveData(), 1000)
        );

        document.getElementById('startDate')?.addEventListener('change', () => {
            this.updateLiveData();
        });
    }

    // Real-time Features
    setupOnlineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateConnectionStatus();
            this.showNotification('Back online! Syncing data...', 'success');
            this.syncPendingChanges();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateConnectionStatus();
            this.showNotification('You\'re offline. Changes will sync when reconnected.', 'warning');
        });
    }

    updateConnectionStatus() {
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        
        if (this.isOnline) {
            statusIndicator.classList.remove('offline');
            statusIndicator.classList.add('online');
            statusText.textContent = 'Connected';
        } else {
            statusIndicator.classList.add('offline');
            statusIndicator.classList.remove('online');
            statusText.textContent = 'Offline';
        }
    }

    // Live Flight Search
    async searchLiveFlights() {
        const departure = document.getElementById('departure').value;
        const destination = document.getElementById('destination').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const flightClass = document.getElementById('flightClass').value;

        if (!departure || !destination || !startDate) {
            this.showNotification('Please fill in departure, destination, and dates', 'warning');
            return;
        }

        this.showLoading('flightSearchLoading', true);
        
        try {
            const flights = await this.fetchFlightData({
                origin: departure,
                destination: destination,
                departureDate: startDate,
                returnDate: endDate,
                travelClass: flightClass
            });

            this.displayFlightResults(flights);
        } catch (error) {
            console.error('Flight search failed:', error);
            this.showNotification('Flight search failed. Please try again.', 'error');
        } finally {
            this.showLoading('flightSearchLoading', false);
        }
    }

    async fetchFlightData(searchParams) {
        // Mock flight API call - replace with actual API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '1',
                        airline: 'Delta Airlines',
                        flightNumber: 'DL 1234',
                        departure: searchParams.origin,
                        destination: searchParams.destination,
                        departureTime: '08:30',
                        arrivalTime: '12:45',
                        duration: '4h 15m',
                        price: '$299',
                        stops: 'Non-stop'
                    },
                    {
                        id: '2',
                        airline: 'American Airlines',
                        flightNumber: 'AA 5678',
                        departure: searchParams.origin,
                        destination: searchParams.destination,
                        departureTime: '14:20',
                        arrivalTime: '18:50',
                        duration: '4h 30m',
                        price: '$279',
                        stops: '1 stop'
                    }
                ]);
            }, 2000);
        });
    }

    displayFlightResults(flights) {
        const resultsContainer = document.getElementById('flightResults');
        
        if (flights.length === 0) {
            resultsContainer.innerHTML = '<p>No flights found for your search criteria.</p>';
            return;
        }

        resultsContainer.innerHTML = flights.map(flight => `
            <div class="result-item" onclick="app.selectFlight('${flight.id}')">
                <div class="result-header">
                    <div class="result-title">
                        ${flight.airline} ${flight.flightNumber}
                    </div>
                    <div class="result-price">${flight.price}</div>
                </div>
                <div class="result-details">
                    <div class="flight-route">
                        ${flight.departure} → ${flight.destination}
                    </div>
                    <div class="flight-time">
                        ${flight.departureTime} - ${flight.arrivalTime} (${flight.duration})
                    </div>
                    <div class="flight-stops">${flight.stops}</div>
                </div>
            </div>
        `).join('');
    }

    // Live Hotel Search
    async searchLiveHotels() {
        const destination = document.getElementById('destination').value;
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const guests = document.getElementById('hotelGuests').value;

        if (!destination || !checkIn || !checkOut) {
            this.showNotification('Please fill in destination and dates', 'warning');
            return;
        }

        this.showLoading('hotelSearchLoading', true);

        try {
            const hotels = await this.fetchHotelData({
                destination,
                checkIn,
                checkOut,
                guests
            });

            this.displayHotelResults(hotels);
            this.updateHotelMap(hotels);
        } catch (error) {
            console.error('Hotel search failed:', error);
            this.showNotification('Hotel search failed. Please try again.', 'error');
        } finally {
            this.showLoading('hotelSearchLoading', false);
        }
    }

    async fetchHotelData(searchParams) {
        // Mock hotel API call - replace with actual API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '1',
                        name: 'Grand Plaza Hotel',
                        rating: 4.5,
                        stars: 4,
                        price: '$189/night',
                        location: 'Downtown',
                        amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
                        image: 'https://via.placeholder.com/300x200',
                        lat: 40.7589,
                        lng: -73.9851
                    },
                    {
                        id: '2',
                        name: 'Luxury Suites',
                        rating: 4.8,
                        stars: 5,
                        price: '$299/night',
                        location: 'City Center',
                        amenities: ['WiFi', 'Spa', 'Restaurant', 'Room Service'],
                        image: 'https://via.placeholder.com/300x200',
                        lat: 40.7505,
                        lng: -73.9934
                    }
                ]);
            }, 1500);
        });
    }

    displayHotelResults(hotels) {
        const resultsContainer = document.getElementById('hotelResults');
        
        resultsContainer.innerHTML = hotels.map(hotel => `
            <div class="result-item" onclick="app.selectHotel('${hotel.id}')">
                <div class="result-header">
                    <div class="result-title">
                        ${hotel.name}
                        <div class="hotel-stars">${'★'.repeat(hotel.stars)}</div>
                    </div>
                    <div class="result-price">${hotel.price}</div>
                </div>
                <div class="result-details">
                    <div class="hotel-rating">Rating: ${hotel.rating}/5</div>
                    <div class="hotel-location">${hotel.location}</div>
                    <div class="hotel-amenities">
                        ${hotel.amenities.slice(0, 3).join(' • ')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Live Weather Data
    async fetchLiveWeather(destination) {
        if (!destination) return;

        try {
            const weatherData = await this.fetchWeatherAPI(destination);
            this.displayWeatherData(weatherData);
        } catch (error) {
            console.error('Weather fetch failed:', error);
        }
    }

    async fetchWeatherAPI(destination) {
        // Mock weather API - replace with actual API like OpenWeatherMap
        const mockData = {
            current: {
                temp: 22,
                condition: 'Partly Cloudy',
                icon: '⛅',
                humidity: 65,
                windSpeed: 12
            },
            forecast: [
                { date: 'Today', icon: '⛅', high: 24, low: 18 },
                { date: 'Tomorrow', icon: '☀️', high: 26, low: 19 },
                { date: 'Wed', icon: '🌧️', high: 20, low: 15 },
                { date: 'Thu', icon: '☀️', high: 23, low: 17 },
                { date: 'Fri', icon: '⛅', high: 21, low: 16 }
            ],
            tips: [
                { icon: '👕', text: 'Light layers recommended' },
                { icon: '🧥', text: 'Bring a light jacket for evenings' },
                { icon: '☂️', text: 'Pack an umbrella for Wednesday' }
            ]
        };

        return new Promise(resolve => {
            setTimeout(() => resolve(mockData), 1000);
        });
    }

    displayWeatherData(weather) {
        const currentWeather = document.getElementById('currentWeather');
        const forecast = document.getElementById('weatherForecast');
        const tips = document.getElementById('travelWeatherTips');

        currentWeather.innerHTML = `
            <div class="weather-temp">${weather.current.temp}°C</div>
            <div class="weather-icon">${weather.current.icon}</div>
            <div class="weather-desc">${weather.current.condition}</div>
            <div class="weather-details">
                Humidity: ${weather.current.humidity}% • Wind: ${weather.current.windSpeed} km/h
            </div>
        `;

        forecast.innerHTML = weather.forecast.map(day => `
            <div class="forecast-day">
                <div class="forecast-date">${day.date}</div>
                <div class="forecast-icon">${day.icon}</div>
                <div class="forecast-temps">
                    <span class="high">${day.high}°</span>
                    <span class="low">${day.low}°</span>
                </div>
            </div>
        `).join('');

        tips.innerHTML = weather.tips.map(tip => `
            <div class="weather-tip">
                <span>${tip.icon}</span>
                <span>${tip.text}</span>
            </div>
        `).join('');
    }

    // Activities Search
    async searchActivities() {
        const destination = document.getElementById('destination').value;
        const query = document.getElementById('activityQuery').value;
        const category = document.getElementById('activityCategory').value;

        if (!destination) {
            this.showNotification('Please select a destination first', 'warning');
            return;
        }

        try {
            const activities = await this.fetchActivitiesData({
                destination,
                query,
                category
            });
            this.displayActivityResults(activities);
        } catch (error) {
            console.error('Activities search failed:', error);
            this.showNotification('Activities search failed. Please try again.', 'error');
        }
    }

    async fetchActivitiesData(params) {
        // Mock activities API
        const mockActivities = [
            {
                id: '1',
                name: 'City Walking Tour',
                category: 'tours',
                rating: 4.7,
                price: '$25',
                duration: '3 hours',
                description: 'Explore the historic downtown area with a local guide'
            },
            {
                id: '2',
                name: 'Local Food Market',
                category: 'restaurants',
                rating: 4.5,
                price: 'Free',
                duration: '2 hours',
                description: 'Discover local flavors and fresh ingredients'
            }
        ];

        return new Promise(resolve => {
            setTimeout(() => resolve(mockActivities), 1000);
        });
    }

    displayActivityResults(activities) {
        const resultsContainer = document.getElementById('activityResults');
        
        resultsContainer.innerHTML = activities.map(activity => `
            <div class="result-item" onclick="app.selectActivity('${activity.id}')">
                <div class="result-header">
                    <div class="result-title">${activity.name}</div>
                    <div class="result-price">${activity.price}</div>
                </div>
                <div class="result-details">
                    <div class="activity-rating">★ ${activity.rating}/5</div>
                    <div class="activity-duration">${activity.duration}</div>
                    <div class="activity-desc">${activity.description}</div>
                </div>
            </div>
        `).join('');
    }

    // Cloud Data Management
    async saveCurrentTrip() {
        if (!this.user) {
            this.showNotification('Please sign in to save trips', 'warning');
            this.openModal('loginModal');
            return;
        }

        this.showLoading('saveTripLoading', true);

        try {
            const tripData = this.collectFormData();
            tripData.userId = this.user.uid;
            tripData.lastModified = firebase.firestore.FieldValue.serverTimestamp();
            tripData.shared = false;

            if (tripData.id) {
                await this.db.collection('trips').doc(tripData.id).update(tripData);
                this.showNotification('Trip updated successfully!', 'success');
            } else {
                const docRef = await this.db.collection('trips').add(tripData);
                this.currentTrip.id = docRef.id;
                this.showNotification('Trip saved successfully!', 'success');
            }

            this.loadUserTrips();
        } catch (error) {
            console.error('Save failed:', error);
            this.showNotification('Failed to save trip. Please try again.', 'error');
        } finally {
            this.showLoading('saveTripLoading', false);
        }
    }

    async loadUserTrips() {
        if (!this.user || !this.db) return;

        try {
            const snapshot = await this.db.collection('trips')
                .where('userId', '==', this.user.uid)
                .orderBy('lastModified', 'desc')
                .get();

            const trips = [];
            snapshot.forEach(doc => {
                trips.push({ id: doc.id, ...doc.data() });
            });

            this.displaySavedTrips(trips);
        } catch (error) {
            console.error('Failed to load trips:', error);
        }
    }

    displaySavedTrips(trips) {
        const listElement = document.getElementById('savedTripsList');
        
        if (trips.length === 0) {
            listElement.innerHTML = '<p>No saved trips yet. Create your first trip!</p>';
            return;
        }

        listElement.innerHTML = trips.map(trip => `
            <div class="trip-card" onclick="app.loadTrip('${trip.id}')">
                <div class="trip-card-header">
                    <div>
                        <div class="trip-card-title">${trip.tripInfo?.name || 'Untitled Trip'}</div>
                        <div class="trip-card-dates">
                            ${this.formatDateRange(trip.tripInfo?.startDate, trip.tripInfo?.endDate)}
                        </div>
                    </div>
                    <div class="trip-card-actions" onclick="event.stopPropagation()">
                        <button class="btn btn-small" onclick="app.shareTrip('${trip.id}')">Share</button>
                        <button class="btn btn-small" onclick="app.deleteTrip('${trip.id}')">Delete</button>
                    </div>
                </div>
                <div class="trip-card-destination">
                    ${trip.tripInfo?.departure || ''} → ${trip.tripInfo?.destination || ''}
                </div>
                <div class="trip-card-details">
                    ${trip.shared ? '👥 Shared' : '🔒 Private'} • 
                    ${new Date(trip.lastModified?.toDate?.() || Date.now()).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    }

    // Collaboration Features
    async shareTrip(tripId) {
        if (!tripId) return;

        try {
            await this.db.collection('trips').doc(tripId).update({
                shared: true,
                shareCode: this.generateShareCode()
            });

            const shareUrl = `${window.location.origin}?shared=${tripId}`;
            await navigator.clipboard.writeText(shareUrl);
            
            this.showNotification('Trip share link copied to clipboard!', 'success');
        } catch (error) {
            console.error('Share failed:', error);
            this.showNotification('Failed to share trip', 'error');
        }
    }

    async inviteCollaborator() {
        const email = document.getElementById('collaboratorEmail').value;
        if (!email || !this.currentTrip.id) return;

        try {
            await this.db.collection('trip_invites').add({
                tripId: this.currentTrip.id,
                inviterEmail: this.user.email,
                inviteeEmail: email,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            this.showNotification(`Invitation sent to ${email}`, 'success');
            document.getElementById('collaboratorEmail').value = '';
        } catch (error) {
            console.error('Invite failed:', error);
            this.showNotification('Failed to send invitation', 'error');
        }
    }

    // Real-time Updates
    setupRealtimeUpdates() {
        if (!this.db || !this.user) return;

        // Listen for trip updates
        this.db.collection('trips')
            .where('userId', '==', this.user.uid)
            .onSnapshot((snapshot) => {
                const trips = [];
                snapshot.forEach(doc => {
                    trips.push({ id: doc.id, ...doc.data() });
                });
                this.displaySavedTrips(trips);
            });
    }

    setupRealtimeSync() {
        // Sync current trip changes in real-time
        if (this.currentTrip.id) {
            this.tripListener = this.db.collection('trips').doc(this.currentTrip.id)
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        // Update UI if changes came from other collaborators
                        if (data.lastModifiedBy !== this.user.uid) {
                            this.populateForm(data);
                        }
                    }
                });
        }
    }

    // Price Alerts
    async setupPriceAlert() {
        const email = document.getElementById('alertEmail').value;
        const targetPrice = document.getElementById('targetPrice').value;
        const departure = document.getElementById('departure').value;
        const destination = document.getElementById('destination').value;

        if (!email || !targetPrice || !departure || !destination) {
            this.showNotification('Please fill in all alert fields', 'warning');
            return;
        }

        try {
            await this.db.collection('price_alerts').add({
                userId: this.user?.uid,
                email,
                targetPrice: parseFloat(targetPrice),
                route: `${departure} → ${destination}`,
                active: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            this.showNotification('Price alert set successfully!', 'success');
            this.loadPriceAlerts();
        } catch (error) {
            console.error('Price alert failed:', error);
            this.showNotification('Failed to set price alert', 'error');
        }
    }

    // AI Recommendations
    async generateAIRecommendations() {
        const destination = document.getElementById('destination').value;
        const tripType = document.querySelector('.trip-type-btn.active')?.dataset.type;
        const budget = document.getElementById('budgetRange').value;

        if (!destination) return;

        try {
            const recommendations = await this.fetchAIRecommendations({
                destination,
                tripType,
                budget
            });

            this.displayAIRecommendations(recommendations);
        } catch (error) {
            console.error('AI recommendations failed:', error);
        }
    }

    async fetchAIRecommendations(params) {
        // Mock AI recommendations
        const mockRecommendations = [
            {
                title: 'Perfect 3-Day Itinerary',
                description: 'AI-curated activities based on your preferences and budget',
                confidence: 95
            },
            {
                title: 'Hidden Local Gems',
                description: 'Discover authentic experiences away from tourist crowds',
                confidence: 88
            }
        ];

        return new Promise(resolve => {
            setTimeout(() => resolve(mockRecommendations), 1500);
        });
    }

    displayAIRecommendations(recommendations) {
        const container = document.getElementById('aiSuggestions');
        const liveRecommendations = document.getElementById('liveRecommendations');
        
        container.innerHTML = recommendations.map(rec => `
            <div class="ai-suggestion" onclick="app.selectAISuggestion('${rec.title}')">
                <div class="suggestion-title">${rec.title}</div>
                <div class="suggestion-desc">${rec.description}</div>
                <div class="suggestion-confidence">Confidence: ${rec.confidence}%</div>
            </div>
        `).join('');

        liveRecommendations.style.display = 'block';
    }

    // Smart Packing Assistant
    async generateSmartPackingList() {
        const destination = document.getElementById('destination').value;
        const startDate = document.getElementById('startDate').value;
        const tripType = document.querySelector('.trip-type-btn.active')?.dataset.type;

        if (!destination || !startDate) return;

        try {
            const weather = await this.fetchWeatherAPI(destination);
            const packingList = this.generatePackingRecommendations(weather, tripType);
            
            this.displayPackingRecommendations(packingList);
            this.updatePackingProgress();
        } catch (error) {
            console.error('Packing recommendations failed:', error);
        }
    }

    generatePackingRecommendations(weather, tripType) {
        const baseItems = {
            clothing: ['Comfortable walking shoes', 'Underwear', 'Socks'],
            electronics: ['Phone charger', 'Power bank', 'Camera'],
            toiletry: ['Toothbrush', 'Toothpaste', 'Deodorant'],
            documents: ['Passport/ID', 'Travel insurance', 'Hotel confirmations']
        };

        // Add weather-specific items
        if (weather.current.temp < 15) {
            baseItems.clothing.push('Warm jacket', 'Sweaters', 'Long pants');
        } else if (weather.current.temp > 25) {
            baseItems.clothing.push('Lightweight shirts', 'Shorts', 'Sun hat');
        }

        // Add trip-type specific items
        if (tripType === 'business') {
            baseItems.clothing.push('Formal attire', 'Dress shoes');
            baseItems.electronics.push('Laptop', 'Presentation materials');
        } else if (tripType === 'adventure') {
            baseItems.clothing.push('Hiking boots', 'Quick-dry clothing');
            baseItems.electronics.push('GPS device', 'Headlamp');
        }

        return baseItems;
    }

    displayPackingRecommendations(packingList) {
        Object.keys(packingList).forEach(category => {
            const listElement = document.getElementById(`${category}List`);
            listElement.innerHTML = packingList[category].map(item => `
                <div class="packing-item">
                    <label class="checkbox-item">
                        <input type="checkbox" onchange="app.updatePackingProgress()">
                        <span>${item}</span>
                    </label>
                </div>
            `).join('');
        });
    }

    updatePackingProgress() {
        const allCheckboxes = document.querySelectorAll('.packing-item input[type="checkbox"]');
        const checkedBoxes = document.querySelectorAll('.packing-item input[type="checkbox"]:checked');
        
        const totalItems = allCheckboxes.length;
        const packedItems = checkedBoxes.length;
        const percentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

        document.getElementById('packedItems').textContent = packedItems;
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('packingProgress').querySelector('.progress-text').textContent = `${percentage}%`;

        // Update progress circle
        const circle = document.getElementById('packingProgress');
        const degree = (percentage / 100) * 360;
        circle.style.background = `conic-gradient(var(--primary-color) ${degree}deg, var(--border-color) ${degree}deg)`;
    }

    // Utility Functions
    collectFormData() {
        return {
            id: this.currentTrip.id || null,
            tripInfo: {
                name: document.getElementById('tripName').value,
                departure: document.getElementById('departure').value,
                destination: document.getElementById('destination').value,
                startDate: document.getElementById('startDate').value,
                endDate: document.getElementById('endDate').value,
                adults: document.getElementById('adults').value,
                children: document.getElementById('children').value,
                budget: document.getElementById('budgetRange').value,
                tripType: document.querySelector('.trip-type-btn.active')?.dataset.type,
                notes: document.getElementById('notes').value
            }
        };
    }

    populateForm(tripData) {
        if (tripData.tripInfo) {
            document.getElementById('tripName').value = tripData.tripInfo.name || '';
            document.getElementById('departure').value = tripData.tripInfo.departure || '';
            document.getElementById('destination').value = tripData.tripInfo.destination || '';
            document.getElementById('startDate').value = tripData.tripInfo.startDate || '';
            document.getElementById('endDate').value = tripData.tripInfo.endDate || '';
            document.getElementById('adults').value = tripData.tripInfo.adults || '1';
            document.getElementById('children').value = tripData.tripInfo.children || '0';
            document.getElementById('budgetRange').value = tripData.tripInfo.budget || '5000';
            document.getElementById('budgetValue').textContent = tripData.tripInfo.budget || '5000';
            document.getElementById('notes').value = tripData.tripInfo.notes || '';

            if (tripData.tripInfo.tripType) {
                document.querySelectorAll('.trip-type-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.type === tripData.tripInfo.tripType);
                });
            }
        }
    }

    // Live Data Updates
    async updateLiveData() {
        const destination = document.getElementById('destination').value;
        if (!destination) return;

        await Promise.all([
            this.fetchLiveWeather(destination),
            this.generateAIRecommendations(),
            this.generateSmartPackingList()
        ]);
    }

    async searchLiveOptions() {
        this.showLoading('searchLoading', true);
        
        try {
            await Promise.all([
                this.searchLiveFlights(),
                this.searchLiveHotels(),
                this.updateLiveData()
            ]);
        } catch (error) {
            console.error('Live search failed:', error);
            this.showNotification('Some searches failed. Please try again.', 'warning');
        } finally {
            this.showLoading('searchLoading', false);
        }
    }

    // Event Handlers
    switchTab(tabName) {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Load tab-specific data
        if (tabName === 'weather') {
            this.fetchLiveWeather(document.getElementById('destination').value);
        } else if (tabName === 'my-trips') {
            this.loadUserTrips();
        }
    }

    async handleAuthentication() {
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const isSignUp = document.querySelector('.auth-tab.active').dataset.tab === 'signup';

        try {
            if (isSignUp) {
                await this.signUp(email, password);
            } else {
                await this.signIn(email, password);
            }
        } catch (error) {
            console.error('Authentication failed:', error);
        }
    }

    updateUserInterface() {
        const userSection = document.getElementById('userSection');
        const loginBtn = document.getElementById('loginBtn');

        if (this.user) {
            userSection.innerHTML = `
                <div class="user-avatar">${this.user.email.charAt(0).toUpperCase()}</div>
                <span class="user-email">${this.user.email}</span>
                <button class="btn btn-small" onclick="app.signOut()">Sign Out</button>
            `;
        } else {
            userSection.innerHTML = `
                <button class="btn btn-secondary" id="loginBtn" onclick="app.openModal('loginModal')">Sign In</button>
            `;
        }
    }

    // Auto-save and sync
    autoSave() {
        this.currentTrip = this.collectFormData();
        if (this.user && this.currentTrip.id) {
            this.debouncedCloudSave();
        }
    }

    debounceAutoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => this.autoSave(), 500);
    }

    debouncedCloudSave = this.debounce(async () => {
        if (this.user && this.currentTrip.id) {
            try {
                await this.db.collection('trips').doc(this.currentTrip.id).update({
                    ...this.currentTrip,
                    lastModified: firebase.firestore.FieldValue.serverTimestamp(),
                    lastModifiedBy: this.user.uid
                });
            } catch (error) {
                console.error('Auto-save failed:', error);
            }
        }
    }, 2000);

    // Quick Actions
    async quickSave() {
        await this.saveCurrentTrip();
    }

    async refreshData() {
        this.showNotification('Refreshing data...', 'success');
        await this.updateLiveData();
        if (this.user) {
            await this.loadUserTrips();
        }
    }

    async generateItinerary() {
        const tripData = this.collectFormData();
        if (!tripData.tripInfo.destination) {
            this.showNotification('Please add trip details first', 'warning');
            return;
        }

        const itinerary = this.createItinerary(tripData);
        document.getElementById('itineraryContent').innerHTML = itinerary;
        this.openModal('itineraryModal');
    }

    createItinerary(tripData) {
        return `
            <div class="itinerary">
                <h3>${tripData.tripInfo.name || 'Your Trip'}</h3>
                <div class="itinerary-overview">
                    <p><strong>Destination:</strong> ${tripData.tripInfo.departure} → ${tripData.tripInfo.destination}</p>
                    <p><strong>Dates:</strong> ${this.formatDateRange(tripData.tripInfo.startDate, tripData.tripInfo.endDate)}</p>
                    <p><strong>Travelers:</strong> ${tripData.tripInfo.adults} adults, ${tripData.tripInfo.children} children</p>
                    <p><strong>Budget:</strong> $${tripData.tripInfo.budget}</p>
                </div>
                <div class="itinerary-placeholder">
                    <p>🚀 AI-powered itinerary generation coming soon!</p>
                    <p>Your personalized day-by-day schedule will be created based on your preferences, weather, and local recommendations.</p>
                </div>
            </div>
        `;
    }

    async shareCurrentTrip() {
        if (!this.currentTrip.id) {
            this.showNotification('Please save the trip first', 'warning');
            return;
        }
        await this.shareTrip(this.currentTrip.id);
    }

    // Autocomplete setup
    setupAutocomplete() {
        const departureInput = document.getElementById('departure');
        const destinationInput = document.getElementById('destination');

        if (departureInput) {
            departureInput.addEventListener('input', (e) => {
                this.showAutocompleteResults(e.target, 'departureResults');
            });
        }

        if (destinationInput) {
            destinationInput.addEventListener('input', (e) => {
                this.showAutocompleteResults(e.target, 'destinationResults');
            });
        }
    }

    showAutocompleteResults(input, resultsId) {
        const query = input.value;
        if (query.length < 2) return;

        // Mock autocomplete data - replace with actual places API
        const mockCities = [
            'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
            'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA'
        ].filter(city => city.toLowerCase().includes(query.toLowerCase()));

        const resultsDiv = document.getElementById(resultsId);
        resultsDiv.innerHTML = mockCities.map(city => 
            `<div class="autocomplete-item" onclick="app.selectCity('${city}', '${input.id}')">${city}</div>`
        ).join('');
        resultsDiv.style.display = mockCities.length > 0 ? 'block' : 'none';
    }

    selectCity(city, inputId) {
        document.getElementById(inputId).value = city;
        document.querySelectorAll('.autocomplete-results').forEach(div => {
            div.style.display = 'none';
        });
    }

    // Modal management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        modal.style.display = 'flex';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        modal.style.display = 'none';
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        const container = document.getElementById('notifications');
        container.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Loading states
    showLoading(elementId, show) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = show ? 'inline-block' : 'none';
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    formatDateRange(startDate, endDate) {
        if (!startDate) return 'No dates set';
        const start = new Date(startDate).toLocaleDateString();
        const end = endDate ? new Date(endDate).toLocaleDateString() : 'Open-ended';
        return `${start} - ${end}`;
    }

    generateShareCode() {
        return Math.random().toString(36).substr(2, 9);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new OnlineTripPlannerApp();
});

// Handle page visibility changes for real-time sync
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.app) {
        window.app.refreshData();
    }
});

// Global function handlers for onclick events
function searchLiveOptions() { app.searchLiveOptions(); }
function searchLiveFlights() { app.searchLiveFlights(); }
function searchLiveHotels() { app.searchLiveHotels(); }
function searchActivities() { app.searchActivities(); }
function saveCurrentTrip() { app.saveCurrentTrip(); }
function shareTrip(id) { app.shareTrip(id); }
function inviteCollaborator() { app.inviteCollaborator(); }
function setupPriceAlert() { app.setupPriceAlert(); }
function addCustomItem(category) { 
    const item = prompt('Enter item name:');
    if (item) {
        const listElement = document.getElementById(`${category}List`);
        const packingItem = document.createElement('div');
        packingItem.className = 'packing-item';
        packingItem.innerHTML = `
            <label class="checkbox-item">
                <input type="checkbox" onchange="app.updatePackingProgress()">
                <span>${item}</span>
            </label>
        `;
        listElement.appendChild(packingItem);
        app.updatePackingProgress();
    }
}
function quickSave() { app.quickSave(); }
function refreshData() { app.refreshData(); }
function generateItinerary() { app.generateItinerary(); }
function shareCurrentTrip() { app.shareCurrentTrip(); }
function closeModal(modalId) { app.closeModal(modalId); }
function signInWithGoogle() { app.signInWithGoogle(); }
function downloadItinerary() { window.print(); }