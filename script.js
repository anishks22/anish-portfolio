'use strict';

/* ============================================
   Portfolio JavaScript — Production Build
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    try {
        initThemePanel();
        initLightbox();
        initParticles();
        initTypingEffect();
        initScrollReveal();
        initNavbar();
        initSmoothScroll();
        initCountUp();
        initVisitorCounter();
        initCopyEmail();
    } catch (err) {
        console.error('[Portfolio] Initialization error:', err);
    }
});

/* ============================================
   Particle Canvas Background
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    let animationId;
    let isVisible = true;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();

    // Debounced resize for performance
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });

    // Pause animation when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isVisible = false;
            cancelAnimationFrame(animationId);
        } else {
            isVisible = true;
            animate();
        }
    });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() > 0.5 ? 190 : 250;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;
            ctx.fill();
        }
    }

    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        if (!isVisible) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   Typing Effect
   ============================================ */
function initTypingEffect() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const titles = [
        'Software Development Engineer',
        'Android AOSP Developer',
        'System-Level API Engineer',
        'Backend Developer',
        'Problem Solver (800+ DSA)',
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let speed = 60;

    function type() {
        const current = titles[titleIndex];
        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            speed = 30;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            speed = 60;
        }

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }
    type();
}

/* ============================================
   Scroll Reveal (Intersection Observer)
   ============================================ */
function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
        // Fallback: show all elements immediately
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================
   Navbar
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (!navbar || !hamburger || !navLinks) return;

    const links = document.querySelectorAll('.nav-link');

    // Debounced scroll handler
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                // Navbar background
                navbar.classList.toggle('scrolled', window.scrollY > 50);

                // Active link highlighting
                const sections = document.querySelectorAll('section[id]');
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 100;
                    if (window.scrollY >= sectionTop) {
                        current = section.getAttribute('id');
                    }
                });
                links.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
                });

                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Hamburger
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/* ============================================
   Smooth Scroll
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 72;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   Count Up Animation
   ============================================ */
function initCountUp() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const statsContainer = counters[0].closest('.hero-stats');
    if (!statsContainer) return;

    if (!('IntersectionObserver' in window)) {
        counters.forEach(c => { c.textContent = c.getAttribute('data-count'); });
        return;
    }

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'), 10);
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    function updateCount() {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.textContent = target;
                        }
                    }
                    updateCount();
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsContainer);
}

/* ============================================
   Theme Panel
   ============================================ */
function initThemePanel() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const panel = document.getElementById('theme-panel');
    const closeBtn = document.getElementById('theme-panel-close');
    if (!toggleBtn || !panel || !closeBtn) return;

    const modeBtns = document.querySelectorAll('.mode-btn');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const html = document.documentElement;

    // Load saved preferences
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    const savedColor = localStorage.getItem('portfolio-color') || 'default';

    applyTheme(savedTheme);
    applyColor(savedColor);

    // Toggle panel
    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('active');
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
    });

    // Close panel on outside click
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !toggleBtn.contains(e.target)) {
            panel.classList.remove('active');
        }
    });

    // Mode switching
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            applyTheme(mode);
            try { localStorage.setItem('portfolio-theme', mode); } catch (e) { /* Private browsing */ }
        });
    });

    // Color switching
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const color = swatch.dataset.swatch;
            applyColor(color);
            try { localStorage.setItem('portfolio-color', color); } catch (e) { /* Private browsing */ }
        });
    });

    function applyTheme(theme) {
        if (theme === 'light') {
            html.setAttribute('data-theme', 'light');
        } else {
            html.removeAttribute('data-theme');
        }
        modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === theme);
        });
        const canvas = document.getElementById('particles-canvas');
        if (canvas) {
            canvas.style.opacity = theme === 'light' ? '0.35' : '1';
        }
    }

    function applyColor(color) {
        if (color === 'default') {
            html.removeAttribute('data-color');
        } else {
            html.setAttribute('data-color', color);
        }
        colorSwatches.forEach(swatch => {
            swatch.classList.toggle('active', swatch.dataset.swatch === color);
        });
    }
}

/* ============================================
   Image Lightbox
   ============================================ */
function initLightbox() {
    const trigger = document.getElementById('hero-avatar-trigger');
    const overlay = document.getElementById('lightbox-overlay');
    const closeBtn = document.getElementById('lightbox-close');
    if (!trigger || !overlay || !closeBtn) return;

    trigger.addEventListener('click', () => {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/* ============================================
   Visitor Counter (counterapi.dev)
   ============================================ */
function initVisitorCounter() {
    const counterEl = document.getElementById('visitor-count');
    if (!counterEl) return;

    // We use counterapi.dev which is free and easy to use
    // Namespace: anishks22-portfolio (based on username/repo)
    // Key: visits
    const namespace = 'anishks22-portfolio';
    const key = 'visits';
    const url = `https://api.counterapi.dev/v1/${namespace}/${key}/up`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && typeof data.count === 'number') {
                // Animate the count up
                animateCounter(counterEl, data.count);
            }
        })
        .catch(err => {
            console.error('[Portfolio] Visitor counter error:', err);
            counterEl.textContent = '---';
        });

    function animateCounter(el, target) {
        const duration = 1500;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime < duration) {
                const progress = elapsedTime / duration;
                const currentCount = Math.floor(progress * target);
                el.textContent = currentCount.toLocaleString();
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        }
        requestAnimationFrame(update);
    }
}

/* ============================================
   Copy Email & Toast
   ============================================ */
function initCopyEmail() {
    const btn = document.getElementById('copy-email');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const email = 'anish.aks121@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            showToast('Email copied to clipboard!');
            
            // Subtle feedback on the button
            btn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            setTimeout(() => {
                btn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                `;
            }, 2000);
        });
    });
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
