# Scroll Storytelling Specification

## Purpose

The centerpiece of the Convertix landing page — a GSAP ScrollTrigger pinned mega-timeline delivering a premium brand film experience across 5 sequential scenes. This section MUST be the most visually impressive moment on the page, combining product transforms, floating orbs, feature pills, layered text transitions, a progress bar, and a culminating CTA. Think Apple keynote product reveals — depth, luminosity, and precision.

## Requirements

### Requirement: Pinned Mega-Timeline Structure

The section MUST pin for a virtual scroll distance of `3000px` on desktop (`1500px` on <768px mobile) using `ScrollTrigger({ trigger, start: "top top", end: "+=3000", scrub: 1, pin: true, pinSpacing: true })`. The timeline SHALL drive 5 sequential scenes mapped to progress ranges: Scene 1 (0–20%), Scene 2 (20–40%), Scene 3 (40–60%), Scene 4 (60–80%), Scene 5 (80–100%). Each scene transition MUST crossfade text layers over 200ms overlap. All timeline tweens SHALL use `ease: "none"` for smooth scrubbing. The ScrollTrigger `onUpdate` callback MUST drive the progress bar and scene indicators.

Desktop layout: product image centered, text layers below, orbs behind product, pills floating around product, progress bar fixed at section top. Mobile: same behavior but reduced orb count (2→1), reduced pill count (4→2), and product at 70% scale.

#### Scenario: User scrolls through pinned section on desktop

- GIVEN the scroll-storytelling section is pinned at the top of the viewport
- WHEN the user scrolls from 0 to 3000 virtual pixels
- THEN the timeline progresses linearly through all 5 scenes
- AND the progress bar tracks 0→100% width
- AND scene indicator dots light up at 20%, 40%, 60%, 80% progress
- AND text layers crossfade between scenes
- AND orbs float continuously through all scenes

#### Scenario: User scrolls through pinned section on mobile (<768px)

- GIVEN the viewport is < 768px
- WHEN the user scrolls through the pinned section (1500px virtual distance)
- THEN all 5 scenes play with the same timing proportions
- AND only 1 orb is visible
- AND only 2 pills appear
- AND the product displays at 70% scale

### Requirement: Five-Scene Narrative Sequence

Each scene MUST animate distinct visual elements as defined below. Text layers SHALL use manual character-splitting for letter-by-letter stagger effects (no SplitText dependency).

**Scene 1 — "Mirá cómo cobra vida" (0–20%)**: Product fades in (`autoAlpha: 0→1`, `scale: 0.8→1`, `y: 80→0`). Both orbs begin floating animation. Scene 1 text ("Mirá cómo cobra vida") staggers in from `y: 30`. Scene 2–5 text and pills remain hidden.

**Scene 2 — "Tu producto como protagonista" (20–40%)**: Scene 1 text fades out (`autoAlpha: 1→0`, `y: 0→-20`). Scene 2 text fades in (`autoAlpha: 0→1`, `y: 30→0`). Product scales to `1.08` with a subtle `drop-shadow(0 0 50px rgba(124,77,255,0.35))`. Pills 1–4 stagger in from random angles (±45deg, `autoAlpha: 0→1`, `scale: 0.5→1`) using `stagger: 0.1`.

**Scene 3 — "Cada detalle comunica valor" (20%→40%)**: Scene 2 text fades out. Scene 3 text fades in. Product returns to `scale: 1.0` but gains `filter: brightness(1.1) saturate(1.2)`. Orb opacity intensifies to `0.28` and orb‑1 gains `scale: 1.4`, orb‑2 `scale: 1.2`. Pills begin a slow orbital drift around the product with each pill bobbing (`y: "±8px"`, `repeat: -1, yoyo: true`).

**Scene 4 — "Una experiencia que vende" (60%→80%)**: Scene 3 text fades out. Scene 4 text fades in. Background darkens via an overlay (`opacity: 0→0.35`, `background: radial-gradient(ellipse at center, transparent 40%, #050510 100%)`). Product glow intensifies: `drop-shadow(0 0 80px rgba(124,77,255,0.5))` and a second glow in cyan: `drop-shadow(0 0 40px rgba(0,180,255,0.3))`. Pills fade out collectively. Orbs slow their drift, increase blur to `140px`.

**Scene 5 — "Convertix Web lo hace posible" + CTA (80%→100%)**: Scene 4 text fades out. Product scales down to `0.7` and fades to `autoAlpha: 0.5`. Scene 5 text fades in centered. CTA button scales from 0→1 with `elastic.out(1, 0.4)`. Progress bar reaches 100%. A final luminous flare (`radial-gradient` at center, `opacity: 0→0.15→0`, `scale: 0→2`, duration: 300ms) marks completion.

#### Scenario: Scene 1 — product entrance

- GIVEN the scroll section is pinned and progress is between 0–20%
- WHEN the user scrolls down the first 600px of virtual distance
- THEN the product fades in from scale 0.8 and y:80
- AND Scene 1 text characters stagger in
- AND both orbs begin their floating animations

#### Scenario: Scene 2 — product detail + pills

- GIVEN scroll progress enters 20–40% range
- WHEN scene 2 activates
- THEN Scene 1 text fades out upward
- AND Scene 2 text fades in from below
- AND product scales to 1.08 with purple glow shadow
- AND all 4 pills stagger in from random angles

#### Scenario: Scene 5 — final CTA

- GIVEN scroll progress enters 80–100% range
- WHEN scene 5 activates
- THEN product scales down and fades
- AND CTA button scales in with elastic.out
- AND final luminous flare flashes at 100%
- AND Scene 5 text is centered and fully visible
- AND progress bar shows 100%

### Requirement: Progress Bar

A fixed progress bar MUST sit at the top of the pinned section (`height: 4px`, `width: 100%`). Its fill SHALL be a `linear-gradient(to right, #7c4dff, #00b4ff)` whose width animates from 0% to 100% linearly with ScrollTrigger progress, driven by `onUpdate`. Below the bar, 4 scene indicator dots (at 25%, 50%, 75%, 100% of the bar) MUST light up (`scale: 0.6→1`, `background: #7c4dff`, `box-shadow: 0 0 8px #7c4dff`) when progress passes their threshold. The current scene's dot SHALL pulse with a 1.5s `repeat: -1` glow animation.

#### Scenario: Progress at 35%

- GIVEN the scroll section is active and progress is at 35%
- WHEN the `onUpdate` callback fires
- THEN the progress bar fill width is 35%
- AND the first scene indicator dot (at 25%) is lit with glow
- AND the second dot (50%) remains dim

### Requirement: Background Orbs (Desktop)

Two orbs MUST float behind the product throughout all 5 scenes. Orb‑1: `#7c4dff` (purple), `width: 400px`, `height: 400px`, `border-radius: 50%`, `filter: blur(100px)`, initial `opacity: 0.18`. Orb‑2: `#00b4ff` (cyan), `width: 300px`, `height: 300px`, `filter: blur(90px)`, initial `opacity: 0.15`. Orbs SHALL continuously drift using standalone GSAP tweens (`repeat: -1, yoyo: true, ease: "sine.inOut"`): Orb‑1 drifts `x: "+=60", y: "-=40"` over 8s, Orb‑2 drifts `x: "-=50", y: "+=30"` over 7s.

During Scene 3, orb opacity MUST intensify to 0.28 (p1) and 0.22 (p2). During Scene 4, orb blur MUST increase to 140px/120px. During Scene 5, orbs SHALL fade to opacity 0.08 as focus shifts to the CTA.

#### Scenario: Orbs during Scene 3 (value communication)

- GIVEN scroll progress is between 40–60%
- WHEN Scene 3 is active
- THEN Orb‑1 opacity is 0.28 and scale is 1.4
- THEN Orb‑2 opacity is 0.22 and scale is 1.2
- AND both orbs continue their independent drift loops

### Requirement: Feature Pills

Four pill-shaped tags MUST appear during Scene 2 and persist through Scene 3. Each pill SHALL have: `padding: 8px 20px`, `border-radius: 50px`, `background: rgba(12,12,24,0.8)`, `border: 1px solid rgba(124,77,255,0.3)`, `backdrop-filter: blur(8px)`, `font-size: 0.85rem`. Pill labels: "GSAP", "Scroll Narrativo", "Microinteracciones", "Diseño Premium". During Scene 2 entrance, pills stagger in from random angles with `autoAlpha: 0→1, scale: 0.5→1, rotate: ±15deg→0`. During Scene 3, each pill enters a gentle bobbing loop (`y: "±6px"`, `duration: 3–4s` each, staggered). All pills MUST fade out collectively in Scene 4 (`autoAlpha: 1→0`, `scale: 1→0.8`, `duration: 250ms`).

#### Scenario: Pills appear in Scene 2

- GIVEN scroll progress crosses 20%
- WHEN Scene 2 activates
- THEN pill "GSAP" fades in from x:-40 with -15deg rotation
- THEN pill "Scroll Narrativo" follows from x:40 with +15deg (100ms later)
- THEN "Microinteracciones" and "Diseño Premium" follow with stagger
- AND all pills reach full visibility at scale:1, rotate:0

#### Scenario: Pills disappear in Scene 4

- GIVEN scroll progress crosses 60%
- WHEN Scene 4 activates
- THEN all 4 pills fade out and scale to 0.8 simultaneously over 250ms
- AND no pill remnants remain after 250ms

### Requirement: Mobile Adaptation

On viewports < 768px, the pinned section MUST adapt: virtual scroll SHALL be `1500px`, only 1 orb (purple, 200px, blur 60px), only 2 pills, product at `max-width: 70%`, text at `font-size: 90%`, and `scrub: 1.5` for smoother mobile feel. The 5-scene structure and timing proportions MUST remain identical.

#### Scenario: Mobile device scrolls pinned section

- GIVEN the viewport is 375px wide (mobile)
- WHEN the user scrolls through the 1500px pinned section
- THEN all 5 scenes animate with proportional timing
- AND only Orb‑1 is visible (200px, blur 60px)
- AND only 2 pills ("GSAP", "Premium") appear
- AND scrubbing uses 1.5s smooth catch-up
- AND frame rate remains ≥ 30fps (no jank on mid-range devices)
