/**
 * Authentication module for the therapy platform - SUPABASE VERSION
 * Handles user registration, login, and session management using Supabase Auth
 * 
 * ✅ SECURITY IMPROVEMENTS:
 * - Real authentication with secure password hashing (bcrypt on server)
 * - JWT tokens for session management
 * - Server-side rate limiting
 * - Production-ready security
 */

const Auth = {
    /**
     * Current logged in user
     */
    currentUser: null,
    
    /**
     * UX Enhancement: Show notification (Toast or Alert fallback)
     */
    showNotification: function(message, type = 'info') {
        if (typeof Toast !== 'undefined' && Toast) {
            Toast[type](message);
        } else {
            alert(message);
        }
    },
    
    /**
     * Initialize authentication state
     */
    init: async function() {
        try {
            // Check for existing session
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) throw error;
            
            if (session) {
                // User is logged in, get their profile
                await this.loadUserProfile(session.user.id);
            }
            
            // Listen for auth state changes
            supabase.auth.onAuthStateChange(async (event, session) => {
                console.log('Auth state changed:', event);
                
                if (event === 'SIGNED_IN' && session) {
                    await this.loadUserProfile(session.user.id);
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                    this.updateUI();
                }
            });
            
            // Set up auth-related event listeners
            this.setupEventListeners();
            
            // Update UI based on current state
            this.updateUI();
            
        } catch (error) {
            console.error('Error initializing auth:', error);
        }
    },
    
    /**
     * Load user profile from database
     */
    loadUserProfile: async function(userId) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error) throw error;
            
            this.currentUser = data;
            this.updateUI();
            
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    },
    
    /**
     * Set up event listeners for auth forms
     */
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
                if (userType === 'therapist' || userType === 'psiholog') {
                    therapistData = {
                        description: document.getElementById('therapist-description').value,
                        why: document.getElementById('therapist-why').value,
                        specializations: document.getElementById('therapist-specialization').value.split(',').map(s => s.trim()),
                        city: document.getElementById('therapist-city').value,
                        online: document.getElementById('online-sessions').checked,
                        office: document.getElementById('office-sessions').checked,
                        gender: 'not-specified',
                        availability: {
                            monday: ['09:00', '10:00', '11:00'],
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
                    therapistFields.style.display = (userType === 'therapist' || userType === 'psiholog') ? 'block' : 'none';
                }
            }
            
            // Logout button
            if (e.target.id === 'logout-btn') {
                e.preventDefault();
                this.logout();
            }
        });
    },
    
    /**
     * Toggle between auth tabs (login/register)
     */
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
    
    /**
     * Register a new user
     */
    register: async function(name, email, password, userType, therapistData = {}) {
        try {
            // Validate password
            if (!password || password.trim().length < 8) {
                this.showNotification('Parola trebuie să aibă minimum 8 caractere.', 'error');
                return;
            }
            
            // Validate therapist required fields
            if (userType === 'therapist' || userType === 'psiholog') {
                if (!therapistData.description || !therapistData.description.trim()) {
                    this.showNotification('Descrierea este obligatorie pentru psihologi.', 'error');
                    return;
                }
                if (!therapistData.why || !therapistData.why.trim()) {
                    this.showNotification('Câmpul "De ce terapie cu mine?" este obligatoriu.', 'error');
                    return;
                }
                if (!therapistData.specializations || therapistData.specializations.length === 0 || 
                    (therapistData.specializations.length === 1 && !therapistData.specializations[0].trim())) {
                    this.showNotification('Te rugăm să adaugi cel puțin o specializare.', 'error');
                    return;
                }
                if (!therapistData.city || !therapistData.city.trim()) {
                    this.showNotification('Orașul este obligatoriu pentru psihologi.', 'error');
                    return;
                }
                if (!therapistData.online && !therapistData.office) {
                    this.showNotification('Te rugăm să selectezi cel puțin un tip de sesiune (Online sau La cabinet).', 'error');
                    return;
                }
            }
            
            // Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name,
                        user_type: userType
                    }
                }
            });
            
            if (authError) {
                this.showNotification(authError.message, 'error');
                return;
            }
            
            if (!authData.user) {
                this.showNotification('Eroare la înregistrare. Te rugăm să încerci din nou.', 'error');
                return;
            }
            
            // Create user profile in users table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .insert([{
                    id: authData.user.id,
                    email: email,
                    name: name,
                    user_type: userType
                }])
                .select()
                .single();
            
            if (userError) {
                console.error('Error creating user profile:', userError);
                // Don't fail registration if profile creation fails
            }
            
            // If therapist/psiholog, create therapist record
            if (userType === 'therapist' || userType === 'psiholog') {
                const { error: therapistError } = await supabase
                    .from('therapists')
                    .insert([{
                        user_id: authData.user.id,
                        name: name,
                        email: email,
                        ...therapistData,
                        approved: false // Needs admin approval
                    }]);
                
                if (therapistError) {
                    console.error('Error creating therapist profile:', therapistError);
                }
            }
            
            // Set current user
            this.currentUser = userData || {
                id: authData.user.id,
                email: email,
                name: name,
                user_type: userType
            };
            
            // Show success message
            this.showNotification('Înregistrare reușită! Bine ai venit!', 'success');
            
            // Check if email confirmation is required
            if (authData.user && !authData.session) {
                this.showNotification('Te rugăm să verifici email-ul pentru a confirma contul.', 'info');
            }
            
            // Navigate to home
            App.navigateTo('home');
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification('Eroare la înregistrare. Te rugăm să încerci din nou.', 'error');
        }
    },
    
    /**
     * Log in an existing user
     */
    login: async function(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) {
                this.showNotification('Credențiale invalide. Te rugăm să verifici email-ul și parola.', 'error');
                return;
            }
            
            if (!data.user) {
                this.showNotification('Eroare la autentificare. Te rugăm să încerci din nou.', 'error');
                return;
            }
            
            // Load user profile
            await this.loadUserProfile(data.user.id);
            
            // Show success message
            this.showNotification('Autentificare reușită! Bine ai revenit!', 'success');
            
            // Navigate to home
            App.navigateTo('home');
            
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Eroare la autentificare. Te rugăm să încerci din nou.', 'error');
        }
    },
    
    /**
     * Log out the current user
     */
    logout: async function() {
        try {
            const { error } = await supabase.auth.signOut();
            
            if (error) throw error;
            
            this.currentUser = null;
            this.updateUI();
            
            // Redirect to home
            App.navigateTo('home');
            
            this.showNotification('Te-ai deconectat cu succes.', 'success');
            
        } catch (error) {
            console.error('Logout error:', error);
            this.showNotification('Eroare la deconectare.', 'error');
        }
    },
    
    /**
     * Set the current logged in user
     */
    setCurrentUser: function(user) {
        this.currentUser = user;
        this.updateUI();
    },
    
    /**
     * Update UI based on authentication state
     */
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
            
            // Show therapist-only elements if the user is a therapist/psiholog
            if (this.currentUser.user_type === 'therapist' || this.currentUser.user_type === 'psiholog') {
                document.querySelectorAll('.therapist-only').forEach(el => {
                    el.classList.add('show-therapist');
                });
            } else {
                document.querySelectorAll('.therapist-only').forEach(el => {
                    el.classList.remove('show-therapist');
                });
            }
            
            // Show admin-only elements if the user is admin
            if (this.currentUser.user_type === 'admin') {
                document.querySelectorAll('.admin-only').forEach(el => {
                    el.classList.add('show-admin');
                });
            } else {
                document.querySelectorAll('.admin-only').forEach(el => {
                    el.classList.remove('show-admin');
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
            
            // Hide admin-only elements
            document.querySelectorAll('.admin-only').forEach(el => {
                el.classList.remove('show-admin');
            });
            
            // Remove logged-in class from body
            document.body.classList.remove('user-logged-in');
        }
    },
    
    /**
     * Check if user is logged in
     */
    isLoggedIn: function() {
        return this.currentUser !== null;
    },
    
    /**
     * Check if current user is a therapist/psiholog
     */
    isTherapist: function() {
        return this.isLoggedIn() && (this.currentUser.user_type === 'therapist' || this.currentUser.user_type === 'psiholog');
    },
    
    /**
     * Check if current user is admin
     */
    isAdmin: function() {
        return this.isLoggedIn() && this.currentUser.user_type === 'admin';
    },
    
    /**
     * Get current session
     */
    getSession: async function() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            console.error('Error getting session:', error);
            return null;
        }
        return session;
    }
};

