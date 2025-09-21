// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
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
            }
        });
    });
    
    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.style-card, .timeline-item, .service-card, .project-card, .tip-card');
        
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
            
            elements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px) scale(0.95)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(element);
            });
        }
    }
    
    // Run animation on scroll
    animateOnScroll();
    
    // Style card hover effects with 3D transform
    const styleCards = document.querySelectorAll('.style-card');
    styleCards.forEach(card => {
        const image = card.querySelector('.style-image img');
        
        card.addEventListener('mouseenter', () => {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            card.style.transform = 'perspective(1000px) rotateY(5deg) translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1)';
            }
            card.style.transform = 'perspective(1000px) rotateY(0deg) translateY(0)';
        });

        // Add mouse move parallax effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });
    });
    
    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 300);
    });
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const image = card.querySelector('.project-image img');
        
        card.addEventListener('mouseenter', () => {
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
    
    // Add staggered loading animation
    function addLoadingAnimation() {
        const cards = document.querySelectorAll('.style-card, .service-card, .tip-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.9)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 150);
        });
    }
    
    // Initialize loading animation after a short delay
    setTimeout(addLoadingAnimation, 500);
    
    // Color palette generator demo (for fun)
    function generateColorPalette() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        const palette = document.querySelector('.color-palette');
        
        if (!palette) {
            // Create a demo palette if not exists
            const demoPalette = document.createElement('div');
            demoPalette.className = 'color-palette';
            demoPalette.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 1000;
            `;
            
            colors.forEach(color => {
                const swatch = document.createElement('div');
                swatch.style.cssText = `
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: ${color};
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                `;
                
                swatch.addEventListener('click', () => {
                    document.documentElement.style.setProperty('--accent', color);
                    document.body.style.setProperty('--accent', color);
                });
                
                swatch.addEventListener('mouseenter', () => {
                    swatch.style.transform = 'scale(1.1)';
                });
                
                swatch.addEventListener('mouseleave', () => {
                    swatch.style.transform = 'scale(1)';
                });
                
                demoPalette.appendChild(swatch);
            });
            
            document.body.appendChild(demoPalette);
        }
    }
    
    // Uncomment below to enable color palette demo
    // generateColorPalette();
});