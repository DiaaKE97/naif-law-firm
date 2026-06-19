/* ═══════════════════════════════════════════════
   SCRIPT.JS – مكتب نايف الفهدان للمحاماة
═══════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────
   1. CANVAS BACKGROUND — golden geometric lines
───────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W,
    H,
    nodes = [],
    animId;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createNodes(count) {
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      });
    }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Move nodes
    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Draw connections
    const maxDist = 180;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212, 175, 55, 0.25)";
      ctx.fill();
    });

    animId = requestAnimationFrame(drawFrame);
  }

  function init() {
    resize();
    createNodes(55);
    if (animId) cancelAnimationFrame(animId);
    drawFrame();
  }

  window.addEventListener("resize", () => {
    resize();
    createNodes(55);
  });

  init();
})();

/* ─────────────────────────────────────────
   2. FLOATING PARTICLES
───────────────────────────────────────── */
(function initParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  const count = 28;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";

    const size = Math.random() * 2.5 + 1;
    const left = Math.random() * 100;
    const delay = Math.random() * 18;
    const duration = Math.random() * 15 + 12;
    const opacity = Math.random() * 0.5 + 0.2;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      opacity: 0;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      filter: blur(${Math.random() > 0.7 ? "1px" : "0px"});
    `;

    container.appendChild(p);
  }
})();

/* ─────────────────────────────────────────
   3. NAVBAR — scroll behaviour & hamburger
───────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (!navbar) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    },
    { passive: true },
  );

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close on link click
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
        document.body.style.overflow = "";
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }
})();

/* ─────────────────────────────────────────
   4. SCROLL REVEAL — intersection observer
───────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  revealEls.forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────────
   5. SCROLL TO TOP BUTTON
───────────────────────────────────────── */
(function initScrollTop() {
  const btn = document.getElementById("scrollTop");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 500) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    },
    { passive: true },
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ─────────────────────────────────────────
   6. CONTACT FORM — submit handler
───────────────────────────────────────── */
(function initForm() {
  const form = document.getElementById("consultForm");
  const success = document.getElementById("formSuccess");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Loading state
    btn.disabled = true;
    btn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';

    // Simulate async submit (replace with real endpoint)
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;

      if (success) {
        success.classList.add("show");
        form.reset();
        setTimeout(() => success.classList.remove("show"), 5000);
      }
    }, 1500);
  });
})();

/* ─────────────────────────────────────────
   7. HERO PARALLAX — subtle mouse parallax
───────────────────────────────────────── */
(function initParallax() {
  const heroGlow = document.querySelector(".hero-bg-glow");
  if (!heroGlow) return;

  let rafId;
  document.addEventListener("mousemove", (e) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const xRatio = (e.clientX / window.innerWidth - 0.5) * 30;
      const yRatio = (e.clientY / window.innerHeight - 0.5) * 20;
      heroGlow.style.transform = `translate(${xRatio}px, ${yRatio}px)`;
    });
  });
})();

/* ─────────────────────────────────────────
   8. ACTIVE NAV LINK — highlight on scroll
───────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navAs = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navAs.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAs.forEach((a) => {
            a.style.color =
              a.getAttribute("href") === `#${id}` ? "var(--gold)" : "";
          });
        }
      });
    },
    {
      rootMargin: "-40% 0px -55% 0px",
    },
  );

  sections.forEach((s) => observer.observe(s));
})();

/* ─────────────────────────────────────────
   9. SERVICE CARDS — hover glow effect
───────────────────────────────────────── */
// (function initCardGlow() {
//   const cards = document.querySelectorAll('.service-card, .why-card');

//   cards.forEach(card => {
//     card.addEventListener('mousemove', (e) => {
//       const rect = card.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212,175,55,0.07), var(--bg-card-hover) 60%)`;
//     });

//     card.addEventListener('mouseleave', () => {
//       card.style.background = '';
//     });
//   });
// })();

/* ─────────────────────────────────────────
   10. COUNTER ANIMATION — hero stats
───────────────────────────────────────── */
(function initCounters() {
  const statNums = document.querySelectorAll(".stat-num");
  if (!statNums.length) return;

  function animateCounter(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.textContent;
          const num = parseInt(raw.replace(/\D/g, ""));
          const suffix = raw.replace(/[\d]/g, "");
          animateCounter(el, num, suffix);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  statNums.forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────────
   11. SMOOTH ANCHOR SCROLL (enhanced)
───────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navH = document.getElementById("navbar")?.offsetHeight || 80;
      const top =
        target.getBoundingClientRect().top + window.scrollY - navH - 10;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();

/* ─────────────────────────────────────────
   12. LOGO INIT — ensure gold filter
───────────────────────────────────────── */
(function initLogo() {
  // Logo images are already styled via CSS; no JS needed
  // But add a small entrance animation
  const logos = document.querySelectorAll(".logo-img");
  logos.forEach((img) => {
    img.addEventListener("load", () => {
      img.style.opacity = "1";
    });
    // If already loaded
    if (img.complete) img.style.opacity = "1";
  });
})();

/* ─────────────────────────────────────────
   13. PROCESS STEPS — sequential reveal
───────────────────────────────────────── */
(function initProcessReveal() {
  const steps = document.querySelectorAll(".process-step");
  if (!steps.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      let delay = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);
          delay += 180;
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  steps.forEach((s) => observer.observe(s));
})();

/* ─────────────────────────────────────────
   14. REGISTRATION SEAL — pause on hover
───────────────────────────────────────── */
(function initSeal() {
  const seal = document.querySelector(".reg-seal");
  if (!seal) return;

  seal.addEventListener("mouseenter", () => {
    seal.style.animationPlayState = "paused";
  });
  seal.addEventListener("mouseleave", () => {
    seal.style.animationPlayState = "running";
  });
})();

/* ─────────────────────────────────────────
   15. BACK-TO-TOP SMOOTH + PROGRESS
───────────────────────────────────────── */
(function initScrollProgress() {
  // Create a thin gold progress bar at top
  const bar = document.createElement("div");
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(to right, #A8862A, #D4AF37, #F0D98A);
    z-index: 9999;
    transition: width 0.1s;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + "%";
    },
    { passive: true },
  );
})();
