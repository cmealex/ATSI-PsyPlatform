/**
 * Main application module for the therapy platform
 * Handles page navigation, UI updates, and app functionality
 */

const App = {
    // Current page ID
    currentPage: 'home',
    
    // BUG-004 FIX: Sanitize HTML to prevent XSS attacks
    sanitizeHTML: function(html) {
        // Check if DOMPurify is available
        if (typeof DOMPurify !== 'undefined') {
            return DOMPurify.sanitize(html, {
                ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
                ALLOWED_ATTR: []
            });
        }
        // Fallback if DOMPurify is not loaded
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    },
    
    // Initialize application
    init: async function() {
        // Initialize data storage
        await TherapyData.init();
        
        // Initialize authentication
        await Auth.init();
        
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
                const id = e.target.getAttribute('data-id');
                if (id) {
                    this.navigateTo(page, { id: id });
                } else {
                    this.navigateTo(page);
                }
            }
            
            // Therapist list item clicks (when clicking on card but not on button)
            if (e.target.closest('.therapist-card') && !e.target.closest('.btn') && !e.target.matches('[data-page]')) {
                const card = e.target.closest('.therapist-card');
                const therapistId = card.getAttribute('data-id');
                if (therapistId) {
                    this.navigateTo('therapist-detail', { id: therapistId });
                }
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
                const modalId = e.target.getAttribute('data-modal');
                if (modalId) {
                    document.getElementById(modalId).style.display = 'none';
                } else {
                    e.target.closest('.modal').style.display = 'none';
                }
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
                this.bookSession().catch(err => console.error('Error booking session:', err));
            }
        });
        
        // Mobile menu toggle
        document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
            const nav = document.querySelector('nav');
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // BUG-005 FIX: Close mobile menu after clicking a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function() {
                const nav = document.querySelector('nav');
                const toggle = document.querySelector('.mobile-menu-toggle');
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    toggle.classList.remove('active');
                }
            });
        });
        
        // Form submissions
        document.addEventListener('submit', (e) => {
            // Review form
            if (e.target.id === 'review-form') {
                e.preventDefault();
                this.submitReview().catch(err => console.error('Error submitting review:', err));
            }
            
            // New topic form
            if (e.target.id === 'new-topic-form') {
                e.preventDefault();
                this.submitNewTopic().catch(err => console.error('Error submitting topic:', err));
            }
            
            // Reply form
            if (e.target.id === 'reply-form') {
                e.preventDefault();
                this.submitReply().catch(err => console.error('Error submitting reply:', err));
            }
            
            // Profile form
            if (e.target.id === 'profile-form') {
                e.preventDefault();
                this.updateProfile().catch(err => console.error('Error updating profile:', err));
            }
        });
        
        // Profile tabs
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn') && e.target.closest('.profile-tabs')) {
                const tabId = e.target.getAttribute('data-tab');
                this.toggleProfileTabs(tabId);
            }
            
            // Admin tabs
            if (e.target.classList.contains('tab-btn') && e.target.closest('.admin-tabs')) {
                const tabId = e.target.getAttribute('data-tab');
                this.toggleAdminTabs(tabId);
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
    loadPage: async function(pageId, params = {}) {
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
                await this.loadTherapistsPage();
                break;
                
            case 'therapist-detail':
                await this.loadTherapistDetail(params.id);
                break;
                
            case 'profile':
                if (!Auth.isLoggedIn()) {
                    this.navigateTo('auth');
                    return;
                }
                await this.loadProfilePage();
                break;
                
            case 'resources':
                // No specific logic needed for resources page
                break;
                
            case 'resource-detail':
                await this.loadResourceDetail(params.id);
                break;
                
            case 'forum':
                await this.loadForumPage();
                break;
                
            case 'topic-detail':
                await this.loadTopicDetail(params.id);
                break;
                
            case 'admin':
                if (!Auth.isAdmin()) {
                    alert('Acces interzis. Doar administratorii pot accesa această pagină.');
                    this.navigateTo('home');
                    return;
                }
                await this.loadAdminPage();
                break;
        }
    },
    
    // Load therapists list page
    loadTherapistsPage: async function() {
        const therapists = await TherapyData.getTherapists();
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
            
            // HTML for the card (BUG-004 FIX: Sanitize user-generated content)
            card.innerHTML = `
                <div class="therapist-card-photo">
                    <img src="${therapist.photo || 'Date/Poze2/placeholder.jpg'}" alt="${this.sanitizeHTML(therapist.name)}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22%23999%22%3E${therapist.name.split(' ').map(n => n[0]).join('')}%3C/text%3E%3C/svg%3E'">
                </div>
                <div class="therapist-card-content">
                    <h3 class="therapist-card-name">${this.sanitizeHTML(therapist.name)}</h3>
                    <p class="therapist-card-city">${this.sanitizeHTML(therapist.city)}</p>
                    <div class="therapist-card-types">
                        ${therapist.online ? '<span class="session-type">Online</span>' : ''}
                        ${therapist.office ? '<span class="session-type">La cabinet</span>' : ''}
                    </div>
                    <div class="therapist-card-specializations">
                        <div class="tag-list">
                            ${(therapist.specializations || []).map(spec => `
                                <span class="tag">${this.sanitizeHTML(spec)}</span>
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
        const setupFilters = async () => {
            const cityValue = cityFilter.value;
            const sessionTypeValue = document.getElementById('session-type-filter').value;
            const genderValue = document.getElementById('gender-filter').value;
            const specializationValue = specializationFilter.value;
            
            let visibleCount = 0;
            
            for (const card of document.querySelectorAll('.therapist-card')) {
                const therapistId = card.getAttribute('data-id');
                const therapist = await TherapyData.getTherapistById(therapistId);
                
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
                if (visible) visibleCount++;
            }
            
            // BUG-007 FIX: Show message when no results
            const existingMessage = therapistsList.querySelector('.no-results-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            if (visibleCount === 0) {
                const noResultsDiv = document.createElement('div');
                noResultsDiv.className = 'no-results-message';
                noResultsDiv.innerHTML = `
                    <div class="no-results-content">
                        <p>Nu am găsit terapeuți cu criteriile selectate.</p>
                        <p>Te rugăm să modifici filtrele sau</p>
                        <button class="btn secondary-btn" id="reset-filters-btn">Resetează filtrele</button>
                    </div>
                `;
                therapistsList.appendChild(noResultsDiv);
                
                // BUG-006 FIX: Add reset filters functionality
                document.getElementById('reset-filters-btn').addEventListener('click', resetFilters);
            }
        };
        
        // BUG-006 FIX: Reset filters function
        const resetFilters = () => {
            cityFilter.value = '';
            document.getElementById('session-type-filter').value = '';
            document.getElementById('gender-filter').value = '';
            specializationFilter.value = '';
            setupFilters();
        };
        
        // Set up filter event listeners
        cityFilter.addEventListener('change', setupFilters);
        document.getElementById('session-type-filter').addEventListener('change', setupFilters);
        document.getElementById('gender-filter').addEventListener('change', setupFilters);
        specializationFilter.addEventListener('change', setupFilters);
    },
    
    // Load therapist detail page
    loadTherapistDetail: async function(therapistId) {
        const therapist = await TherapyData.getTherapistById(therapistId);
        if (!therapist) {
            console.error('Therapist not found:', therapistId);
            this.navigateTo('therapists');
            return;
        }
        
        // Set therapist photo
        const therapistImg = document.getElementById('therapist-img');
        if (therapistImg) {
            therapistImg.src = therapist.photo || 'Date/Poze2/placeholder.jpg';
            therapistImg.onerror = function() {
                this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2240%22 fill=%22%23999%22%3E' + therapist.name.split(' ').map(n => n[0]).join('') + '%3C/text%3E%3C/svg%3E';
            };
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
        await this.loadReviewsForTherapist(therapist.id);
        
        // Show/hide add review form based on authentication
        const addReviewForm = document.getElementById('add-review-form');
        if (!Auth.isLoggedIn()) {
            addReviewForm.innerHTML = `
                <p>Pentru a adăuga o recenzie, te rugăm să te <a href="#" data-page="auth">autentifici</a>.</p>
            `;
        } else {
            // BUG-009 FIX: Add character counter for review text
            const reviewTextarea = document.getElementById('review-text');
            const characterCount = document.querySelector('.character-count');
            if (reviewTextarea && characterCount) {
                reviewTextarea.addEventListener('input', function() {
                    const count = this.value.length;
                    characterCount.textContent = `${count}/1000 caractere`;
                });
            }
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
            dayItem.addEventListener('click', async (e) => {
                document.querySelectorAll('.day-item').forEach(item => {
                    item.classList.remove('selected');
                });
                dayItem.classList.add('selected');
                
                await this.showTimeSlotsForDay(therapist, date);
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
    showTimeSlotsForDay: async function(therapist, date) {
        const timeSlotsContainer = document.getElementById('time-slots');
        timeSlotsContainer.innerHTML = '<h4>Intervale orare disponibile:</h4>';
        
        // Get day of week
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = daysOfWeek[date.getDay()];
        
        // Check if therapist has availability for this day
        const availableSlots = therapist.availability[dayName] || [];
        const dateString = date.toISOString().split('T')[0];
        
        // Get existing appointments for the therapist on this day
        const appointments = await TherapyData.getAppointments();
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
    bookSession: async function() {
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
        
        // BUG-008 FIX: Check for duplicate bookings
        const existingAppointments = await TherapyData.getAppointmentsByUserId(Auth.currentUser.id);
        const duplicate = existingAppointments.find(app => 
            app.therapistId === therapistId && 
            app.date === selectedDate && 
            app.time === selectedTime
        );
        
        if (duplicate) {
            alert('Ai deja o programare la această dată și oră cu acest terapeut.');
            return;
        }
        
        // Create appointment
        const appointment = {
            therapistId,
            userId: Auth.currentUser.id,
            date: selectedDate,
            time: selectedTime,
            status: 'confirmed'
        };
        
        // Save appointment
        await TherapyData.saveAppointment(appointment);
        
        // Show confirmation and refresh page
        alert('Programare realizată cu succes!');
        await this.loadTherapistDetail(therapistId);
    },
    
    // Get therapist ID from current page
    getTherapistIdFromCurrentPage: function() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    },
    
    // Load reviews for a therapist
    loadReviewsForTherapist: async function(therapistId) {
        const allReviews = await TherapyData.getReviewsByTherapistId(therapistId);
        const reviews = allReviews.filter(r => r.approved);
        const reviewsList = document.getElementById('reviews-list');
        
        reviewsList.innerHTML = '';
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p>Nicio recenzie încă.</p>';
            return;
        }
        
        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review';
            
            // HTML for the review (BUG-004 FIX: Sanitize user-generated content)
            reviewElement.innerHTML = `
                <div class="review-header">
                    <div class="review-author">${this.sanitizeHTML(review.userName)}</div>
                    <div class="review-rating">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>
                </div>
                <div class="review-text">${this.sanitizeHTML(review.text)}</div>
                <div class="review-date">${new Date(review.date).toLocaleDateString('ro-RO')}</div>
            `;
            
            reviewsList.appendChild(reviewElement);
        });
    },
    
    // Submit a new review
    submitReview: async function() {
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
        await TherapyData.saveReview(review);
        
        // Show confirmation and clear form
        alert('Recenzie trimisă cu succes! Aceasta va fi afișată după moderare.');
        document.getElementById('review-text').value = '';
        document.getElementById('review-rating').value = '5';
    },
    
    // Load profile page
    loadProfilePage: async function() {
        const user = Auth.currentUser;
        
        // Fill profile form
        document.getElementById('profile-name').value = user.name;
        document.getElementById('profile-email').value = user.email;
        
        // If user is therapist/psiholog, fill additional fields
        if (user.user_type === 'therapist' || user.user_type === 'psiholog') {
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
        await this.loadUserAppointments(user.id);
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
    loadUserAppointments: async function(userId) {
        let appointments;
        
        if (Auth.isTherapist()) {
            // If user is therapist, show appointments for them
            appointments = await TherapyData.getAppointmentsByTherapistId(userId);
        } else {
            // If user is youth, show their appointments
            appointments = await TherapyData.getAppointmentsByUserId(userId);
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
        for (const appointment of appointments) {
            const appointmentElement = document.createElement('div');
            appointmentElement.className = 'appointment';
            
            // Get other party details (therapist or user)
            let otherPartyName = '';
            if (Auth.isTherapist()) {
                const user = await TherapyData.getUserById(appointment.user_id);
                otherPartyName = user ? user.name : 'Client necunoscut';
            } else {
                const therapist = await TherapyData.getTherapistById(appointment.therapist_id);
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
        }
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
    
    // Get text for user type
    getUserTypeText: function(userType) {
        switch (userType) {
            case 'admin': return 'Administrator';
            case 'psiholog': return 'Psiholog';
            case 'therapist': return 'Terapeut';
            case 'beneficiar': return 'Beneficiar';
            case 'youth': return 'Tânăr';
            default: return userType;
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
    updateProfile: async function() {
        const user = Auth.currentUser;
        
        // Get basic profile data
        const name = document.getElementById('profile-name').value;
        
        // BUG-011 FIX: Validate required fields
        if (!name || !name.trim()) {
            alert('Numele este obligatoriu.');
            return;
        }
        
        user.name = name;
        
        // If user is therapist/psiholog, get additional data
        if (user.userType === 'therapist' || user.userType === 'psiholog') {
            const description = document.getElementById('profile-description').value;
            const why = document.getElementById('profile-why').value;
            const specializationText = document.getElementById('profile-specialization').value;
            const city = document.getElementById('profile-city').value;
            const online = document.getElementById('profile-online-sessions').checked;
            const office = document.getElementById('profile-office-sessions').checked;
            
            // BUG-011 FIX: Validate therapist required fields
            if (!description || !description.trim()) {
                alert('Descrierea este obligatorie pentru psihologi.');
                return;
            }
            if (!why || !why.trim()) {
                alert('Câmpul "De ce terapie cu mine?" este obligatoriu.');
                return;
            }
            if (!specializationText || !specializationText.trim()) {
                alert('Specializările sunt obligatorii.');
                return;
            }
            if (!city || !city.trim()) {
                alert('Orașul este obligatoriu pentru psihologi.');
                return;
            }
            if (!online && !office) {
                alert('Te rugăm să selectezi cel puțin un tip de sesiune.');
                return;
            }
            
            user.description = description;
            user.why = why;
            user.specializations = specializationText.split(',').map(s => s.trim()).filter(s => s);
            user.city = city;
            user.online = online;
            user.office = office;
        }
        
        // Save user data
        await TherapyData.saveUser(user);
        
        // If user is therapist/psiholog, also update therapist data
        if (user.user_type === 'therapist' || user.user_type === 'psiholog') {
            await TherapyData.saveTherapist(user);
        }
        
        // Update current user in Auth
        Auth.setCurrentUser(user);
        
        // Show confirmation
        alert('Profilul a fost actualizat cu succes!');
    },
    
    // Load resource detail page
    loadResourceDetail: async function(resourceId) {
        const resource = await TherapyData.getResourceById(resourceId);
        if (!resource) {
            console.error('Resource not found:', resourceId);
            this.navigateTo('resources');
            return;
        }
        
        document.getElementById('resource-title').textContent = resource.title;
        document.getElementById('resource-content').innerHTML = resource.content;
    },
    
    // Load forum page
    loadForumPage: async function() {
        const topics = await TherapyData.getForumTopics();
        const topicsList = document.getElementById('forum-topics');
        
        topicsList.innerHTML = '';
        
        if (topics.length === 0) {
            topicsList.innerHTML = '<p>Nu există subiecte încă. Fii primul care deschide o discuție!</p>';
            return;
        }
        
        // Sort topics by date (newest first)
        topics.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Create topics list
        for (const topic of topics) {
            const topicElement = document.createElement('div');
            topicElement.className = 'forum-topic';
            topicElement.setAttribute('data-id', topic.id);
            
            // Get replies count
            const replies = await TherapyData.getForumRepliesByTopicId(topic.id);
            
            // Format date
            const date = new Date(topic.date);
            const formattedDate = date.toLocaleDateString('ro-RO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // HTML for the topic (BUG-004 FIX: Sanitize user-generated content)
            topicElement.innerHTML = `
                <h3 class="topic-title">${this.sanitizeHTML(topic.title)}</h3>
                <div class="topic-meta">
                    <span class="topic-author">Autor: ${this.sanitizeHTML(topic.userName)}</span>
                    <span class="topic-date">Data: ${formattedDate}</span>
                    <span class="topic-replies">Răspunsuri: ${replies.length}</span>
                </div>
            `;
            
            topicsList.appendChild(topicElement);
        }
        
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
    submitNewTopic: async function() {
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
            user_id: Auth.currentUser.id,
            user_name: Auth.currentUser.name,
            title,
            content
        };
        
        // Save topic
        const savedTopic = await TherapyData.saveForumTopic(topic);
        
        // Close modal
        document.getElementById('new-topic-modal').style.display = 'none';
        
        // Clear form
        document.getElementById('topic-title').value = '';
        document.getElementById('topic-content').value = '';
        
        // Navigate to the new topic
        this.navigateTo('topic-detail', { id: savedTopic.id });
    },
    
    // Load topic detail page
    loadTopicDetail: async function(topicId) {
        const topic = await TherapyData.getForumTopicById(topicId);
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
        await this.loadRepliesForTopic(topicId);
        
        // Check if user is logged in to enable reply form
        const replyForm = document.getElementById('reply-form');
        if (!Auth.isLoggedIn()) {
            replyForm.innerHTML = `
                <p>Pentru a răspunde, te rugăm să te <a href="#" data-page="auth">autentifici</a>.</p>
            `;
        }
    },
    
    // Load replies for a topic
    loadRepliesForTopic: async function(topicId) {
        const replies = await TherapyData.getForumRepliesByTopicId(topicId);
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
            
            // HTML for the reply (BUG-004 FIX: Sanitize user-generated content)
            replyElement.innerHTML = `
                <div class="reply-header">
                    <div class="reply-author">${this.sanitizeHTML(reply.userName)}</div>
                    <div class="reply-date">${formattedDate}</div>
                </div>
                <div class="reply-content">${this.sanitizeHTML(reply.content)}</div>
            `;
            
            repliesList.appendChild(replyElement);
        });
    },
    
    // Submit reply to a topic
    submitReply: async function() {
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
            topic_id: topicId,
            user_id: Auth.currentUser.id,
            user_name: Auth.currentUser.name + (Auth.isTherapist() ? ' (Terapeut)' : ''),
            content
        };
        
        // Save reply
        await TherapyData.saveForumReply(reply);
        
        // Clear form
        document.getElementById('reply-content').value = '';
        
        // Reload replies
        await this.loadRepliesForTopic(topicId);
    },
    
    // Load admin page
    loadAdminPage: async function() {
        // Load users by default
        await this.loadAdminUsers();
        
        // Set up event listeners for admin actions
        document.getElementById('add-user-btn').addEventListener('click', () => this.showAddUserModal());
        document.getElementById('add-psychologist-btn').addEventListener('click', () => this.showAddPsychologistModal());
        
        // Set up form submissions
        document.getElementById('user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUserFromModal();
        });
        
        document.getElementById('psychologist-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePsychologistFromModal();
        });
    },
    
    // Toggle admin tabs
    toggleAdminTabs: function(activeTab) {
        // Update tab buttons
        const tabBtns = document.querySelectorAll('.admin-tabs .tab-btn');
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === activeTab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update tab content
        const tabContents = document.querySelectorAll('.admin-tab-content');
        tabContents.forEach(content => {
            if (content.id === activeTab) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
        
        // Load appropriate data
        switch (activeTab) {
            case 'users':
                this.loadAdminUsers().catch(err => console.error('Error loading users:', err));
                break;
            case 'psychologists':
                this.loadAdminPsychologists().catch(err => console.error('Error loading psychologists:', err));
                break;
            case 'reviews':
                this.loadAdminReviews().catch(err => console.error('Error loading reviews:', err));
                break;
            case 'appointments':
                this.loadAdminAppointments().catch(err => console.error('Error loading appointments:', err));
                break;
            case 'statistics':
                this.loadAdminStatistics().catch(err => console.error('Error loading statistics:', err));
                break;
        }
    },
    
    // Load users in admin panel
    loadAdminUsers: async function() {
        const users = await TherapyData.getUsers();
        const tbody = document.querySelector('#users-table tbody');
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${this.getUserTypeText(user.userType)}</td>
                <td>
                    <button class="btn-small secondary-btn" onclick="App.editUser('${user.id}')">Editează</button>
                    <button class="btn-small danger-btn" onclick="App.deleteUserConfirm('${user.id}')">Șterge</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },
    
    // Load psychologists in admin panel
    loadAdminPsychologists: async function() {
        const psychologists = await TherapyData.getTherapists(true);
        const tbody = document.querySelector('#psychologists-table tbody');
        tbody.innerHTML = '';
        
        psychologists.forEach(psych => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${psych.id}</td>
                <td>${psych.name}</td>
                <td>${psych.email}</td>
                <td>${psych.city}</td>
                <td><span class="status-badge ${psych.approved ? 'approved' : 'pending'}">${psych.approved ? 'Aprobat' : 'În așteptare'}</span></td>
                <td>
                    ${!psych.approved ? `<button class="btn-small primary-btn" onclick="App.approvePsychologist('${psych.id}')">Aprobă</button>` : ''}
                    <button class="btn-small secondary-btn" onclick="App.editPsychologist('${psych.id}')">Editează</button>
                    <button class="btn-small danger-btn" onclick="App.deletePsychologistConfirm('${psych.id}')">Șterge</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },
    
    // Load reviews in admin panel
    loadAdminReviews: async function() {
        const reviews = await TherapyData.getReviews();
        const tbody = document.querySelector('#reviews-table tbody');
        tbody.innerHTML = '';
        
        for (const review of reviews) {
            const therapist = await TherapyData.getTherapistById(review.therapist_id);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${review.id}</td>
                <td>${review.user_name}</td>
                <td>${therapist ? therapist.name : 'Necunoscut'}</td>
                <td>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</td>
                <td><div class="review-text-preview">${review.text.substring(0, 50)}...</div></td>
                <td><span class="status-badge ${review.approved ? 'approved' : 'pending'}">${review.approved ? 'Aprobată' : 'În așteptare'}</span></td>
                <td>
                    ${!review.approved ? `<button class="btn-small primary-btn" onclick="App.approveReviewAdmin('${review.id}')">Aprobă</button>` : ''}
                    <button class="btn-small danger-btn" onclick="App.deleteReviewConfirm('${review.id}')">Șterge</button>
                </td>
            `;
            tbody.appendChild(row);
        }
    },
    
    // Load appointments in admin panel
    loadAdminAppointments: async function() {
        const appointments = await TherapyData.getAppointments();
        const tbody = document.querySelector('#appointments-table tbody');
        tbody.innerHTML = '';
        
        for (const appointment of appointments) {
            const therapist = await TherapyData.getTherapistById(appointment.therapist_id);
            const user = await TherapyData.getUserById(appointment.user_id);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.id}</td>
                <td>${user ? user.name : 'Necunoscut'}</td>
                <td>${therapist ? therapist.name : 'Necunoscut'}</td>
                <td>${new Date(appointment.date).toLocaleDateString('ro-RO')}</td>
                <td>${appointment.time}</td>
                <td><span class="status-badge status-${appointment.status}">${this.getStatusText(appointment.status)}</span></td>
            `;
            tbody.appendChild(row);
        }
    },
    
    // Load statistics
    loadAdminStatistics: async function() {
        const users = await TherapyData.getUsers();
        const therapists = await TherapyData.getTherapists(true);
        const appointments = await TherapyData.getAppointments();
        const reviews = await TherapyData.getReviews();
        const topics = await TherapyData.getForumTopics();
        
        document.getElementById('stat-users').textContent = users.length;
        document.getElementById('stat-beneficiaries').textContent = users.filter(u => u.userType === 'beneficiar' || u.userType === 'youth').length;
        document.getElementById('stat-psychologists').textContent = therapists.length;
        document.getElementById('stat-approved-psychologists').textContent = therapists.filter(t => t.approved).length;
        document.getElementById('stat-appointments').textContent = appointments.length;
        document.getElementById('stat-reviews').textContent = reviews.length;
        document.getElementById('stat-approved-reviews').textContent = reviews.filter(r => r.approved).length;
        document.getElementById('stat-forum-topics').textContent = topics.length;
    },
    
    // Show add user modal
    showAddUserModal: function() {
        document.getElementById('user-modal-title').textContent = 'Adaugă utilizator';
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-modal').style.display = 'flex';
    },
    
    // Edit user
    editUser: async function(userId) {
        const user = await TherapyData.getUserById(userId);
        if (!user) return;
        
        document.getElementById('user-modal-title').textContent = 'Editează utilizator';
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-user-type').value = user.userType;
        document.getElementById('user-password').value = '';
        document.getElementById('user-modal').style.display = 'flex';
    },
    
    // Save user from modal
    saveUserFromModal: async function() {
        const id = document.getElementById('user-id').value;
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        const userType = document.getElementById('user-user-type').value;
        
        let user;
        if (id) {
            // Editing existing user
            user = await TherapyData.getUserById(id);
            user.name = name;
            user.email = email;
            if (password) {
                // BUG-016 FIX: Hash password when admin changes it
                user.password = Auth.simpleHash(password);
            }
            user.userType = userType;
        } else {
            // Adding new user
            user = {
                name,
                email,
                password: password, // Supabase handles hashing
                user_type: userType
            };
        }
        
        await TherapyData.saveUser(user);
        document.getElementById('user-modal').style.display = 'none';
        await this.loadAdminUsers();
        alert('Utilizator salvat cu succes!');
    },
    
    // Delete user with confirmation
    deleteUserConfirm: async function(userId) {
        if (confirm('Ești sigur că vrei să ștergi acest utilizator?')) {
            await TherapyData.deleteUser(userId);
            await this.loadAdminUsers();
            alert('Utilizator șters cu succes!');
        }
    },
    
    // Show add psychologist modal
    showAddPsychologistModal: function() {
        document.getElementById('psychologist-modal-title').textContent = 'Adaugă psiholog';
        document.getElementById('psychologist-form').reset();
        document.getElementById('psych-id').value = '';
        document.getElementById('psychologist-modal').style.display = 'flex';
    },
    
    // Edit psychologist
    editPsychologist: async function(psychId) {
        const psych = await TherapyData.getTherapistById(psychId);
        if (!psych) return;
        
        document.getElementById('psychologist-modal-title').textContent = 'Editează psiholog';
        document.getElementById('psych-id').value = psych.id;
        document.getElementById('psych-name').value = psych.name;
        document.getElementById('psych-email').value = psych.email;
        document.getElementById('psych-description').value = psych.description || '';
        document.getElementById('psych-why').value = psych.why || '';
        document.getElementById('psych-specializations').value = (psych.specializations || []).join(', ');
        document.getElementById('psych-city').value = psych.city || '';
        document.getElementById('psych-gender').value = psych.gender || 'male';
        document.getElementById('psych-online').checked = psych.online || false;
        document.getElementById('psych-office').checked = psych.office || false;
        document.getElementById('psych-approved').checked = psych.approved || false;
        document.getElementById('psych-password').value = '';
        document.getElementById('psychologist-modal').style.display = 'flex';
    },
    
    // Save psychologist from modal
    savePsychologistFromModal: async function() {
        const id = document.getElementById('psych-id').value;
        const name = document.getElementById('psych-name').value;
        const email = document.getElementById('psych-email').value;
        const password = document.getElementById('psych-password').value;
        const description = document.getElementById('psych-description').value;
        const why = document.getElementById('psych-why').value;
        const specializations = document.getElementById('psych-specializations').value.split(',').map(s => s.trim());
        const city = document.getElementById('psych-city').value;
        const gender = document.getElementById('psych-gender').value;
        const online = document.getElementById('psych-online').checked;
        const office = document.getElementById('psych-office').checked;
        const approved = document.getElementById('psych-approved').checked;
        
        let psych;
        if (id) {
            // Editing existing psychologist
            psych = await TherapyData.getTherapistById(id);
            psych.name = name;
            psych.email = email;
            if (password) {
                // BUG-016 FIX: Hash password when admin changes it
                psych.password = Auth.simpleHash(password);
            }
            psych.description = description;
            psych.why = why;
            psych.specializations = specializations;
            psych.city = city;
            psych.gender = gender;
            psych.online = online;
            psych.office = office;
            psych.approved = approved;
        } else {
            // Adding new psychologist
            psych = {
                name,
                email,
                password: password, // Supabase handles hashing
                description,
                why,
                specializations,
                city,
                gender,
                online,
                office,
                approved,
                user_type: 'psiholog',
                availability: {
                    monday: ['10:00', '11:00', '14:00', '15:00'],
                    wednesday: ['10:00', '11:00', '14:00', '15:00'],
                    friday: ['10:00', '11:00', '14:00', '15:00']
                }
            };
        }
        
        await TherapyData.saveTherapist(psych);
        // Also save as user
        await TherapyData.saveUser({
            id: psych.id,
            name: psych.name,
            email: psych.email,
            password: psych.password,
            user_type: 'psiholog'
        });
        
        document.getElementById('psychologist-modal').style.display = 'none';
        await this.loadAdminPsychologists();
        alert('Psiholog salvat cu succes!');
    },
    
    // Approve psychologist
    approvePsychologist: async function(psychId) {
        await TherapyData.approveTherapist(psychId);
        await this.loadAdminPsychologists();
        alert('Psiholog aprobat cu succes!');
    },
    
    // Delete psychologist with confirmation
    deletePsychologistConfirm: async function(psychId) {
        if (confirm('Ești sigur că vrei să ștergi acest psiholog?')) {
            await TherapyData.deleteTherapist(psychId);
            await this.loadAdminPsychologists();
            alert('Psiholog șters cu succes!');
        }
    },
    
    // Approve review
    approveReviewAdmin: async function(reviewId) {
        await TherapyData.approveReview(reviewId);
        await this.loadAdminReviews();
        alert('Recenzie aprobată cu succes!');
    },
    
    // Delete review with confirmation
    deleteReviewConfirm: async function(reviewId) {
        if (confirm('Ești sigur că vrei să ștergi această recenzie?')) {
            await TherapyData.deleteReview(reviewId);
            await this.loadAdminReviews();
            alert('Recenzie ștearsă cu succes!');
        }
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