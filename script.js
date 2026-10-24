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

/* ===== LOGO SAFETY NET: shows a built-in copy if logo.png / logo.webp are missing from the site ===== */
const LOGO_FALLBACK = 'data:image/webp;base64,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';
document.querySelectorAll('img[src="/logo.png"]').forEach((img) => {
  const fix = () => {
    const p = img.closest('picture');
    if (p) p.querySelectorAll('source').forEach((s) => s.remove());
    img.src = LOGO_FALLBACK;
  };
  if (img.complete && img.naturalWidth === 0) fix(); else img.addEventListener('error', fix, { once: true });
});

/* ===== PREMIUM SCROLL EFFECTS ===== */
(function () {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const prog = $('progress');
  const hero = document.querySelector('.hero');
  const tl = document.querySelector('.timeline');
  const steps = [...document.querySelectorAll('.step')];
  const shapes = [...document.querySelectorAll('[data-parallax]')];
  let queued = false;

  function frame() {
    const s = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (max > 0 ? s / max : 0) + ')';
    if (tl) {
      const r = tl.getBoundingClientRect();
      const p = clamp((window.innerHeight * 0.65 - r.top) / r.height, 0, 1);
      tl.style.setProperty('--tp', p);
      steps.forEach((st, i) => st.classList.toggle('on', p >= i / steps.length + 0.02));
    }
    if (reduce) return;
    if (hero) hero.style.setProperty('--hp', clamp(s / (hero.offsetHeight * 0.9), 0, 1));
    shapes.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      const off = r.top + r.height / 2 - window.innerHeight / 2;
      const sp = parseFloat(el.dataset.parallax);
      el.style.translate = '0 ' + (-off * sp) + 'px';
      el.style.rotate = (off * sp * 0.25) + 'deg';
    });
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(() => { frame(); queued = false; }); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  frame();

  // 3D tilt + glow following the pointer on glass cards
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.tilt').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--mx', (px + 0.5) * 100 + '%');
        el.style.setProperty('--my', (py + 0.5) * 100 + '%');
        const m = Math.hypot(px, py);
        if (m > 0.001) el.style.rotate = (py * 2) + ' ' + (-px * 2) + ' 0 ' + (m * 10) + 'deg';
      });
      el.addEventListener('pointerleave', () => { el.style.rotate = ''; });
    });
  }

  // Count-up numbers (cost per video, channel stats)
  const counters = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      const el = e.target;
      const to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0);
      const fmt = (v) => (el.dataset.prefix || '') + v.toFixed(dec) + (el.dataset.suffix || '');
      if (reduce) { el.textContent = fmt(to); return; }
      const t0 = performance.now(), dur = 1400;
      (function step(t) {
        const k = clamp((t - t0) / dur, 0, 1);
        el.textContent = fmt(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }), { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }
})();
