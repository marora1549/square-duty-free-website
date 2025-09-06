/**
 * Square Duty Free - Premium Website JavaScript
 * Enhanced animations and interactions
 */

// ===========================
// Global Variables
// ===========================

let isLoaded = false;
let scrollTop = 0;
let navbar = null;
let sections = [];
let observers = [];

// ===========================
// Utility Functions
// ===========================

const throttle = (func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
};

const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

// ===========================
// Loading Screen
// ===========================

class LoadingScreen {
    constructor() {
        this.loadingElement = document.querySelector('.loading-screen');
        this.init();
    }

    init() {
        // Ensure minimum loading time for smooth experience
        const minLoadTime = 2500;
        const startTime = Date.now();

        const hideLoading = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadTime - elapsedTime);

            setTimeout(() => {
                this.hideLoadingScreen();
            }, remainingTime);
        };

        if (document.readyState === 'complete') {
            hideLoading();
        } else {
            window.addEventListener('load', hideLoading);
        }
    }

    hideLoadingScreen() {
        if (this.loadingElement) {
            this.loadingElement.classList.add('hidden');
            
            setTimeout(() => {
                this.loadingElement.style.display = 'none';
                isLoaded = true;
                this.triggerPageAnimations();
            }, 800);
        }
    }

    triggerPageAnimations() {
        // Initialize all other components after loading
        new Navigation();
        new ScrollAnimations();
        new SmoothScroll();
        new ParallaxEffects();
        new ProductShowcase();
        new InteractiveElements();
    }
}

// ===========================
// Navigation
// ===========================

class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        if (!this.navbar) return;

        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupSmoothNavigation();
    }

    setupScrollEffect() {
        const handleScroll = throttle(() => {
            scrollTop = window.pageYOffset;
            
            if (scrollTop > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }

    setupMobileMenu() {
        if (!this.navToggle || !this.navMenu) return;

        this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.navMenu.contains(e.target) && 
                !this.navToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupActiveLinks() {
        sections = Array.from(document.querySelectorAll('section[id]'));
        
        const handleScroll = throttle(() => {
            const scrollPosition = window.pageYOffset + 100;
            
            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`a[href="#${sectionId}"]`);
                
                if (navLink && 
                    scrollPosition >= sectionTop && 
                    scrollPosition < sectionTop + sectionHeight) {
                    this.setActiveLink(navLink);
                }
            });
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }

    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    setupSmoothNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                        
                        this.closeMobileMenu();
                    }
                }
            });
        });
    }
}

// ===========================
// Scroll Animations
// ===========================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollIndicator();
        this.setupParallaxElements();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.dataset.delay || 0;
                    
                    setTimeout(() => {
                        element.classList.add('visible');
                    }, delay);
                    
                    observer.unobserve(element);
                }
            });
        }, this.observerOptions);

        // Observe all animation elements
        const animationElements = document.querySelectorAll([
            '.fade-in',
            '.slide-in-left',
            '.slide-in-right',
            '.scale-in',
            '.about-card',
            '.product-card',
            '.location-card',
            '.business-card'
        ].join(', '));

        animationElements.forEach((element, index) => {
            // Add staggered delays for grouped elements
            if (element.closest('.about-text') || 
                element.closest('.products-grid') ||
                element.closest('.locations-grid') ||
                element.closest('.businesses-grid')) {
                element.dataset.delay = (index % 3) * 150;
            }
            
            observer.observe(element);
        });

        observers.push(observer);
    }

    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            });

            // Hide scroll indicator after scrolling
            const hideIndicator = throttle(() => {
                if (window.pageYOffset > 200) {
                    scrollIndicator.style.opacity = '0';
                } else {
                    scrollIndicator.style.opacity = '1';
                }
            }, 16);

            window.addEventListener('scroll', hideIndicator);
        }
    }

    setupParallaxElements() {
        const parallaxElements = document.querySelectorAll('.floating-particles');
        
        if (parallaxElements.length === 0) return;

        const handleScroll = throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }
}

// ===========================
// Smooth Scroll
// ===========================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Enhanced smooth scrolling for all internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    this.smoothScrollTo(target);
                }
            });
        });
    }

    smoothScrollTo(target) {
        const targetTop = target.offsetTop - 80;
        const startTop = window.pageYOffset;
        const distance = targetTop - startTop;
        const duration = Math.min(Math.abs(distance) / 2, 1000);
        let startTime = null;

        const animateScroll = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = easeOutQuart(progress);
            window.scrollTo(0, startTop + (distance * ease));
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }
}

// ===========================
// Parallax Effects
// ===========================

class ParallaxEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupImageParallax();
        this.setupBackgroundParallax();
    }

    setupImageParallax() {
        const images = document.querySelectorAll('.about-image img, .product-image img');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const handleScroll = throttle(() => {
                        const rect = entry.target.getBoundingClientRect();
                        const speed = 0.1;
                        const yPos = -(rect.top * speed);
                        entry.target.style.transform = `translateY(${yPos}px)`;
                    }, 16);

                    window.addEventListener('scroll', handleScroll);
                    
                    // Cleanup when element is no longer in view
                    const cleanup = () => {
                        window.removeEventListener('scroll', handleScroll);
                    };
                    
                    setTimeout(cleanup, 5000); // Auto cleanup after 5 seconds
                }
            });
        });

        images.forEach(img => observer.observe(img));
    }

    setupBackgroundParallax() {
        const parallaxSections = document.querySelectorAll('.hero, .products, .founder, .contact');
        
        const handleScroll = throttle(() => {
            parallaxSections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const speed = 0.05;
                const yPos = rect.top * speed;
                
                section.style.backgroundPosition = `center ${yPos}px`;
            });
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }
}

// ===========================
// Product Showcase
// ===========================

class ProductShowcase {
    constructor() {
        this.init();
    }

    init() {
        this.setupProductHover();
        this.setupProductImageEffects();
    }

    setupProductHover() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const image = card.querySelector('.product-image img');
            
            if (!image) return;

            card.addEventListener('mouseenter', () => {
                this.animateProductCard(card, true);
            });

            card.addEventListener('mouseleave', () => {
                this.animateProductCard(card, false);
            });
        });
    }

    animateProductCard(card, isHover) {
        const image = card.querySelector('.product-image img');
        const content = card.querySelector('.product-content');
        
        if (isHover) {
            image.style.transform = 'scale(1.1) rotate(2deg)';
            content.style.transform = 'translateY(-5px)';
        } else {
            image.style.transform = 'scale(1) rotate(0deg)';
            content.style.transform = 'translateY(0)';
        }
    }

    setupProductImageEffects() {
        const productImages = document.querySelectorAll('.product-image-large img');
        
        productImages.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.05) rotate(2deg)';
            });

            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }
}

// ===========================
// Interactive Elements
// ===========================

class InteractiveElements {
    constructor() {
        this.init();
    }

    init() {
        this.setupButtonEffects();
        this.setupCardHovers();
        this.setupImageHovers();
        this.setupCursorEffects();
    }

    setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.createRipple(button);
            });
        });
    }

    createRipple(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.1)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupCardHovers() {
        const cards = document.querySelectorAll('.about-card, .location-card, .business-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.handleCardHover(e, true);
            });

            card.addEventListener('mouseleave', (e) => {
                this.handleCardHover(e, false);
            });

            card.addEventListener('mousemove', (e) => {
                this.handleCardTilt(e);
            });
        });
    }

    handleCardHover(event, isEntering) {
        const card = event.currentTarget;
        
        if (isEntering) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
        }
    }

    handleCardTilt(event) {
        const card = event.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `translateY(-8px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
        }, { once: true });
    }

    setupImageHovers() {
        const images = document.querySelectorAll('.about-image, .founder-image');
        
        images.forEach(container => {
            const img = container.querySelector('img');
            
            if (!img) return;

            container.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.05)';
            });

            container.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        });
    }

    setupCursorEffects() {
        // Custom cursor for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .nav-link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                document.body.style.cursor = 'pointer';
            });

            element.addEventListener('mouseleave', () => {
                document.body.style.cursor = 'default';
            });
        });
    }
}

// ===========================
// Performance Optimization
// ===========================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupScrollOptimization();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupImageOptimization() {
        // Preload critical images
        const criticalImages = [
            'transparent logo.svg',
            '600px-Sunil_Gehani1.jpeg',
            'beehive1.jpeg'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    setupScrollOptimization() {
        // Passive scroll listeners for better performance
        const passiveOptions = { passive: true };
        
        window.addEventListener('scroll', throttle(() => {
            // Batch DOM reads and writes
            requestAnimationFrame(() => {
                // DOM reads here
                const scrollTop = window.pageYOffset;
                
                // DOM writes here
                document.documentElement.style.setProperty('--scroll-top', scrollTop + 'px');
            });
        }, 16), passiveOptions);
    }
}

// ===========================
// Error Handling
// ===========================

class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalErrorHandling();
        this.setupImageErrorHandling();
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            console.warn('Script error caught:', event.error);
            // Graceful degradation - continue with basic functionality
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.warn('Promise rejection caught:', event.reason);
            // Prevent the error from breaking the entire application
            event.preventDefault();
        });
    }

    setupImageErrorHandling() {
        document.addEventListener('error', (event) => {
            if (event.target.tagName === 'IMG') {
                const img = event.target;
                console.warn('Image failed to load:', img.src);
                
                // Add error class for styling
                img.classList.add('image-error');
                
                // Optional: Replace with placeholder
                // img.src = 'path/to/placeholder.jpg';
            }
        }, true);
    }
}

// ===========================
// Accessibility Enhancements
// ===========================

class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupReducedMotion();
    }

    setupKeyboardNavigation() {
        // Escape key handler for mobile menu
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const activeMenu = document.querySelector('.nav-menu.active');
                if (activeMenu) {
                    const navigation = new Navigation();
                    navigation.closeMobileMenu();
                }
            }
        });

        // Tab key management
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupFocusManagement() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-gold);
            color: white;
            padding: 8px;
            border-radius: 4px;
            text-decoration: none;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupReducedMotion() {
        // Respect user's motion preferences
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (reducedMotion.matches) {
            document.documentElement.style.setProperty('--ease-out-quart', 'ease');
            document.documentElement.style.setProperty('--ease-out-expo', 'ease');
            
            // Disable complex animations
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===========================
// CSS Animations for JavaScript
// ===========================

const addCSSAnimations = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }
        
        .keyboard-navigation *:focus {
            outline: 2px solid var(--color-gold) !important;
            outline-offset: 2px;
        }
        
        .image-error {
            opacity: 0.5;
            filter: grayscale(100%);
        }
        
        .loaded {
            opacity: 1;
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);
};

// ===========================
// Initialization
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Add CSS animations
    addCSSAnimations();
    
    // Initialize core systems
    new ErrorHandler();
    new AccessibilityEnhancer();
    new PerformanceOptimizer();
    
    // Start loading sequence
    new LoadingScreen();
});

// ===========================
// Export for potential module use
// ===========================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LoadingScreen,
        Navigation,
        ScrollAnimations,
        SmoothScroll,
        ParallaxEffects,
        ProductShowcase,
        InteractiveElements,
        PerformanceOptimizer,
        ErrorHandler,
        AccessibilityEnhancer
    };
}