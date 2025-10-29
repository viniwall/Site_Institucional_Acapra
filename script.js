(function() {
    'use strict';

    const initSmoothScroll = () => {
        document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    document.querySelectorAll('.navbar a').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            });
        });
    };

    const initHeaderScroll = () => {
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll(
            '.box, .about .row, .his-miss .content, .animais-doados > div, .mautrato .content, .stats .content'
        );

        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            const revealPoint = 100;

            revealElements.forEach((element, index) => {
                const elementTop = element.getBoundingClientRect().top;

                if (elementTop < windowHeight - revealPoint) {
                    if (element.classList.contains('box')) {
                        setTimeout(() => {
                            element.classList.add('scroll-reveal', 'active');
                        }, index * 100);
                    } else {
                        element.classList.add('scroll-reveal', 'active');
                    }
                }
            });
        };

        revealElements.forEach(element => {
            element.classList.add('scroll-reveal');
        });

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); 
    };

    const initActiveNavOnScroll = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar a[href^="#"]');

        const highlightNav = () => {
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 150;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', highlightNav);
    };

    const initParallax = () => {
        const homeContainer = document.querySelector('.home-container');
        
        if (homeContainer) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;
                homeContainer.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            });
        }
    };

    const initCardTilt = () => {
        const cards = document.querySelectorAll('.box');

        cards.forEach(card => {
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

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        });
    };

    const initAnimatedCounters = () => {
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;

        const numbers = statsSection.querySelectorAll('.content p');
        let counted = false;

        const animateNumbers = () => {
            if (counted) return;

            const statsSectionTop = statsSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (statsSectionTop < windowHeight - 100) {
                counted = true;
                
                numbers.forEach(paragraph => {
                    const text = paragraph.textContent;
                    const numberMatch = text.match(/\d+/);
                    
                    if (numberMatch) {
                        const finalNumber = parseInt(numberMatch[0]);
                        const duration = 2000;
                        const steps = 60;
                        const increment = finalNumber / steps;
                        let current = 0;
                        let step = 0;

                        const counter = setInterval(() => {
                            current += increment;
                            step++;
                            
                            if (step >= steps) {
                                current = finalNumber;
                                clearInterval(counter);
                            }

                            paragraph.textContent = text.replace(/\d+/, Math.floor(current));
                        }, duration / steps);
                    }
                });
            }
        };

        window.addEventListener('scroll', animateNumbers);
        animateNumbers();
    };

    const initButtonRipple = () => {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        const style = document.createElement('style');
        style.textContent = `
            .btn {
                position: relative;
                overflow: hidden;
            }
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    };

    const initLazyLoad = () => {
        const images = document.querySelectorAll('img[src]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';
                    
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });

                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    };

    const initFloatingIcons = () => {
        const icons = document.querySelectorAll('.icons img');
        
        icons.forEach((icon, index) => {
            const delay = index * 0.5;
            icon.style.animationDelay = `${delay}s`;
        });
    };

    const initBackToTop = () => {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.classList.add('back-to-top');
        backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
        document.body.appendChild(backToTopBtn);

        const style = document.createElement('style');
        style.textContent = `
            .back-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
                color: white;
                font-size: 24px;
                border: none;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1000;
                box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
            }
            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
            .back-to-top:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 30px rgba(139, 92, 246, 0.6);
            }
            .back-to-top:active {
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    const initPageLoad = () => {
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });
    };

    const init = () => {
        console.log('🐾 ACAPRA - Carregando experiência interativa...');
        
        initSmoothScroll();
        initHeaderScroll();
        initScrollReveal();
        initActiveNavOnScroll();
        initParallax();
        initCardTilt();
        initAnimatedCounters();
        initButtonRipple();
        initLazyLoad();
        initFloatingIcons();
        initBackToTop();
        initPageLoad();

        console.log('✨ ACAPRA - Pronto para navegar!');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
