/* ============================================================
   FEATURE MODAL — GSAP FLIP shared element transition
   ============================================================ */

(function () {
  const featureData = {
    '01': {
      title: '40hr de Batería',
      specs: [
        '8hr de reproducción continua por carga',
        '32hr adicionales del case de carga',
        'Carga rápida: 10 min = 4hr de reproducción',
        'USB-C — carga completa en 90 min'
      ]
    },
    '02': {
      title: 'Cancelación Activa de Ruido',
      specs: [
        'ANC híbrido feedforward + feedback',
        'Reducción de ruido: hasta 35dB',
        'Modo Transparencia — escuchá tu entorno sin sacarlos',
        '6 micrófonos beamforming para llamadas claras'
      ]
    },
    '03': {
      title: 'Audio Espacial',
      specs: [
        'Audio 3D con seguimiento dinámico de cabeza',
        'Drivers de 40mm personalizados para graves profundos',
        'Ecualización adaptativa según el ajuste del oído',
        'Compatible con todos los servicios de streaming'
      ]
    },
    '04': {
      title: 'Controles Táctiles',
      specs: [
        'Toque único: play/pausa/responder llamada',
        'Toque doble: siguiente pista',
        'Toque triple: pista anterior',
        'Deslizá arriba/abajo: subir/bajar volumen'
      ]
    },
    '05': {
      title: 'Carga Inalámbrica',
      specs: [
        'Estándar Qi — compatible con cualquier cargador inalámbrico',
        '3 cargas completas de los auriculares desde el case',
        'Case que carga también tu teléfono',
        'Indicador LED de batería en el case'
      ]
    },
    '06': {
      title: 'Policarbonato microestructurado + silicona médica',
      specs: [
        '5.3g por auricular — apenas pesan',
        'Silicona médica hipoalergénica para uso prolongado',
        '3 pares de ear tips (S/M/L) para el ajuste perfecto',
        'Resistentes al sudor y lluvia — IPX5'
      ]
    }
  };

  const modal = document.getElementById('feature-modal');
  if (!modal) return;

  const modalOverlay = modal.querySelector('.feature-modal__overlay');
  const modalContent = modal.querySelector('.feature-modal__content');
  const modalIcon = modal.querySelector('[data-modal-icon]');
  const modalNumber = modal.querySelector('[data-modal-number]');
  const modalTitle = modal.querySelector('[data-modal-title]');
  const modalDesc = modal.querySelector('[data-modal-desc]');
  const modalSpecs = modal.querySelector('[data-modal-specs]');
  const modalCloseBtn = modal.querySelector('.feature-modal__close');

  let currentModalId = null;
  let modalOpenTl = null;
  let isModalAnimating = false;

  /* Scrollbar compensation */
  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function lockBodyScroll() {
    const scrollbarW = getScrollbarWidth();
    if (scrollbarW > 0) {
      document.body.style.paddingRight = scrollbarW + 'px';
      const header = document.querySelector('.header');
      if (header) header.style.paddingRight = scrollbarW + 'px';
    }
    document.body.style.overflow = 'hidden';
  }

  function unlockBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    const header = document.querySelector('.header');
    if (header) header.style.paddingRight = '';
  }

  /* --- Abrir modal ---
     Desktop: la card crece EN SU LUGAR desde su centro (transformOrigin center).
     Mobile: modal centrado con scale-in suave.
     Contenido existente se respeta, specs aparecen debajo. --- */
  function openModal(id) {
    if (isModalAnimating || currentModalId) return;

    const card = document.querySelector(`[data-modal-id="${id}"]`);
    if (!card) return;

    if (modalOpenTl) modalOpenTl.kill();
    isModalAnimating = true;

    const cardRect = card.getBoundingClientRect();
    const cardIcon = card.querySelector('.feature-card__icon');
    const cardDescEl = card.querySelector('.feature-card__desc');
    const cardShortDesc = cardDescEl ? cardDescEl.textContent.trim() : '';
    const isMobile = window.innerWidth <= 767;

    const data = featureData[id];

    /* Clonar el SVG completo — no solo innerHTML (sin wrapper no renderiza) */
    modalIcon.innerHTML = '';
    if (cardIcon) {
      const svgClone = cardIcon.cloneNode(true);
      svgClone.removeAttribute('class');
      svgClone.setAttribute('width', '100%');
      svgClone.setAttribute('height', '100%');
      modalIcon.appendChild(svgClone);
    }
    modalNumber.textContent = id;
    modalTitle.textContent = data.title;
    modalDesc.textContent = cardShortDesc;
    modalSpecs.innerHTML = data.specs.map(s => `<li>${s}</li>`).join('');

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    lockBodyScroll();

    if (isMobile) {
      /* Mobile: flexbox centrado — sin position fixed */
      modalContent.style.position = '';
      modalContent.style.top = '';
      modalContent.style.left = '';

      requestAnimationFrame(() => {
        gsap.set([modalSpecs, modalCloseBtn], { opacity: 0 });
        gsap.set(modalSpecs, { y: 12 });
        gsap.set(modalOverlay, { opacity: 0 });
        gsap.set(modalContent, {
          scale: 0.92,
          opacity: 1,
          borderRadius: '12px',
        });

        modalOpenTl = gsap.timeline({
          onComplete: () => { isModalAnimating = false; }
        });

        modalOpenTl.to(modalOverlay, { opacity: 1, duration: 0.28, ease: 'power2.out' }, 0);
        modalOpenTl.to(modalContent, {
          scale: 1,
          borderRadius: '20px',
          duration: 0.42,
          ease: 'power3.out',
        }, 0);

        modalOpenTl.to(modalCloseBtn, { opacity: 1, duration: 0.22, ease: 'power2.out' }, '-=0.22');
        modalOpenTl.to(modalSpecs, {
          opacity: 1,
          y: 0,
          duration: 0.38,
          ease: 'power3.out',
        }, '-=0.3');

        currentModalId = id;
      });

    } else {
      /* Desktop: position fixed anclado a la card — crece desde su centro */
      const modalW = 560;
      const destLeft = Math.max(0, Math.min(cardRect.left, window.innerWidth - modalW));
      const destTop  = Math.max(0, Math.min(cardRect.top, window.innerHeight - 200));

      modalContent.style.position = 'fixed';
      modalContent.style.top = destTop + 'px';
      modalContent.style.left = destLeft + 'px';

      requestAnimationFrame(() => {
        const contentRect = modalContent.getBoundingClientRect();

        /* Centro de la card → centro del modal (transformOrigin: center center) */
        const cardCX = cardRect.left + cardRect.width / 2;
        const cardCY = cardRect.top + cardRect.height / 2;
        const contentCX = contentRect.left + contentRect.width / 2;
        const contentCY = contentRect.top + contentRect.height / 2;

        const dx = cardCX - contentCX;
        const dy = cardCY - contentCY;
        const sx = contentRect.width > 0 ? cardRect.width / contentRect.width : 1;
        const sy = contentRect.height > 0 ? cardRect.height / contentRect.height : 1;

        gsap.set([modalSpecs, modalCloseBtn], { opacity: 0 });
        gsap.set(modalSpecs, { y: 12 });
        gsap.set(modalOverlay, { opacity: 0 });
        gsap.set(modalContent, {
          x: dx, y: dy,
          scaleX: sx, scaleY: sy,
          transformOrigin: 'center center',
          opacity: 1,
          borderRadius: '0px',
          boxShadow: '0 0 0 rgba(0,0,0,0)',
        });

        modalOpenTl = gsap.timeline({
          onComplete: () => { isModalAnimating = false; }
        });

        /* Overlay + crecimiento arrancan juntos (sin stagger) */
        modalOpenTl.to(modalOverlay, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0);
        modalOpenTl.to(modalContent, {
          x: 0, y: 0,
          scaleX: 1, scaleY: 1,
          borderRadius: '24px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
          duration: 0.45,
          ease: 'power3.out',
        }, 0);

        modalOpenTl.to(modalCloseBtn, { opacity: 1, duration: 0.22, ease: 'power2.out' }, '-=0.22');
        modalOpenTl.to(modalSpecs, {
          opacity: 1,
          y: 0,
          duration: 0.38,
          ease: 'power3.out',
        }, '-=0.3');

        currentModalId = id;
      });
    }
  }

  /* --- Cerrar modal --- */
  function closeModal() {
    if (!currentModalId || isModalAnimating) return;

    currentModalId = null;
    isModalAnimating = true;

    if (modalOpenTl) modalOpenTl.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        unlockBodyScroll();
        modalIcon.innerHTML = '';
        /* Resetear posición fixed que se setea en openModal */
        modalContent.style.position = '';
        modalContent.style.top = '';
        modalContent.style.left = '';
        gsap.set([modalIcon, modalTitle, modalNumber, modalDesc, modalSpecs, modalContent, modalOverlay, modalCloseBtn], { clearProps: 'all' });
        isModalAnimating = false;
      }
    });

    tl
      .to([modalDesc, modalSpecs], { opacity: 0, duration: 0.1, ease: 'power2.in' })
      .to([modalTitle, modalNumber], { opacity: 0, duration: 0.15, ease: 'power2.in' }, '-=0.05')
      .to(modalIcon, { opacity: 0, duration: 0.15, ease: 'power2.in' }, '-=0.1')
      .to(modalCloseBtn, { opacity: 0, duration: 0.12, ease: 'power2.in' }, '-=0.12')
      .to(modalContent, { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power3.in' }, '-=0.15')
      .to(modalOverlay, { opacity: 0, duration: 0.25, ease: 'power2.in' }, '-=0.25');
  }

  /* --- Event listeners --- */
  document.querySelectorAll('[data-feature-card]').forEach(card => {
    card.addEventListener('click', () => openModal(card.getAttribute('data-modal-id')));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.getAttribute('data-modal-id'));
      }
    });
  });

  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && currentModalId) closeModal();
  });
})();
