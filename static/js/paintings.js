// Enhanced navigation with smooth animations
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;
    
    // Initialize navigation
    function initNavigation() {
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMobileMenu();
            });
            
            // Close on link click
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        }
    }
    
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        if (navMenu.classList.contains('active')) {
            createAnimatedBackdrop();
        }
    }
    
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        body.classList.remove('menu-open');
        
        const backdrop = document.querySelector('.animated-backdrop');
        if (backdrop) {
            backdrop.style.opacity = '0';
            backdrop.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            }, 400);
        }
    }
    
    function createAnimatedBackdrop() {
        // Remove existing backdrop
        document.querySelector('.animated-backdrop')?.remove();
        
        const backdrop = document.createElement('div');
        backdrop.className = 'animated-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(155, 89, 182, 0.8), rgba(231, 76, 60, 0.6));
            z-index: 997;
            opacity: 0;
            transform: scale(1.2);
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(backdrop);
        
        requestAnimationFrame(() => {
            backdrop.style.opacity = '1';
            backdrop.style.transform = 'scale(1)';
        });
        
        backdrop.addEventListener('click', closeMobileMenu);
    }
    
    initNavigation();
    
    // Ultra-smooth scrolling with custom easing
    function smoothScrollTo(target, duration = 1200) {
        const startPosition = window.pageYOffset;
        const distance = target - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Custom easing function (easeOutQuart)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const position = startPosition + (distance * easeOutQuart);
            
            window.scrollTo(0, position);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                closeMobileMenu(); // Close menu after scroll
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 60;
                
                smoothScrollTo(targetPosition);
            }
        });
    });
    
    // Advanced scroll-triggered animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = parseFloat(element.dataset.animationDelay) || 0;
                    const duration = parseFloat(element.dataset.animationDuration) || 0.8;
                    
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
                    element.style.transition = `all ${duration}s cubic-bezier(0.25, 0.8, 0.25, 1) ${delay}s`;
                    
                    // Trigger staggered child animations
                    const children = element.querySelectorAll('[data-child-animation]');
                    children.forEach((child, childIndex) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, (index + childIndex) * 100);
                    });
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);
        
        // Observe all animated elements
        document.querySelectorAll('[data-animation]').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(80px) scale(0.9)';
            observer.observe(element);
        });
    }
    
    initScrollAnimations();
    
    // Collection card interactions with 3D effects
    const collectionCards = document.querySelectorAll('.collection-card');
    collectionCards.forEach((card, index) => {
        const image = card.querySelector('.collection-image img');
        const overlay = card.querySelector('.collection-overlay');
        
        // Staggered entrance
        card.style.opacity = '0';
        card.style.transform = 'translateY(100px) rotateX(30deg)';
        
        setTimeout(() => {
            card.style.transition = `all 1s cubic-bezier(0.25, 0.8, 0.25, 1) ${index * 0.2}s`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotateX(0deg)';
        }, index * 300);
        
        // Enhanced hover with 3D transform
        card.addEventListener('mouseenter', () => {
            if (image) {
                image.style.transform = 'scale(1.1) rotateY(5deg)';
                image.style.filter = 'saturate(1.3) brightness(1.05)';
            }
            overlay.style.opacity = '1';
            card.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(3deg) translateY(-15px)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1) rotateY(0deg)';
                image.style.filter = 'saturate(1) brightness(1)';
            }
            overlay.style.opacity = '0';
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
        });
        
        // Mouse parallax within card
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });
    });
    
    // Masterpiece card interactions with floating animation
    const masterpieceCards = document.querySelectorAll('.masterpiece-card');
    masterpieceCards.forEach((card, index) => {
        const image = card.querySelector('.masterpiece-image img');
        const overlay = card.querySelector('.image-overlay');
        
        // Floating entrance animation
        card.style.opacity = '0';
        card.style.transform = `translateY(100px) rotateY(${index * 30}deg)`;
        
        setTimeout(() => {
            card.style.transition = `all 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) ${index * 0.25}s`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotateY(0deg)';
        }, index * 400);
        
        card.addEventListener('mouseenter', () => {
            if (image) {
                image.style.transform = 'scale(1.15) rotateY(8deg) rotateX(5deg)';
                image.style.filter = 'saturate(1.4) contrast(1.1)';
            }
            overlay.style.opacity = '1';
            card.style.transform = 'perspective(1000px) rotateY(-8deg) rotateX(5deg) translateY(-25px) scale(1.03)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1) rotateY(0deg) rotateX(0deg)';
                image.style.filter = 'saturate(1.1) contrast(1.05)';
            }
            overlay.style.opacity = '0';
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)';
        });
    });
    
    // Quick view modal functionality
    const quickViewModal = document.getElementById('quick-view-modal');
    const quickViewImg = document.getElementById('quick-view-img');
    const quickViewTitle = document.getElementById('quick-view-title');
    const quickViewDescription = document.getElementById('quick-view-description');
    const quickViewMedium = document.getElementById('quick-view-medium');
    const quickViewSize = document.getElementById('quick-view-size');
    const quickViewYear = document.getElementById('quick-view-year');
    const quickViewPrice = document.getElementById('quick-view-price');
    const closeQuickView = document.querySelector('.close-quick-view');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    // Artwork data for quick view
    const quickViewArtworks = {
        'void': {
            img: 'https://via.placeholder.com/800x1000/9b59b6/f8f9fa?text=The+Void+Detail',
            title: 'The Void',
            description: 'A meditation on emptiness and creative potential. This large-scale abstract explores negative space as a canvas for possibility, using subtle tonal shifts and minimal gestural marks to create profound visual depth.',
            medium: 'Acrylic and ink on canvas',
            size: '36" × 48" (91 × 122 cm)',
            year: '2024',
            price: '₹1,20,000'
        },
        'fire': {
            img: 'https://via.placeholder.com/800x1000/e74c3c/f8f9fa?text=Inner+Fire+Detail',
            title: 'Inner Fire',
            description: 'Raw emotional energy captured through explosive color and dynamic brushwork. This piece channels creative passion and inner intensity, with layered drips and impasto creating a visceral sense of movement and heat.',
            medium: 'Oil on canvas',
            size: '30" × 40" (76 × 102 cm)',
            year: '2024',
            price: '₹95,000'
        },
        'ocean': {
            img: 'https://via.placeholder.com/800x1000/27ae60/f8f9fa?text=Ocean+Dreams+Detail',
            title: 'Ocean Dreams',
            description: 'Surreal exploration of the subconscious through fluid forms and oceanic color palettes. This piece blends representational elements with dreamlike abstraction, creating a sense of weightless immersion and emotional depth.',
            medium: 'Mixed media on birch panel',
            size: '40" × 60" (102 × 152 cm)',
            year: '2024',
            price: '₹1,50,000'
        }
    };
    
    // Open quick view
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const artworkId = this.getAttribute('data-artwork');
            const artwork = quickViewArtworks[artworkId];
            
            if (artwork) {
                quickViewImg.src = artwork.img;
                quickViewTitle.textContent = artwork.title;
                quickViewDescription.innerHTML = artwork.description.replace(/\n/g, '<br><br>');
                quickViewMedium.textContent = artwork.medium;
                quickViewSize.textContent = artwork.size;
                quickViewYear.textContent = artwork.year;
                quickViewPrice.textContent = artwork.price;
                
                quickViewModal.style.display = 'block';
                body.classList.add('quick-view-open');
                
                // Animate entrance
                const content = document.querySelector('.quick-view-content');
                content.style.opacity = '0';
                content.style.transform = 'scale(0.9) translateY(30px)';
                
                requestAnimationFrame(() => {
                    content.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
                    content.style.opacity = '1';
                    content.style.transform = 'scale(1) translateY(0)';
                });
            }
        });
    });
    
    // Close quick view
    function closeQuickViewModal() {
        quickViewModal.style.opacity = '0';
        const content = document.querySelector('.quick-view-content');
        content.style.transform = 'scale(0.9) translateY(30px)';
        
        setTimeout(() => {
            quickViewModal.style.display = 'none';
            body.classList.remove('quick-view-open');
            content.style.transition = 'none';
        }, 400);
    }
    
    closeQuickView.addEventListener('click', closeQuickViewModal);
    
    // Close on outside click
    quickViewModal.addEventListener('click', function(e) {
        if (e.target === quickViewModal) {
            closeQuickViewModal();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && quickViewModal.style.display === 'block') {
            closeQuickViewModal();
        }
    });
    
    // Purchase buttons
    document.querySelectorAll('.purchase-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.masterpiece-card');
            const title = card.querySelector('.masterpiece-title').textContent;
            const price = card.querySelector('.masterpiece-price').textContent;
            
            // Enhanced purchase notification
            showArtPurchaseNotification(title, price);
            
            // Visual feedback
            this.style.transform = 'scale(0.95) rotate(5deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        });
    });
    
    function showArtPurchaseNotification(title, price) {
        const notification = document.createElement('div');
        notification.className = 'art-purchase-notification';
        notification.innerHTML = `
            <div class="notification-header">
                <i class="fas fa-shopping-cart"></i>
                <h4>Purchase Initiated</h4>
            </div>
            <div class="notification-body">
                <p class="purchase-title">"${title}"</p>
                <p class="purchase-price">${price}</p>
                <div class="purchase-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <p>Processing your order...</p>
                </div>
            </div>
            <div class="notification-footer">
                <button class="track-order-btn">Track Order</button>
                <button class="continue-shopping-btn">Continue Shopping</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 380px;
            background: linear-gradient(135deg, var(--white) 0%, #f8f9fa 100%);
            border-radius: 1.5rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.25);
            z-index: 5000;
            transform: translateY(100%) scale(0.9);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
            border: 1px solid rgba(155, 89, 182, 0.1);
            font-family: 'Inter', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        // Slide up animation
        requestAnimationFrame(() => {
            notification.style.transform = 'translateY(0) scale(1)';
            notification.style.opacity = '1';
        });
        
        // Animate progress bar
        const progressFill = notification.querySelector('.progress-fill');
        setTimeout(() => {
            progressFill.style.width = '100%';
            progressFill.style.transition = 'width 2s ease-in-out';
        }, 500);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(100%) scale(0.9)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 5000);
        
        // Button interactions
        const trackBtn = notification.querySelector('.track-order-btn');
        const continueBtn = notification.querySelector('.continue-shopping-btn');
        
        trackBtn.addEventListener('click', () => {
            // Simulate order tracking
            showOrderTracking();
            notification.remove();
        });
        
        continueBtn.addEventListener('click', () => {
            notification.remove();
        });
    }
    
    function showOrderTracking() {
        const trackingModal = document.createElement('div');
        trackingModal.className = 'order-tracking-modal';
        trackingModal.innerHTML = `
            <div class="tracking-content">
                <h3>Order Processing</h3>
                <div class="tracking-steps">
                    <div class="step active">
                        <div class="step-icon">✓</div>
                        <div class="step-text">Order Received</div>
                    </div>
                    <div class="step">
                        <div class="step-icon">○</div>
                        <div class="step-text">Payment Verified</div>
                    </div>
                    <div class="step">
                        <div class="step-icon">○</div>
                        <div class="step-text">Artwork Prepared</div>
                    </div>
                    <div class="step">
                        <div class="step-icon">○</div>
                        <div class="step-text">Shipped</div>
                    </div>
                </div>
                <p class="tracking-status">Your order is being processed. You'll receive a confirmation email shortly.</p>
                <button class="close-tracking">Close</button>
            </div>
        `;
        
        trackingModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 6000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(trackingModal);
        
        requestAnimationFrame(() => {
            trackingModal.style.opacity = '1';
            trackingModal.style.transform = 'scale(1)';
        });
        
        trackingModal.querySelector('.close-tracking').addEventListener('click', () => {
            trackingModal.style.opacity = '0';
            trackingModal.style.transform = 'scale(0.8)';
            setTimeout(() => trackingModal.remove(), 300);
        });
    }
    
    // Parallax and floating elements
    function initFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-canvas, .philosophy-card, .highlight-item');
        
        floatingElements.forEach((element, index) => {
            element.style.transform = `translateY(50px) rotateY(${index * 10}deg)`;
            element.style.opacity = '0';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) rotateY(0deg)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(element);
        });
    }
    
    initFloatingElements();
    
    // Color-shifting animation for hero
    function initColorShift() {
        const hero = document.querySelector('.page-hero');
        if (!hero) return;
        
        let hue = 0;
        const colorShiftInterval = setInterval(() => {
            if (document.hidden) return;
            
            hue = (hue + 2) % 360;
            hero.style.filter = `hue-rotate(${hue}deg) saturate(1.1)`;
        }, 100);
        
        // Pause when tab is inactive
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(colorShiftInterval);
                hero.style.filter = 'hue-rotate(270deg) saturate(1.1)';
            } else {
                // Restart with current hue
                initColorShift();
            }
        });
    }
    
    initColorShift();
    
    // Performance optimization
    let rafId;
    function requestAnimationLoop(callback) {
        function loop() {
            callback();
            rafId = requestAnimationFrame(loop);
        }
        rafId = requestAnimationFrame(loop);
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
    });
    
    console.log('Original Paintings page loaded with advanced interactive features');
});