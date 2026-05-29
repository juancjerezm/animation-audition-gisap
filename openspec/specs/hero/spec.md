# Hero Specification

## Purpose

Full-viewport entrance section that establishes the Convertix premium brand through layered GSAP animations. The hero MUST deliver an immediate "wow" moment — product reveal, ambient orb breathing, and elegant CTA — all sequenced to feel like a premium product film opening.

## Requirements

### Requirement: Hero Entrance Animation Sequence

The system MUST animate the hero section in a choreographed 3-phase sequence on page load, synchronized via a GSAP timeline with staggered easing.

**Phase 1 — Atmosphere (0–400ms)**: Background gradient fades in from `#050510` to a luminous `radial-gradient` at center with ellipse shape using `#1a1040 → #0d0d1a`. Two large background orbs (`max-width: 500px`, `blur: 120px`) fade in at `opacity: 0.18` — orb‑1 (`#7c4dff`) drifts right, orb‑2 (`#00b4ff`) drifts left, both with `scale: 0.8 → 1.0`.

**Phase 2 — Product Reveal (400–900ms)**: Product image fades in (`autoAlpha: 0 → 1`, `scale: 0.75 → 1.02 → 1.0` with elastic ease) and floats upward `y: +60 → 0`. A soft `drop-shadow(0 0 60px rgba(124,77,255,0.35))` bloom animates on.

**Phase 3 — Text & CTA (900–1400ms)**: Headline text (split into chars/spans) staggers in from below (`y: +40 → 0`, `autoAlpha: 0 → 1`, `stagger: 0.04`). CTA button scales from `0.6 → 1.0` with `elastic.inOut(1, 0.5)`, and its gradient border glow pulses once at full scale. A subtle `50px` vertical parallax offset is applied to product vs text during initial entrance.

#### Scenario: First-time page load

- GIVEN the page has fully loaded and GSAP is registered
- WHEN the hero timeline fires on DOMContentLoaded (after 200ms delay for layout stability)
- THEN the background gradient and dual orbs fade in within 400ms
- AND the product image scales from 0.75 to 1.0 with elastic ease within 500ms
- AND the headline characters stagger in from `y: 40` with 0.04s stagger within 500ms
- AND the CTA button scales in with elastic.inOut and its glow pulses once at full size
- AND no layout shift occurs during any animation frame

#### Scenario: Rapid page refresh (animation already cached in browser)

- GIVEN the page is refreshed mid-animation or immediately after
- WHEN the new page load triggers the hero timeline
- THEN all GSAP tweens are killed and recreated cleanly (no double-animation)
- AND the entrance sequence replays from the beginning

### Requirement: Orb Breathing Loop

After the entrance sequence completes, the two background orbs MUST enter a continuous, subtle floating loop.

Each orb independently drifts with `gsap.to` using `repeat: -1, yoyo: true, ease: "sine.inOut"`. Orb‑1: `x: "+=40", y: "-=25", scale: 1.08`, duration 6s. Orb‑2: `x: "-=35", y: "+=20", scale: 0.95`, duration 7s. Colors SHALL remain `#7c4dff` (purple) and `#00b4ff` (cyan) with `blur(120px)` and `opacity: 0.15–0.22` range. No fade-out — orbs persist indefinitely.

#### Scenario: Idle hero after entrance

- GIVEN the hero entrance timeline has completed
- WHEN 500ms elapses after entrance completion
- THEN orb‑1 begins drifting right-and-up over 6s in a yoyo loop
- AND orb‑2 begins drifting left-and-down over 7s in a yoyo loop
- AND both orbs remain within their opacity range without ever reaching 0

### Requirement: Hero CTA Button

The CTA button MUST feature a gradient background transitioning from `#7c4dff` to `#00b4ff`, white text, and `border-radius: 50px`. On hover: `scale: 1.05`, `box-shadow: 0 0 30px rgba(124,77,255,0.5)` expansion, and background brightens 10%. On click: brief `scale: 0.96` press-down. The button text SHALL be "Ver cómo funciona" with a subtle right-arrow icon that shifts `x: +4` on hover.

#### Scenario: User hovers CTA button

- GIVEN the hero entrance has completed and the CTA is visible
- WHEN the user moves the cursor over the CTA button
- THEN the button scales to 1.05 over 250ms with ease `power2.out`
- AND the glow shadow expands from 0 to 30px blur over the same duration
- AND the arrow icon shifts right 4px

#### Scenario: User clicks CTA button

- GIVEN the CTA is visible
- WHEN the user clicks the CTA button
- THEN the button scales to 0.96 for 100ms then returns to 1.0
- AND the page must scroll smoothly to the scroll-storytelling section (`behavior: smooth`)
