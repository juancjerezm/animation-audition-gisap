## Exploration: Convertix Landing — Single-File GSAP Demo

### Current State
Greenfield project. No existing HTML/CSS/JS files. The project directory contains only SDD infrastructure (`openspec/`, `.atl/`) and the specification document (`Specs.md`). The `openspec/config.yaml` confirms: HTML5 + CSS3 + Vanilla JS + GSAP 3 with ScrollTrigger, no test runner, single-file delivery. No existing implementation to extend or refactor.

### Affected Areas
- **New file**: `index.html` (or `convertix-landing.html`) — the single-file deliverable containing all HTML structure, inlined CSS, and inlined JS with GSAP animations.
- **`openspec/changes/convertix-landing/`** — SDD artifacts (exploration, proposal, specs, design, tasks).

### Requirements Clarified

#### 1. ScrollTrigger Pinned Section — Scene Breakdown
The spec lists 5 scenes thematically. I derive the following concrete structure:

| Scene | Progress | Visual | Text | Action |
|-------|----------|--------|------|--------|
| 1 — Captura | 0%–20% | Product fades in, orbs begin pulsing | "Mirá cómo cobra vida" (Watch it come alive) | Attention grab: product reveals with entrance animation |
| 2 — Protagonista | 20%–40% | Full product detail, subtle 3D-like rotate, pills appear | "Tu producto como protagonista" (Your product as the lead) | Product centered with detail zoom |
| 3 — Valor | 40%–60% | Feature pills orbit, orbs intensify | "Cada detalle comunica valor" (Every detail communicates value) | Features/tags orbit around product |
| 4 — Intención | 60%–80% | Background darkens slightly, product gains premium glow | "Una experiencia que vende" (An experience that sells) | Premium/prestige moment — shadow, glow |
| 5 — CTA | 80%–100% | Product scales down, CTA button scales up from center | "Convertix Web lo hace posible" (Convertix Web makes it possible) + CTA button | Commercial finish with clear action |

#### 2. Product Images
The spec says the product can be fictional. Recommendation: use **Unsplash placeholder URLs** for a premium tech product look:
- Hero product: dark-themed gadget/device (smartwatch, headphones, or abstract 3D render)
- Catalog cards (×3): related product shots (color variants, angles)
- Scroll section product: same hero product at higher resolution

Suggested Unsplash collections:
- `https://images.unsplash.com/photo-{id}?w=800&q=80` — tech/product photography
- Fallback: `https://placehold.co/600x400/0a0a0f/7c4dff?text=Product+Demo`

**Open question**: Should the product be a physical gadget (headphones, watch) or a digital product mockup (SaaS dashboard, app UI)? This affects the visual feel significantly.

#### 3. GSAP Timeline Structure for Scroll Section
```javascript
const scrollTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".scroll-section",
    start: "top top",
    end: "+=3000",          // Virtual scroll distance
    scrub: 1,               // 1s smooth catch-up
    pin: true,
    pinSpacing: true,
    markers: false,         // true during dev
    onUpdate: (self) => {
      // Update progress bar width
      gsap.set(".progress-bar-fill", { 
        width: `${self.progress * 100}%` 
      });
      // Scene indicator logic
      updateSceneIndicator(self.progress);
    }
  }
});

// Scene 1 — Product entrance + orbs
scrollTL
  .from(".scroll-product", { autoAlpha: 0, scale: 0.8, y: 80, duration: 0.5 })
  .from(".scroll-text-1", { autoAlpha: 0, y: 30 }, "<")
  .to(".orb-1", { x: 40, y: -30, scale: 1.2 }, "<")
  .to(".orb-2", { x: -50, y: 20, scale: 0.9 }, "<")

// Scene 2 — Product detail + pills
  .to(".scroll-text-1", { autoAlpha: 0, y: -20 })
  .from(".scroll-text-2", { autoAlpha: 0, y: 30 }, "<")
  .to(".scroll-product", { scale: 1.05 }, "<")
  .from(".pill-1", { autoAlpha: 0, x: -40, rotate: -15 }, "<0.2")
  .from(".pill-2", { autoAlpha: 0, x: 40, rotate: 15 }, "<")
  .from(".pill-3", { autoAlpha: 0, y: 40 }, "<")

// Scene 3 — Value display
  .to(".scroll-text-2", { autoAlpha: 0, y: -20 })
  .from(".scroll-text-3", { autoAlpha: 0, y: 30 }, "<")
  .to(".orb-1", { scale: 1.5, opacity: 0.6 })
  .to(".orb-2", { scale: 1.3, opacity: 0.5 }, "<")

// Scene 4 — Premium moment
  .to(".scroll-text-3", { autoAlpha: 0, y: -20 })
  .from(".scroll-text-4", { autoAlpha: 0, y: 30 }, "<")
  .to(".scroll-product", { filter: "drop-shadow(0 0 30px rgba(124,77,255,0.4))" })

// Scene 5 — CTA finish
  .to([".scroll-text-4", ".scroll-product"], { autoAlpha: 0, scale: 0.9 })
  .from(".scroll-text-5", { autoAlpha: 0, y: 40 }, "<")
  .from(".scroll-cta", { autoAlpha: 0, scale: 0.5, y: 30 }, "<0.2");
```

#### 4. Progress Bar
- **Location**: Fixed at the top of the pinned scroll section, full-width
- **Visual**: Thin bar (4px) with gradient fill (blue → purple), matching brand
- **Behavior**: Width goes from 0% to 100% linearly with the ScrollTrigger timeline progress
- **Implementation**: A `.progress-bar` container with an inner `.progress-bar-fill` div whose `width` is updated via `onUpdate`
- **Scene dots**: Optional — small dots at 25%, 50%, 75% positions showing scene transitions

#### 5. Orbes and Pills — Visual Definition

**Orbes (Background Orbs)**:
- 2–3 large blurred circles (200–400px diameter)
- CSS `radial-gradient` or `border-radius: 50%` with `filter: blur(80px)`
- Colors: cyan (`#00b4ff`), purple (`#7c4dff`), and a blend
- Opacity: 0.15–0.3 (subtle, not overpowering)
- Animation: GSAP-powered floating — slow continuous drift (x, y) with `repeat: -1, yoyo: true`
- Position: `absolute` within the pinned section, behind the product
- Mobile consideration: reduce size/blur for performance

**Pills (Floating Tags)**:
- Small pill-shaped badges with feature labels like "Scroll narrativo", "Microinteracciones", "Diseño premium", "GSAP"
- CSS: `border-radius: 50px`, semi-transparent dark background with border glow
- Animation: Appear and float outward from the product, then gently bob with GSAP
- Enter with stagger, exit collectively before scene transitions
- Mobile: fewer pills (3 on desktop, 2 on mobile)

### Approaches

| Approach | Pros | Cons | Effort |
|----------|------|------|--------|
| **A: Full GSAP CDN (free tier)** — Core + ScrollTrigger only. Manual text splitting, no ScrambleText/SplitText. | No cost, simple CDN includes, works offline after first load | Less polished text animations, manual word/char splitting needed for stagger effects | Medium |
| **B: GSAP Club tier** — Include SplitText and ScrambleTextPlugin via paid CDN tokens. | Superior text animations, ScrambleText effect for scene transitions | Requires GSAP Club membership, adds dependency on paid service | Medium |
| **C: Hybrid GSAP + CSS animations** — GSAP for scroll/product, CSS animations for text transitions. | Splits concerns, CSS animations are hardware-accelerated | More complex coordination, two animation systems to sync | High |

### Recommendation
**Approach A (Full GSAP CDN - free tier)**. The free tier of GSAP (core + ScrollTrigger) is sufficient for all required animations. For text stagger effects, we can manually split text nodes with JavaScript (a 20-line utility function). This keeps the project self-contained, cost-free, and maximally portable (single HTML file with CDN links). SplitText/ScrambleText would be nice-to-have but not essential for a demo — the core animations (pin, scrub, timeline, stagger, hover, parallax) are all free.

### CDN URLs to Use
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

### File Structure (Single File)
```
index.html
├── <style> — All CSS (~300–400 lines)
│   ├── CSS Custom Properties (colors, fonts, spacing)
│   ├── Reset / Base styles
│   ├── Layout (sections, grids, flex)
│   ├── Component styles (header, cards, menu, orbs, pills, progress bar)
│   ├── Responsive breakpoints (768px, 480px)
│   └── Animation keyframes (if any CSS-only animations)
├── <body> — HTML structure (~200 lines)
│   ├── Fixed header with logo + menu toggle
│   ├── Side menu overlay
│   ├── Hero section (#1)
│   ├── Catalog grid (#2)
│   ├── Product interaction (#3)
│   ├── Commercial catalog (#4)
│   ├── Benefits cards (#5)
│   ├── Pinned scroll section (#6)
│   │   ├── Progress bar
│   │   ├── Background orbs (divs)
│   │   ├── Product image
│   │   ├── Text layers (5 scenes)
│   │   ├── Floating pills
│   │   └── CTA button
│   └── Footer/CTA section (#7)
└── <script> — All JS (~400–500 lines)
    ├── GSAP + ScrollTrigger registration
    ├── Menu toggle animation
    ├── Hero entrance timeline
    ├── Product parallax (mousemove)
    ├── Card hover effects (mouseenter/mouseleave + gsap)
    ├── ScrollReveal for sections (ScrollTrigger.batch or individual)
    ├── Product switch transition (click handlers)
    ├── Pinned scroll mega-timeline
    ├── Orb floating animations (standalone tweens)
    ├── CTA reveal
    └── Responsive adjustments (ScrollTrigger.refresh on resize)
```

### Risks

1. **Mobile scroll performance** — Pinned sections with `scrub` can jank on low-end mobile devices. Mitigation: reduce virtual scroll distance on mobile (`end: "+=1500"` instead of `+=3000`), reduce orb blur, limit pill count.
2. **CDN dependency** — If CDN is down, demo is broken. Mitigation: acceptable for a demo (single CDN, widely available).
3. **Image loading** — Unsplash URLs may be slow or fail. Mitigation: add fallback placeholder colors, use `loading="lazy"` where appropriate, preload hero image.
4. **Ambiguous product type** — Without knowing what kind of product to showcase, the visual design may feel generic. Mitigation: recommend a fictional premium tech gadget (wireless earbuds or smartwatch) — these photograph well and fit the dark/premium aesthetic.
5. **Single-file size** — All CSS + JS + HTML in one file could exceed 1000 lines, making it harder to navigate. Mitigation: use clear comment section headers and consistent formatting.
6. **ScrollTrigger refresh on resize** — Responsive breakpoints may need `ScrollTrigger.refresh()` calls. Mitigation: debounced resize handler.

### Open Questions for the User

1. **Product type**: Physical gadget (headphones, watch, speaker) or digital/software mockup (SaaS dashboard, app screenshots)? This determines image selection and visual direction.
2. **Pill content**: What labels should the floating pills display? I recommend: "GSAP", "Scroll Narrativo", "Microinteracciones", "Diseño Premium" — matching the benefits section.
3. **Side menu**: Functional navigation links or purely decorative showcase? If decorative, we can skip scroll-to-section logic.
4. **Mobile pinned section**: Should mobile use the same pin+scrub behavior or fall back to a simpler stacked layout? Pinning on mobile can feel claustrophobic with limited viewport.
5. **CTA destination**: Where should "Ver demo" and "Cotizar una landing así" link to? Placeholder `#` links or actual URLs?
6. **Product switch section (#4)**: What are the product variants — color options, feature views, or completely different products? How many variants (3 recommended)?

### Ready for Proposal
**Yes** — with the clarifications above. The spec is detailed enough to begin proposal and spec writing. The open questions can be resolved with reasonable defaults during design if the user doesn't provide explicit answers. The technical approach is clear: single-file HTML with GSAP CDN (free tier), CSS Custom Properties for theming, and a ScrollTrigger mega-timeline for the pinned section.

### Recommended Defaults (if user doesn't answer open questions)

| Question | Default |
|----------|---------|
| Product type | Premium wireless earbuds (photogenic, fits dark theme) |
| Pill labels | "GSAP", "Scroll Narrativo", "Microinteracciones", "Premium" |
| Side menu | Functional — scroll-to-section with smooth behavior |
| Mobile pinned | Simplified — shorter virtual scroll (1500px), no pin (stacked) |
| CTA links | `#` placeholders with smooth scroll prevention |
| Product variants | 3 color variants of the same product |
