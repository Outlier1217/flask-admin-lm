// Enhanced mobile menu with backdrop
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Add backdrop
            if (navMenu.classList.contains('active')) {
                createMenuBackdrop();
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
    }
    
    function createMenuBackdrop() {
        const backdrop = document.createElement('div');
        backdrop.className = 'menu-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        `;
        document.body.appendChild(backdrop);
        
        requestAnimationFrame(() => {
            backdrop.style.opacity = '1';
            backdrop.style.visibility = 'visible';
        });
        
        backdrop.addEventListener('click', closeMobileMenu);
    }
    
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        body.classList.remove('menu-open');
        
        const backdrop = document.querySelector('.menu-backdrop');
        if (backdrop) {
            backdrop.style.opacity = '0';
            backdrop.style.visibility = 'hidden';
            setTimeout(() => {
                if (backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            }, 300);
        }
    }
    
    // Smooth scrolling with enhanced easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 40;
                
                // Enhanced smooth scroll with easing
                let startPosition = window.pageYOffset;
                let distance = targetPosition - startPosition;
                let startTime = null;
                
                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = ease(timeElapsed, startPosition, distance, 1200);
                    
                    window.scrollTo(0, run);
                    if (timeElapsed < 1200) requestAnimationFrame(animation);
                    else closeMobileMenu();
                }
                
                function ease(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t * t + b;
                    t--;
                    return c / 2 * (t * t * t + 2) + b;
                }
                
                requestAnimationFrame(animation);
            }
        });
    });
    
    // Advanced scroll animations
    function animateOnScroll() {
        const elements = document.querySelectorAll('.highlight-item, .timeline-item, .service-card, .artist-card');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const delay = parseFloat(element.dataset.delay) || 0;
                        
                        setTimeout(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
                        }, delay * 100);
                        
                        observer.unobserve(element);
                    }
                });
            }, { 
                threshold: 0.15,
                rootMargin: '0px 0px -100px 0px'
            });
            
            elements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(60px) scale(0.9) rotateX(15deg)';
                element.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
                element.dataset.delay = index * 0.1;
                observer.observe(element);
            });
        }
    }
    
    animateOnScroll();
    
    // Enhanced gallery interactions
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        const image = item.querySelector('.painting-image');
        const container = item.querySelector('.painting-container');
        
        // Staggered canvas reveal
        item.style.opacity = '0';
        item.style.transform = 'translateY(100px) scale(0.8)';
        
        setTimeout(() => {
            item.style.transition = `all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s`;
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, index * 200);
        
        // 3D painting hover effect
        item.addEventListener('mouseenter', () => {
            if (image) {
                image.style.transform = 'rotateY(5deg) rotateX(5deg) scale(1.02)';
                image.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
            container.style.transform = 'perspective(1000px) rotateY(-2deg)';
        });
        
        item.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
            }
            container.style.transform = 'perspective(1000px) rotateY(0deg)';
        });
        
        // Parallax mouse tracking
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            
            container.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
            image.style.transform = `rotateY(${-rotateY}deg) rotateX(${rotateX}deg) scale(1.02)`;
        });
    });
    
    // Enhanced modal functionality
    const modal = document.getElementById('artwork-modal');
    const modalImg = document.getElementById('modal-artwork-img');
    const modalTitle = document.getElementById('modal-artwork-title');
    const modalDescription = document.getElementById('modal-artwork-description');
    const modalMedium = document.getElementById('modal-medium');
    const modalSize = document.getElementById('modal-size');
    const modalPrice = document.getElementById('modal-price');
    const modalTime = document.getElementById('modal-time');
    const closeModal = document.querySelector('.close-modal');
    const viewDetailBtns = document.querySelectorAll('.view-detail-btn');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    
    // Artwork data with enhanced details
    const artworks = {
        'oil-1': {
            img: 'https://via.placeholder.com/1000x800/e74c3c/f8f9fa?text=Renaissance+Glow+Detail',
            title: 'Renaissance Glow',
            description: 'Inspired by the golden age of portraiture, this oil painting captures the subject in soft, diffused lighting reminiscent of Rembrandt\'s masterful chiaroscuro technique. Multiple layers of glazing create the luminous skin tones and jewel-like highlights.',
            medium: 'Oil on fine linen canvas',
            size: '24" x 30" (61cm x 76cm)',
            price: '₹1,25,000',
            time: '6-8 weeks'
        },
        'acrylic-1': {
            img: 'https://via.placeholder.com/1000x800/9b59b6/f8f9fa?text=Modern+Expression+Detail',
            title: 'Modern Expression',
            description: 'A contemporary acrylic portrait featuring bold, expressive brushwork and vibrant color relationships. The artist used palette knife techniques to create textured surfaces that add depth and movement to the composition.',
            medium: 'Acrylic on gallery-wrapped canvas',
            size: '20" x 24" (51cm x 61cm)',
            price: '₹85,000',
            time: '4-6 weeks'
        },
        'oil-2': {
            img: 'https://via.placeholder.com/1000x800/e74c3c/f8f9fa?text=Golden+Hour+Detail',
            title: 'Golden Hour',
            description: 'Painted during the magical light of sunset, this oil portrait captures the warm, golden tones on the subject\'s skin and hair. The artist employed impasto technique for the highlights, creating a three-dimensional quality.',
            medium: 'Oil on canvas',
            size: '30" x 40" (76cm x 102cm)',
            price: '₹1,85,000',
            time: '8-10 weeks'
        },
        'acrylic-2': {
            img: 'https://via.placeholder.com/1000x800/9b59b6/f8f9fa?text=Vibrant+Soul+Detail',
            title: 'Vibrant Soul',
            description: 'This acrylic mixed media piece combines traditional portraiture with abstract elements, creating a dynamic composition that reflects the subject\'s multifaceted personality and creative spirit.',
            medium: 'Acrylic mixed media on canvas',
            size: '18" x 24" (46cm x 61cm)',
            price: '₹72,000',
            time: '5-7 weeks'
        },
        'oil-3': {
            img: 'https://via.placeholder.com/1000x800/e74c3c/f8f9fa?text=Timeless+Elegance+Detail',
            title: 'Timeless Elegance',
            description: 'A sophisticated oil portrait featuring the subject in formal evening wear against a dramatic dark background. The artist used 12 layers of glazing to achieve the rich, velvety blacks and luminous skin tones.',
            medium: 'Oil on fine linen',
            size: '36" x 48" (91cm x 122cm)',
            price: '₹2,75,000',
            time: '10-12 weeks'
        }
    };
    
    let currentZoom = 1;
    const maxZoom = 3;
    const minZoom = 0.5;
    
    // Open modal with enhanced transitions
    viewDetailBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const artworkId = this.getAttribute('data-modal');
            const artwork = artworks[artworkId];
            
            if (artwork) {
                // Preload and set image
                const tempImg = new Image();
                tempImg.onload = function() {
                    modalImg.src = artwork.img;
                    modalTitle.textContent = artwork.title;
                    modalDescription.innerHTML = artwork.description.replace(/\n/g, '<br>');
                    modalMedium.textContent = artwork.medium;
                    modalSize.textContent = artwork.size;
                    modalPrice.textContent = artwork.price;
                    modalTime.textContent = artwork.time;
                    
                    // Reset zoom
                    currentZoom = 1;
                    modalImg.style.transform = 'scale(1)';
                    
                    // Show modal with animation
                    modal.style.opacity = '0';
                    modal.style.transform = 'scale(0.8)';
                    modal.style.display = 'block';
                    
                    requestAnimationFrame(() => {
                        modal.style.opacity = '1';
                        modal.style.transform = 'scale(1)';
                    });
                    
                    body.classList.add('modal-open');
                };
                tempImg.src = artwork.img;
            }
        });
    });
    
    // Close modal with animation
    function closeModalFunc() {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            modal.style.display = 'none';
            body.classList.remove('modal-open');
        }, 300);
    }
    
    closeModal.addEventListener('click', closeModalFunc);
    
    // Close on outside click
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalFunc();
        }
    });
    
    // Zoom functionality
    let isDragging = false;
    let startX, startY;
    
    zoomInBtn.addEventListener('click', () => {
        if (currentZoom < maxZoom) {
            currentZoom += 0.2;
            modalImg.style.transform = `scale(${currentZoom})`;
        }
    });
    
    zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > minZoom) {
            currentZoom -= 0.2;
            modalImg.style.transform = `scale(${currentZoom})`;
        }
    });
    
    // Drag to pan when zoomed
    const imageContainer = document.querySelector('.modal-image-container');
    
    imageContainer.addEventListener('mousedown', (e) => {
        if (currentZoom > 1) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            imageContainer.style.cursor = 'grabbing';
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging && currentZoom > 1) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const currentTransform = modalImg.style.transform;
            const matrix = new WebKitCSSMatrix(currentTransform) || new DOMMatrix(currentTransform);
            
            const newX = matrix.m41 + deltaX;
            const newY = matrix.m42 + deltaY;
            
            modalImg.style.transform = `scale(${currentZoom}) translate(${newX}px, ${newY}px)`;
            
            startX = e.clientX;
            startY = e.clientY;
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        imageContainer.style.cursor = currentZoom > 1 ? 'grab' : 'default';
    });
    
    // Wheel zoom
    imageContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom + delta));
        
        if (newZoom !== currentZoom) {
            currentZoom = newZoom;
            modalImg.style.transform = `scale(${currentZoom})`;
            imageContainer.style.cursor = currentZoom > 1 ? 'grab' : 'default';
        }
    });
    
    // Commission buttons
    document.querySelectorAll('.commission-similar-btn, .add-to-cart-modal-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.classList.contains('commission-similar-btn') ? 'commission' : 'cart';
            
            // Enhanced notification
            showEnhancedNotification(
                action === 'commission' 
                    ? 'We\'ll contact you within 24 hours to discuss your custom commission!' 
                    : 'Artwork added to cart! Continue shopping or proceed to checkout.',
                action === 'commission' ? 'success' : 'info'
            );
            
            if (action === 'commission') {
                // Scroll to top and highlight contact form
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(closeModalFunc, 500);
            }
        });
    });
    
    // Enhanced notification system
    function showEnhancedNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.enhanced-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `enhanced-notification enhanced-notification--${type}`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
        const bgColor = type === 'success' ? '#27ae60' : '#3498db';
        const iconColor = type === 'success' ? '#2ecc71' : '#5dade2';
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icon}"></i>
            </div>
            <div class="notification-content">
                <p class="notification-message">${message}</p>
            </div>
            <div class="notification-close">
                <i class="fas fa-times"></i>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            min-width: 350px;
            background: linear-gradient(135deg, ${bgColor}, ${type === 'success' ? '#2ecc71' : '#5dade2'});
            color: white;
            padding: 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 4000;
            transform: translateX(100%);
            opacity: 0;
            display: flex;
            align-items: center;
            gap: 1rem;
            font-family: 'Inter', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        // Slide in animation
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Close on click
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
    
    // Timeline animation
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 200);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.timeline-item').forEach(item => {
        timelineObserver.observe(item);
    });
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const galleryItem = this.closest('.gallery-item');
            const title = galleryItem.querySelector('.gallery-title').textContent;
            
            // Simulate cart addition
            showEnhancedNotification(`"${title}" added to your cart!`, 'info');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Parallax hero effect
    function parallaxHero() {
        const hero = document.querySelector('.page-hero');
        if (!hero || window.innerWidth < 768) return;
        
        const heroCanvas = document.querySelector('.hero-canvas');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * -0.5;
            hero.style.transform = `translateY(${parallax}px)`;
            
            // Canvas texture animation
            const textureOffset = (scrolled * 0.1) % 100;
            heroCanvas.style.backgroundPosition = `${textureOffset}px 0`;
        });
        
        // Mouse parallax
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth) * 20 - 10;
            const y = (clientY / window.innerHeight) * 20 - 10;
            
            hero.style.transform = `translateY(${parallax}px) rotateX(${y}deg) rotateY(${x}deg)`;
        });
    }
    
    if (window.innerWidth > 768) {
        parallaxHero();
    }
    
    // Performance optimization
    let ticking = false;
    function updatePosition() {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Update scroll-based animations
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('mousemove', updatePosition, { passive: true });
    
    // Brush stroke effect on hover
    function createBrushStroke(element) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '120');
        svg.setAttribute('height', '60');
        svg.setAttribute('viewBox', '0 0 120 60');
        svg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            z-index: 10;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M10 30 Q60 10 110 30 T10 30');
        path.setAttribute('stroke', `url(#brush-gradient-${Math.random()})`);
        path.setAttribute('stroke-width', '8');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('stroke-dasharray', '300');
        path.setAttribute('stroke-dashoffset', '300');
        path.classList.add('brush-stroke');
        
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', `brush-gradient-${Math.random()}`);
        gradient.innerHTML = `
            <stop offset="0%" stop-color="${Math.random() > 0.5 ? '#e74c3c' : '#9b59b6'}"/>
            <stop offset="100%" stop-color="${Math.random() > 0.5 ? '#c0392b' : '#8e44ad'}"/>
        `;
        defs.appendChild(gradient);
        svg.appendChild(defs);
        svg.appendChild(path);
        element.appendChild(svg);
        
        element.addEventListener('mouseenter', () => {
            svg.style.opacity = '1';
            svg.style.transform = 'translate(-50%, -50%) scale(1)';
            path.style.animation = 'none';
            path.style.strokeDashoffset = '300';
            setTimeout(() => {
                path.style.animation = 'brushStroke 1s ease forwards';
            }, 100);
        });
        
        element.addEventListener('mouseleave', () => {
            svg.style.opacity = '0';
            svg.style.transform = 'translate(-50%, -50%) scale(0)';
        });
    }
    
    // Apply brush strokes to gallery items
    galleryItems.forEach(item => {
        createBrushStroke(item);
    });
    
    // Preload images for better performance
    function preloadImages() {
        Object.values(artworks).forEach(artwork => {
            const img = new Image();
            img.src = artwork.img;
        });
    }
    
    preloadImages();
    
    console.log('Oil Portraits page loaded with enhanced interactive features');
});