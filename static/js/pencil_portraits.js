// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
        
        // Close menu on outside click
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    });
    
    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.highlight-item, .process-step, .service-card, .story-card');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            elements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px) scale(0.95)';
                element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                observer.observe(element);
            });
        }
    }
    
    // Run animation on scroll
    animateOnScroll();
    
    // Gallery item interactions
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        const image = item.querySelector('.portrait-image img');
        const overlay = item.querySelector('.image-overlay');
        
        // Staggered entrance animation
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            item.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 150);
        
        // Enhanced hover effects
        item.addEventListener('mouseenter', () => {
            if (image) {
                image.style.filter = 'grayscale(0%) contrast(1.3) brightness(1.05)';
            }
            overlay.style.transform = 'translateY(0)';
        });
        
        item.addEventListener('mouseleave', () => {
            if (image) {
                image.style.filter = 'grayscale(20%) contrast(1.1)';
            }
            overlay.style.transform = 'translateY(100%)';
        });
    });
    
    // Modal functionality
    const modal = document.getElementById('portrait-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalMedium = document.getElementById('modal-medium');
    const modalSize = document.getElementById('modal-size');
    const modalPrice = document.getElementById('modal-price');
    const closeModal = document.querySelector('.close-modal');
    const viewDetailBtns = document.querySelectorAll('.view-detail-btn');
    
    // Portrait data
    const portraits = {
        'portrait-1': {
            img: 'https://via.placeholder.com/800x600/34495e/f8f9fa?text=Family+Heirloom+Detail',
            title: 'Family Heirloom',
            description: 'This multi-generational family portrait captures four generations of love and resilience. The artist used a combination of fine graphite detailing for the faces and soft charcoal blending for the background to create depth and emotional resonance.',
            medium: 'Charcoal on 300gsm archival paper',
            size: '18" x 24"',
            price: '₹45,000'
        },
        'portrait-2': {
            img: 'https://via.placeholder.com/800x600/2c3e50/f8f9fa?text=Eternal+Love+Detail',
            title: 'Eternal Love',
            description: 'Celebrating 50 years of marriage, this portrait captures the couple during their engagement with delicate graphite line work that emphasizes their gentle expressions and the tender way they look at each other.',
            medium: 'Graphite & charcoal mixed media',
            size: '16" x 20"',
            price: '₹38,000'
        },
        'portrait-3': {
            img: 'https://via.placeholder.com/800x600/34495e/f8f9fa?text=Warrior+Spirit+Detail',
            title: 'Warrior Spirit',
            description: 'Commissioned as a tribute to a retired military officer, this charcoal portrait emphasizes strength and dignity through dramatic lighting and bold contrast. The subjects gaze conveys decades of leadership and courage.',
            medium: 'Charcoal on textured paper',
            size: '20" x 24"',
            price: '₹52,000'
        },
        'portrait-4': {
            img: 'https://via.placeholder.com/800x600/2c3e50/f8f9fa?text=Childhood+Memories+Detail',
            title: 'Childhood Memories',
            description: 'A mothers gift to herself, this pencil portrait captures her daughters curiosity and joy during her toddler years. The soft lighting and delicate rendering preserve the fleeting innocence of early childhood.',
            medium: 'Graphite pencil on smooth Bristol',
            size: '12" x 16"',
            price: '₹28,000'
        },
        'portrait-5': {
            img: 'https://via.placeholder.com/800x600/34495e/f8f9fa?text=Legacy+Portrait+Detail',
            title: 'Legacy Portrait',
            description: 'This executive portrait series for a corporate boardroom combines individual portraits with a group composition, using mixed media techniques to convey authority, wisdom, and professional excellence.',
            medium: 'Mixed media on canvas paper',
            size: '24" x 30"',
            price: '₹68,000'
        }
    };
    
    // Open modal
    viewDetailBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const portraitId = this.getAttribute('data-modal');
            const portrait = portraits[portraitId];
            
            if (portrait) {
                modalImg.src = portrait.img;
                modalTitle.textContent = portrait.title;
                modalDescription.textContent = portrait.description;
                modalMedium.textContent = portrait.medium;
                modalSize.textContent = portrait.size;
                modalPrice.textContent = portrait.price;
                
                modal.style.display = 'block';
                body.classList.add('modal-open');
            }
        });
    });
    
    // Close modal
    function closeModalFunc() {
        modal.style.display = 'none';
        body.classList.remove('modal-open');
    }
    
    closeModal.addEventListener('click', closeModalFunc);
    
    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalFunc();
        }
    });
    
    // Commission similar button
    const commissionBtn = document.querySelector('.commission-similar-btn');
    if (commissionBtn) {
        commissionBtn.addEventListener('click', function() {
            // Scroll to contact form or redirect to contact page
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Close modal after a brief delay
            setTimeout(closeModalFunc, 500);
            
            // Optional: Add notification
            showNotification('We\'ll help you create your own masterpiece!', 'success');
        });
    }
    
    // Notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Slide in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Pencil stroke animation effect
    function createPencilStrokeEffect(element) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100');
        svg.setAttribute('height', '100');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 10;
            opacity: 0;
        `;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M10 90 Q50 50 90 10');
        path.setAttribute('stroke', 'var(--graphite)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-dasharray', '200');
        path.setAttribute('stroke-dashoffset', '200');
        path.classList.add('pencil-stroke');
        
        svg.appendChild(path);
        element.appendChild(svg);
        
        // Show on hover
        element.addEventListener('mouseenter', () => {
            svg.style.opacity = '1';
            path.style.animation = 'none';
            path.style.strokeDashoffset = '200';
            setTimeout(() => {
                path.style.animation = 'pencilStroke 1s ease forwards';
            }, 100);
        });
    }
    
    // Apply pencil stroke to gallery items
    galleryItems.forEach(item => {
        createPencilStrokeEffect(item);
    });
    
    // Parallax effect for hero section
    function parallaxEffect() {
        const hero = document.querySelector('.page-hero');
        if (!hero || window.innerWidth < 768) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Initialize parallax if supported
    if (window.innerWidth > 768) {
        parallaxEffect();
    }
    
    // Image loading optimization
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Performance: throttle scroll events
    let ticking = false;
    function updateAnimations() {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Update any scroll-based animations here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateAnimations, { passive: true });
    
    console.log('Pencil Portraits page loaded with interactive features');
});