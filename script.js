/* ═══════════════════════════════════════════════════════
   DESAF-IA — Playbook Web
   script.js
═══════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────
   1. MATRIX RAIN ANIMATION (cyan/blue — mismo estilo landing)
───────────────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01アβΩΔΨΦΛ∑∞≠≈∂∇ξψωφ◆◇▲△▼▽⬡⬢⬟ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩabcdefghijklmnopqrstuvwxyz0123456789'.split('');
  const FONT_SIZE = 14;
  let cols, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / FONT_SIZE);
    drops = Array.from({ length: cols }, () => Math.random() * -canvas.height / FONT_SIZE | 0);
  }

  function draw() {
    // Fade trail
    ctx.fillStyle = 'rgba(2, 10, 25, 0.07)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = FONT_SIZE + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = CHARS[Math.random() * CHARS.length | 0];
      const y    = drops[i] * FONT_SIZE;

      // Head: white with cyan glow
      if (drops[i] > 0) {
        ctx.shadowColor = '#00ccff';
        ctx.shadowBlur  = 24;
        ctx.fillStyle   = '#ffffff';
        ctx.fillText(char, i * FONT_SIZE, y);
        ctx.fillText(char, i * FONT_SIZE, y);
        ctx.shadowBlur  = 0;
      }

      // Body: cyan-blue range
      const hue = 195 + Math.random() * 35;
      const lgt = 70  + Math.random() * 22;
      ctx.shadowColor = `hsl(${hue}, 100%, 80%)`;
      ctx.shadowBlur  = 14;
      ctx.fillStyle   = `hsl(${hue}, 100%, ${lgt}%)`;
      const bodyChar = CHARS[Math.random() * CHARS.length | 0];
      ctx.fillText(bodyChar, i * FONT_SIZE, y - FONT_SIZE);
      ctx.fillText(bodyChar, i * FONT_SIZE, y - FONT_SIZE);
      ctx.shadowBlur  = 0;

      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 40); // ~25 fps
})();


/* ─────────────────────────────────────────────────────
   2. SCROLL PROGRESS BAR
───────────────────────────────────────────────────── */
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const doc    = document.documentElement;
    const total  = doc.scrollHeight - doc.clientHeight;
    const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
})();


/* ─────────────────────────────────────────────────────
   3. NAVBAR — glass on scroll + active link
───────────────────────────────────────────────────── */
(function () {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('section[id], div[id]'));

  function onScroll() {
    // Glass effect
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    const scrollMid = window.scrollY + window.innerHeight * 0.4;
    let current = '';

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollMid) {
        current = sec.id;
      }
    });

    links.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ─────────────────────────────────────────────────────
   4. HAMBURGER MENU
───────────────────────────────────────────────────── */
(function () {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    links.classList.toggle('open', open);
  });

  // Close on link click (mobile)
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();


/* ─────────────────────────────────────────────────────
   5. DROPDOWNS DE NAVEGACIÓN (click-based)
───────────────────────────────────────────────────── */
(function () {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  if (!dropdowns.length) return;

  function closeAll(except) {
    dropdowns.forEach(d => { if (d !== except) d.classList.remove('open'); });
  }

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('a');
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      closeAll(null);
      if (!isOpen) dropdown.classList.add('open');
    });
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', () => closeAll(null));

  // Cerrar al navegar a un link dentro del dropdown
  document.querySelectorAll('.nav-dropdown-menu a').forEach(a => {
    a.addEventListener('click', () => closeAll(null));
  });
})();


/* ─────────────────────────────────────────────────────
   6. SCROLL REVEAL ANIMATIONS
───────────────────────────────────────────────────── */
(function () {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger cards in a grid
          const delay = entry.target.closest('.cards-grid, .tools-grid, .prompts-grid, .pasos-cierre')
            ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
            : 0;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────────────────
   6. BACK TO TOP BUTTON
───────────────────────────────────────────────────── */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
})();


/* ─────────────────────────────────────────────────────
   7. COPY TO CLIPBOARD — copyPrompt(button)
   Uso: onclick="copyPrompt(this)" + data-target="id-del-pre"
───────────────────────────────────────────────────── */
function copyPrompt(btn) {
  const targetId = btn.getAttribute('data-target');
  const pre = document.getElementById(targetId);
  if (!pre) return;

  const text = pre.textContent;
  const span = btn.querySelector('span');
  const originalText = span ? span.textContent : btn.textContent;

  const success = () => {
    btn.classList.add('copied');
    if (span) span.textContent = '¡Copiado!';
    else btn.textContent = '¡Copiado!';

    setTimeout(() => {
      btn.classList.remove('copied');
      if (span) span.textContent = originalText;
      else btn.textContent = originalText;
    }, 2000);
  };

  // Modern API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(success).catch(() => fallbackCopy(text, success));
  } else {
    fallbackCopy(text, success);
  }
}

function fallbackCopy(text, callback) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity  = '0';
  ta.style.top = '0';
  ta.style.left = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    callback();
  } catch (e) {
    console.warn('Copy failed', e);
  }
  document.body.removeChild(ta);
}


/* ─────────────────────────────────────────────────────
   8. SMOOTH SCROLL for anchor links (fallback for old browsers)
───────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────────────────────
   9. 3D CARD FLIP — toggle para mobile / touch
───────────────────────────────────────────────────── */
(function () {
  document.querySelectorAll('.tool-scene').forEach(function (scene) {
    scene.addEventListener('click', function (e) {
      if (e.target.closest('.btn-back-cta')) return; // deja que el href navegue
      scene.classList.toggle('flipped');
    });
  });
})();


/* ─────────────────────────────────────────────────────
   10. HIGHLIGHT ACTIVE PROMPT ON HOVER (subtle glow)
───────────────────────────────────────────────────── */
(function () {
  document.querySelectorAll('.prompt-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 8px 32px rgba(124, 58, 237, 0.15)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });
})();
