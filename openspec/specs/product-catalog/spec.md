# Product Catalog Specification

## Purpose

Three-card product grid that showcases Convertix's premium product mockups with sophisticated hover effects. Each card must feel like a high-end e-commerce interaction — depth, glow, and smooth responsive transitions.

## Requirements

### Requirement: Card Grid Layout

The catalog MUST display 3 product cards in a horizontal row using CSS Grid (`grid-template-columns: repeat(3, 1fr)`) with `gap: 32px` (desktop). Cards SHALL have `width: 100%`, `aspect-ratio: 3/4`, `border-radius: 20px`, and a subtle `1px` border in `rgba(124,77,255,0.12)`. Card backgrounds SHALL be `rgba(12, 12, 24, 0.6)` with `backdrop-filter: blur(10px)`. On mobile (<768px), the grid MUST collapse to a single-column vertical stack with cards at `aspect-ratio: 16/10`.

Each card contains: product image (top 60%), product name (below, `font-size: 1.1rem`, `font-weight: 600`), and a short tagline in `rgba(255,255,255,0.5)`.

#### Scenario: Desktop viewport loads catalog section

- GIVEN the viewport is ≥ 768px wide
- WHEN the catalog section enters the viewport
- THEN 3 cards render in a horizontal row with 32px gap
- AND each card has the specified aspect ratio, border, and background
- AND product images, names, and taglines are visible

#### Scenario: Mobile viewport (<768px)

- GIVEN the viewport is < 768px wide
- WHEN the catalog section renders
- THEN cards stack vertically in a single column
- AND each card has `aspect-ratio: 16/10`

### Requirement: Card Hover Effects

On `mouseenter`, each card MUST animate simultaneously:
- `scale: 1 → 1.04` (duration: 350ms, ease: `power2.out`)
- `box-shadow` expands from `0 8px 30px rgba(0,0,0,0.3)` to `0 20px 60px rgba(124,77,255,0.25)`
- Border color transitions from `rgba(124,77,255,0.12)` to `rgba(124,77,255,0.5)`
- A radial glow (`radial-gradient` behind image) fades in at `opacity: 0 → 0.15`, centered on cursor position with `30%` radius
- Product image scales internally to `1.08` with a slight `translateY(-6px)` parallax effect

On `mouseleave`, all properties MUST return to default over 400ms with `ease: "power2.inOut"`. The glow MUST track cursor position within the card (x/y percentage mapped to `background-position` of the radial gradient).

#### Scenario: User hovers a product card

- GIVEN the catalog cards are visible
- WHEN the user moves the cursor over Card 2
- THEN Card 2 scales to 1.04 over 350ms
- AND its shadow expands to `0 20px 60px rgba(124,77,255,0.25)`
- AND its border glows to `rgba(124,77,255,0.5)`
- AND the product image inside scales to 1.08 and shifts up 6px
- AND the radial glow follows the cursor position on the card surface
- AND adjacent cards (1 and 3) remain unchanged

#### Scenario: User moves cursor away from card

- GIVEN Card 2 is in hovered state
- WHEN the user moves the cursor outside Card 2
- THEN all properties (scale, shadow, border, glow, image transform) return to defaults over 400ms

### Requirement: Catalog Scroll Reveal

The 3 cards MUST stagger-enter from below when the catalog section scrolls into view. Using ScrollTrigger, each card SHALL animate from `y: 60, autoAlpha: 0` to `y: 0, autoAlpha: 1` with `stagger: 0.12, duration: 0.6, ease: "power3.out"`. The trigger point is when the section top reaches 75% of viewport height.

#### Scenario: User scrolls catalog into view

- GIVEN the catalog section is below the fold
- WHEN scrolling brings the section top to 75% of viewport height
- THEN Card 1 fades in and rises from y:60
- THEN Card 2 starts 120ms after Card 1
- THEN Card 3 starts 120ms after Card 2
- AND all cards complete their entrance within 1s total
