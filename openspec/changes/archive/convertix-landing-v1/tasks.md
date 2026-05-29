# Tasks: Convertix Landing — Single-File GSAP Demo

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1000 (200 HTML + 350 CSS + 450 JS) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: HTML+CSS (~550 lines static) → PR 2: GSAP JS (~450 lines interactive) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Complete static landing page (HTML structure + all CSS) | PR 1 | Verifiable: 7 styled sections render correctly at all breakpoints |
| 2 | GSAP animations (hero, nav, parallax, hover, scroll-storytelling, reveals) | PR 2 | Depends on PR 1 structure; verifiable: all animations play per spec |

## Phase 1: HTML Structure + CSS Foundation

- [x] 1.1 Create `index.html` with HTML5 boilerplate, Inter font CDN, GSAP 3.12.5 + ScrollTrigger CDN links, and all 7 section containers with unique `id` attributes
- [x] 1.2 Define CSS Custom Properties on `:root` (--bg-deep, --purple, --cyan, --glass-border, --radius-card, --radius-pill, --font, --header-h)
- [x] 1.3 Write CSS reset, base typography (`Inter` with fallback), section layout defaults, `scroll-behavior: smooth`, `will-change` hints
- [x] 1.4 Implement fixed header: glassmorphism (`backdrop-filter`, rgba bg, gradient bottom-border), logo with gradient text-fill, hamburger icon (3 lines). Scroll >100px shadow per NAV-REQ-001
- [x] 1.5 Hero section HTML+CSS: full-viewport flex-center, product `<img>` placeholder, headline `<h1>`, CTA `<button>` with gradient bg + glow shadow per HERO-REQ-001/003
- [x] 1.6 Navigation slide menu HTML+CSS: overlay panel (380px desktop, 100vw mobile), 7 links with accent bar, semi-transparent backdrop per NAV-REQ-003
- [x] 1.7 Product Catalog HTML+CSS: 3-card grid (`repeat(3,1fr)`), card with image+name+tagline, glassmorphism card style per CAT-REQ-001
- [x] 1.8 Product Showcase HTML+CSS: parallax container, product `<img>`, 3 color-variant dot indicators below per SHOW-REQ-001/002
- [x] 1.9 Benefits HTML+CSS: 2×2 card grid, each with gradient icon-circle + headline + description, glassmorphism per BEN-REQ-001
- [x] 1.10 Scroll Storytelling HTML+CSS: pinned section with progress-bar (4px bar + 4 scene dots), 2 background orb divs, product image, 5 text-layer divs, 4 pill elements, CTA button per SCROLL-REQ-001 through SCROLL-REQ-006
- [x] 1.11 CTA Footer HTML+CSS: centered flex-column layout, gradient headline, sub-headline, large gradient CTA button, 3 footer links per CTA-REQ-001/003/004

## Phase 2: GSAP Animations (JavaScript)

- [x] 2.1 Register GSAP + ScrollTrigger; implement `splitText()` utility (~20 lines) wrapping each character in `<span>` for stagger effects
- [x] 2.2 Hero entrance timeline: atmosphere (bg + orbs fade), product reveal (scale+elastic, bloom glow), text stagger, CTA elastic scale per HERO-REQ-001. Add orb breathing loops (repeat:-1, yoyo, sine.inOut) per HERO-REQ-002
- [x] 2.3 Menu toggle: hamburger-to-X morph (rotate ±45deg, line2 fade), overlay slide (power3.inOut, 450ms), link stagger (0.06, x:30→0), backdrop click-close, scroll-to-section on link click per NAV-REQ-002/003
- [x] 2.4 Product parallax: `quickTo()` for GPU-friendly mousemove (±15px X, ±10px Y, ±3deg tilt), clamp to container bounds, smooth 600ms reset on leave per SHOW-REQ-001. Variant switch: crossfade timeline (250ms out + 350ms in with 50ms overlap), dot pulse, name crossfade per SHOW-REQ-002
- [x] 2.5 Catalog card hover: `mouseenter` (scale 1.04, glow shadow, border purple, image scale 1.08 + translateY -6px, cursor-tracking radial glow) / `mouseleave` (400ms return) per CAT-REQ-002. Benefits card hover: translateY -6px, shadow, border tint, icon hue-shift per BEN-REQ-003
- [x] 2.6 ScrollReveal triggers: catalog cards (stagger 0.12, y:60, start:"top 75%") per CAT-REQ-003. Benefits headline + cards (stagger 0.15, scale:0.92→1, start:"top 80%") per BEN-REQ-002. CTA footer (headline chars stagger 0.03, sub-headline, button back.out) per CTA-REQ-002
- [x] 2.7 Scroll storytelling mega-timeline: pinned scrub timeline (`end:"+=3000"`, `scrub:1`) with 5 scenes at 0–20%, 20–40%, 40–60%, 60–80%, 80–100% progress. Scene 1: product entrance + text stagger. Scene 2: product scale 1.08 + glow + 4 pills stagger. Scene 3: product brightness boost + orb intensify + pill bob. Scene 4: darken overlay + dual glow + pill fadeout. Scene 5: product scale-down + CTA elastic + luminous flare. All per SCROLL-REQ-001/002
- [x] 2.8 Progress bar + scene indicators: `onUpdate` drives fill width linearly (0→100%). Scene dots light up (scale+glow) at 25/50/75/100%. Current dot pulses per SCROLL-REQ-003

## Phase 3: Responsive + Integration

- [ ] 3.1 Add CSS media queries: ≤768px (single-column grids, full-width menu, reduced spacing, smaller typography) and ≤480px (further reductions)
- [ ] 3.2 Wrap GSAP params in `ScrollTrigger.matchMedia()`: desktop (`(min-width:768px)`) with `end:"+=3000"`, `scrub:1`, 2 orbs, 4 pills; mobile with `end:"+=1500"`, `scrub:1.5`, 1 orb, 2 pills per SCROLL-REQ-007 and design responsive table
- [ ] 3.3 Add debounced (200ms) `resize` listener calling `ScrollTrigger.refresh()`; remove `will-change` on touch devices per design performance constraints

## Phase 4: Manual Verification

- [ ] 4.1 Load page in Chrome/Firefox/Edge — verify zero console errors, no 404s, GSAP+ScrollTrigger registered
- [ ] 4.2 Verify hero entrance: orbs breathe continuously after entrance, CTA hover glow + click press-down + smooth scroll to scroll-section per HERO spec scenarios
- [ ] 4.3 Verify navigation: hamburger morphs correctly, menu opens/closes with stagger, all 7 links scroll to correct sections, backdrop closes menu per NAV spec scenarios
- [ ] 4.4 Verify catalog: cards stagger-enter on scroll, hover effects (scale+glow+image parallax) work independently per card, cursor-tracking glow follows mouse per CAT spec scenarios
- [ ] 4.5 Verify showcase: parallax responds to cursor position within bounds, returns to center on leave, variant switch crossfades with dot pulse per SHOW spec scenarios
- [ ] 4.6 Verify scroll-storytelling: timeline scrubs linearly through all 5 scenes, text crossfades, pills appear/disappear, progress bar tracks 0–100%, scene dots light at correct thresholds per SCROLL spec scenarios
- [ ] 4.7 Verify responsive: DevTools device toolbar at 768px, 480px, 375px — layout adapts without overflow, animations remain smooth, mobile pinned section uses reduced params per all Responsive scenarios
