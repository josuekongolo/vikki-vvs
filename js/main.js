/**
 * VIKKI VVS - Main JavaScript
 * Din lokale rørlegger på Østensjø
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    // ========================================
    // MOBILE NAVIGATION
    // ========================================

    function initMobileNav() {
        if (!menuToggle || !mobileNav) return;

        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================

    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add shadow when scrolled
            if (currentScroll > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // CONTACT FORM HANDLING
    // ========================================

    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('.form-submit');
            const originalText = submitButton.textContent;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sender...';

            // Collect form data
            const formData = {
                name: contactForm.name.value.trim(),
                email: contactForm.email.value.trim(),
                phone: contactForm.phone.value.trim(),
                address: contactForm.address.value.trim(),
                serviceType: contactForm.serviceType.value,
                description: contactForm.description.value.trim(),
                isUrgent: contactForm.urgent.checked,
                timestamp: new Date().toISOString()
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.phone || !formData.description) {
                showFormMessage('Vennligst fyll ut alle obligatoriske felter.', 'error');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormMessage('Vennligst oppgi en gyldig e-postadresse.', 'error');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                return;
            }

            try {
                // For now, we'll simulate a successful submission
                // In production, this would send to Resend API or similar

                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Log form data (for development)
                console.log('Form submitted:', formData);

                // Show success message
                showFormMessage(
                    'Takk for meldingen! Jeg har mottatt henvendelsen din og svarer så fort jeg kan - vanligvis innen noen timer. Haster det? Ring meg direkte på 900 00 000.',
                    'success'
                );

                // Reset form
                contactForm.reset();

            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage(
                    'Beklager, noe gikk galt. Vennligst ring meg direkte på 900 00 000.',
                    'error'
                );
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });

        // Real-time validation feedback
        const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                // Clear error state on input
                this.style.borderColor = '';
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');

        if (isRequired && !value) {
            field.style.borderColor = 'var(--color-error)';
            return false;
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.style.borderColor = 'var(--color-error)';
                return false;
            }
        }

        field.style.borderColor = 'var(--color-success)';
        return true;
    }

    function showFormMessage(message, type) {
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide after 10 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 10000);
        }
    }

    // ========================================
    // SERVICE CARDS ANIMATION
    // ========================================

    function initServiceCards() {
        const cards = document.querySelectorAll('.service-card, .value-card, .why-us__item');

        if (!cards.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    // ========================================
    // CLICK TO CALL TRACKING (Analytics Ready)
    // ========================================

    function initClickToCall() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

        phoneLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Track click (analytics placeholder)
                console.log('Phone click:', this.href);

                // If analytics is set up, track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        'event_category': 'Contact',
                        'event_label': 'Phone Call',
                        'value': 1
                    });
                }
            });
        });
    }

    // ========================================
    // LAZY LOADING FOR IMAGES
    // ========================================

    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        if (!images.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // SCROLL TO TOP ON PAGE LOAD (for hash links)
    // ========================================

    function initHashScroll() {
        if (window.location.hash) {
            // Wait for page load
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }

    // ========================================
    // ACTIVE NAVIGATION STATE
    // ========================================

    function setActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.header__nav-link, .mobile-nav__link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    function init() {
        initMobileNav();
        initHeaderScroll();
        initSmoothScroll();
        initContactForm();
        initServiceCards();
        initClickToCall();
        initLazyLoading();
        initHashScroll();
        setActiveNav();

        console.log('VIKKI VVS - Website initialized');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
