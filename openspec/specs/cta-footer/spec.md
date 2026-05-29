# CTA Footer Specification

## Purpose

Final commercial call-to-action section that closes the Convertix narrative with a bold reveal animation, large gradient typography, and a luminous CTA button. This section MUST leave the viewer with the clear message: "Convertix can make YOUR product look this good."

## Requirements

### Requirement: CTA Section Layout

The section SHALL occupy `min-height: 70vh` with `display: flex`, `flex-direction: column`, `align-items: center`, `justify-content: center`. Background MUST be a deep gradient from `#050510` at top to `#0a0a1a` at bottom, with a centered `radial-gradient(ellipse at center, rgba(124,77,255,0.08) 0%, transparent 70%)` ambient glow. A large headline ("¿Listo para que tu producto se vea así?") SHALL use `font-size: clamp(2rem, 5vw, 3.5rem)`, `font-weight: 800`, and a gradient text fill (`#7c4dff → #00b4ff`). Below, a sub-headline in `rgba(255,255,255,0.6)` at `font-size: 1.15rem`. Links/buttons SHALL use `#` placeholders.

#### Scenario: CTA section renders

- GIVEN the page has scrolled to the CTA footer
- WHEN the section is in the DOM
- THEN the background gradient and ambient radial glow are visible
- AND the gradient headline is rendered at responsive font size
- AND the sub-headline appears below
- AND a CTA button is centered below the text

### Requirement: Scroll-Triggered Reveal Animation

The CTA content MUST animate in when the section enters the viewport. Using ScrollTrigger (`start: "top 85%"`), the headline SHALL stagger-enter its characters from `y: 50, autoAlpha: 0` with `stagger: 0.03, ease: "power3.out", duration: 0.6`. The sub-headline enters 150ms after headline completes: `y: 30→0, autoAlpha: 0→1, duration: 0.5`. The CTA button enters last: `scale: 0.7→1, autoAlpha: 0→1, duration: 0.5, ease: "back.out(1.7)"`.

Once revealed, a continuous subtle shimmer animation SHALL run across the headline gradient: a `linear-gradient` at 120% width sweeps left-to-right every 3s via `background-position` animation.

#### Scenario: User scrolls CTA section into view

- GIVEN the CTA footer is below the fold
- WHEN the section top reaches 85% of viewport height
- THEN headline characters stagger in from y:50 over ~0.8s total
- THEN sub-headline fades in 150ms after headline
- THEN CTA button scales in with back.out easing
- AND 500ms after all elements are visible, the headline shimmer animation starts looping

#### Scenario: Section is already visible on page load (short page)

- GIVEN the page height is short enough that the CTA section is in view on load
- WHEN ScrollTrigger initializes
- THEN the reveal animation triggers immediately
- AND no "already-revealed" flicker occurs

### Requirement: CTA Button Design

The CTA button MUST be large (`padding: 18px 48px`, `font-size: 1.15rem`, `border-radius: 50px`), with a `linear-gradient(135deg, #7c4dff, #00b4ff)` background and white text (`font-weight: 700`). On hover: `scale: 1.06`, `box-shadow: 0 0 40px rgba(124,77,255,0.6), 0 0 80px rgba(0,180,255,0.2)` — a dual glow. The gradient SHALL shift 45deg on hover via `background-position` animation. On click: `scale: 0.95` press-down, then return. The button text SHALL be "Cotizar una landing así".

#### Scenario: User hovers CTA button

- GIVEN the CTA button is visible
- WHEN the cursor enters the button
- THEN the button scales to 1.06 with dual-glow shadow over 300ms
- AND the gradient background shifts 45deg position
- AND the text remains crisp white

#### Scenario: User clicks CTA button

- GIVEN the CTA button is visible
- WHEN the user clicks the button
- THEN the button scales to 0.95 for 100ms then returns to 1.0
- AND no navigation occurs (href="#")

### Requirement: Footer Links

Below the CTA button, a horizontal link row SHALL display: "Convertix Web", "Servicios", "Contacto". Links MUST be styled with `color: rgba(255,255,255,0.4)`, `font-size: 0.9rem`, `gap: 32px`. On hover: `color: #7c4dff`, subtle `translateY(-1px)`. Links point to `#` placeholders.

#### Scenario: User hovers footer link

- GIVEN the footer links are visible
- WHEN the cursor enters "Contacto"
- THEN the text color transitions to #7c4dff over 200ms
- AND the link shifts up 1px
