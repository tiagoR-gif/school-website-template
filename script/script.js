
/* ── 1. NAVBAR: scroll + hamburger ── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  // Scroll: add/remove .scrolled class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();


/* ── 2. SMOOTH SCROLL for all anchor links ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 3. SCROLL REVEAL with IntersectionObserver ── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal, .reveal');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after first trigger for performance
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ── 4. STAGGERED CARDS ANIMATION ── */
(function initStaggeredCards() {
  const grids = document.querySelectorAll('.cards-grid, .cursos-grid, .depoimentos-grid');

  grids.forEach(grid => {
    const cards = grid.querySelectorAll('.diff-card, .curso-card, .dep-card');
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.10}s`;
    });
  });
})();


/* ── 5. HERO: parallax on scroll ── */
(function initHeroParallax() {
  const blob1 = document.querySelector('.hero-blob:not(.hero-blob--2)');
  const blob2 = document.querySelector('.hero-blob--2');
  const grid  = document.querySelector('.hero-grid');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > window.innerHeight) return; // only in hero range
    if (blob1) blob1.style.transform = `translateY(${y * 0.25}px) rotate(${y * 0.01}deg)`;
    if (blob2) blob2.style.transform = `translateY(${-y * 0.15}px)`;
    if (grid)  grid.style.transform  = `translateY(${y * 0.08}px)`;
  }, { passive: true });
})();


/* ── 6. COUNTER ANIMATION for stats ── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');

  const parseTarget = (el) => {
    const text = el.textContent.replace(/[^0-9.]/g, '');
    return parseFloat(text) || 0;
  };

  const formatNum = (num, isDecimal) =>
    isDecimal ? num.toFixed(1) : Math.round(num).toLocaleString('pt-BR');

  const animateCounter = (el) => {
    const target   = parseTarget(el);
    const suffix   = el.querySelector('sup') ? el.querySelector('sup').outerHTML : '';
    const isDecimal = el.textContent.includes('.');
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = target * eased;

      el.innerHTML = formatNum(current, isDecimal) + suffix;

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  // Observe hero stats block
  const statsBlock = document.querySelector('.hero-stats');
  if (!statsBlock) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stats.forEach(s => animateCounter(s));
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsBlock);
})();


/* ── 7. CONTACT FORM ── */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const inputs = form.querySelectorAll('input[required], select[required]');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#e05555';
        valid = false;
        setTimeout(() => (input.style.borderColor = ''), 2000);
      }
    });
    if (!valid) return;

    // Simulate submit
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled    = true;

    setTimeout(() => {
      btn.textContent = 'Enviar mensagem';
      btn.disabled    = false;
      form.reset();
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1400);
  });
})();


/* ── 8. ACTIVE NAV LINK on scroll ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  const setActive = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) current = section.getAttribute('id');
    });

    links.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = '#ffffff';
      }
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
})();


/* ── 9. CURSOR GLOW effect on hero ── */
(function initCursorGlow() {
  const hero = document.getElementById('hero');
  if (!hero || window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: absolute;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(30,111,220,0.18) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%,-50%);
    transition: opacity 0.4s;
    z-index: 1;
  `;
  hero.appendChild(glow);

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    glow.style.left = `${e.clientX - rect.left}px`;
    glow.style.top  = `${e.clientY - rect.top}px`;
    glow.style.opacity = '1';
  });

  hero.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
})();


/* ── 10. PAGE LOAD animation trigger ── */
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  // Fallback if DOMContentLoaded already fired
  if (document.readyState !== 'loading') {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  }
})();