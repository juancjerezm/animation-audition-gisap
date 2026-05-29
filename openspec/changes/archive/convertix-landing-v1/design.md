# Design: Convertix Landing — GSAP Single-File Demo

## Technical Approach

Single `index.html` with inlined CSS (~350 lines) and JS (~450 lines). GSAP 3.12.5 + ScrollTrigger from cdnjs (free tier). Manual text-splitting utility replaces SplitText. All animations use `transform` and `opacity` exclusively — no width/height/top/left animations. CSS Custom Properties on `:root` drive the dark theme. ScrollTrigger `matchMedia()` handles responsive animation parameters across 768px breakpoint.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|-------------|-----------|
| Timeline strategy | Master scrub timeline for scroll-storytelling; independent ScrollTriggers for hero/catalog/benefits/cta | Single mega-timeline for all sections | Pinned section needs fine-grained scrub across 5 scenes; other sections are fire-once reveals with different trigger logic |
| Text splitting | Manual JS utility (~20 lines) wrapping chars in `<span>` | GSAP SplitText (Club, paid) | Free tier, self-contained; 20-line utility covers letter-by-letter stagger for all 7 text animations |
| Responsive GSAP | `ScrollTrigger.matchMedia()` | Inline conditionals + manual refresh | matchMedia handles kill/recreate on resize automatically, cleaner than if/else |
| CSS architecture | Custom Properties + BEM | Tailwind, CSS Modules | No build step, consistent theming across 7 sections, breakpoint overrides trivial |
| Product images | Unsplash CDN URLs with `loading="lazy"` + placeholder gradient fallback | Local assets, data URIs | Keeps single-file portable; placeholder gradient prevents layout shift on load failure |

## CSS Custom Properties

```css
:root {
  --bg-deep: #050510; --bg-dark: #0a0a1a; --bg-card: rgba(12,12,24,0.6);
  --purple: #7c4dff; --cyan: #00b4ff;
  --text-primary: #fff; --text-muted: rgba(255,255,255,0.5);
  --glass-border: rgba(124,77,255,0.12); --glass-blur: blur(12px);
  --radius-card: 20px; --radius-pill: 50px;
  --font: 'Inter', system-ui, sans-serif;
  --header-h: 70px;
}

@media (max-width: 767px) { :root { --header-h: 56px; } }
```

## GSAP Timeline Architecture

### Hero Entrance (page load, `delay: 0.2`)
```
tlHero
  0.0s: bg gradient + orbs fade in (autoAlpha, scale 0.8→1)
  0.4s: product enters (scale 0.75→1.02→1.0, elastic, y:60→0)
  0.9s: headline chars stagger (y:40→0, stagger:0.04, split)
  1.3s: CTA button (scale 0.6→1, elastic.inOut)
  2.0s: orb floating loops begin (standalone, repeat:-1, yoyo)
```

### Navigation
```
tlMenu (open): overlay x:100vw→0 (450ms, power3.inOut) → links stagger x:30→0 (delay:0.2, stagger:0.06)
tlMenu (close): reverse stagger → overlay x→100vw (350ms)
hamburger: line1 rotate 45deg, line3 rotate -45deg, line2 fade out
```

### Product Showcase — Parallax + Switch
```js
// Parallax: quickTo for GPU-friendly per-frame updates
quickTo(".showcase-product", "x", clamp(-15,15) from cursor%)
quickTo(".showcase-product", "y", clamp(-10,10))
quickTo(".showcase-glow", "xPercent", cursorX * 0.5)

// Switch: crossfade timeline
tlSwitch: currentOut(autoAlpha:0, scale:0.95, 250ms)
        | newIn(autoAlpha:1, scale:1.05→1, 350ms, overlap 50ms)
        | dotPulse(radial flash, 400ms)
```

### Scroll Storytelling Mega-Timeline (the crown jewel)

```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scroll-section", start: "top top",
    end: "+=3000", scrub: 1, pin: true, pinSpacing: true,
    onUpdate: (self) => {
      gsap.set(".progress-fill", { width: self.progress * 100 + "%" });
      updateSceneDots(self.progress);
    }
  }
});
```

**Timeline tween map** (all `ease: "none"`, positions as progress fractions):

| Progress | What Happens |
|----------|-------------|
| 0.00–0.20 | Product fades in (scale 0.8→1, y:80→0); Scene1 text ("Mirá cómo cobra vida") chars stagger in from y:30; orbs start drift |
| 0.20–0.40 | Scene1 text out (y:-20, autoAlpha:0); Scene2 text in (y:30→0); product → scale 1.08 + `drop-shadow(0 0 50px rgba(124,77,255,0.35))`; 4 pills stagger in from ±45deg |
| 0.40–0.60 | Scene2 text out; Scene3 text in; product returns to scale 1.0 + brightness/saturate boost; orbs intensify opacity 0.18→0.28; pills bob (y:±8px, standalone) |
| 0.60–0.80 | Scene3 text out; Scene4 text in; bg darkens (overlay opacity 0→0.35); product dual glow (purple + cyan drop-shadow); pills collective fade out (scale 1→0.8); orbs slow + blur ↑ |
| 0.80–1.00 | Scene4 text out; product scale→0.7 + fade; Scene5 text in ("Convertix Web lo hace posible"); CTA scales in (0→1, elastic.out); progress bar→100%; luminous flare at completion |

### ScrollReveal Sections (catalog, benefits, cta-footer)
Each uses independent `ScrollTrigger` at `start: "top 75–85%"` with `stagger: 0.12–0.15` from `y:60–80, autoAlpha:0`.

## Responsive Strategy

| Property | Desktop (≥768px) | Mobile (<768px) |
|----------|-----------------|-----------------|
| Scroll virtual distance | `+=3000` | `+=1500` |
| Scrub | `1` | `1.5` |
| Orbs | 2 (400px/300px, blur 100px/90px) | 1 (200px, blur 60px) |
| Pills | 4 | 2 ("GSAP", "Premium") |
| Product scale | 1.0 | 0.7 |
| Parallax max offset | ±15px, ±3deg | ±7.5px, ±1.5deg |
| Menu width | 380px | 100vw |
| Card grid | 3-col / 2×2 | 1-col stack |

GSAP parameters set inside `ScrollTrigger.matchMedia({ "(min-width: 768px)": {...}, "(max-width: 767px)": {...} })`. Debounced `resize` at 200ms calls `ScrollTrigger.refresh()`.

## Performance Constraints

- **Composite-only**: All GSAP tweens target `transform` and `opacity`. Blur applied via CSS, never GSAP-tweened.
- **Mousemove**: `quickTo()` setters bypass GSAP's ticker for per-frame updates.
- **`will-change`**: Set on `.scroll-product`, `.showcase-product`, `.orb` elements.
- **Mobile**: `will-change` removed on touch devices; reduced blur radii.
- **Images**: `loading="lazy"` on all except hero; `decoding="async"`.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `index.html` | Create | All HTML (~200 lines), CSS (~350 lines), JS (~450 lines) in single file |

## Testing Strategy

No automated test infrastructure. Manual verification checklist:

| Check | Method |
|-------|--------|
| 7 sections render without console errors | Chrome/FF/Edge DevTools |
| ScrollTrigger pinned timeline scrubs 5 scenes | Visual scroll test |
| Side menu opens/closes + navigates | Click test all 7 links |
| Product cards hover + parallax + switch | Mouse interaction test |
| Responsive at 768px, 480px, 375px | DevTools device toolbar |
| Progress bar tracks 0–100% linearly | Visual + `onUpdate` log |
| 60fps sustained during scrub | Chrome Performance panel |

## Open Questions

None blocking — all exploration.md defaults accepted (wireless earbuds product, functional menu, pin+scrub mobile, `#` CTA links, 3 color variants).
