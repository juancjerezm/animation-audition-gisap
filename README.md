# Convertix — Landing Page Animada

Landing page de producto para Convertix (auriculares inalámbricos premium) con animaciones de alto rendimiento usando GSAP y Three.js. Cada animación tiene un propósito: guiar, sorprender o reforzar credibilidad.

**Resultado**: página 100% funcional, responsive, con modales FLIP, carrusel infinito multi-card y canvas 3D optimizado que se pausa al salir del viewport.

## Quick Start

```bash
# Servir localmente (requiere Node.js)
npx serve .
```

Abrir `http://localhost:3000`. La página carga GSAP, ScrollTrigger y Three.js desde CDN — no necesita build step.

## Arquitectura

El proyecto se refactorizó de 2 archivos monolíticos (592 líneas JS, 512 líneas CSS) a 13 archivos enfocados por responsabilidad.

### JavaScript (4 módulos)

| Archivo | Responsabilidad | Técnica clave |
|---------|----------------|---------------|
| `three-hero.js` | Canvas 3D: visualizador + partículas | Three.js, `IntersectionObserver` para pausar GPU, `Date.now()` cacheado por frame, `passive: true` en scroll |
| `animations.js` | Scroll triggers GSAP para todas las secciones | `ScrollTrigger`, timelines, stagger, scrub parallax |
| `modal.js` | Modales de features con FLIP | Expansión whole-card (App Store style), compensación de scrollbar, `gsap.timeline` |
| `carousel.js` | Carrusel infinito multi-card | Clone-teleport pattern, `transitionend`, touch swipe, keyboard (sin robar inputs), resize debounce |

### CSS (9 archivos)

| Archivo | Responsabilidad |
|---------|----------------|
| `reset.css` | CSS reset + variables (`--color-bg: #FEF6E5`, `--color-text: #0A0A0A`) |
| `typography.css` | Fuentes Inter + Syne, escala tipográfica, utilidades |
| `layout-header.css` | Header glassmorphism + navegación |
| `layout-hero.css` | Hero section, texto partido, scroll indicator |
| `layout-sections.css` | Features grid, showcase, stats, lifestyle, CTA |
| `layout-bottom.css` | Marquee + footer |
| `components.css` | Feature cards, stat cards, botones |
| `modal.css` | Modal overlay, contenido, animaciones base |
| `carousel-testimonials.css` | Viewport, track, cards, dots, arrows, contador |

## Decisiones Técnicas

| Decisión | Por qué |
|----------|---------|
| **Clone-teleport para carrusel infinito** | Sin salto visible al llegar al final. Clona `cardsPerView` elementos al inicio y final, teleporta sin transición al cruzar el borde. |
| **FLIP whole-card expansion** | La card entera crece desde su posición hasta llenar el modal. Más fluido que animar elementos individuales por separado. |
| **IntersectionObserver en el canvas 3D** | `requestAnimationFrame` se detiene cuando el hero sale del viewport. La GPU deja de trabajar. Se reanuda automáticamente al volver. |
| **`Date.now()` cacheado por frame** | 6 llamadas a `Date.now()` reducidas a 1. Micro-optimización que evita overhead de llamadas al sistema en el hot path. |
| **Compensación de scrollbar en modales** | `body { overflow: hidden }` causa layout shift. Se calcula el ancho del scrollbar y se aplica `padding-right` al body y header. |
| **CSS modularizado** | Cada sección del layout tiene su propio archivo. Un cambio en el header no puede romper el footer. |

## Estructura

```
animation-gsap/
├── index.html                    # Página única, 7 secciones
├── assets/
│   ├── logo.png                  # Logo Convertix
│   ├── product-front.png         # Hero product shot
│   ├── lifestyle-01.png          # Lifestyle hero
│   ├── headphone-lifestyle-*.jpg # Lifestyle grid
├── src/
│   ├── scripts/
│   │   ├── three-hero.js         # Canvas 3D (199 líneas)
│   │   ├── animations.js         # GSAP scroll triggers (118 líneas)
│   │   ├── carousel.js           # Carrusel infinito (208 líneas)
│   │   └── modal.js              # Modales FLIP (217 líneas)
│   └── styles/
│       ├── reset.css
│       ├── typography.css
│       ├── layout-header.css
│       ├── layout-hero.css
│       ├── layout-sections.css
│       ├── layout-bottom.css
│       ├── components.css
│       ├── modal.css
│       └── carousel-testimonials.css
├── package.json
└── pnpm-lock.yaml
```

## Secciones de la Página

1. **Hero** — Canvas 3D con visualizador de barras + partículas flotantes. Título partido con animación de caracteres. Parallax sutil con el mouse.
2. **Marquee** — Banda infinita con features clave (40h batería, ANC, Audio Espacial, etc.).
3. **Features** — Grid de 6 cards con iconos SVG. Cada card abre un modal con detalles y specs.
4. **Showcase** — Imagen de producto con parallax de texto gigante de fondo.
5. **Stats** — 4 métricas animadas con entrada staggered.
6. **Lifestyle** — Grid de imágenes con layout asimétrico.
7. **Testimonios** — Carrusel infinito con 8 testimonios reales. Desktop: 2 cards visibles. Mobile: 1.
8. **CTA** — Llamada a la acción con animación de entrada.
9. **Footer** — Navegación, contacto (convertixweb.app, email, Instagram, Facebook), scroll-to-top.

## Dependencias

Todas desde CDN — cero build step.

| Dependencia | Versión | Uso |
|------------|---------|-----|
| GSAP | 3.12.5 | Animaciones scroll, FLIP, timelines |
| ScrollTrigger | 3.12.5 | Animaciones activadas por posición de scroll |
| Three.js | r128 | Canvas 3D del hero (visualizador + partículas) |

## Links

| Plataforma | URL |
|-----------|-----|
| Web | [convertixweb.app](https://convertixweb.app/) |
| Instagram | [@convertixweb](https://www.instagram.com/convertixweb/) |
| Facebook | [Convertix](https://www.facebook.com/profile.php?id=61588761966347) |
