# Product Showcase Specification

## Purpose

Interactive product display with mousemove parallax and animated 3-product switch transitions. The goal is to make the product feel alive — responding to cursor with depth and switching variants with a satisfying animated dissolve.

## Requirements

### Requirement: Mousemove Parallax

The product image container MUST respond to cursor position within its bounds using GSAP `quickTo` for performant updates. As the cursor moves, the product image SHALL tilt within a `±15px` range on X and `±10px` range on Y (relative to its center), with the background glow shifting in the opposite direction at 50% intensity. A subtle `rotateY` and `rotateX` (max `±3deg`) derived from cursor offset SHALL create a 3D card-like tilt effect. All transforms MUST use `transform` (not `top`/`left`) for GPU acceleration.

The response MUST be clamped — cursor 0% → offset `-15px`, cursor 50% → `0px`, cursor 100% → `+15px`. Outside the container, the image returns to center with a smooth 600ms `power2.out` reset.

#### Scenario: Cursor moves across product container

- GIVEN the product showcase section is in view
- WHEN the user moves the cursor from left edge to center of the product container
- THEN the product image shifts from `translateX(-15px)` to `translateX(0)` smoothly
- AND the background glow shifts in the opposite direction at ~7.5px
- AND the `rotateY` interpolates from `-3deg` to `0deg`

#### Scenario: Cursor leaves product container

- GIVEN the cursor was at the right edge (image offset +15px)
- WHEN the user moves the cursor outside the product container
- THEN the image returns to `translateX(0), translateY(0), rotateY(0), rotateX(0)` over 600ms
- AND the background glow centers itself over the same duration

### Requirement: Product Variant Switch

Three product variants (color variations of the same product) MUST be switchable via clickable dot indicators below the product. Each dot SHALL be `12px` with `border-radius: 50%`, filled with the variant's accent color. The active dot uses a `2px` glowing ring in `#7c4dff` and `scale: 1.2`.

On dot click, the current product image MUST fade out (`autoAlpha: 1 → 0`, `scale: 1 → 0.95`, duration: 250ms) while the new product image fades in (`autoAlpha: 0 → 1`, `scale: 1.05 → 1`, duration: 350ms, with 50ms overlap). During transition, a brief radial color flash at the dot's accent color pulses from the dot position outward at `150px` radius, `opacity: 0.3 → 0`, duration 400ms. The product name below SHALL crossfade to the new variant name over 200ms.

Clicking the currently active dot MUST do nothing (no redundant animation).

#### Scenario: User clicks a different variant dot

- GIVEN Variant 1 (purple) is currently displayed
- WHEN the user clicks the Variant 2 dot (cyan)
- THEN the purple product image fades out over 250ms
- AND the cyan product image fades in over 350ms (50ms overlap)
- AND a cyan radial flash pulses from the dot over 400ms
- AND the product name crossfades to the new variant name
- AND the cyan dot gains the active ring and scales to 1.2
- AND the purple dot ring fades out and scales back to 1.0

#### Scenario: User clicks already-active variant dot

- GIVEN Variant 2 is currently displayed and active
- WHEN the user clicks the Variant 2 dot again
- THEN no animation triggers
- AND no image or dot state changes

### Requirement: Responsive Parallax

On mobile (<768px), the parallax intensity MUST be reduced to 50% (`±7.5px` max, `±1.5deg` max) to account for smaller viewport and touch interactions. Touch events SHALL be used instead of mousemove; the image responds to the touch point using the same logic.

#### Scenario: Touch interaction on mobile

- GIVEN the viewport is < 768px
- WHEN the user touches and drags across the product container
- THEN the product image tilts with max `±7.5px` offset and `±1.5deg` rotation
- AND the 3D tilt effect remains active but at reduced intensity
