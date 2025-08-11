// Rage Cycles - Main JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    initMobileNav();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Update today's hours
    updateTodaysHours();
    
    // Update next Friday date
    updateNextFridayDate();
    
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
            
            // Handle logo click - scroll to top
            if (targetId === '#') {
                e.preventDefault();
                document.documentElement.scrollTop = 0;
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Get the exact position we want to scroll to
                const elementRect = targetElement.getBoundingClientRect();
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const headerHeight = 70; // Fixed header height
                
                // Calculate target position: current scroll + element position - header height
                const targetScrollTop = currentScrollTop + elementRect.top - headerHeight;
                
                // Smooth scroll to target position
                window.scrollTo({
                    top: targetScrollTop,
                    behavior: 'smooth'
                });
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
 * Update next Friday date display
 */
function updateNextFridayDate() {
    const nextFridayElement = document.getElementById('next-friday-date');
    if (!nextFridayElement) return;
    
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ... 5 = Friday, 6 = Saturday
    
    let daysUntilFriday;
    if (currentDay <= 5) { // Sunday through Friday
        daysUntilFriday = 5 - currentDay; // Days until next Friday
    } else { // Saturday
        daysUntilFriday = 6; // Days until next Friday (next week)
    }
    
    // If today is Friday, show "Today" if it's before evening, otherwise next Friday
    if (currentDay === 5) {
        const currentHour = today.getHours();
        if (currentHour < 18) { // Before 6 PM
            nextFridayElement.textContent = 'Today';
            return;
        } else {
            daysUntilFriday = 7; // Next Friday
        }
    }
    
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);
    
    const options = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric'
    };
    
    const formattedDate = nextFriday.toLocaleDateString('en-US', options);
    nextFridayElement.textContent = formattedDate;
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

// Contact Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Add real-time validation
    const requiredFields = contactForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
    
    // Phone number formatting
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', formatPhoneNumber);
    }
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.form__submit');
    const submitText = form.querySelector('.form__submit-text');
    const submitLoading = form.querySelector('.form__submit-loading');
    const successMessage = form.querySelector('.form__success');
    
    // Validate all fields
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'block';
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone') || 'Not provided',
            service: formData.get('service') || 'Not specified',
            message: formData.get('message'),
            timestamp: new Date().toLocaleString()
        };
        
        // Set reply-to email for Formspree
        document.getElementById('_replyto').value = data.email;
        
        // Send email using EmailJS or similar service
        await sendContactEmail(data);
        
        // Show success message
        successMessage.style.display = 'block';
        form.reset();
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    } catch (error) {
        console.error('Form submission error:', error);
        alert('Sorry, there was an error sending your message. Please try calling us directly at (480) 968-8116.');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitText.style.display = 'block';
        submitLoading.style.display = 'none';
    }
}

/**
 * Send contact email via Formspree
 */
async function sendContactEmail(data) {
    const formspreeEndpoint = 'https://formspree.io/f/mblkqpbo';
    
    // Prepare form data for Formspree
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('service', data.service);
    formData.append('message', data.message);
    formData.append('_subject', `New Contact Form Submission from ${data.firstName} ${data.lastName}`);
    
    // Add formatted message for better email readability
    const formattedMessage = `
Contact Form Submission
======================

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Service Interest: ${data.service}
Submitted: ${data.timestamp}

Message:
${data.message}

---
This message was sent via the Rage Cycles website contact form.
    `.trim();
    
    formData.append('_message', formattedMessage);
    
    const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
    }
    
    return response.json();
}

/**
 * Validate entire form
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate individual field
 */
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    // Phone validation (optional but if provided, should be valid)
    else if (field.type === 'tel' && value) {
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    // Message length validation
    else if (fieldName === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Please provide a more detailed message (at least 10 characters).';
    }
    
    // Show/hide error message
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('form__error--show');
            if (field.type === 'textarea') {
                field.classList.add('form__textarea--invalid');
            } else {
                field.classList.add('form__input--invalid');
            }
        } else {
            errorElement.classList.remove('form__error--show');
            field.classList.remove('form__input--invalid', 'form__textarea--invalid');
        }
    }
    
    return isValid;
}

/**
 * Clear field error on input
 */
function clearFieldError(e) {
    const field = e.target;
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    
    if (errorElement) {
        errorElement.classList.remove('form__error--show');
        field.classList.remove('form__input--invalid', 'form__textarea--invalid');
    }
}

/**
 * Format phone number input
 */
function formatPhoneNumber(e) {
    const input = e.target;
    const value = input.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
        input.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
        input.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else {
        input.value = value;
    }
}

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