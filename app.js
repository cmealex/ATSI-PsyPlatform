/**
 * Main application module for the therapy platform
 * Handles page navigation, UI updates, and app functionality
 */

const App = {
    // Current page ID
    currentPage: 'home',
    
    // Initialize application
    init: function() {
        // Initialize data storage
        TherapyData.init();
        
        // Initialize authentication
        Auth.init();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial page
        this.loadPageFromURL();
    },
    
    // Set up event listeners for navigation and interactions
    setupEventListeners: function() {
        // Navigation links
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            }
            
            // Therapist list item clicks
            if (e.target.closest('.therapist-card') && !e.target.classList.contains('btn')) {
                const card = e.target.closest('.therapist-card');
                const therapistId = card.getAttribute('data-id');
                this.navigateTo('therapist-detail', { id: therapistId });
            }
            
            // Resource detail clicks
            if (e.target.classList.contains('read-more')) {
                e.preventDefault();
                const resourceId = e.target.getAttribute('data-resource');
                this.navigateTo('resource-detail', { id: resourceId });
            }
            
            // Forum topic clicks
            if (e.target.closest('.forum-topic')) {
                const topic = e.target.closest('.forum-topic');
                const topicId = topic.getAttribute('data-id');
                this.navigateTo('topic-detail', { id: topicId });
            }
            
            // New topic button
            if (e.target.id === 'new-topic-btn') {
                document.getElementById('new-topic-modal').style.display = 'flex';
            }
            
            // Close modal
            if (e.target.classList.contains('close-modal')) {
                e.target.closest('.modal').style.display = 'none';
            }
            
            // Time slot selection
            if (e.target.classList.contains('time-slot') && e.target.classList.contains('available')) {
                document.querySelectorAll('.time-slot').forEach(slot => {
                    slot.classList.remove('selected');
                });
                e.target.classList.add('selected');
                document.getElementById('book-session-btn').disabled = false;
            }
            
            // Book session button
            if (e.target.id === 'book-session-btn') {
                this.bookSession();
            }
        });
        
        // Mobile menu toggle
        document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
            const nav = document.querySelector('nav');
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Form submissions
        document.addEventListener('submit', (e) => {
            // Review form
            if (e.target.id === 'review-form') {
                e.preventDefault();
                this.submitReview();
            }
            
            // New topic form
            if (e.target.id === 'new-topic-form') {
                e.preventDefault();
                this.submitNewTopic();
            }
            
            // Reply form
            if (e.target.id === 'reply-form') {
                e.preventDefault();
                this.submitReply();
            }
            
            // Profile form
            if (e.target.id === 'profile-form') {
                e.preventDefault();
                this.updateProfile();
            }
        });
        
        // Profile tabs
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn') && e.target.closest('.profile-tabs')) {
                const tabId = e.target.getAttribute('data-tab');
                this.toggleProfileTabs(tabId);
            }
        });
    },
    
    // Navigate to a specific page
    navigateTo: function(pageId, params = {}) {
        this.currentPage = pageId;
        
        // Update URL for bookmarking and browser history
        let url = '?page=' + pageId;
        if (params.id) {
            url += '&id=' + params.id;
        }
        window.history.pushState({ pageId, params }, '', url);
        
        // Load the page content
        this.loadPage(pageId, params);
        
        // Update active nav link
        document.querySelectorAll('nav a').forEach(link => {
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },
    
    // Load page from URL parameters (for direct links and bookmarks)
    loadPageFromURL: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const pageId = urlParams.get('page') || 'home';
        const id = urlParams.get('id');
        
        this.loadPage(pageId, { id });
    },
    
    // Load a page into the main content area
    loadPage: function(pageId, params = {}) {
        // Get template for the requested page
        const templateId = pageId + '-template';
        const template = document.getElementById(templateId);
        
        if (!template) {
            console.error('Template not found:', templateId);
            return;
        }
        
        // Clone template content
        const content = template.content.cloneNode(true);
        
        // Clear main content and append new content
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = '';
        mainContent.appendChild(content);
        
        // Execute page-specific loading logic
        switch (pageId) {
            case 'home':
                // No specific logic needed for home page
                break;
                
            case 'therapists':
                this.loadTherapistsPage();
                break;
                
            case 'therapist-detail':
                this.loadTherapistDetail(params.id);
                break;
                
            case 'profile':
                if (!Auth.isLoggedIn()) {
                    this.navigateTo('auth');
                    return;
                }
                this.loadProfilePage();
                break;
                
            case 'resources':
                // No specific logic needed for resources page
                break;
                
            case 'resource-detail':
                this.loadResourceDetail(params.id);
                break;
                
            case 'forum':
                this.loadForumPage();
                break;
                
            case 'topic-detail':
                this.loadTopicDetail(params.id);
                break;
        }
    },
    
    // Load therapists list page
    loadTherapistsPage: function() {
        const therapists = TherapyData.getTherapists();
        const therapistsList = document.getElementById('therapists-list');
        const cityFilter = document.getElementById('city-filter');
        const specializationFilter = document.getElementById('specialization-filter');
        
        // Clear existing content
        therapistsList.innerHTML = '';
        
        // Populate filters
        const cities = [...new Set(therapists.map(t => t.city))];
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            cityFilter.appendChild(option);
        });
        
        // Get unique specializations for filter
        let allSpecializations = [];
        therapists.forEach(t => {
            if (t.specializations) {
                allSpecializations = [...allSpecializations, ...t.specializations];
            }
        });
        const uniqueSpecializations = [...new Set(allSpecializations)];
        
        uniqueSpecializations.forEach(spec => {
            const option = document.createElement('option');
            option.value = spec;
            option.textContent = spec;
            specializationFilter.appendChild(option);
        });
        
        // Create therapist cards
        therapists.forEach(therapist => {
            const card = document.createElement('div');
            card.className = 'therapist-card';
            card.setAttribute('data-id', therapist.id);
            
            // HTML for the card
            card.innerHTML = `
                <div class="therapist-card-photo">
                    <img src="img/placeholder.jpg" alt="${therapist.name}">
                </div>
                <div class="therapist-card-content">
                    <h3 class="therapist-card-name">${therapist.name}</h3>
                    <p class="therapist-card-city">${therapist.city}</p>
                    <div class="therapist-card-types">
                        ${therapist.online ? '<span class="session-type">Online</span>' : ''}
                        ${therapist.office ? '<span class="session-type">La cabinet</span>' : ''}
                    </div>
                    <div class="therapist-card-specializations">
                        <div class="tag-list">
                            ${(therapist.specializations || []).map(spec => `
                                <span class="tag">${spec}</span>
                            `).join('')}
                        </div>
                    </div>
                    <div class="therapist-card-action">
                        <a href="#" class="btn primary-btn" data-page="therapist-detail" data-id="${therapist.id}">
                            Vezi profil
                        </a>
                    </div>
                </div>
            `;
            
            therapistsList.appendChild(card);
        });
        
        // Set up filter functionality
        const setupFilters = () => {
            const cityValue = cityFilter.value;
            const sessionTypeValue = document.getElementById('session-type-filter').value;
            const genderValue = document.getElementById('gender-filter').value;
            const specializationValue = specializationFilter.value;
            
            document.querySelectorAll('.therapist-card').forEach(card => {
                const therapistId = card.getAttribute('data-id');
                const therapist = TherapyData.getTherapistById(therapistId);
                
                let visible = true;
                
                // Apply city filter
                if (cityValue && therapist.city !== cityValue) {
                    visible = false;
                }
                
                // Apply session type filter
                if (sessionTypeValue) {
                    if (sessionTypeValue === 'online' && !therapist.online) {
                        visible = false;
                    } else if (sessionTypeValue === 'office' && !therapist.office) {
                        visible = false;
                    }
                }
                
                // Apply gender filter
                if (genderValue && therapist.gender !== genderValue) {
                    visible = false;
                }
                
                // Apply specialization filter
                if (specializationValue && !therapist.specializations.includes(specializationValue)) {
                    visible = false;
                }
                
                // Update visibility
                card.style.display = visible ? 'block' : 'none';
            });
        };
        
        // Set up filter event listeners
        cityFilter.addEventListener('change', setupFilters);
        document.getElementById('session-type-filter').addEventListener('change', setupFilters);
        document.getElementById('gender-filter').addEventListener('change', setupFilters);
        specializationFilter.addEventListener('change', setupFilters);
    },
    
    // Load therapist detail page
    loadTherapistDetail: function(therapistId) {
        const therapist = TherapyData.getTherapistById(therapistId);
        if (!therapist) {
            console.error('Therapist not found:', therapistId);
            this.navigateTo('therapists');
            return;
        }
        
        // Set therapist info
        document.getElementById('therapist-name').textContent = therapist.name;
        document.getElementById('therapist-city').textContent = therapist.city;
        document.getElementById('therapist-description-text').textContent = therapist.description;
        document.getElementById('therapist-why-text').textContent = therapist.why;
        
        // Set session types
        const sessionTypesContainer = document.getElementById('therapist-session-types');
        sessionTypesContainer.innerHTML = '';
        if (therapist.online) {
            const span = document.createElement('span');
            span.className = 'session-type';
            span.textContent = 'Online';
            sessionTypesContainer.appendChild(span);
        }
        if (therapist.office) {
            const span = document.createElement('span');
            span.className = 'session-type';
            span.textContent = 'La cabinet';
            sessionTypesContainer.appendChild(span);
        }
        
        // Set specializations
        const specializationsContainer = document.getElementById('specializations-list');
        specializationsContainer.innerHTML = '';
        (therapist.specializations || []).forEach(spec => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = spec;
            specializationsContainer.appendChild(span);
        });
        
        // Load calendar
        this.loadCalendarForTherapist(therapist);
        
        // Load reviews
        this.loadReviewsForTherapist(therapist.id);
        
        // Show/hide add review form based on authentication
        const addReviewForm = document.getElementById('add-review-form');
        if (!Auth.isLoggedIn()) {
            addReviewForm.innerHTML = `
                <p>Pentru a adăuga o recenzie, te rugăm să te <a href="#" data-page="auth">autentifici</a>.</p>
            `;
        }
    },
    
    // Load calendar for therapist booking
    loadCalendarForTherapist: function(therapist) {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '<h4>Selectează o zi:</h4>';
        
        // Create simple calendar with 7 days starting from today
        const today = new Date();
        const daysOfWeek = ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'];
        const monthsOfYear = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
        
        // Create days list
        const daysList = document.createElement('div');
        daysList.className = 'days-list';
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const dayItem = document.createElement('div');
            dayItem.className = 'day-item';
            dayItem.setAttribute('data-date', date.toISOString().split('T')[0]);
            
            const weekday = daysOfWeek[date.getDay()];
            const day = date.getDate();
            const month = monthsOfYear[date.getMonth()];
            
            dayItem.innerHTML = `
                <div class="day-weekday">${weekday}</div>
                <div class="day-number">${day}</div>
                <div class="day-month">${month}</div>
            `;
            
            // Add event listener to show time slots for the selected day
            dayItem.addEventListener('click', (e) => {
                document.querySelectorAll('.day-item').forEach(item => {
                    item.classList.remove('selected');
                });
                dayItem.classList.add('selected');
                
                this.showTimeSlotsForDay(therapist, date);
            });
            
            daysList.appendChild(dayItem);
        }
        
        calendar.appendChild(daysList);
        
        // Auto-select first day
        const firstDay = daysList.querySelector('.day-item');
        if (firstDay) {
            firstDay.click();
        }
    },
    
    // Show time slots for a day
    showTimeSlotsForDay: function(therapist, date) {
        const timeSlotsContainer = document.getElementById('time-slots');
        timeSlotsContainer.innerHTML = '<h4>Intervale orare disponibile:</h4>';
        
        // Get day of week
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = daysOfWeek[date.getDay()];
        
        // Check if therapist has availability for this day
        const availableSlots = therapist.availability[dayName] || [];
        const dateString = date.toISOString().split('T')[0];
        
        // Get existing appointments for the therapist on this day
        const appointments = TherapyData.getAppointments();
        const bookedSlots = appointments
            .filter(a => a.therapistId === therapist.id && a.date === dateString)
            .map(a => a.time);
        
        // Create time slots
        if (availableSlots.length === 0) {
            timeSlotsContainer.innerHTML += '<p>Nu există intervale disponibile pentru această zi.</p>';
        } else {
            const slotsWrapper = document.createElement('div');
            slotsWrapper.className = 'time-slots-wrapper';
            
            availableSlots.forEach(time => {
                const isBooked = bookedSlots.includes(time);
                
                const slot = document.createElement('div');
                slot.className = `time-slot ${isBooked ? 'booked' : 'available'}`;
                slot.setAttribute('data-time', time);
                slot.textContent = time;
                
                if (isBooked) {
                    slot.setAttribute('title', 'Rezervat');
                }
                
                slotsWrapper.appendChild(slot);
            });
            
            timeSlotsContainer.appendChild(slotsWrapper);
        }
        
        // Reset book button
        document.getElementById('book-session-btn').disabled = true;
        
        // Store selected date for booking
        timeSlotsContainer.setAttribute('data-selected-date', dateString);
    },
    
    // Book a therapy session
    bookSession: function() {
        // Check if user is logged in
        if (!Auth.isLoggedIn()) {
            alert('Pentru a programa o ședință, te rugăm să te autentifici.');
            this.navigateTo('auth');
            return;
        }
        
        // Get selected date and time
        const selectedDate = document.getElementById('time-slots').getAttribute('data-selected-date');
        const selectedTimeSlot = document.querySelector('.time-slot.selected');
        
        if (!selectedTimeSlot) {
            alert('Te rugăm să selectezi un interval orar.');
            return;
        }
        
        const selectedTime = selectedTimeSlot.getAttribute('data-time');
        const therapistId = this.getTherapistIdFromCurrentPage();
        
        // Create appointment
        const appointment = {
            therapistId,
            userId: Auth.currentUser.id,
            date: selectedDate,
            time: selectedTime,
            status: 'confirmed'
        };
        
        // Save appointment
        TherapyData.saveAppointment(appointment);
        
        // Show confirmation and refresh page
        alert('Programare realizată cu succes!');
        this.loadTherapistDetail(therapistId);
    },
    
    // Get therapist ID from current page
    getTherapistIdFromCurrentPage: function() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    },
    
    // Load reviews for a therapist
    loadReviewsForTherapist: function(therapistId) {
        const reviews = TherapyData.getReviewsByTherapistId(therapistId).filter(r => r.approved);
        const reviewsList = document.getElementById('reviews-list');
        
        reviewsList.innerHTML = '';
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p>Nicio recenzie încă.</p>';
            return;
        }
        
        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review';
            
            // HTML for the review
            reviewElement.innerHTML = `
                <div class="review-header">
                    <div class="review-author">${review.userName}</div>
                    <div class="review-rating">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>
                </div>
                <div class="review-text">${review.text}</div>
                <div class="review-date">${new Date(review.date).toLocaleDateString('ro-RO')}</div>
            `;
            
            reviewsList.appendChild(reviewElement);
        });
    },
    
    // Submit a new review
    submitReview: function() {
        // Check if user is logged in
        if (!Auth.isLoggedIn()) {
            alert('Pentru a adăuga o recenzie, te rugăm să te autentifici.');
            this.navigateTo('auth');
            return;
        }
        
        const therapistId = this.getTherapistIdFromCurrentPage();
        const rating = document.getElementById('review-rating').value;
        const text = document.getElementById('review-text').value;
        
        // Validate input
        if (!text.trim()) {
            alert('Te rugăm să introduci textul recenziei.');
            return;
        }
        
        // Create review object
        const review = {
            therapistId,
            userId: Auth.currentUser.id,
            userName: Auth.currentUser.name,
            rating: parseInt(rating),
            text,
            date: new Date().toISOString().split('T')[0]
        };
        
        // Save review
        TherapyData.saveReview(review);
        
        // Show confirmation and clear form
        alert('Recenzie trimisă cu succes! Aceasta va fi afișată după moderare.');
        document.getElementById('review-text').value = '';
        document.getElementById('review-rating').value = '5';
    },
    
    // Load profile page
    loadProfilePage: function() {
        const user = Auth.currentUser;
        
        // Fill profile form
        document.getElementById('profile-name').value = user.name;
        document.getElementById('profile-email').value = user.email;
        
        // If user is therapist, fill additional fields
        if (user.userType === 'therapist') {
            document.getElementById('profile-description').value = user.description || '';
            document.getElementById('profile-why').value = user.why || '';
            document.getElementById('profile-specialization').value = (user.specializations || []).join(', ');
            document.getElementById('profile-city').value = user.city || '';
            document.getElementById('profile-online-sessions').checked = user.online || false;
            document.getElementById('profile-office-sessions').checked = user.office || false;
            
            // Set up availability calendar
            this.loadAvailabilityCalendar(user);
        }
        
        // Load appointments
        this.loadUserAppointments(user.id);
    },
    
    // Toggle profile tabs
    toggleProfileTabs: function(activeTab) {
        // Update tab buttons
        const tabBtns = document.querySelectorAll('.profile-tabs .tab-btn');
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === activeTab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update tab content
        const tabContents = document.querySelectorAll('.profile-section .tab-content');
        tabContents.forEach(content => {
            if (content.id === activeTab) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    },
    
    // Load user appointments
    loadUserAppointments: function(userId) {
        let appointments;
        
        if (Auth.isTherapist()) {
            // If user is therapist, show appointments for them
            appointments = TherapyData.getAppointmentsByTherapistId(userId);
        } else {
            // If user is youth, show their appointments
            appointments = TherapyData.getAppointmentsByUserId(userId);
        }
        
        const appointmentsList = document.getElementById('appointments-list');
        appointmentsList.innerHTML = '';
        
        if (appointments.length === 0) {
            appointmentsList.innerHTML = '<p>Nu există programări.</p>';
            return;
        }
        
        // Sort appointments by date and time
        appointments.sort((a, b) => {
            if (a.date !== b.date) {
                return a.date.localeCompare(b.date);
            }
            return a.time.localeCompare(b.time);
        });
        
        // Create appointments list
        appointments.forEach(appointment => {
            const appointmentElement = document.createElement('div');
            appointmentElement.className = 'appointment';
            
            // Get other party details (therapist or user)
            let otherPartyName = '';
            if (Auth.isTherapist()) {
                const user = TherapyData.getUserById(appointment.userId);
                otherPartyName = user ? user.name : 'Client necunoscut';
            } else {
                const therapist = TherapyData.getTherapistById(appointment.therapistId);
                otherPartyName = therapist ? therapist.name : 'Terapeut necunoscut';
            }
            
            // Format date
            const dateObj = new Date(appointment.date);
            const formattedDate = dateObj.toLocaleDateString('ro-RO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // HTML for the appointment
            appointmentElement.innerHTML = `
                <div class="appointment-header">
                    <div class="appointment-date">${formattedDate}</div>
                    <div class="appointment-time">${appointment.time}</div>
                </div>
                <div class="appointment-details">
                    <div class="appointment-with">
                        ${Auth.isTherapist() ? 'Client' : 'Terapeut'}: ${otherPartyName}
                    </div>
                    <div class="appointment-status">
                        Status: <span class="status-${appointment.status}">${this.getStatusText(appointment.status)}</span>
                    </div>
                </div>
            `;
            
            appointmentsList.appendChild(appointmentElement);
        });
    },
    
    // Get text for appointment status
    getStatusText: function(status) {
        switch (status) {
            case 'confirmed': return 'Confirmat';
            case 'completed': return 'Finalizat';
            case 'cancelled': return 'Anulat';
            default: return status;
        }
    },
    
    // Load availability calendar for therapist
    loadAvailabilityCalendar: function(therapist) {
        // This is a simplified version, in a real app this would be more complex
        const availabilitySlots = document.getElementById('availability-slots');
        if (!availabilitySlots) return;
        
        availabilitySlots.innerHTML = '<p>În această versiune a platformei, disponibilitatea se setează cu valori implicite la înregistrare. Pentru o versiune viitoare, aici veți putea gestiona calendarul de disponibilitate.</p>';
    },
    
    // Update user profile
    updateProfile: function() {
        const user = Auth.currentUser;
        
        // Get basic profile data
        user.name = document.getElementById('profile-name').value;
        
        // If user is therapist, get additional data
        if (user.userType === 'therapist') {
            user.description = document.getElementById('profile-description').value;
            user.why = document.getElementById('profile-why').value;
            user.specializations = document.getElementById('profile-specialization').value.split(',').map(s => s.trim());
            user.city = document.getElementById('profile-city').value;
            user.online = document.getElementById('profile-online-sessions').checked;
            user.office = document.getElementById('profile-office-sessions').checked;
        }
        
        // Save user data
        TherapyData.saveUser(user);
        
        // If user is therapist, also update therapist data
        if (user.userType === 'therapist') {
            TherapyData.saveTherapist(user);
        }
        
        // Update current user in Auth
        Auth.setCurrentUser(user);
        
        // Show confirmation
        alert('Profilul a fost actualizat cu succes!');
    },
    
    // Load resource detail page
    loadResourceDetail: function(resourceId) {
        const resource = TherapyData.getResourceById(resourceId);
        if (!resource) {
            console.error('Resource not found:', resourceId);
            this.navigateTo('resources');
            return;
        }
        
        document.getElementById('resource-title').textContent = resource.title;
        document.getElementById('resource-content').innerHTML = resource.content;
    },
    
    // Load forum page
    loadForumPage: function() {
        const topics = TherapyData.getForumTopics();
        const topicsList = document.getElementById('forum-topics');
        
        topicsList.innerHTML = '';
        
        if (topics.length === 0) {
            topicsList.innerHTML = '<p>Nu există subiecte încă. Fii primul care deschide o discuție!</p>';
            return;
        }
        
        // Sort topics by date (newest first)
        topics.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Create topics list
        topics.forEach(topic => {
            const topicElement = document.createElement('div');
            topicElement.className = 'forum-topic';
            topicElement.setAttribute('data-id', topic.id);
            
            // Get replies count
            const replies = TherapyData.getForumRepliesByTopicId(topic.id);
            
            // Format date
            const date = new Date(topic.date);
            const formattedDate = date.toLocaleDateString('ro-RO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // HTML for the topic
            topicElement.innerHTML = `
                <h3 class="topic-title">${topic.title}</h3>
                <div class="topic-meta">
                    <span class="topic-author">Autor: ${topic.userName}</span>
                    <span class="topic-date">Data: ${formattedDate}</span>
                    <span class="topic-replies">Răspunsuri: ${replies.length}</span>
                </div>
            `;
            
            topicsList.appendChild(topicElement);
        });
        
        // Check if user is logged in to enable new topic button
        const newTopicBtn = document.getElementById('new-topic-btn');
        if (!Auth.isLoggedIn()) {
            newTopicBtn.disabled = true;
            newTopicBtn.title = 'Trebuie să fii autentificat pentru a crea un subiect nou';
        } else {
            newTopicBtn.disabled = false;
            newTopicBtn.title = '';
        }
    },
    
    // Submit new forum topic
    submitNewTopic: function() {
        // Check if user is logged in
        if (!Auth.isLoggedIn()) {
            alert('Pentru a crea un subiect nou, te rugăm să te autentifici.');
            this.navigateTo('auth');
            return;
        }
        
        const title = document.getElementById('topic-title').value;
        const content = document.getElementById('topic-content').value;
        
        // Validate input
        if (!title.trim() || !content.trim()) {
            alert('Te rugăm să completezi toate câmpurile.');
            return;
        }
        
        // Create topic object
        const topic = {
            userId: Auth.currentUser.id,
            userName: Auth.currentUser.name,
            title,
            content
        };
        
        // Save topic
        const savedTopic = TherapyData.saveForumTopic(topic);
        
        // Close modal
        document.getElementById('new-topic-modal').style.display = 'none';
        
        // Clear form
        document.getElementById('topic-title').value = '';
        document.getElementById('topic-content').value = '';
        
        // Navigate to the new topic
        this.navigateTo('topic-detail', { id: savedTopic.id });
    },
    
    // Load topic detail page
    loadTopicDetail: function(topicId) {
        const topic = TherapyData.getForumTopicById(topicId);
        if (!topic) {
            console.error('Topic not found:', topicId);
            this.navigateTo('forum');
            return;
        }
        
        // Set topic details
        document.getElementById('topic-title').textContent = topic.title;
        document.getElementById('topic-author').textContent = `Autor: ${topic.userName}`;
        
        // Format date
        const date = new Date(topic.date);
        const formattedDate = date.toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('topic-date').textContent = `Data: ${formattedDate}`;
        
        // Set topic content
        document.getElementById('topic-content').textContent = topic.content;
        
        // Load replies
        this.loadRepliesForTopic(topicId);
        
        // Check if user is logged in to enable reply form
        const replyForm = document.getElementById('reply-form');
        if (!Auth.isLoggedIn()) {
            replyForm.innerHTML = `
                <p>Pentru a răspunde, te rugăm să te <a href="#" data-page="auth">autentifici</a>.</p>
            `;
        }
    },
    
    // Load replies for a topic
    loadRepliesForTopic: function(topicId) {
        const replies = TherapyData.getForumRepliesByTopicId(topicId);
        const repliesList = document.getElementById('replies-list');
        
        repliesList.innerHTML = '';
        
        if (replies.length === 0) {
            repliesList.innerHTML = '<p>Nu există răspunsuri încă. Fii primul care răspunde!</p>';
            return;
        }
        
        // Sort replies by date
        replies.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Create replies list
        replies.forEach(reply => {
            const replyElement = document.createElement('div');
            replyElement.className = 'reply';
            
            // Format date
            const date = new Date(reply.date);
            const formattedDate = date.toLocaleDateString('ro-RO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // HTML for the reply
            replyElement.innerHTML = `
                <div class="reply-header">
                    <div class="reply-author">${reply.userName}</div>
                    <div class="reply-date">${formattedDate}</div>
                </div>
                <div class="reply-content">${reply.content}</div>
            `;
            
            repliesList.appendChild(replyElement);
        });
    },
    
    // Submit reply to a topic
    submitReply: function() {
        // Check if user is logged in
        if (!Auth.isLoggedIn()) {
            alert('Pentru a răspunde, te rugăm să te autentifici.');
            this.navigateTo('auth');
            return;
        }
        
        const content = document.getElementById('reply-content').value;
        
        // Validate input
        if (!content.trim()) {
            alert('Te rugăm să introduci conținutul răspunsului.');
            return;
        }
        
        // Get topic ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const topicId = urlParams.get('id');
        
        // Create reply object
        const reply = {
            topicId,
            userId: Auth.currentUser.id,
            userName: Auth.currentUser.name + (Auth.isTherapist() ? ' (Terapeut)' : ''),
            content
        };
        
        // Save reply
        TherapyData.saveForumReply(reply);
        
        // Clear form
        document.getElementById('reply-content').value = '';
        
        // Reload replies
        this.loadRepliesForTopic(topicId);
    }
};

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    if (event.state) {
        App.loadPage(event.state.pageId, event.state.params);
    } else {
        App.loadPage('home');
    }
}); 