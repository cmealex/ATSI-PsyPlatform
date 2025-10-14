/**
 * MODERN UX JAVASCRIPT
 * Lead UX Designer - Interactive Enhancements
 * Version: 2.0
 */

/* ============================================
   TOAST NOTIFICATION SYSTEM
   ============================================ */

const Toast = {
    container: null,
    
    init: function() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },
    
    show: function(message, type = 'success', duration = 4000) {
        this.init();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        const titles = {
            success: 'Succes',
            error: 'Eroare',
            warning: 'Atenție',
            info: 'Informație'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">×</button>
        `;
        
        this.container.appendChild(toast);
        
        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.remove(toast));
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            requestAnimationFrame(() => {
                toast.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(0)';
            });
        });
    },
    
    remove: function(toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    },
    
    success: function(message, duration) {
        this.show(message, 'success', duration);
    },
    
    error: function(message, duration) {
        this.show(message, 'error', duration);
    },
    
    warning: function(message, duration) {
        this.show(message, 'warning', duration);
    },
    
    info: function(message, duration) {
        this.show(message, 'info', duration);
    }
};

// Initialize Toast system
document.addEventListener('DOMContentLoaded', function() {
    Toast.init();
});

/* ============================================
   LOADING OVERLAY
   ============================================ */

const Loading = {
    overlay: null,
    
    show: function(message = 'Se încarcă...') {
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(8px);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            this.overlay.innerHTML = `
                <div class="spinner" style="margin-bottom: 1rem;"></div>
                <p style="color: var(--text-secondary); font-weight: 500;">${message}</p>
            `;
            
            document.body.appendChild(this.overlay);
            
            requestAnimationFrame(() => {
                this.overlay.style.opacity = '1';
            });
        }
    },
    
    hide: function() {
        if (this.overlay) {
            this.overlay.style.opacity = '0';
            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                    this.overlay = null;
                }
            }, 300);
        }
    }
};

/* ============================================
   SMOOTH SCROLL TO TOP
   ============================================ */

const ScrollToTop = {
    button: null,
    
    init: function() {
        // Create button
        this.button = document.createElement('button');
        this.button.innerHTML = '↑';
        this.button.className = 'scroll-to-top-btn';
        this.button.setAttribute('aria-label', 'Scroll to top');
        this.button.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-gradient);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            opacity: 0;
            transform: translateY(100px);
            transition: all 0.3s ease;
            z-index: 999;
        `;
        
        document.body.appendChild(this.button);
        
        // Show/hide on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.button.style.opacity = '1';
                this.button.style.transform = 'translateY(0)';
            } else {
                this.button.style.opacity = '0';
                this.button.style.transform = 'translateY(100px)';
            }
        });
        
        // Click handler
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hover effect
        this.button.addEventListener('mouseenter', () => {
            this.button.style.transform = 'translateY(-4px) scale(1.1)';
        });
        
        this.button.addEventListener('mouseleave', () => {
            this.button.style.transform = window.pageYOffset > 300 ? 'translateY(0) scale(1)' : 'translateY(100px)';
        });
    }
};

/* ============================================
   SMOOTH PAGE TRANSITIONS
   ============================================ */

const PageTransition = {
    init: function() {
        // Add fade-in to main content
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.classList.add('fade-in');
        }
    },
    
    fadeOut: function(callback) {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (callback) callback();
                this.fadeIn();
            }, 300);
        }
    },
    
    fadeIn: function() {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            requestAnimationFrame(() => {
                mainContent.style.transition = 'all 0.4s ease-out';
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';
            });
        }
    }
};

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */

const HeaderScroll = {
    init: function() {
        const header = document.querySelector('header');
        if (!header) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide on scroll down, show on scroll up
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
};

/* ============================================
   RIPPLE EFFECT ON BUTTONS
   ============================================ */

const RippleEffect = {
    init: function() {
        document.addEventListener('click', function(e) {
            const button = e.target.closest('.btn');
            if (!button) return;
            
            const ripple = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;
            
            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${e.clientX - button.offsetLeft - radius}px`;
            ripple.style.top = `${e.clientY - button.offsetTop - radius}px`;
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            const oldRipple = button.querySelector('span');
            if (oldRipple) oldRipple.remove();
            
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
        
        // Add ripple animation to CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

/* ============================================
   FORM VALIDATION WITH SMOOTH FEEDBACK
   ============================================ */

const FormValidation = {
    init: function() {
        document.addEventListener('input', function(e) {
            const input = e.target;
            if (input.tagName !== 'INPUT' && input.tagName !== 'TEXTAREA') return;
            
            // Remove any previous validation state
            input.classList.remove('invalid', 'valid');
            
            // Check validity
            if (input.value.trim() !== '') {
                if (input.validity.valid) {
                    input.classList.add('valid');
                } else {
                    input.classList.add('invalid');
                }
            }
        });
        
        // Add validation styles
        const style = document.createElement('style');
        style.textContent = `
            input.valid,
            textarea.valid {
                border-color: var(--success-color);
                box-shadow: 0 0 0 4px rgba(0, 212, 170, 0.1);
            }
            
            input.invalid,
            textarea.invalid {
                border-color: var(--error-color);
                box-shadow: 0 0 0 4px rgba(239, 83, 80, 0.1);
            }
            
            input.valid + label,
            textarea.valid + label {
                color: var(--success-color);
            }
            
            input.invalid + label,
            textarea.invalid + label {
                color: var(--error-color);
            }
        `;
        document.head.appendChild(style);
    }
};

/* ============================================
   LAZY LOAD IMAGES
   ============================================ */

const LazyLoad = {
    init: function() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
};

/* ============================================
   CARD HOVER PARALLAX EFFECT
   ============================================ */

const CardParallax = {
    init: function() {
        const cards = document.querySelectorAll('.card, .therapist-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
};

/* ============================================
   INITIALIZE ALL UX ENHANCEMENTS
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    Toast.init();
    ScrollToTop.init();
    PageTransition.init();
    HeaderScroll.init();
    RippleEffect.init();
    FormValidation.init();
    LazyLoad.init();
    
    // Initialize card parallax after a short delay (wait for cards to load)
    setTimeout(() => {
        CardParallax.init();
    }, 500);
    
    console.log('✨ Modern UX Enhancements Initialized!');
});

/* ============================================
   EXPORT FOR USE IN OTHER SCRIPTS
   ============================================ */

// Make Toast and Loading available globally
window.Toast = Toast;
window.Loading = Loading;
window.PageTransition = PageTransition;

