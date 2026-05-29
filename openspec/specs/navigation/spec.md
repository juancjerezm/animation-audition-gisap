# Navigation Specification

## Purpose

Fixed header with premium backdrop-blur glassmorphism and an animated hamburger-triggered slide menu that navigates to all 7 sections. The navigation MUST feel luxurious — smooth transitions, subtle hover glows, and a satisfying menu toggle morph.

## Requirements

### Requirement: Fixed Header with Glassmorphism

The header MUST be fixed at the top of the viewport with `z-index: 1000`. It SHALL use `backdrop-filter: blur(20px) saturate(180%)` over a `rgba(5, 5, 16, 0.7)` background, creating a frosted-glass effect. The header height SHALL be `70px` on desktop, `56px` on mobile. A subtle `1px` bottom border with `linear-gradient(to right, transparent, rgba(124,77,255,0.3), transparent)` separates header from content.

Logo text "Convertix" MUST appear in the top-left with `font-weight: 700`, `letter-spacing: 0.5px`, and a gradient text fill (`#7c4dff → #00b4ff`) applied via `background-clip: text`. On scroll past 100px, a subtle `box-shadow: 0 4px 30px rgba(0,0,0,0.3)` SHALL appear.

#### Scenario: Page at top (scrollY = 0)

- GIVEN the page is scrolled to the very top
- WHEN the header renders
- THEN the header background is `rgba(5, 5, 16, 0.7)` with `backdrop-filter: blur(20px)`
- AND no box-shadow is visible on the header
- AND the logo gradient text is visible at full opacity

#### Scenario: User scrolls past 100px

- GIVEN the user has scrolled down more than 100px
- WHEN ScrollTrigger detects scroll position > 100
- THEN a `box-shadow: 0 4px 30px rgba(0,0,0,0.3)` animates onto the header over 300ms
- AND the header background intensifies to `rgba(5, 5, 16, 0.85)`

### Requirement: Animated Hamburger Menu Toggle

The hamburger icon MUST consist of three horizontal lines (`width: 24px`, `height: 2px`, `background: #fff`). On click, the icon MUST morph into an "X": top line rotates `45deg` + translates down, bottom line rotates `-45deg` + translates up, middle line fades to `opacity: 0`. All transforms use `duration: 350ms, ease: "power3.inOut"`. The icon SHALL have a `border-radius: 50%` hover background of `rgba(124,77,255,0.15)` that expands and fades on mouseleave.

#### Scenario: User clicks hamburger to open menu

- GIVEN the menu is closed and the hamburger shows three parallel lines
- WHEN the user clicks the hamburger icon
- THEN lines 1 and 3 rotate ±45deg and translate into an X over 350ms
- AND line 2 fades to opacity 0 over 200ms
- AND the purple hover circle background fades out if present
- AND the slide menu opens (see Menu Overlay requirement)

#### Scenario: User clicks hamburger to close menu

- GIVEN the menu is open and the hamburger shows an X
- WHEN the user clicks the hamburger icon
- THEN the X morphs back to three parallel lines over 350ms
- AND the slide menu closes simultaneously

### Requirement: Slide Menu Overlay

The menu overlay MUST slide in from the right (`x: "100vw → 0"`) with `width: 380px` (desktop) or `100vw` (mobile), `duration: 450ms`, `ease: "power3.inOut"`. Background SHALL be `rgba(8, 8, 20, 0.97)` with `backdrop-filter: blur(30px)`. Menu links (7 items, one per section) MUST stagger in from `x: +30, autoAlpha: 0` with `stagger: 0.06, delay: 0.2` after overlay opens. Each link has gradient text on hover (`#7c4dff → #00b4ff`), `translateX: +8` shift, and a left-side accent bar that fades in. Active/current section link SHALL show the accent bar permanently.

Clicking any link MUST close the menu (reverse stagger, then overlay slides right), then scroll smoothly to the target section. A semi-transparent backdrop (`rgba(0,0,0,0.5)`) SHALL fade in behind the menu and close the menu on click.

#### Scenario: Menu opens via hamburger click

- GIVEN the menu is closed
- WHEN the user clicks the hamburger
- THEN the overlay slides from right over 450ms with `power3.inOut`
- AND the backdrop fades in behind the menu
- AND 200ms after overlay starts, the 7 nav links stagger in from `x: 30`
- AND the link corresponding to the currently visible section has its accent bar visible

#### Scenario: User clicks a menu link

- GIVEN the menu is open with all links visible
- WHEN the user clicks "Scroll Storytelling" (or any section link)
- THEN the links stagger out in reverse order
- AND the overlay slides back to the right over 350ms
- AND the backdrop fades out
- AND the page scrolls smoothly to the target section's `id` anchor
- AND the hamburger icon morphs back to three lines

#### Scenario: User clicks the backdrop

- GIVEN the menu is open
- WHEN the user clicks the backdrop area (outside the menu panel)
- THEN the menu closes with the same animation as clicking a link
