document.addEventListener('DOMContentLoaded', function() {
// Handle video thumbnail clicks
function initVideoPlayers() {
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach((button, index) => {
        button.onclick = function(e) {
            e.stopPropagation();
            
            const thumbnail = this.closest('.video-thumbnail');
            const videoId = thumbnail.getAttribute('data-video-id');
            
            const wrapper = thumbnail.closest('.video-wrapper');
            const iframe = wrapper.querySelector('.video-iframe');
            
            if (iframe && videoId) {
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                thumbnail.style.display = 'none';
                iframe.style.display = 'block';
            }
        };
    });
}

    // Get all navigation links and pages
    const navLinks = document.querySelectorAll('.nav-link, [data-page]');
    const pages = document.querySelectorAll('.page');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');
    
    // Handle navigation
    function navigateToPage(pageId) {
        // Remove active class from all pages and nav links
        pages.forEach(page => page.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        
        // Add active class to target page and nav link
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        const targetNavLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Close mobile menu if open
        navLinksContainer.classList.remove('active');

        // Reinitialize videos when navigating to data-viz page
   if (pageId === 'data-viz') {
       setTimeout(() => {
           initVideoPlayers();
       }, 100);
   }
    }
    
    // Add click event to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                navigateToPage(pageId);
            }
        });
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinksContainer.classList.toggle('active');
        });
    }
    
    // Animated counters for stats
    function animateCounter(element, target, duration = 2000) {
        let current = 0;
        const increment = target / (duration / 16); // 60fps
        const isDecimal = target % 1 !== 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = isDecimal ? target.toFixed(1) : Math.ceil(target);
                clearInterval(timer);
            } else {
                element.textContent = isDecimal ? current.toFixed(1) : Math.ceil(current);
            }
        }, 16);
    }
    
    // Start counters when page loads
    const projectCount = document.getElementById('projectCount');
    const courseCount = document.getElementById('courseCount');
    const gpaCount = document.getElementById('gpaCount');
    
    if (projectCount) {
        setTimeout(() => {
            animateCounter(projectCount, 12);
            animateCounter(courseCount, 8);
            animateCounter(gpaCount, 3.92);
        }, 500);
    }
    
    // Add smooth scroll behavior to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const targetId = href.substring(1);
            if (document.getElementById(targetId)) {
                e.preventDefault();
            }
        });
    });
    
    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.project-item, .skill-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Handle logo click - go to home
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('click', function() {
            navigateToPage('home');
        });
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.page) {
            navigateToPage(e.state.page);
        }
    });
    
    // Set initial state
    const initialPage = window.location.hash ? window.location.hash.substring(1) : 'home';
    navigateToPage(initialPage);
    history.replaceState({ page: initialPage }, '', `#${initialPage}`);
    
    // Update state when navigating
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                history.pushState({ page: pageId }, '', `#${pageId}`);
            }
        });
    });
});

// Utility function: Debounce for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Add any resize-specific logic here
        console.log('Window resized');
    }, 250);
});

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    console.log('Page fully loaded');
});

// Prevent default on hash links that match page IDs
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        const href = link.getAttribute('href');
        const pageId = href.substring(1);
        const pages = ['home', 'about', 'data-viz', 'web-dev'];
        
        if (pages.includes(pageId)) {
            e.preventDefault();
        }
    }
});
