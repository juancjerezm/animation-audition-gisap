/* ============================================================
   ANIMACIONES GSAP — Scroll triggers
   ============================================================ */

(function () {
'use strict';

if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

gsap.registerPlugin(ScrollTrigger);

/* ---- Entrada del hero — espera que las fuentes carguen para evitar FOUT/glitch ---- */
/* Timeout de 3s: si las fuentes nunca terminan de cargar, arranca igual */
const fontsReady = Promise.race([
  document.fonts.ready,
  new Promise(resolve => setTimeout(resolve, 3000))
]);

fontsReady.then(() => {
  const heroTl = gsap.timeline({ delay: 0.3 });
  heroTl
    .to(".hero__label", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0)
    .to(".hero__title .char-inner", {
      y: "0%",
      duration: 1.1,
      stagger: 0.1,
      ease: "power4.out"
    }, 0.3)
    .to(".hero__desc", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 1)
    .to(".hero__scroll", { opacity: 1, duration: 0.6, ease: "power2.out" }, 1.2);
});

/* ---- Linea de scroll ---- */
gsap.to(".hero__scroll-line", {
  scaleY: 1.8,
  opacity: 0.4,
  duration: 1.5,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut"
});

/* ---- Header de features ---- */
gsap.to(".features__label", {
  scrollTrigger: { trigger: ".features__header", start: "top 80%" },
  opacity: 1, y: 0, duration: 0.8, ease: "power3.out"
});

gsap.to(".features__title", {
  scrollTrigger: { trigger: ".features__header", start: "top 80%" },
  opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: "power3.out"
});

/* ---- Cards de features ---- */
gsap.to(".feature-card", {
  scrollTrigger: { trigger: ".features__grid", start: "top 75%" },
  opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out"
});

/* ---- Showcase ---- */
gsap.to(".showcase__text", {
  scrollTrigger: { trigger: ".showcase", start: "top 60%" },
  opacity: 1, x: 0, duration: 1, ease: "power3.out"
});

gsap.to(".showcase__image", {
  scrollTrigger: { trigger: ".showcase", start: "top 60%" },
  opacity: 1, x: 0, duration: 1, delay: 0.2, ease: "power3.out"
});

/* ---- Parallax del texto de fondo ---- */
gsap.to(".showcase__bg-text", {
  scrollTrigger: {
    trigger: ".showcase",
    start: "top bottom",
    end: "bottom top",
    scrub: 1.5,
  },
  x: "-15%",
  ease: "none"
});

/* ---- Stats ---- */
gsap.to(".stat", {
  scrollTrigger: { trigger: ".stats__grid", start: "top 80%" },
  opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out"
});

/* ---- Lifestyle ---- */
gsap.to(".lifestyle__title", {
  scrollTrigger: { trigger: ".lifestyle__header", start: "top 80%" },
  opacity: 1, y: 0, duration: 0.8, ease: "power3.out"
});

gsap.to(".lifestyle__desc", {
  scrollTrigger: { trigger: ".lifestyle__header", start: "top 80%" },
  opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: "power3.out"
});

gsap.to(".lifestyle__big", {
  scrollTrigger: { trigger: ".lifestyle__grid", start: "top 80%" },
  opacity: 1, y: 0, duration: 0.9, ease: "power3.out"
});

gsap.to(".lifestyle__small", {
  scrollTrigger: { trigger: ".lifestyle__grid", start: "top 80%" },
  opacity: 1, y: 0, duration: 0.8, stagger: 0.15, delay: 0.2, ease: "power3.out"
});

/* ---- Testimonios ---- */
gsap.to(".testimonials__title", {
  scrollTrigger: { trigger: ".testimonials__header", start: "top 80%" },
  opacity: 1, y: 0, duration: 0.8, ease: "power3.out"
});

/* Entrada del carrusel con scroll */
gsap.to(".testimonials-carousel", {
  scrollTrigger: { trigger: ".testimonials-carousel", start: "top 80%" },
  opacity: 1,
  duration: 0.6,
  ease: "power2.out"
});

/* ---- CTA ---- */
const ctaTl = gsap.timeline({
  scrollTrigger: { trigger: ".cta-section", start: "top 70%" }
});
ctaTl
  .to(".cta-section__label", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
  .to(".cta-section__title", { opacity: 1, y: 0, duration: 0.9, delay: 0.15, ease: "power4.out" }, 0)
  .to(".cta-section__btn", { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: "power3.out" }, 0);

})();
