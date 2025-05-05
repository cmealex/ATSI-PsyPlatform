/**
 * Authentication module for the therapy platform
 * Handles user registration, login, and session management
 */

const Auth = {
    // Current logged in user
    currentUser: null,
    
    // Initialize authentication state
    init: function() {
        // Check if a user is already logged in (from localStorage)
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            this.updateUI();
        }
        
        // Set up auth-related event listeners
        this.setupEventListeners();
    },
    
    // Set up event listeners for auth forms
    setupEventListeners: function() {
        // Login form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'login-form') {
                e.preventDefault();
                
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                this.login(email, password);
            }
            
            // Registration form submission
            if (e.target.id === 'register-form') {
                e.preventDefault();
                
                const name = document.getElementById('register-name').value;
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const userType = document.getElementById('user-type').value;
                
                // Additional fields for therapists
                let therapistData = {};
                if (userType === 'therapist') {
                    therapistData = {
                        description: document.getElementById('therapist-description').value,
                        why: document.getElementById('therapist-why').value,
                        specializations: document.getElementById('therapist-specialization').value.split(',').map(s => s.trim()),
                        city: document.getElementById('therapist-city').value,
                        online: document.getElementById('online-sessions').checked,
                        office: document.getElementById('office-sessions').checked,
                        gender: 'not-specified', // Default value, could be expanded in the form
                        availability: {
                            monday: ['09:00', '10:00', '11:00'], // Default values
                            wednesday: ['09:00', '10:00', '11:00'],
                            friday: ['09:00', '10:00', '11:00']
                        }
                    };
                }
                
                this.register(name, email, password, userType, therapistData);
            }
        });
        
        // Toggle between login and register forms
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                const tabId = e.target.getAttribute('data-tab');
                if (tabId === 'login' || tabId === 'register') {
                    this.toggleAuthTabs(tabId);
                }
            }
            
            // User type selection for registration form to show/hide therapist fields
            if (e.target.id === 'user-type') {
                const userType = e.target.value;
                const therapistFields = document.getElementById('therapist-fields');
                if (therapistFields) {
                    therapistFields.style.display = userType === 'therapist' ? 'block' : 'none';
                }
            }
            
            // Logout button
            if (e.target.id === 'logout-btn') {
                e.preventDefault();
                this.logout();
            }
        });
    },
    
    // Toggle between auth tabs (login/register)
    toggleAuthTabs: function(activeTab) {
        const authContainer = document.querySelector('.auth-container');
        if (!authContainer) return;
        
        // Update tab buttons
        const tabBtns = authContainer.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === activeTab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update tab content
        const tabContents = authContainer.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            if (content.id === activeTab) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    },
    
    // Register a new user
    register: function(name, email, password, userType, therapistData = {}) {
        // Check if email already exists
        const existingUser = TherapyData.getUserByEmail(email);
        if (existingUser) {
            alert('Acest email este deja înregistrat. Te rugăm să folosești alt email sau să te conectezi.');
            return;
        }
        
        // Create user object
        const user = {
            name,
            email,
            password, // In a real app, this should be hashed
            userType,
            ...therapistData
        };
        
        // Save user to storage
        const savedUser = TherapyData.saveUser(user);
        
        // If therapist, also save to therapists list
        if (userType === 'therapist') {
            TherapyData.saveTherapist(savedUser);
        }
        
        // Log in the new user
        this.setCurrentUser(savedUser);
        
        // Show success message and redirect
        alert('Înregistrare reușită! Bine ai venit!');
        App.navigateTo('home');
    },
    
    // Log in an existing user
    login: function(email, password) {
        const user = TherapyData.getUserByEmail(email);
        
        if (!user || user.password !== password) {
            alert('Email sau parolă incorectă. Te rugăm să încerci din nou.');
            return;
        }
        
        // Set current user and update UI
        this.setCurrentUser(user);
        
        // Show success message and redirect
        alert('Autentificare reușită! Bine ai revenit!');
        App.navigateTo('home');
    },
    
    // Log out the current user
    logout: function() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        
        // Redirect to home
        App.navigateTo('home');
    },
    
    // Set the current logged in user
    setCurrentUser: function(user) {
        this.currentUser = user;
        
        // Save to localStorage (for persistence)
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        this.updateUI();
    },
    
    // Update UI based on authentication state
    updateUI: function() {
        const authLink = document.getElementById('auth-link');
        
        if (this.currentUser) {
            // User is logged in
            if (authLink) {
                authLink.textContent = 'Profilul meu';
                authLink.setAttribute('data-page', 'profile');
            }
            
            // Add logout button if not exists
            if (!document.getElementById('logout-btn')) {
                const nav = document.querySelector('nav ul');
                if (nav) {
                    const logoutItem = document.createElement('li');
                    const logoutLink = document.createElement('a');
                    logoutLink.setAttribute('href', '#');
                    logoutLink.setAttribute('id', 'logout-btn');
                    logoutLink.textContent = 'Deconectare';
                    logoutItem.appendChild(logoutLink);
                    nav.appendChild(logoutItem);
                }
            }
            
            // Show therapist-only elements if the user is a therapist
            if (this.currentUser.userType === 'therapist') {
                document.querySelectorAll('.therapist-only').forEach(el => {
                    el.classList.add('show-therapist');
                });
            } else {
                document.querySelectorAll('.therapist-only').forEach(el => {
                    el.classList.remove('show-therapist');
                });
            }
            
            // Add logged-in class to body
            document.body.classList.add('user-logged-in');
        } else {
            // User is logged out
            if (authLink) {
                authLink.textContent = 'Autentificare';
                authLink.setAttribute('data-page', 'auth');
            }
            
            // Remove logout button if exists
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.parentElement.remove();
            }
            
            // Hide therapist-only elements
            document.querySelectorAll('.therapist-only').forEach(el => {
                el.classList.remove('show-therapist');
            });
            
            // Remove logged-in class from body
            document.body.classList.remove('user-logged-in');
        }
    },
    
    // Check if user is logged in
    isLoggedIn: function() {
        return this.currentUser !== null;
    },
    
    // Check if current user is a therapist
    isTherapist: function() {
        return this.isLoggedIn() && this.currentUser.userType === 'therapist';
    }
}; 