/* ===== SETTINGS ===== */
// Google Analytics 4 Measurement ID. This is a PUBLIC id (not a secret). Leave as-is to keep analytics off.
const GA_ID = 'G-XXXXXXXXXX'; // CHANGE THIS

const $ = (id) => document.getElementById(id);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== NAV ===== */
const nav = $('nav');
const menuBtn = $('menu-btn');
const links = $('nav-links');
if (menuBtn && links) {
  menuBtn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    links.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));
}
const y = $('year');
if (y) y.textContent = new Date().getFullYear();

/* ===== SCROLL: nav line, reveal, parallax orbs ===== */
const orbs = document.querySelectorAll('.orb');
let ticking = false;
function onScroll() {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
  if (!reduce && !ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      const s = window.scrollY;
      orbs.forEach((o, i) => { o.style.translate = '0 ' + (s * (0.08 + i * 0.05)) + 'px'; });
      ticking = false;
    });
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const delay = [...items].indexOf(e.target) % 3 * 120;
        setTimeout(() => e.target.classList.add('visible'), delay);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('visible'));
}

/* ===== HERO TILT (follows the pointer) ===== */
const hv = $('hero-visual');
if (hv && !reduce && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (e) => {
    const dx = (e.clientX / window.innerWidth - 0.5) * 14;
    const dy = (e.clientY / window.innerHeight - 0.5) * 14;
    hv.style.transform = 'perspective(900px) rotateY(' + dx + 'deg) rotateX(' + (-dy) + 'deg)';
  });
}

/* ===== COOKIE CONSENT + ANALYTICS ===== */
const KEY = 'cfm_consent';
const banner = $('cookie');
function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
function loadAnalytics() {
  if (!GA_ID || GA_ID === 'G-XXXXXXXXXX' || window.__gaLoaded) return;
  window.__gaLoaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}
function decide(v) {
  store(v);
  if (banner) banner.hidden = true;
  if (v === 'accepted') loadAnalytics();
}
if (banner) {
  const saved = read();
  if (saved === 'accepted') loadAnalytics();
  else if (!saved) banner.hidden = false;
  $('cookie-accept').addEventListener('click', () => decide('accepted'));
  $('cookie-decline').addEventListener('click', () => decide('declined'));
}
const cs = $('cookie-settings');
if (cs) cs.addEventListener('click', () => { if (banner) banner.hidden = false; else alert('Cookie settings are on the home page.'); });

/* ===== CONTACT FORM: validation + spam protection ===== */
const form = $('contact-form');
if (form) {
  const loadedAt = Date.now();
  const status = $('form-status');
  const rules = {
    name: (v) => (v.trim().length < 2 ? 'Please enter your name.' : ''),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'),
    message: (v) => (v.trim().length < 10 ? 'Please write at least a sentence (10+ characters).' : ''),
  };
  const ids = { name: 'f-name', email: 'f-email', message: 'f-msg' };

  function setErr(key, msg, inputId) {
    $('e-' + key).textContent = msg;
    const el = $(inputId);
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
  }
  function validate() {
    let first = null;
    for (const k in rules) {
      const msg = rules[k](form.elements[k].value);
      setErr(k === 'message' ? 'msg' : k, msg, ids[k]);
      if (msg && !first) first = $(ids[k]);
    }
    const okC = $('f-consent').checked;
    setErr('consent', okC ? '' : 'Please agree to continue.', 'f-consent');
    if (!okC && !first) first = $('f-consent');
    if (first) first.focus();
    return !first;
  }
  Object.keys(ids).forEach((k) => $(ids[k]).addEventListener('blur', () => setErr(k === 'message' ? 'msg' : k, rules[k](form.elements[k].value), ids[k])));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'status full'; status.textContent = '';
    if (!validate()) return;
    // Spam checks: hidden honeypot filled, or form submitted impossibly fast
    if (form.elements['bot-field'].value || Date.now() - loadedAt < 3000) {
      status.textContent = 'Thanks! We will be in touch soon.'; status.classList.add('ok');
      return;
    }
    const btn = $('send'); btn.disabled = true; btn.textContent = 'Sending...';
    try {
      const body = new URLSearchParams(new FormData(form)).toString();
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      if (!res.ok) throw new Error('bad response');
      form.reset();
      status.textContent = 'Thanks! Your message was sent. We will reply soon.'; status.classList.add('ok');
    } catch (err) {
      status.textContent = 'Something went wrong. Please try again or email us directly.'; status.classList.add('bad');
    }
    btn.disabled = false; btn.textContent = 'Send message';
  });
}
