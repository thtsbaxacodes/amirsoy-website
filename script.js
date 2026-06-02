/* Language switcher */
const translations = {};
let currentLang = localStorage.getItem('amirsoy_lang') || 'en';

function registerLang(lang, strings) {
  translations[lang] = strings;
}

function setLang(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('amirsoy_lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key] !== undefined) el.textContent = translations[lang][key];
  });
  document.documentElement.lang = lang;

  const currentEl = document.getElementById('lang-current');
  if (currentEl) currentEl.textContent = lang.toUpperCase();

  const flagSrc = { en: 'https://flagcdn.com/w20/gb.png', ru: 'https://flagcdn.com/w20/ru.png', uz: 'https://flagcdn.com/w20/uz.png' };
  const flagEl = document.getElementById('lang-flag');
  if (flagEl && flagSrc[lang]) flagEl.src = flagSrc[lang];

  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('text-primary', btn.dataset.lang === lang);
    btn.classList.toggle('text-on-surface-variant', btn.dataset.lang !== lang);
  });
}

function selectLang(lang) {
  setLang(lang);
  closeLangMenu();
}

function toggleLangMenu() {
  const menu    = document.getElementById('lang-menu');
  const chevron = document.getElementById('lang-chevron');
  const open    = !menu.classList.contains('hidden');
  if (open) {
    closeLangMenu();
  } else {
    menu.classList.remove('hidden');
    chevron.style.transform = 'rotate(180deg)';
  }
}

function closeLangMenu() {
  const menu    = document.getElementById('lang-menu');
  const chevron = document.getElementById('lang-chevron');
  menu.classList.add('hidden');
  chevron.style.transform = 'rotate(0deg)';
}

/* Close dropdown when clicking outside */
document.addEventListener('click', (e) => {
  const switcher = document.getElementById('lang-switcher');
  if (switcher && !switcher.contains(e.target)) closeLangMenu();
});

/* Reviews carousel — auto-scroll */

/* 3-D Scroll Reveal — Intersection Observer */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

/* Hero Parallax — depth layers at different speeds */
function initParallax() {
  const hero  = document.getElementById('hero');
  const line1 = document.querySelector('.hero-line-1');
  const line2 = document.querySelector('.hero-line-2');
  const line3 = document.querySelector('.hero-line-3');
  const desc  = document.querySelector('.hero-desc');
  const stats = document.querySelectorAll('.hero-stat');

  if (!hero || !line1) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = hero.offsetHeight;

        if (y <= h) {
          line1.style.transform = `translateY(${y * 0.18}px) translateZ(0)`;
          line2.style.transform = `translateY(${y * 0.28}px) translateZ(0)`;
          line3.style.transform = `translateY(${y * 0.38}px) translateZ(0)`;
          if (desc) desc.style.transform = `translateY(${y * 0.12}px) translateZ(0)`;
          stats.forEach((s, i) => {
            s.style.transform = `translateY(${y * (0.08 + i * 0.05)}px) translateZ(0)`;
          });
          const fade = Math.max(0, 1 - (y / h) * 1.6);
          const content = hero.querySelector('.relative.z-10');
          if (content) content.style.opacity = fade;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* Init */
document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
  initParallax();
});
