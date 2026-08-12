/* =============================================================
   ANISHA KUMARI PORTFOLIO — script.js
   Pure Vanilla JavaScript ONLY — No frameworks, no jQuery
   Features: Theme, Navbar, Typed Text, Scroll Reveal, Canvas,
             Hamburger, Counter, Form, Scroll Hint
   ============================================================= */

'use strict';

/* ===========================================================
   1. THEME MANAGEMENT (Dark / Light)
      - Reads localStorage on load
      - Falls back to system preference on first visit
      - Saves selection to localStorage on toggle
   =========================================================== */
const THEME_KEY = 'ak-portfolio-theme';
const htmlEl    = document.documentElement;
const themeBtn  = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    applyTheme(saved);
  } else {
    // First visit — use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
}

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// Listen for OS-level theme changes (only applies if user has NOT manually set a theme)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem(THEME_KEY)) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

initTheme();


/* ===========================================================
   2. NAVBAR — Scroll Effect + Active Link Highlight
   =========================================================== */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  // Scrolled style
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar(); // run immediately


/* ===========================================================
   3. HAMBURGER MENU (Mobile)
   =========================================================== */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ===========================================================
   4. SMOOTH SCROLL (Keyboard & Click)
   =========================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ===========================================================
   5. TYPED TEXT ANIMATION
   =========================================================== */
const typedEl = document.getElementById('typedRole');
const roles   = [
  'React Native Developer',
  'Mobile App Engineer',
  'Full Stack Developer',
  'Software Engineer',
  'AI/ML Enthusiast',
];
let roleIdx = 0, charIdx = 0, deleting = false;

function typeRole() {
  if (!typedEl) return;
  const current = roles[roleIdx];

  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeRole, 2200);
      return;
    }
    setTimeout(typeRole, 72);
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(typeRole, 420);
      return;
    }
    setTimeout(typeRole, 38);
  }
}
setTimeout(typeRole, 900);


/* ===========================================================
   6. SCROLL REVEAL ANIMATION
   =========================================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const index = Array.from(revealEls).indexOf(entry.target) % 6;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 70);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ===========================================================
   7. ANIMATED COUNTER (About section stats)
   =========================================================== */
function animateCount(el, endValue, suffix) {
  const duration = 1400;
  const start    = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // cubic ease
    el.textContent = Math.round(eased * endValue) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl  = entry.target.querySelector('.stat-num');
      if (!numEl) return;
      const raw    = numEl.textContent.trim();
      const isPlus = raw.includes('+');
      const value  = parseInt(raw.replace(/\D/g, ''), 10);
      animateCount(numEl, value, isPlus ? '+' : '');
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-box').forEach(el => statObserver.observe(el));


/* ===========================================================
   8. CANVAS NETWORK BACKGROUND
   =========================================================== */
const canvas = document.getElementById('bgCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H;

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const COUNT    = 55;
  const MAX_DIST = 130;
  const particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.5 + 0.5;
      this.a  = Math.random() * 0.45 + 0.08;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(110, 86, 207, ${this.a})`
        : `rgba(110, 86, 207, ${this.a * 0.4})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawLines() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const a = (1 - dist / MAX_DIST) * (isDark ? 0.12 : 0.06);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(47, 129, 247, ${a})`;
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();
}


/* ===========================================================
   9. SCROLL CUE — Hide on scroll
   =========================================================== */
const scrollCue = document.getElementById('scrollCue');
if (scrollCue) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      scrollCue.style.opacity = '0';
      scrollCue.style.pointerEvents = 'none';
    } else {
      scrollCue.style.opacity = '1';
      scrollCue.style.pointerEvents = 'auto';
    }
  }, { passive: true });
}


/* ===========================================================
   10. CONTACT — No form. Contact info links handle themselves.
   =========================================================== */
// Form removed by design — contact via email/phone/LinkedIn/GitHub directly.


/* ===========================================================
   11. CODE WINDOW / PROFILE IMAGE — Subtle Hover Effects
   =========================================================== */

// Profile image container subtle parallax on mouse move
const profileImg = document.getElementById('profileImg');
if (profileImg) {
  const container = profileImg.closest('.profile-img-container');
  if (container) {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      container.style.transform = `scale(1.02) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    container.addEventListener('mouseleave', () => {
      container.style.transform = '';
    });
  }
}

// Handle missing profile image gracefully
if (profileImg) {
  profileImg.addEventListener('error', () => {
    // Show initials fallback if image fails to load
    const wrap = profileImg.closest('.profile-img-container');
    if (wrap) {
      profileImg.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.style.cssText = `
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
        font-size: 4rem; font-weight: 800;
        background: linear-gradient(135deg, #6e56cf, #2f81f7);
        border-radius: 50%;
        color: white;
        font-family: 'Inter', sans-serif;
      `;
      fallback.textContent = 'AK';
      wrap.appendChild(fallback);
    }
  });
}


/* ===========================================================
   12. KEYBOARD ACCESSIBILITY — Escape closes mobile menu
   =========================================================== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    hamburger && hamburger.focus();
  }
});


/* ===========================================================
   13. CONSOLE BRANDING
   =========================================================== */
console.log(
  '%c  Anisha Kumari | Portfolio  ',
  'background:linear-gradient(135deg,#6e56cf,#2f81f7);color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:700;'
);
console.log('%c React Native Developer · MCA · Open to Work 🚀', 'color:#2f81f7;font-size:11px;');
console.log('%c Built with HTML5 + CSS3 + Vanilla JavaScript', 'color:#3fb950;font-size:10px;');
