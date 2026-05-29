/* ============================================================
   MENÚ HAMBURGUESA MOBILE — Animación GSAP premium
   ============================================================ */

(function () {
  'use strict';

  const hamburger = document.querySelector('.header__hamburger');
  const menu = document.querySelector('.mobile-menu');
  const links = document.querySelectorAll('.mobile-menu__link');
  const cta = document.querySelector('.mobile-menu__cta');
  const footer = document.querySelector('.mobile-menu__footer');
  const bg = document.querySelector('.mobile-menu__bg');

  if (!hamburger || !menu) return;

  let isOpen = false;
  let menuTimeline;

  /* Construir timeline una sola vez */
  function buildTimeline() {
    menuTimeline = gsap.timeline({ paused: true });

    /* Overlay background */
    menuTimeline.set(menu, { display: 'flex' });
    menuTimeline.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' });

    /* Links — stagger desde abajo */
    menuTimeline.fromTo(links, 
      { y: 32, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
      '-=0.15'
    );

    /* CTA */
    menuTimeline.fromTo(cta, 
      { y: 24, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.2'
    );

    /* Footer social */
    menuTimeline.fromTo(footer, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.1'
    );

    /* Ocultar al final del reverse */
    menuTimeline.eventCallback('onReverseComplete', () => {
      menu.style.display = 'none';
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  function open() {
    isOpen = true;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Cerrar menú');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    menuTimeline.play();
  }

  function close() {
    isOpen = false;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menú');
    menuTimeline.reverse();
  }

  function toggle() {
    isOpen ? close() : open();
  }

  hamburger.addEventListener('click', toggle);

  /* Cerrar al clickear un link */
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      close();
      /* Permitir navegación con scroll suave */
      const target = link.getAttribute('href');
      if (target && target.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) {
          /* Pequeño delay para que el menú se cierre primero */
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 400);
        }
      }
    });
  });

  /* CTA también cierra el menú */
  if (cta) {
    cta.addEventListener('click', (e) => {
      close();
      const target = cta.getAttribute('href');
      if (target && target.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 400);
        }
      }
    });
  }

  /* Cerrar con tecla Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });

  /* Construir timeline después de que GSAP esté listo */
  if (typeof gsap !== 'undefined') {
    buildTimeline();
  } else {
    /* Fallback si GSAP tarda — el script de animaciones lo carga */
    window.addEventListener('load', () => {
      if (typeof gsap !== 'undefined') buildTimeline();
    });
  }
})();
