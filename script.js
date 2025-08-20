// ===== Helpers =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ===== Dark mode toggle (persisted) =====
(function themeInit() {
  const btn = $('#themeToggle');
  if (!btn) return;

  const saved = localStorage.getItem('theme'); // 'dark' | 'light' | null
  if (saved === 'dark') document.body.classList.add('dark');
  if (saved === 'light') document.body.classList.remove('dark');

  const setLabel = () => {
    btn.textContent = document.body.classList.contains('dark') ? 'Light' : 'Dark';
  };
  setLabel();

  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', mode);
    setLabel();
  });
})();

// ===== Smooth scroll fallback (CSS handles most) =====
$$('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href') || '';
    if (!id.startsWith('#')) return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== Sticky nav active link highlight =====
(function sectionObserver() {
  const sections = ['#Introduction', '#Projects', '#Experience', '#Skills']
    .map(id => $(id))
    .filter(Boolean);

  const linkFor = (id) => $(`.site-nav a[href="${id}"]`);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = '#' + entry.target.id;
      const link = linkFor(id);
      if (!link) return;
      if (entry.isIntersecting) {
        $$('.site-nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0.01 });

  sections.forEach(sec => io.observe(sec));
})();

// ===== Back to top button =====
(function backToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  const showAt = 400;
  window.addEventListener('scroll', () => {
    if (window.scrollY > showAt) btn.classList.add('show');
    else btn.classList.remove('show');
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===== Copy email button =====
(function copyEmail() {
  const btn = $('#copyEmail');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const email = btn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = 'Copy Email'), 1200);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = 'Copy Email'), 1200);
    }
  });
})();


// ===== Nav progress bar + circular progress on back-to-top =====
(function scrollProgress() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  // create the bar once
  let bar = document.getElementById('scrollProgress');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'scrollProgress';
    nav.appendChild(bar);
  }

  const btn = document.getElementById('backToTop');

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;

    // widen the nav bar
    bar.style.width = pct + '%';

    // fill the circular ring around the back-to-top button
    if (btn) btn.style.setProperty('--p', pct + '%');
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ===== Make Projects & Experience cards collapsible =====
(function collapsibles() {
  const cards = Array.from(
    document.querySelectorAll('#Projects .card, #Experience .card')
  );

  cards.forEach((card, idx) => {
    const header = card.querySelector('h3');
    if (!header) return;

    // Move everything *after* the <h3> into a wrapper we can toggle
    const contentNodes = [];
    let node = header.nextSibling;
    while (node) {
      const next = node.nextSibling;
      contentNodes.push(node);
      node = next;
    }
    const wrap = document.createElement('div');
    wrap.className = 'collapse-content';
    contentNodes.forEach(n => wrap.appendChild(n));
    card.appendChild(wrap);

    card.classList.add('collapsible');
    if (idx === 0) card.classList.add('open'); // first one open by default

    header.addEventListener('click', () => {
      card.classList.toggle('open');
    });
  });
})();
