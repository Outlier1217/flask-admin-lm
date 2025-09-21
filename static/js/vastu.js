// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu on outside click
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Navbar scroll effect
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();
    
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
            }
        });
    });
    
    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.benefit-item, .direction-card, .service-card, .case-study-card, .myth-card');
        
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
                element.style.transform = `translateY(30px) scale(${0.95 - (index * 0.02)})`;
                element.style.transition = `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s`;
                observer.observe(element);
            });
        }
    }
    
    // Run animation on scroll
    animateOnScroll();
    
    // Myth/Fact reveal functionality
    const mythCards = document.querySelectorAll('.myth-card');
    mythCards.forEach(card => {
        card.addEventListener('click', function() {
            // Close all other cards
            mythCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('active');
                }
            });
            
            // Toggle current card
            this.classList.toggle('active');
        });
    });
    
    // Direction card hover effects with rotation
    const directionCards = document.querySelectorAll('.direction-card');
    directionCards.forEach(card => {
        const icon = card.querySelector('.direction-icon');
        
        card.addEventListener('mouseenter', () => {
            if (icon) {
                icon.style.transform = 'rotate(360deg) scale(1.1)';
                icon.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
        
        // Add compass rotation effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });
    
    // Case study card hover effects
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    caseStudyCards.forEach(card => {
        const image = card.querySelector('.case-image img');
        const tags = card.querySelector('.case-tags');
        
        card.addEventListener('mouseenter', () => {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            if (tags) {
                tags.style.transform = 'translateY(-10px)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1)';
            }
            if (tags) {
                tags.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Vastu energy visualization
    function createEnergyVisualization() {
        const directionsSection = document.querySelector('.directions-section');
        if (!directionsSection) return;
        
        // Create floating energy particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, ${getRandomColor()} 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 0;
                animation: float ${10 + Math.random() * 10}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                transform: translate(-50%, -50%);
            `;
            
            particle.style.animationDuration = `${8 + Math.random() * 12}s`;
            directionsSection.appendChild(particle);
        }
    }
    
    function getRandomColor() {
        const colors = ['#1e90ff', '#00bfff', '#32cd32', '#ff4500', '#ff0000', '#daa520', '#4169e1', '#6495ed'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Initialize energy visualization
    createEnergyVisualization();
    
    // Staggered loading animation
    function addLoadingAnimation() {
        const elements = document.querySelectorAll('.benefit-item, .direction-card, .service-card, .case-study-card');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = `translateY(50px) scale(0.9) rotateX(15deg)`;
            
            setTimeout(() => {
                element.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
            }, index * 150);
        });
    }
    
    // Initialize loading animation after a short delay
    setTimeout(addLoadingAnimation, 500);
    
    // Parallax effect for hero section
    function parallaxEffect() {
        const hero = document.querySelector('.page-hero');
        if (!hero || window.innerWidth < 768) return;
        
        const omSymbol = document.querySelector('.hero-title::after');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            hero.style.transform = `translateY(${rate}px)`;
            
            if (omSymbol) {
                omSymbol.style.transform = `translateY(${rate * 0.5}px) rotate(${scrolled * 0.1}deg)`;
            }
        });
    }
    
    // Initialize parallax if supported
    if (window.innerWidth > 768) {
        parallaxEffect();
    }
    
    // Vastu compass animation
    function createCompassAnimation() {
        const directionsSection = document.querySelector('.directions-section');
        if (!directionsSection) return;
        
        const compass = document.createElement('div');
        compass.innerHTML = `
            <svg class="vastu-compass" width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(210, 105, 30, 0.1)" stroke-width="2"/>
                <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(139, 69, 19, 0.1)" stroke-width="1"/>
                <g class="compass-needle">
                    <path d="M100 20 L105 80 L100 75 L95 80 Z" fill="url(#needle-gradient)" transform="rotate(0 100 100)"/>
                    <path d="M100 180 L105 120 L100 125 L95 120 Z" fill="url(#needle-gradient)" transform="rotate(180 100 100)"/>
                </g>
                <defs>
                    <linearGradient id="needle-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#d2691e;stop-opacity:1" />
                    </linearGradient>
                </defs>
            </svg>
        `;
        
        compass.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.7;
            pointer-events: none;
            z-index: 0;
            animation: compassRotate 20s linear infinite;
        `;
        
        directionsSection.style.position = 'relative';
        directionsSection.appendChild(compass);
    }
    
    // Initialize compass animation
    createCompassAnimation();
    
    // Add click-to-reveal effect for benefits
    const benefitItems = document.querySelectorAll('.benefit-item');
    benefitItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(210, 105, 30, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
            `;
            
            const rect = this.getBoundingClientRect();
            ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) * 2 + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(1);
                opacity: 0;
            }
        }
        
        @keyframes compassRotate {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .vastu-compass {
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }
        
        .benefit-item.expanded {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(139, 69, 19, 0.2);
        }
        
        @media (max-width: 768px) {
            .vastu-compass {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Performance optimization: throttle scroll events
    let ticking = false;
    function updateScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateScroll, { passive: true });
    
    console.log('Vastu page loaded successfully with interactive elements');
});