/**
 * Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initAnimations();
    initNavbarScroll();
    initParallax();
    initLazyLoading();
    initScrollToTop();
    initActiveNavLinks();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    const actions = document.querySelector('.nav-actions');

    if (toggle) {
        toggle.addEventListener('click', () => {
            const isActive = menu?.classList.contains('active');
            menu?.classList.toggle('active');
            actions?.classList.toggle('active');
            toggle.classList.toggle('active');
            
            // Toggle icon
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
            
            // Close menu when clicking outside
            if (!isActive) {
                document.addEventListener('click', function closeMenu(e) {
                    if (!toggle.contains(e.target) && !menu?.contains(e.target) && !actions?.contains(e.target)) {
                        menu?.classList.remove('active');
                        actions?.classList.remove('active');
                        toggle.classList.remove('active');
                        if (icon) {
                            icon.classList.add('fa-bars');
                            icon.classList.remove('fa-times');
                        }
                        document.removeEventListener('click', closeMenu);
                    }
                });
            }
        });
    }
}

/**
 * Smooth Scroll for Anchor Links (optimized for mobile)
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Close mobile menu if open
                const menu = document.querySelector('.nav-menu');
                const actions = document.querySelector('.nav-actions');
                const toggle = document.querySelector('.mobile-menu-toggle');
                if (menu && menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    actions?.classList.remove('active');
                    toggle?.classList.remove('active');
                    const icon = toggle?.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
                
                // Calculate offset for fixed navbar
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, { passive: false });
    });
}

/**
 * Navbar Scroll Effect (optimized for mobile)
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Scroll Animations with Stagger
 */
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements with stagger
    document.querySelectorAll('.feature-card, .step').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

/**
 * Parallax Effect for Hero Section (disabled on mobile for performance)
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Disable parallax on mobile devices for better performance
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    if (isMobile) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.5;
                hero.style.transform = `translateY(${rate}px)`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Lazy Loading for Images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s';
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Scroll to Top Button (optimized for mobile)
 */
function initScrollToTop() {
    // Create button
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'العودة إلى الأعلى');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.style.touchAction = 'manipulation';
    document.body.appendChild(button);

    let ticking = false;
    let isVisible = false;

    // Show/hide on scroll (throttled)
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const shouldShow = window.pageYOffset > 300;
                
                if (shouldShow !== isVisible) {
                    if (shouldShow) {
                        button.classList.add('visible');
                    } else {
                        button.classList.remove('visible');
                    }
                    isVisible = shouldShow;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, { passive: true });
}

/**
 * Active Navigation Links on Scroll (optimized for mobile)
 */
function initActiveNavLinks() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    if (navLinks.length === 0 || sections.length === 0) return;

    let ticking = false;
    
    function updateActiveLink() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Check if at top of page
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateActiveLink);
            ticking = true;
        }
    }, { passive: true });
    
    updateActiveLink(); // Initial check
}

/**
 * Counter Animation for Stats
 */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

