// Trip Planning App JavaScript
class TripPlannerApp {
    constructor() {
        this.currentTrip = {};
        this.savedTrips = [];
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupOfflineDetection();
        this.loadSavedData();
        this.updateConnectionStatus();
        this.registerServiceWorker();
        this.setupFormValidation();
        this.generateWeatherTips();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Form inputs - auto-save on change
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('change', () => this.autoSave());
            input.addEventListener('input', () => this.debounceAutoSave());
        });

        // Checkbox tracking for packing lists
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleCheckboxChange(e));
        });

        // Date validation
        document.getElementById('startDate').addEventListener('change', () => this.validateDates());
        document.getElementById('endDate').addEventListener('change', () => this.validateDates());

        // Destination change for weather tips
        document.getElementById('destination').addEventListener('input', 
            this.debounce(() => this.generateWeatherTips(), 1000)
        );
    }

    // Tab Navigation
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Save current progress when switching tabs
        this.autoSave();
    }

    // Offline Detection
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateConnectionStatus();
            this.showMessage('Connection restored!', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateConnectionStatus();
            this.showMessage('Working offline - your data is still being saved locally.', 'warning');
        });
    }

    updateConnectionStatus() {
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        
        if (this.isOnline) {
            statusIndicator.classList.remove('offline');
            statusText.textContent = 'Online';
        } else {
            statusIndicator.classList.add('offline');
            statusText.textContent = 'Offline';
        }
    }

    // Service Worker Registration
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('service-worker.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    // Form Validation
    setupFormValidation() {
        const form = document.getElementById('tripForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCurrentTrip();
        });
    }

    validateDates() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                this.showMessage('End date must be after start date', 'error');
                document.getElementById('endDate').value = '';
            }
        }
    }

    // Auto-save functionality
    autoSave() {
        this.currentTrip = this.collectFormData();
        this.saveToLocalStorage('currentTrip', this.currentTrip);
    }

    debounceAutoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => this.autoSave(), 500);
    }

    // Data Collection
    collectFormData() {
        const formData = {
            id: this.currentTrip.id || Date.now().toString(),
            lastModified: new Date().toISOString(),
            tripInfo: {
                name: document.getElementById('tripName').value,
                departure: document.getElementById('departure').value,
                destination: document.getElementById('destination').value,
                startDate: document.getElementById('startDate').value,
                endDate: document.getElementById('endDate').value,
                travelers: document.getElementById('travelers').value,
                budget: document.getElementById('budget').value,
                tripTypes: this.getCheckedValues('input[name="tripType"]:checked'),
                notes: document.getElementById('notes').value
            },
            flights: {
                type: document.getElementById('flightType').value,
                class: document.getElementById('class').value,
                preferredAirlines: document.getElementById('preferredAirlines').value,
                preferences: this.getCheckedValues('input[name="flightPreferences"]:checked'),
                savedFlights: this.getSavedItems('flightsList')
            },
            accommodation: {
                type: document.getElementById('accommodationType').value,
                rooms: document.getElementById('rooms').value,
                preferences: this.getCheckedValues('input[name="accommodationPreferences"]:checked'),
                savedHotels: this.getSavedItems('hotelsList')
            },
            activities: {
                transportation: this.getCheckedValues('input[name="transportation"]:checked'),
                dining: this.getCheckedValues('input[name="dining"]:checked'),
                savedActivities: this.getSavedItems('activitiesList')
            },
            packing: {
                clothing: this.getPackingItems('clothingList'),
                toiletry: this.getPackingItems('toiletryList'),
                electronics: this.getPackingItems('electronicsList'),
                documents: this.getPackingItems('documentsList')
            }
        };
        
        return formData;
    }

    getCheckedValues(selector) {
        return Array.from(document.querySelectorAll(selector)).map(el => el.value);
    }

    getSavedItems(listId) {
        const listElement = document.getElementById(listId);
        return Array.from(listElement.children).map(item => ({
            id: item.dataset.id,
            title: item.querySelector('.saved-item-title').textContent,
            details: item.querySelector('.saved-item-details').textContent
        }));
    }

    getPackingItems(listId) {
        const listElement = document.getElementById(listId);
        return Array.from(listElement.children).map(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const label = item.querySelector('label');
            return {
                item: label.textContent.trim(),
                checked: checkbox.checked
            };
        });
    }

    // Local Storage Management
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            this.showMessage('Error saving data locally', 'error');
        }
    }

    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    loadSavedData() {
        // Load current trip
        const currentTrip = this.loadFromLocalStorage('currentTrip');
        if (currentTrip) {
            this.currentTrip = currentTrip;
            this.populateForm(currentTrip);
        }

        // Load saved trips
        const savedTrips = this.loadFromLocalStorage('savedTrips');
        if (savedTrips) {
            this.savedTrips = savedTrips;
            this.displaySavedTrips();
        }
    }

    populateForm(tripData) {
        // Populate basic trip info
        if (tripData.tripInfo) {
            document.getElementById('tripName').value = tripData.tripInfo.name || '';
            document.getElementById('departure').value = tripData.tripInfo.departure || '';
            document.getElementById('destination').value = tripData.tripInfo.destination || '';
            document.getElementById('startDate').value = tripData.tripInfo.startDate || '';
            document.getElementById('endDate').value = tripData.tripInfo.endDate || '';
            document.getElementById('travelers').value = tripData.tripInfo.travelers || '1';
            document.getElementById('budget').value = tripData.tripInfo.budget || 'budget';
            document.getElementById('notes').value = tripData.tripInfo.notes || '';
        }

        // Populate flights info
        if (tripData.flights) {
            document.getElementById('flightType').value = tripData.flights.type || 'round-trip';
            document.getElementById('class').value = tripData.flights.class || 'economy';
            document.getElementById('preferredAirlines').value = tripData.flights.preferredAirlines || '';
        }

        // Populate accommodation info
        if (tripData.accommodation) {
            document.getElementById('accommodationType').value = tripData.accommodation.type || 'hotel';
            document.getElementById('rooms').value = tripData.accommodation.rooms || '1';
        }

        // Populate packing lists
        if (tripData.packing) {
            this.populatePackingList('clothingList', tripData.packing.clothing);
            this.populatePackingList('toiletryList', tripData.packing.toiletry);
            this.populatePackingList('electronicsList', tripData.packing.electronics);
            this.populatePackingList('documentsList', tripData.packing.documents);
        }
    }

    populatePackingList(listId, items) {
        if (!items) return;
        
        const listElement = document.getElementById(listId);
        listElement.innerHTML = '';
        
        items.forEach(item => {
            const packingItem = this.createPackingItem(item.item, item.checked);
            listElement.appendChild(packingItem);
        });
    }

    // Dynamic Content Management
    addFlightOption() {
        const title = prompt('Enter flight details (e.g., "Delta 1234 - 2:30 PM")');
        if (title) {
            const details = prompt('Enter additional details (price, duration, etc.)') || '';
            this.addSavedItem('flightsList', title, details);
        }
    }

    addHotelOption() {
        const title = prompt('Enter hotel name');
        if (title) {
            const details = prompt('Enter hotel details (price, location, etc.)') || '';
            this.addSavedItem('hotelsList', title, details);
        }
    }

    addActivity() {
        const title = prompt('Enter activity name');
        if (title) {
            const details = prompt('Enter activity details (time, location, price, etc.)') || '';
            this.addSavedItem('activitiesList', title, details);
        }
    }

    addSavedItem(listId, title, details) {
        const listElement = document.getElementById(listId);
        const item = this.createSavedItem(Date.now().toString(), title, details);
        listElement.appendChild(item);
        this.autoSave();
    }

    createSavedItem(id, title, details) {
        const item = document.createElement('div');
        item.className = 'saved-item';
        item.dataset.id = id;
        
        item.innerHTML = `
            <div class="saved-item-content">
                <div class="saved-item-title">${title}</div>
                <div class="saved-item-details">${details}</div>
            </div>
            <div class="saved-item-actions">
                <button class="btn-icon" onclick="app.editSavedItem('${id}')" title="Edit">✏️</button>
                <button class="btn-icon" onclick="app.deleteSavedItem('${id}')" title="Delete">🗑️</button>
            </div>
        `;
        
        return item;
    }

    editSavedItem(id) {
        const item = document.querySelector(`[data-id="${id}"]`);
        const titleElement = item.querySelector('.saved-item-title');
        const detailsElement = item.querySelector('.saved-item-details');
        
        const newTitle = prompt('Edit title:', titleElement.textContent);
        if (newTitle !== null) {
            titleElement.textContent = newTitle;
        }
        
        const newDetails = prompt('Edit details:', detailsElement.textContent);
        if (newDetails !== null) {
            detailsElement.textContent = newDetails;
        }
        
        this.autoSave();
    }

    deleteSavedItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            const item = document.querySelector(`[data-id="${id}"]`);
            item.remove();
            this.autoSave();
        }
    }

    // Packing List Management
    addPackingItem(category) {
        const item = prompt('Enter item name:');
        if (item) {
            const listId = category + 'List';
            const listElement = document.getElementById(listId);
            const packingItem = this.createPackingItem(item, false);
            listElement.appendChild(packingItem);
            this.autoSave();
        }
    }

    createPackingItem(itemText, checked = false) {
        const item = document.createElement('div');
        item.className = 'packing-item';
        
        item.innerHTML = `
            <label class="checkbox-item">
                <input type="checkbox" ${checked ? 'checked' : ''}>
                ${itemText}
            </label>
        `;
        
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => this.handleCheckboxChange(e));
        
        return item;
    }

    handleCheckboxChange(e) {
        const item = e.target.closest('.packing-item');
        if (item) {
            if (e.target.checked) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
        }
        this.autoSave();
    }

    // Weather Tips Generation
    generateWeatherTips() {
        const destination = document.getElementById('destination').value;
        const startDate = document.getElementById('startDate').value;
        const weatherTipsElement = document.getElementById('weatherTips');
        
        if (!destination || !startDate) {
            weatherTipsElement.innerHTML = '<p>Add your destination and travel dates to get personalized clothing recommendations!</p>';
            return;
        }

        const tips = this.getWeatherTips(destination, startDate);
        weatherTipsElement.innerHTML = tips.map(tip => 
            `<div class="weather-tip">
                <span>${tip.icon}</span>
                <span>${tip.text}</span>
            </div>`
        ).join('');
    }

    getWeatherTips(destination, date) {
        // Basic weather tips based on destination and season
        const month = new Date(date).getMonth();
        const season = this.getSeason(month);
        const tips = [];

        // General seasonal advice
        switch (season) {
            case 'winter':
                tips.push(
                    { icon: '🧥', text: 'Pack warm layers and a heavy coat' },
                    { icon: '🧤', text: 'Don\'t forget gloves and warm accessories' },
                    { icon: '👢', text: 'Waterproof boots recommended' }
                );
                break;
            case 'spring':
                tips.push(
                    { icon: '🧥', text: 'Light jacket for cool evenings' },
                    { icon: '☔', text: 'Pack a rain jacket or umbrella' },
                    { icon: '👕', text: 'Layerable clothing for changing weather' }
                );
                break;
            case 'summer':
                tips.push(
                    { icon: '👕', text: 'Light, breathable clothing' },
                    { icon: '🕶️', text: 'Sunglasses and sun hat essential' },
                    { icon: '🧴', text: 'Pack plenty of sunscreen' }
                );
                break;
            case 'fall':
                tips.push(
                    { icon: '🧥', text: 'Medium-weight jacket recommended' },
                    { icon: '👖', text: 'Long pants for cooler weather' },
                    { icon: '👟', text: 'Comfortable walking shoes' }
                );
                break;
        }

        // Location-specific tips
        const destLower = destination.toLowerCase();
        if (destLower.includes('beach') || destLower.includes('island') || 
            destLower.includes('hawaii') || destLower.includes('florida')) {
            tips.push(
                { icon: '👙', text: 'Swimwear and beach attire' },
                { icon: '🩴', text: 'Flip-flops or sandals' },
                { icon: '🏖️', text: 'Beach towel and cover-up' }
            );
        }

        if (destLower.includes('mountain') || destLower.includes('hiking') ||
            destLower.includes('colorado') || destLower.includes('alps')) {
            tips.push(
                { icon: '🥾', text: 'Sturdy hiking boots' },
                { icon: '🎒', text: 'Daypack for outdoor activities' },
                { icon: '🧢', text: 'Hat for sun protection' }
            );
        }

        if (destLower.includes('city') || destLower.includes('urban') ||
            destLower.includes('new york') || destLower.includes('london')) {
            tips.push(
                { icon: '👞', text: 'Comfortable walking shoes' },
                { icon: '👔', text: 'Smart casual attire for dining' },
                { icon: '🎭', text: 'Dressier outfit for entertainment' }
            );
        }

        return tips.length > 0 ? tips : [
            { icon: '🧳', text: 'Pack according to planned activities' },
            { icon: '📱', text: 'Check weather forecast before departure' }
        ];
    }

    getSeason(month) {
        if (month >= 11 || month <= 1) return 'winter';
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        return 'fall';
    }

    // Trip Management
    saveCurrentTrip() {
        const tripData = this.collectFormData();
        
        if (!tripData.tripInfo.name || !tripData.tripInfo.destination) {
            this.showMessage('Please enter a trip name and destination', 'error');
            return;
        }

        // Add to saved trips
        const existingIndex = this.savedTrips.findIndex(trip => trip.id === tripData.id);
        if (existingIndex >= 0) {
            this.savedTrips[existingIndex] = tripData;
            this.showMessage('Trip updated successfully!', 'success');
        } else {
            this.savedTrips.push(tripData);
            this.showMessage('Trip saved successfully!', 'success');
        }

        this.saveToLocalStorage('savedTrips', this.savedTrips);
        this.displaySavedTrips();
    }

    displaySavedTrips() {
        const listElement = document.getElementById('savedTripsList');
        
        if (this.savedTrips.length === 0) {
            listElement.innerHTML = '<p>No saved trips yet. Create your first trip!</p>';
            return;
        }

        listElement.innerHTML = this.savedTrips.map(trip => `
            <div class="trip-card" onclick="app.loadTrip('${trip.id}')">
                <div class="trip-card-header">
                    <div>
                        <div class="trip-card-title">${trip.tripInfo.name}</div>
                        <div class="trip-card-dates">${this.formatDateRange(trip.tripInfo.startDate, trip.tripInfo.endDate)}</div>
                    </div>
                    <div class="trip-card-actions" onclick="event.stopPropagation()">
                        <button class="btn-icon" onclick="app.deleteTrip('${trip.id}')" title="Delete">🗑️</button>
                    </div>
                </div>
                <div class="trip-card-destination">${trip.tripInfo.departure} → ${trip.tripInfo.destination}</div>
                <div class="trip-card-details">
                    ${trip.tripInfo.travelers} traveler(s) • ${trip.tripInfo.budget} budget
                </div>
            </div>
        `).join('');
    }

    loadTrip(tripId) {
        const trip = this.savedTrips.find(t => t.id === tripId);
        if (trip) {
            this.currentTrip = { ...trip };
            this.populateForm(trip);
            this.switchTab('trip-info');
            this.showMessage('Trip loaded successfully!', 'success');
        }
    }

    deleteTrip(tripId) {
        if (confirm('Are you sure you want to delete this trip?')) {
            this.savedTrips = this.savedTrips.filter(trip => trip.id !== tripId);
            this.saveToLocalStorage('savedTrips', this.savedTrips);
            this.displaySavedTrips();
            this.showMessage('Trip deleted', 'success');
        }
    }

    formatDateRange(startDate, endDate) {
        if (!startDate) return 'No dates set';
        const start = new Date(startDate).toLocaleDateString();
        const end = endDate ? new Date(endDate).toLocaleDateString() : 'Open-ended';
        return `${start} - ${end}`;
    }

    // Quick Actions
    saveProgress() {
        this.autoSave();
        this.showMessage('Progress saved!', 'success');
    }

    clearForm() {
        if (confirm('Are you sure you want to clear all form data?')) {
            document.getElementById('tripForm').reset();
            document.querySelectorAll('.saved-list').forEach(list => list.innerHTML = '');
            document.querySelectorAll('.packing-list').forEach(list => {
                // Keep default items but uncheck them
                list.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            });
            this.currentTrip = {};
            localStorage.removeItem('currentTrip');
            this.showMessage('Form cleared', 'success');
        }
    }

    generateSummary() {
        const tripData = this.collectFormData();
        const summaryContent = this.createTripSummary(tripData);
        document.getElementById('summaryContent').innerHTML = summaryContent;
        this.openModal('summaryModal');
    }

    createTripSummary(trip) {
        return `
            <div class="trip-summary">
                <h3>${trip.tripInfo.name || 'Untitled Trip'}</h3>
                
                <div class="summary-section">
                    <h4>Trip Details</h4>
                    <p><strong>Destination:</strong> ${trip.tripInfo.departure} → ${trip.tripInfo.destination}</p>
                    <p><strong>Dates:</strong> ${this.formatDateRange(trip.tripInfo.startDate, trip.tripInfo.endDate)}</p>
                    <p><strong>Travelers:</strong> ${trip.tripInfo.travelers}</p>
                    <p><strong>Budget:</strong> ${trip.tripInfo.budget}</p>
                    ${trip.tripInfo.notes ? `<p><strong>Notes:</strong> ${trip.tripInfo.notes}</p>` : ''}
                </div>

                <div class="summary-section">
                    <h4>Flight Information</h4>
                    <p><strong>Type:</strong> ${trip.flights.type}</p>
                    <p><strong>Class:</strong> ${trip.flights.class}</p>
                    ${trip.flights.preferredAirlines ? `<p><strong>Preferred Airlines:</strong> ${trip.flights.preferredAirlines}</p>` : ''}
                </div>

                <div class="summary-section">
                    <h4>Accommodation</h4>
                    <p><strong>Type:</strong> ${trip.accommodation.type}</p>
                    <p><strong>Rooms:</strong> ${trip.accommodation.rooms}</p>
                </div>

                <div class="summary-section">
                    <h4>Packing Checklist</h4>
                    ${this.createPackingSummary(trip.packing)}
                </div>
            </div>
        `;
    }

    createPackingSummary(packing) {
        let summary = '';
        Object.keys(packing).forEach(category => {
            if (packing[category] && packing[category].length > 0) {
                summary += `<h5>${category.charAt(0).toUpperCase() + category.slice(1)}</h5>`;
                summary += '<ul>';
                packing[category].forEach(item => {
                    summary += `<li${item.checked ? ' style="text-decoration: line-through;"' : ''}>${item.item}</li>`;
                });
                summary += '</ul>';
            }
        });
        return summary || '<p>No packing items added yet.</p>';
    }

    shareTripPlan() {
        if (navigator.share) {
            const tripData = this.collectFormData();
            navigator.share({
                title: tripData.tripInfo.name || 'My Trip Plan',
                text: `Check out my trip plan: ${tripData.tripInfo.departure} → ${tripData.tripInfo.destination}`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const tripData = this.collectFormData();
            const text = `Trip: ${tripData.tripInfo.name}\nDestination: ${tripData.tripInfo.departure} → ${tripData.tripInfo.destination}\nDates: ${this.formatDateRange(tripData.tripInfo.startDate, tripData.tripInfo.endDate)}`;
            navigator.clipboard.writeText(text).then(() => {
                this.showMessage('Trip details copied to clipboard!', 'success');
            });
        }
    }

    // Data Export/Import
    exportData() {
        const data = {
            currentTrip: this.currentTrip,
            savedTrips: this.savedTrips,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trip-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showMessage('Data exported successfully!', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.savedTrips) {
                    this.savedTrips = data.savedTrips;
                    this.saveToLocalStorage('savedTrips', this.savedTrips);
                    this.displaySavedTrips();
                }
                
                if (data.currentTrip) {
                    this.currentTrip = data.currentTrip;
                    this.populateForm(data.currentTrip);
                    this.saveToLocalStorage('currentTrip', this.currentTrip);
                }
                
                this.showMessage('Data imported successfully!', 'success');
            } catch (error) {
                this.showMessage('Error importing data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    // Modal Management
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

    printSummary() {
        window.print();
    }

    // Utility Functions
    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        
        // Insert at top of main content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(messageEl, mainContent.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 5000);
    }

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
}

// Global functions for HTML onclick handlers
function addFlightOption() { app.addFlightOption(); }
function addHotelOption() { app.addHotelOption(); }
function addActivity() { app.addActivity(); }
function addPackingItem(category) { app.addPackingItem(category); }
function saveCurrentTrip() { app.saveCurrentTrip(); }
function exportData() { app.exportData(); }
function importData(event) { app.importData(event); }
function saveProgress() { app.saveProgress(); }
function clearForm() { app.clearForm(); }
function generateSummary() { app.generateSummary(); }
function shareTripPlan() { app.shareTripPlan(); }
function closeModal(modalId) { app.closeModal(modalId); }
function printSummary() { app.printSummary(); }

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TripPlannerApp();
});

// Handle page visibility changes to save data when user switches tabs/apps
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && window.app) {
        window.app.autoSave();
    }
});