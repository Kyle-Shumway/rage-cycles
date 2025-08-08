// Rage Cycles - Main JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    initMobileNav();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Update today's hours
    updateTodaysHours();
    
    // Initialize lazy loading for images
    initLazyLoading();
});

/**
 * Initialize mobile navigation functionality
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (!navToggle || !navList) return;
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        
        navToggle.setAttribute('aria-expanded', !isOpen);
        navList.classList.toggle('nav__list--open');
        
        // Update toggle icon animation
        navToggle.classList.toggle('nav__toggle--open');
        
        // Trap focus when menu is open
        if (!isOpen) {
            navLinks[0]?.focus();
        }
    });
    
    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.setAttribute('aria-expanded', 'false');
            navList.classList.remove('nav__list--open');
            navToggle.classList.remove('nav__toggle--open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
            navToggle.setAttribute('aria-expanded', 'false');
            navList.classList.remove('nav__list--open');
            navToggle.classList.remove('nav__toggle--open');
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navList.classList.contains('nav__list--open')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navList.classList.remove('nav__list--open');
            navToggle.classList.remove('nav__toggle--open');
            navToggle.focus();
        }
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    // Only add smooth scroll behavior if user hasn't specified reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just '#'
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update focus for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                // Remove tabindex after focus is lost
                targetElement.addEventListener('blur', function() {
                    this.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    });
}

/**
 * Update today's hours display
 */
function updateTodaysHours() {
    const todayHoursElement = document.getElementById('today-hours');
    if (!todayHoursElement) return;
    
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const hours = {
        0: 'Today: Closed (Gone Riding!)', // Sunday
        1: 'Today: 10:00 AM - 6:00 PM', // Monday
        2: 'Today: 10:00 AM - 6:00 PM', // Tuesday
        3: 'Today: 10:00 AM - 6:00 PM', // Wednesday
        4: 'Today: 10:00 AM - 6:00 PM', // Thursday
        5: 'Today: 10:00 AM - 6:00 PM', // Friday
        6: 'Today: 10:00 AM - 5:00 PM'  // Saturday
    };
    
    todayHoursElement.textContent = hours[dayOfWeek] || 'Today: 10:00 AM - 6:00 PM';
    
    // Add status indicator for open/closed
    const currentTime = now.getHours() * 60 + now.getMinutes();
    let isOpen = false;
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday - Friday
        isOpen = currentTime >= (10 * 60) && currentTime < (18 * 60); // 10 AM - 6 PM
    } else if (dayOfWeek === 6) { // Saturday
        isOpen = currentTime >= (10 * 60) && currentTime < (17 * 60); // 10 AM - 5 PM
    }
    
    // Add visual indicator
    const statusIndicator = document.createElement('span');
    statusIndicator.className = `hours-status hours-status--${isOpen ? 'open' : 'closed'}`;
    statusIndicator.textContent = isOpen ? ' (Open Now)' : ' (Closed)';
    statusIndicator.setAttribute('aria-label', isOpen ? 'Currently open' : 'Currently closed');
    
    todayHoursElement.appendChild(statusIndicator);
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // If image has data-src, load it
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // If image has data-srcset, load it
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    // Remove loading class and add loaded class
                    img.classList.remove('img-loading');
                    img.classList.add('img-loaded');
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        // Observe all images with loading="lazy"
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.classList.add('img-loading');
            imageObserver.observe(img);
        });
    }
}

/**
 * Phone number click tracking (optional - for analytics)
 */
function trackPhoneClick(phoneNumber) {
    // This is where you would add analytics tracking
    // Example: gtag('event', 'phone_call', { phone_number: phoneNumber });
    console.log('Phone call initiated:', phoneNumber);
}

/**
 * Directions click tracking (optional - for analytics)
 */
function trackDirectionsClick(address) {
    // This is where you would add analytics tracking
    // Example: gtag('event', 'directions_requested', { address: address });
    console.log('Directions requested to:', address);
}

// Add click tracking to phone and directions buttons
document.addEventListener('DOMContentLoaded', function() {
    const phoneButtons = document.querySelectorAll('a[href^="tel:"]');
    const directionsButtons = document.querySelectorAll('a[href*="maps.google.com"]');
    
    phoneButtons.forEach(button => {
        button.addEventListener('click', function() {
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            trackPhoneClick(phoneNumber);
        });
    });
    
    directionsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const address = this.getAttribute('href');
            trackDirectionsClick(address);
        });
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (window.scrollY > 100) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
});

// Add CSS for header scroll effect
const style = document.createElement('style');
style.textContent = `
    .header--scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .img-loading {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .img-loaded {
        opacity: 1;
    }
    
    .hours-status {
        font-size: 0.875rem;
        font-weight: normal;
    }
    
    .hours-status--open {
        color: #22c55e;
    }
    
    .hours-status--closed {
        color: #ef4444;
    }
    
    .nav__toggle--open .nav__toggle-line:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav__toggle--open .nav__toggle-line:nth-child(2) {
        opacity: 0;
    }
    
    .nav__toggle--open .nav__toggle-line:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;

document.head.appendChild(style);

// Performance optimization: Preload critical resources
function preloadCriticalResources() {
    // Preload hero image when it becomes critical
    const heroImage = document.querySelector('.hero__image');
    if (heroImage && heroImage.dataset.src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = heroImage.dataset.src;
        document.head.appendChild(link);
    }
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadCriticalResources);

// Service Worker registration (optional - for caching)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}