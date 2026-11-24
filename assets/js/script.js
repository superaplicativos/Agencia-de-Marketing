/* ============================================
   Super Aplicativos - Scripts
   ============================================ */

(function () {
    'use strict';

    /* ---------- Header scroll ---------- */
    const header = document.getElementById('header');
    const onScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile menu ---------- */
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    /* ---------- Scroll reveal ---------- */
    const revealEls = document.querySelectorAll(
        '.service-card, .diff-card, .stat-card, .testimonial-card, .process-step, .faq-item, .final-cta-box, .about-image, .about-content, .results-dashboard'
    );
    revealEls.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ---------- Animated counters ---------- */
    const counters = document.querySelectorAll('.stat-value');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = prefix + value + suffix;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = prefix + target + suffix;
            }
        }
        requestAnimationFrame(update);
    }

    /* ---------- FAQ: close others when opening one ---------- */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(other => {
                    if (other !== item) other.open = false;
                });
            }
        });
    });

    /* ---------- WhatsApp exit intent (only once) ---------- */
    let exitShown = false;
    function showExitPrompt() {
        if (exitShown) return;
        exitShown = true;
        // Redirect user to WhatsApp with a contextual message
        const msg = encodeURIComponent(
            'Oi! Vi que você estava navegando no site da Super Aplicativos. ' +
            'Posso te ajudar com algo? Diagnóstico gratuito de marketing digital!'
        );
        if (window.confirm('Antes de ir embora, que tal um diagnóstico gratuito de marketing digital?\n\nClique em OK para falar com a gente no WhatsApp.')) {
            window.open('https://wa.me/5511966161611?text=' + msg, '_blank');
        }
    }

    // Trigger on mouseout (desktop only) - quick exit to top
    document.addEventListener('mouseout', (e) => {
        if (!e.toElement && !e.relatedTarget && e.clientY <= 10) {
            showExitPrompt();
        }
    });

    /* ---------- Track CTA clicks (simple console log for now) ---------- */
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            // Hook futuro: integrar Google Analytics / Meta Pixel aqui
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'whatsapp_click', {
                    'event_category': 'lead',
                    'event_label': link.textContent.trim().substring(0, 40)
                });
            }
            if (typeof window.fbq === 'function') {
                window.fbq('track', 'Contact', { method: 'whatsapp' });
            }
        });
    });

})();
