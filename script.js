/* ===== BRAND COLORS (change them once here and the whole site updates) ===== */
:root {
  --blue: #5BBCF2;          /* light blue */
  --blue-soft: #EAF6FE;     /* very light blue backgrounds */
  --green: #2FCB7E;         /* green */
  --green-dark: #1FA862;
  --white: #FFFFFF;
  --ink: #0F1B2D;           /* main text (deep navy) */
  --muted: #5F6C7B;         /* secondary text */
  --line: #E3E9EF;          /* borders */
  --gold: #F5B83D;          /* accent: gold tier */
  --silver: #9AA7B5;        /* accent: silver tier */
  --diamond: #7C6CF2;       /* accent: diamond tier */
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: var(--ink);
  background: var(--white);
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }

/* ===== NAV ===== */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 5vw;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  transition: box-shadow 0.3s;
}
.nav.scrolled { box-shadow: 0 1px 0 var(--line); }

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: -0.01em;
}
.logo-img { height: 38px; width: auto; display: block; }

.nav-links { display: flex; align-items: center; gap: 28px; font-size: 0.95rem; font-weight: 500; }
.nav-links a:hover { color: var(--green-dark); }
.nav-cta {
  background: var(--ink);
  color: var(--white);
  padding: 9px 18px;
  border-radius: 999px;
}
.nav-cta:hover { color: var(--white) !important; background: var(--green-dark); }

/* ===== HERO ===== */
.hero {
  text-align: center;
  padding: 190px 6vw 130px;
  background:
    radial-gradient(900px 400px at 20% 0%, rgba(91, 188, 242, 0.35), transparent 70%),
    radial-gradient(800px 400px at 85% 10%, rgba(47, 203, 126, 0.25), transparent 70%),
    var(--white);
}
.eyebrow {
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--green-dark);
  margin: 0 0 18px;
}
.hero h1 {
  font-size: clamp(2.8rem, 7vw, 5.2rem);
  line-height: 1.05;
  letter-spacing: -0.035em;
  font-weight: 800;
  max-width: 900px;
  margin: 0 auto 24px;
}
.grad {
  background: linear-gradient(90deg, var(--blue), var(--green));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.lead {
  font-size: clamp(1.15rem, 2vw, 1.45rem);
  color: var(--muted);
  max-width: 640px;
  margin: 0 auto 36px;
}
.hero-buttons { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

/* ===== BUTTONS ===== */
.btn {
  display: inline-block;
  padding: 14px 30px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1rem;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  cursor: pointer;
}
.btn:hover { transform: translateY(-2px); }
.btn-primary {
  background: linear-gradient(90deg, var(--blue), var(--green));
  color: var(--ink);
  box-shadow: 0 8px 24px rgba(47, 203, 126, 0.3);
}
.btn-ghost { border: 1.5px solid var(--ink); }
.btn-ghost:hover { background: var(--ink); color: var(--white); }
.btn-outline { border: 1.5px solid var(--blue); color: #1B8BC4; }
.btn-outline:hover { background: var(--blue-soft); }

/* ===== SECTIONS ===== */
.section { padding: 110px 6vw; max-width: 1200px; margin: 0 auto; text-align: center; }
.section h2 {
  font-size: clamp(2.2rem, 4.5vw, 3.4rem);
  letter-spacing: -0.03em;
  line-height: 1.1;
  font-weight: 800;
  margin: 0 0 14px;
}
.section-sub { font-size: 1.25rem; color: var(--muted); margin: 0 auto 56px; max-width: 600px; }

.section-tint { max-width: none; background: var(--blue-soft); }
.section-tint > * { max-width: 1100px; margin-left: auto; margin-right: auto; }

/* ===== FEATURES ===== */
.feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.feature {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 36px 28px;
  text-align: left;
}
.icon { font-size: 2.2rem; margin-bottom: 14px; }
.feature h3 { font-size: 1.35rem; margin: 0 0 8px; letter-spacing: -0.02em; }
.feature p { margin: 0; color: var(--muted); font-size: 1.05rem; }

/* ===== PRICING COMPARISON (Apple-style) ===== */
.compare { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: stretch; }

.plan {
  position: relative;
  background: var(--white);
  border-radius: 28px;
  padding: 44px 30px 34px;
  text-align: center;
  box-shadow: 0 2px 20px rgba(15, 27, 45, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}
.plan.reveal.visible:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(15, 27, 45, 0.12); }
.plan.popular { border: 2px solid var(--green); }

.badge {
  position: absolute;
  top: -14px; left: 50%;
  transform: translateX(-50%);
  background: var(--green);
  color: var(--white);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 999px;
  white-space: nowrap;
}

.plan-name { font-size: 1.6rem; font-weight: 700; margin: 0 0 6px; letter-spacing: -0.02em; }
.plan-name.silver { color: var(--silver); }
.plan-name.gold { color: var(--gold); }
.plan-name.diamond { color: var(--diamond); }

.plan-price { font-size: 3rem; font-weight: 800; letter-spacing: -0.04em; margin: 0 0 22px; line-height: 1.1; }
.plan-price span { font-size: 1rem; font-weight: 500; color: var(--muted); letter-spacing: 0; }

.rows { list-style: none; padding: 0; margin: 30px 0 0; text-align: center; }
.rows li { padding: 16px 0; border-top: 1px solid var(--line); min-height: 92px; display: flex; flex-direction: column; justify-content: center; }
.label { display: block; font-size: 0.85rem; color: var(--muted); margin-bottom: 4px; }
.value { display: block; font-size: 1.2rem; font-weight: 600; }
.value.yes { color: var(--green-dark); font-size: 1.6rem; }
.value.no { color: #C5CDD6; font-size: 1.6rem; }

.fine-print { margin-top: 32px !important; font-size: 0.95rem; color: var(--muted); }

/* ===== CONTACT ===== */
.contact-card {
  background: var(--ink);
  color: var(--white);
  border-radius: 28px;
  padding: 50px 30px;
  max-width: 560px;
  margin: 0 auto;
}
.contact-card p { margin: 0 0 22px; font-size: 1.15rem; }
.contact-card strong { color: var(--blue); font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; }
.contact-card a:not(.btn):hover { color: var(--green); }

/* ===== FOOTER ===== */
footer { text-align: center; padding: 36px 20px; color: var(--muted); font-size: 0.95rem; border-top: 1px solid var(--line); }
footer p { margin: 0; }

/* ===== SCROLL ANIMATION ===== */
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.visible { opacity: 1; transform: none; }

/* ===== MOBILE ===== */
@media (max-width: 900px) {
  body { font-size: 17px; }
  .feature-grid, .compare { grid-template-columns: 1fr; }
  .nav-links a:not(.nav-cta) { display: none; }
  .hero { padding: 150px 6vw 90px; }
  .section { padding: 80px 6vw; }
  .rows li { min-height: 0; }
}
