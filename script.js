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

// Helper: render a single project item into a container
function renderProjectItem(item, container) {
    const reverseClass = item.reverse ? ' project-reverse' : '';
    const color = (item.badge && item.badge.color) ? item.badge.color : 'blue';
    const firstLink = (item.links && item.links.length) ? item.links[0].url : '#';
    const titleText = item.title || '';
    const imgAlt = item.title ? item.title : 'project image';

    let mediaHtml = '';
    if (item.type === 'video') {
        const thumbSrc = item.videoThumbnail || `https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`;
        mediaHtml = `
            <div class="project-image">
                <a href="${firstLink}" target="_blank" rel="noopener noreferrer">
                    <div class="video-wrapper">
                        <div class="video-thumbnail" data-video-id="${item.videoId}">
                            <img src="${thumbSrc}" alt="${imgAlt}">
                            <div class="play-button"></div>
                        </div>
                    </div>
                </a>
                <iframe class="video-iframe"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen style="display:none"></iframe>
            </div>
        `;
    } else {
        const imgSrc = item.image || '';
        mediaHtml = `
            <div class="project-image">
                <a href="${firstLink}" target="_blank" rel="noopener noreferrer">
                    ${imgSrc ? `<img src="${imgSrc}" alt="${imgAlt}">` : `<div class="image-placeholder">${titleText}</div>`}
                </a>
            </div>
        `;
    }

    const badgeClass = `badge-${color}`;
    const highlightsHtml = (item.highlights || []).map(h => `<li>${h}</li>`).join('');
    const tagsHtml = (item.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    const ctaHtml = (item.links && item.links.length)
        ? item.links.map(linkObj => {
            const url = linkObj.url || '#';
            const text = linkObj.text || 'Open';
            const btnColor = linkObj.color || color;
            const colorClass = `link-${btnColor}`;
            return `<a class="link-display ${colorClass}" href="${url}" target="_blank" rel="noopener noreferrer"><button type="button" class="preview-button">${text}</button></a>`;
        }).join('')
        : '';

    const projectHtml = `
        <div class="project-item${reverseClass}" style="opacity: 1; transform: translateY(0px); transition: opacity 0.6s, transform 0.6s;">
            ${mediaHtml}
            <div class="project-details">
                ${item.badge ? `<div class="project-badge ${badgeClass}">${item.badge.text}</div>` : ''}
                <a href="${firstLink}" target="_blank" rel="noopener noreferrer" class="project-title-${color}"><h2>${titleText}</h2></a>
                <p>${item.description || ''}</p>
                ${ctaHtml ? `<div class="project-cta" style="margin:12px 0; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">${ctaHtml}</div>` : ''}
                ${item.highlights && item.highlights.length ? `<div class="project-highlights"><h4>Project Highlights</h4><ul class="list-${color}">${highlightsHtml}</ul></div>` : ''}
                ${item.tags && item.tags.length ? `<div class="project-tags">${tagsHtml}</div>` : ''}
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', projectHtml);
}

// Render projects from data arrays into the corresponding .projects-list containers
function renderProjects() {
    // Render motion & data viz projects into design-motion page
    const motionContainer = document.getElementById('design-motion-projects');
    if (motionContainer) {
        const motionItems = (typeof designMotionProjects !== 'undefined' ? designMotionProjects : []);
        motionContainer.innerHTML = '';
        motionItems.forEach(item => renderProjectItem(item, motionContainer));
    }

    // Render presentations into design-motion page
    const presentationsContainer = document.getElementById('presentations-list');
    if (presentationsContainer) {
        const presItems = (typeof presentationProjects !== 'undefined' ? presentationProjects : []);
        presentationsContainer.innerHTML = '';
        presItems.forEach(item => renderProjectItem(item, presentationsContainer));
    }

    const collections = {
        'web-dev': (typeof webDevProjects !== 'undefined' ? webDevProjects : (window.webDevProjects || [])),
        'ux-ui': (typeof uxUiProjects !== 'undefined' ? uxUiProjects : (window.uxUiProjects || []))
    };

    Object.keys(collections).forEach(sectionId => {
        const container = document.querySelector(`#${sectionId} .projects-list`);
        const items = collections[sectionId];
        if (!container) return;
        container.innerHTML = '';

        items.forEach(item => {
            renderProjectItem(item, container);
        });
    });

    // After rendering, initialize video click handlers again
    if (typeof initVideoPlayers === 'function') {
        initVideoPlayers();
    }
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

        // Reinitialize videos when navigating to design-motion page
   if (pageId === 'design-motion') {
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
            animateCounter(projectCount, 10);
            animateCounter(courseCount, 15);
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
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add these functions to your script.js file

// Gallery and Lightbox functionality
let currentImageIndex = 0;
let galleryImages = [];

function renderDesignGallery() {
    const galleryGrid = document.querySelector('#design-motion .gallery-grid');
    if (!galleryGrid) return;
    
    const items = (typeof designGalleryItems !== 'undefined' ? designGalleryItems : (window.designGalleryItems || []));
    galleryImages = items; // Store for lightbox navigation
    
    galleryGrid.innerHTML = '';
    
    items.forEach((item, index) => {
        let thumbnailSrc = '';
        let playIconHtml = '';
        
        // Determine thumbnail source and play icon
        if (item.type === 'video') {
            thumbnailSrc = item.thumbnail || item.video; // Use custom thumbnail or video itself
            playIconHtml = '<div class="gallery-play-icon"></div>';
        } else {
            thumbnailSrc = item.image;
        }
        
        // Detect by extension so type:image with .mp4 src still renders as video
        const isMp4 = thumbnailSrc.match(/\.(mp4|webm|ogg)(\?.*)?$/i);
        playIconHtml = ''; // No play icon needed for autoplay videos
        const mediaHtml = isMp4
            ? `<div class="gallery-media"><video src="${thumbnailSrc}" autoplay muted loop playsinline></video></div>`
            : `<div class="gallery-media"><img src="${thumbnailSrc}" alt="${item.title || 'Design work'}"></div>`;

        const galleryItem = `
            <div class="gallery-item" data-index="${index}">
                ${mediaHtml}
                <div class="gallery-overlay">
                    <h3>${item.title || ''}</h3>
                    <p>${item.description || ''}</p>
                </div>
            </div>
        `;
        galleryGrid.insertAdjacentHTML('beforeend', galleryItem);
    });
    
    // Add click event to gallery items
    const galleryItemElements = document.querySelectorAll('.gallery-item');
    galleryItemElements.forEach(item => {
        item.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            openLightbox(index);
        });
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (galleryImages[index]) {
        const item = galleryImages[index];
        
        // Hide both media elements first
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'none';
        
        // Detect by file extension — supports type:image with .mp4 src
        const mediaSrc = item.image || item.video || '';
        const isVideo = mediaSrc.match(/\.(mp4|webm|ogg)(\?.*)?$/i);

        if (isVideo) {
            // Keep video invisible until first frame is ready to avoid black overlay
            lightboxVideo.style.opacity = '0';
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = mediaSrc;
            lightboxVideo.muted = true;
            lightboxVideo.load();

            const showVideo = () => {
                lightboxVideo.style.transition = 'opacity 0.2s ease';
                lightboxVideo.style.opacity = '1';
                lightboxVideo.removeEventListener('canplay', showVideo);
            };
            lightboxVideo.addEventListener('canplay', showVideo);
            lightboxVideo.play().catch(() => {});
        } else {
            // Show image
            lightboxImg.src = mediaSrc;
            lightboxImg.style.display = 'block';
        }
        
        lightboxCaption.innerHTML = `
            <h3>${item.title || ''}</h3>
        `;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    
    // Pause and reset video
    if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
    }
    
    lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

function navigateLightbox(direction) {
    // Pause current video if playing
    const lightboxVideo = document.getElementById('lightbox-video');
    if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
    }
    
    currentImageIndex += direction;
    
    // Loop around
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }
    
    openLightbox(currentImageIndex);
}

// Initialize lightbox controls
function initLightbox() {
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightbox = document.getElementById('lightbox');
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(-1);
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(1);
        });
    }
    
    // Close on background click (anywhere that isn't the media itself)
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            const isMedia = e.target.closest('#lightbox-img, #lightbox-video, .lightbox-nav, .lightbox-close');
            if (!isMedia) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }
        }
    });
}


    // Render projects from data arrays (data files are loaded before this script in the HTML)
    try { renderProjects(); } catch (err) { console.warn('renderProjects error:', err); }
    try { renderDesignGallery(); } catch (err) { console.warn('renderDesignGallery error:', err); }
    initLightbox();
    
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
        const pages = ['home', 'about', 'design-motion', 'web-dev', 'ux-ui'];
        
        if (pages.includes(pageId)) {
            e.preventDefault();
        }
    }
});