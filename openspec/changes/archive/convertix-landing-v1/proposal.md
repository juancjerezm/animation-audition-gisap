# Proposal: Convertix Landing — Single-File GSAP Demo

## Intent

Build a commercial-grade single-file landing page demo for Convertix Web that showcases GSAP-powered animations: scroll-driven storytelling, product parallax, card hover effects, and interactive navigation. The demo sells the "we can make your product look this good" narrative using a fictional premium wireless earbuds brand.

## Scope

### In Scope
- Single `index.html` with inlined CSS (~300–400 lines) and JS (~400–500 lines)
- 7 sections: Hero, Catalog grid, Product showcase, Commercial catalog, Benefits, Pinned scroll storytelling (5 scenes), Footer/CTA
- GSAP ScrollTrigger pinned mega-timeline with progress bar, floating orbs, pills, scene text transitions
- Fixed header with animated side menu (scroll-to-section links)
- Product parallax (mousemove) + 3-product switch transitions (3 distinct products)
- Responsive: 768px and 480px breakpoints; mobile uses same pin+scrub behavior with reduced duration
- Premium dark theme (blue/purple gradients, Inter typography)

### Out of Scope
- Real product images (Unsplash placeholders only)
- Backend, CMS, form handling, analytics
- GSAP Club plugins (SplitText, ScrambleText)
- Testing infrastructure
- Browser support beyond modern evergreen browsers

## Capabilities

### New Capabilities
- **hero**: Full-viewport entrance with product fade-in, orb pulses, CTA animation
- **navigation**: Fixed header + hamburger-triggered slide menu with scroll-to-section
- **product-catalog**: 3-card grid with hover effects (scale, glow, shadow)
- **product-showcase**: Parallax via mousemove + animated product-switch between 3 products
- **benefits**: Card grid with scroll-reveal staggered entrance
- **scroll-storytelling**: Pinned 5-scene mega-timeline with progress bar, orbs, pills, text layers, CTA
- **cta-footer**: Final commercial CTA with reveal animation, links as `#` placeholders

### Modified Capabilities
None — greenfield project.

## Approach

**Approach A (GSAP CDN free tier)**. Single `index.html` with:
- GSAP 3.12.5 + ScrollTrigger from cdnjs
- Manual text-splitting utility (~20 lines) for stagger effects (no SplitText needed)
- CSS Custom Properties for consistent dark theme
- ScrollTrigger mega-timeline (`pin: true, scrub: 1, end: "+=3000"`) for the storytelling section
- Debounced `resize` handler calling `ScrollTrigger.refresh()`

Mobile: Same pin+scrub but `end: "+=1500"`, reduced orb size/blur, fewer pills.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `index.html` | New | Single-file deliverable: HTML + inlined CSS + inlined JS |
| `openspec/changes/convertix-landing/` | Modified | Added proposal, specs, design, tasks |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Mobile scroll jank with pinned section | Medium | Reduce virtual scroll distance (1500px), smaller orbs, fewer pills |
| CDN unavailability breaks demo | Low | Single widely-available CDN; acceptable for demo |
| Image load failures (Unsplash) | Low | Fallback placeholder colors, `loading="lazy"`, hero preload |

## Rollback Plan

Delete `index.html`. No dependencies, no build artifacts, no database. Project returns to greenfield state.

## Dependencies

- Internet access for GSAP CDN (cdnjs.cloudflare.com)
- Unsplash for placeholder product images (degradable)

## Success Criteria

- [ ] Page loads without console errors in Chrome, Firefox, Edge
- [ ] ScrollTrigger pinned timeline scrubs smoothly through all 5 scenes
- [ ] Side menu opens/closes with animation and scrolls to correct sections
- [ ] Product cards animate on hover consistently
- [ ] Responsive layout works at 768px and 480px breakpoints
- [ ] Progress bar tracks scroll position (0–100%) linearly
- [ ] Visual polish: no layout shifts, consistent spacing, theme coherence
