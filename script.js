/* ═══════════════════════════════════════
   OPTION 1: SUPER FUN — script.js
   ═══════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Mobile Nav ── */
  var hamburger = document.getElementById('hamburger-btn');
  var navMenu = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      var open = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!open));
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('.nav-link').forEach(function (l) {
      l.addEventListener('click', function () {
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
      });
    });
  }

  /* ── Navbar scroll ── */
  var header = document.querySelector('.site-header');
  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var t = document.querySelector(id);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── Modal ── */
  var modal = document.getElementById('work-modal');
  var modalTitle = modal ? modal.querySelector('.modal-show-title') : null;
  var modalRole = modal ? modal.querySelector('.modal-show-role') : null;
  var modalVideoContainer = document.getElementById('modal-video-container');
  var modalNoVideo = document.getElementById('modal-no-video');
  var modalCloseBtn = document.getElementById('modal-close-btn');
  var lastFocused = null;

  function openModal(show, role, videoUrl) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modalTitle.textContent = show;
    modalRole.textContent = role || 'Character Animator';

    if (videoUrl) {
      modalVideoContainer.innerHTML =
        '<div class="video-container"><iframe src="' + videoUrl + '" ' +
        'allow="autoplay; fullscreen; picture-in-picture" allowfullscreen ' +
        'title="' + show + ' reel"></iframe></div>';
      modalVideoContainer.style.display = '';
      modalNoVideo.classList.remove('active');
    } else {
      modalVideoContainer.innerHTML = '';
      modalVideoContainer.style.display = 'none';
      modalNoVideo.classList.add('active');
    }

    modal.removeAttribute('hidden');
    void modal.offsetWidth;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (modalCloseBtn) modalCloseBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function () {
      modal.setAttribute('hidden', '');
      modalVideoContainer.innerHTML = '';
    }, 400);
    if (lastFocused) lastFocused.focus();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
  });

  // Reel link inside modal
  var reelLink = modal ? modal.querySelector('.modal-reel-link') : null;
  if (reelLink) reelLink.addEventListener('click', closeModal);

  // Card triggers
  document.querySelectorAll('.work-card-btn:not(.work-card-link)').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var show = this.getAttribute('data-show') || '';
      var role = this.getAttribute('data-role') || '';
      var video = this.getAttribute('data-video') || '';
      openModal(show, role, video);
    });
  });

  /* ── Scroll Reveal ── */
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ── Confetti Burst (on hero button click) ── */
  var canvas = document.getElementById('confetti-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var running = false;

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    function Particle(x, y) {
      this.x = x; this.y = y;
      this.vx = (Math.random() - 0.5) * 16;
      this.vy = Math.random() * -14 - 4;
      this.size = Math.random() * 8 + 4;
      this.color = ['#ff6b9d','#a855f7','#fbbf24','#2dd4bf','#60a5fa','#fb923c'][Math.floor(Math.random()*6)];
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 12;
      this.life = 1;
    }

    function burst(x, y) {
      for (var i = 0; i < 60; i++) particles.push(new Particle(x, y));
      if (!running) { running = true; animate(); }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.35; p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.life -= 0.012;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      if (particles.length > 0) requestAnimationFrame(animate);
      else running = false;
    }

    // Trigger on primary button clicks
    document.querySelectorAll('.btn-primary').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        burst(e.clientX, e.clientY);
      });
    });
  }

  /* ── Year ── */
  var y = document.getElementById('footer-year');
  if (y) y.textContent = new Date().getFullYear();

})();
