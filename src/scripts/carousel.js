/* ============================================================
   CARRUSEL DE TESTIMONIOS — Infinito multi-card (Vanilla JS)
   Desktop: 2 cards visibles | Mobile: 1 card visible
   ============================================================ */

(function () {
  const carouselTrack = document.querySelector('.testimonials-carousel__track');
  const carouselViewport = document.querySelector('.testimonials-carousel__viewport');
  const carouselCards = document.querySelectorAll('.testimonials-carousel__card');
  const carouselDotsContainer = document.querySelector('.testimonials-carousel__dots');
  const carouselPrevBtn = document.getElementById('carousel-prev');
  const carouselNextBtn = document.getElementById('carousel-next');
  const carouselCurrentEl = document.querySelector('.testimonials-carousel__current');
  const carouselTotalEl = document.querySelector('.testimonials-carousel__total');

  if (!carouselTrack || !carouselCards.length) return;

  const realTotal = carouselCards.length;
  let cardsPerView = 1;
  let cardWidth = 300;
  let currentIndex;
  let carouselAutoplay;
  let isTransitioning = false;
  const TRANSITION = 'transform 1.2s cubic-bezier(0.76, 0, 0.24, 1)';

  carouselTotalEl.textContent = String(realTotal).padStart(2, '0');

  /* ---- Setup dinámico ---- */

  function getCardsPerView() {
    return window.innerWidth <= 767 ? 1 : 2;
  }

  function getCardWidth() {
    const vw = carouselViewport.clientWidth;
    const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
    return (vw - (cardsPerView - 1) * gap) / cardsPerView;
  }

  function getStepSize() {
    const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
    return cardWidth + gap;
  }

  function setCardWidths() {
    const allCards = carouselTrack.querySelectorAll('.testimonials-carousel__card');
    allCards.forEach(c => {
      c.style.width = cardWidth + 'px';
      c.style.flexShrink = '0';
      c.style.flexGrow = '0';
      c.style.flexBasis = 'auto';
    });
  }

  function buildCarousel() {
    /* Limpiar clones y resetear originales */
    const allCards = carouselTrack.querySelectorAll('.testimonials-carousel__card');
    allCards.forEach(c => {
      if (!Array.from(carouselCards).includes(c)) c.remove();
    });
    carouselCards.forEach(c => {
      c.style.width = '';
      c.style.flexShrink = '';
      c.style.flexGrow = '';
      c.style.flexBasis = '';
    });

    cardsPerView = getCardsPerView();
    cardWidth = getCardWidth();
    currentIndex = cardsPerView;

    for (let i = 0; i < cardsPerView; i++) {
      carouselTrack.appendChild(carouselCards[i].cloneNode(true));
    }
    for (let i = realTotal - cardsPerView; i < realTotal; i++) {
      carouselTrack.insertBefore(carouselCards[i].cloneNode(true), carouselTrack.firstChild);
    }

    setCardWidths();

    const step = getStepSize();
    carouselTrack.style.transition = 'none';
    carouselTrack.style.transform = `translateX(-${currentIndex * step}px)`;
    carouselTrack.offsetHeight; // forzar reflow

    carouselDotsContainer.innerHTML = '';
    carouselCards.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'testimonials-carousel__dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => carouselGoTo(i));
      carouselDotsContainer.appendChild(d);
    });

    updateUI();
  }

  /* ---- Navegación ---- */

  function getRealIndex() {
    let idx = currentIndex - cardsPerView;
    while (idx < 0) idx += realTotal;
    return idx % realTotal;
  }

  function updateUI() {
    const realIdx = getRealIndex();
    document.querySelectorAll('.testimonials-carousel__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === realIdx);
    });
    carouselCurrentEl.textContent = String(realIdx + 1).padStart(2, '0');
  }

  function carouselSlide() {
    const step = getStepSize();
    carouselTrack.style.transition = TRANSITION;
    carouselTrack.style.transform = `translateX(-${currentIndex * step}px)`;
    updateUI();
  }

  function carouselTeleport(targetIndex) {
    const step = getStepSize();
    carouselTrack.style.transition = 'none';
    currentIndex = targetIndex;
    carouselTrack.style.transform = `translateX(-${currentIndex * step}px)`;
    carouselTrack.offsetHeight;
    updateUI();
    isTransitioning = false;
  }

  function carouselGoNext() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    carouselSlide();
  }

  function carouselGoPrev() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    carouselSlide();
  }

  function carouselGoTo(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = index + cardsPerView;
    carouselSlide();
  }

  /* ---- Event listeners ---- */

  carouselTrack.addEventListener('transitionend', () => {
    const maxIdx = realTotal + cardsPerView;
    if (currentIndex >= maxIdx) {
      carouselTeleport(currentIndex - realTotal);
    } else if (currentIndex < cardsPerView) {
      carouselTeleport(currentIndex + realTotal);
    } else {
      isTransitioning = false;
    }
  });

  function resetAutoplay() {
    clearInterval(carouselAutoplay);
    carouselAutoplay = setInterval(carouselGoNext, 4000);
  }

  carouselPrevBtn.addEventListener('click', () => { resetAutoplay(); carouselGoPrev(); });
  carouselNextBtn.addEventListener('click', () => { resetAutoplay(); carouselGoNext(); });

  document.querySelector('.testimonials-carousel').addEventListener('mouseenter', () => clearInterval(carouselAutoplay));
  document.querySelector('.testimonials-carousel').addEventListener('mouseleave', resetAutoplay);

  /* Touch swipe */
  let touchStartX = 0;
  carouselTrack.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carouselTrack.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx < -50) { resetAutoplay(); carouselGoNext(); }
    else if (dx > 50) { resetAutoplay(); carouselGoPrev(); }
  });

  /* Keyboard — no roba flechas de inputs/selects */
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'ArrowRight') { resetAutoplay(); carouselGoNext(); }
    else if (e.key === 'ArrowLeft') { resetAutoplay(); carouselGoPrev(); }
  });

  /* Recalcular en resize */
  let resizeDebounce;
  window.addEventListener('resize', () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      buildCarousel();
      resetAutoplay();
    }, 250);
  });

  /* Arrancar */
  buildCarousel();
  carouselAutoplay = setInterval(carouselGoNext, 4000);
})();
