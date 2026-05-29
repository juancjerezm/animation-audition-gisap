# Benefits Specification

## Purpose

A card grid showcasing Convertix's value propositions (4 benefit cards) with elegant scroll-reveal stagger entrance. Each card combines an icon, headline, and description with premium glassmorphism styling that reinforces the high-end design narrative.

## Requirements

### Requirement: Benefits Card Grid Layout

The section MUST display 4 benefit cards in a 2×2 grid on desktop (`grid-template-columns: repeat(2, 1fr)`, `gap: 28px`). On tablet (<1024px), the grid SHALL switch to 2×2 with reduced gap. On mobile (<768px), the grid MUST collapse to a single-column stack.

Each card SHALL have: `padding: 32px`, `border-radius: 20px`, `background: rgba(12, 12, 24, 0.5)`, `backdrop-filter: blur(12px)`, and a `1px` border in `rgba(255,255,255,0.06)`. Cards contain: a 48px icon area (top-left), a headline (`font-size: 1.25rem`, `font-weight: 700`), and a description paragraph in `rgba(255,255,255,0.6)`. Icon backgrounds SHALL be gradient circles (`width: 56px`, `height: 56px`, `border-radius: 50%`) using a custom gradient per card.

#### Scenario: Desktop viewport loads benefits section

- GIVEN the viewport is ≥ 1024px
- WHEN the benefits section renders
- THEN 4 cards appear in a 2×2 grid with 28px gap
- AND each card renders with icon, headline, description, and glassmorphism styling

### Requirement: Scroll-Reveal Staggered Entrance

When the benefits section scrolls into view, the 4 cards MUST animate in with a staggered bottom-to-top reveal. Using ScrollTrigger (`start: "top 80%"`), each card SHALL animate from `y: 80`, `autoAlpha: 0`, `scale: 0.92` to `y: 0`, `autoAlpha: 1`, `scale: 1` with `stagger: 0.15`, `duration: 0.7`, `ease: "power3.out"`. Cards enter in reading order: top-left, top-right, bottom-left, bottom-right. The section headline ("Lo que hacemos distinto") SHALL enter first with a solo animation (`y: 40 → 0`, `autoAlpha: 0 → 1`) before the card stagger begins.

#### Scenario: User scrolls benefits section into view

- GIVEN the benefits section is below the fold
- WHEN the section top reaches 80% of viewport height
- THEN the section headline fades in and rises from y:40
- AND after headline completes, Card TL enters, followed by Card TR (150ms later), Card BL (150ms), Card BR (150ms)
- AND each card animates from `scale: 0.92, y: 80` to full visibility in 700ms
- AND all cards are fully visible within 1.15s of the trigger point

#### Scenario: User scrolls quickly past the section (scrub edge case)

- GIVEN the user scrolls rapidly so the trigger passes instantly
- WHEN ScrollTrigger fires with the section already past the trigger point
- THEN cards snap to their final state (`y: 0, autoAlpha: 1, scale: 1`) without animation jank
- AND no partially-animated cards remain visible

### Requirement: Card Hover Accent

On hover, each card SHALL subtly elevate: `translateY: -6px`, `box-shadow: 0 16px 40px rgba(124,77,255,0.12)`, and border transitions to `rgba(124,77,255,0.3)` over 300ms `power2.out`. The icon gradient SHALL shift hue by 20deg. On `mouseleave`, all properties return over 400ms.

#### Scenario: User hovers a benefit card

- GIVEN the benefits cards are visible
- WHEN the cursor enters a card
- THEN the card rises 6px with shadow expansion over 300ms
- AND the border gains purple tint
- AND the icon gradient hue-shifts
