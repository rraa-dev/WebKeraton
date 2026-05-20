/* ═══════════════════════════════════════════════════
   JIWA TEMPAT — script.js  (versi lengkap)
   Cursor · Loader · Navbar · Reveal · Lightbox · Zone Modal
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════
  //  LOADER
  // ══════════════════════════════════════
  const loader = document.getElementById('loader');
  document.body.style.overflow = 'hidden';

  function hideLoader() {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 150);
    });
  }

  window.addEventListener('load', () => setTimeout(hideLoader, 1200));
  setTimeout(hideLoader, 3000); // fallback


  // ══════════════════════════════════════
  //  CUSTOM CURSOR
  // ══════════════════════════════════════
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animateCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .gallery-item, .hierarki-card, .arsitek-item, .ring, .ring-center').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '16px'; cursor.style.height = '16px';
      follower.style.width = '50px'; follower.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '8px'; cursor.style.height = '8px';
      follower.style.width = '32px'; follower.style.height = '32px';
    });
  });


  // ══════════════════════════════════════
  //  NAVBAR SCROLL
  // ══════════════════════════════════════
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });


  // ══════════════════════════════════════
  //  MOBILE NAV TOGGLE
  // ══════════════════════════════════════
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(4px,4px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px,-4px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '';
      });
    });
  });


  // ══════════════════════════════════════
  //  INTERSECTION OBSERVER — REVEAL
  // ══════════════════════════════════════
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));


  // ══════════════════════════════════════
  //  ACTIVE NAV LINK ON SCROLL
  // ══════════════════════════════════════
  document.querySelectorAll('section[id]').forEach(sec => {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.4 }).observe(sec);
  });


  // ══════════════════════════════════════
  //  IMAGE ERROR HANDLING
  // ══════════════════════════════════════
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const ph = img.parentElement.querySelector('.photo-placeholder');
      if (ph) ph.style.opacity = '1';
    });
    img.addEventListener('load', () => {
      if (img.naturalWidth > 0) {
        img.style.display = 'block';
        img.style.opacity = '1';
        const ph = img.parentElement.querySelector('.photo-placeholder');
        if (ph) ph.style.display = 'none';
      }
    });
  });


  // ══════════════════════════════════════
  //  LIGHTBOX (galeri)
  // ══════════════════════════════════════
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose   = document.getElementById('lb-close');

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbCaption.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const cap = item.querySelector('.gallery-caption');
      if (img && img.complete && img.naturalWidth > 0) {
        openLightbox(img.src, cap ? cap.textContent : '');
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });


  // ══════════════════════════════════════
  //  ZONE MODAL — Diagram Konsentris
  // ══════════════════════════════════════
  const zoneModal       = document.getElementById('zone-modal');
  const zoneBackdrop    = document.getElementById('zone-modal-backdrop');
  const zoneClose       = document.getElementById('zone-modal-close');
  const zoneTitle       = document.getElementById('zone-modal-title');
  const zoneDesc        = document.getElementById('zone-modal-desc');
  const zonePhoto       = document.getElementById('zone-modal-photo');
  const zonePlaceholder = document.getElementById('zone-modal-placeholder');

  function openZoneModal(el) {
    const title = el.dataset.title;
    const desc  = el.dataset.desc;
    const photo = el.dataset.photo;
    if (!title) return;

    zoneTitle.textContent = title;
    zoneDesc.textContent  = desc || '';

    // Reset foto dulu
    zonePhoto.style.display       = 'none';
    zonePlaceholder.style.display = 'flex';

    if (photo) {
      const testImg = new Image();
      testImg.onload = () => {
        zonePhoto.src = photo;
        zonePhoto.style.display = 'block';
        zonePlaceholder.style.display = 'none';
      };
      testImg.onerror = () => {
        zonePhoto.style.display = 'none';
        zonePlaceholder.style.display = 'flex';
      };
      testImg.src = photo;
    }

    zoneModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeZoneModal() {
    zoneModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Pasang event ke semua ring & ring-center yang punya data-title
  document.querySelectorAll('.ring[data-title], .ring-center[data-title]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      openZoneModal(el);
    });
  });

  zoneClose.addEventListener('click', closeZoneModal);
  zoneBackdrop.addEventListener('click', closeZoneModal);


  // ══════════════════════════════════════
  //  ESCAPE KEY — tutup semua modal/lightbox
  // ══════════════════════════════════════
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeZoneModal();
    }
  });


  // ══════════════════════════════════════
  //  PARALLAX HERO
  // ══════════════════════════════════════
  const heroImg = document.getElementById('hero-img');
  window.addEventListener('scroll', () => {
    if (!heroImg) return;
    if (window.scrollY < window.innerHeight) {
      heroImg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.15}px)`;
    }
  }, { passive: true });


  // ══════════════════════════════════════
  //  SMOOTH SCROLL
  // ══════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  console.log('%c꧁ Jiwa Tempat — Keraton Yogyakarta ꧂',
    'color:#c9a84c; font-family:serif; font-size:1.2rem; padding:8px;');
  console.log('%cTaruh foto di folder photos/ sesuai README.md',
    'color:#8a6520; font-size:0.85rem;');

});