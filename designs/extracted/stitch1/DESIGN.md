---
name: Ethereal Sketch
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e604d'
  on-secondary: '#ffffff'
  secondary-container: '#e1e1c9'
  on-secondary-container: '#636451'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1d0e'
  on-tertiary-container: '#848571'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e4e4cc'
  secondary-fixed-dim: '#c8c8b0'
  on-secondary-fixed: '#1b1d0e'
  on-secondary-fixed-variant: '#474836'
  tertiary-fixed: '#e4e4cc'
  tertiary-fixed-dim: '#c8c8b1'
  on-tertiary-fixed: '#1b1d0e'
  on-tertiary-fixed-variant: '#474837'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  display:
    fontFamily: Playfair Display
    fontSize: 120px
    fontWeight: '700'
    lineHeight: 110%
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 120%
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 120%
  headline-md:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 120%
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 160%
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 160%
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 100%
    letterSpacing: 0.1em
spacing:
  margin-page: 5vw
  gutter: 2rem
  section-gap: 10rem
  element-gap: 1.5rem
---

## Brand & Style

The design system is centered on a "Digital Atelier" philosophy—blending high-end editorial precision with the raw, intimate touch of a creative professional’s sketchbook. It targets a premium audience that values both technical mastery and artistic soul.

The aesthetic combines **Minimalism** with **Tactile/Sketch** accents. Large, deliberate use of whitespace (breathing room) is punctuated by high-contrast typography and subtle hand-drawn elements (e.g., charcoal-style underlines or scribbled icons) that appear on hover or interaction. This creates a "Living Canvas" effect where the UI feels both prestigious and approachable.

## Colors

This system utilizes a "Paper and Ink" palette to evoke a high-fashion, editorial mood.

*   **Primary Background:** A soft, warm beige (#F5F5DC) serves as the base, reducing the harshness of pure white and providing a gallery-like warmth.
*   **Primary Content:** Deep charcoal (#1A1A1A) is used for all primary typography and structural strokes to maintain a crisp, authoritative presence.
*   **Accent/Surface:** A slightly deeper parchment tone (#E8E8D0) is used for subtle container backgrounds or hover states to maintain the monochromatic warmth.
*   **Neutral:** A mid-tone grey (#757575) is reserved for secondary information and captions to ensure visual hierarchy.

## Typography

The typography strategy relies on the tension between a romantic, high-contrast serif and a utilitarian, modern sans-serif.

*   **Headlines:** Utilize `Playfair Display`. These should be treated as visual anchors. For Display and H1 levels, use tight line spacing and slight negative letter spacing to mimic high-end magazine headers.
*   **Body & Navigation:** Utilize `Inter`. This provides a functional, neutral counterpoint to the expressive headlines. It ensures that long-form text remains highly readable and navigation feels precise.
*   **Labels:** Small caps and increased letter spacing for labels and categories to create a sense of curated organization.

## Layout & Spacing

The layout follows a **Fluid Grid** model with an emphasis on asymmetrical balance. 

*   **Grid:** A 12-column layout is used for desktop, but elements frequently break the grid or overlap with "white space bleed" to reinforce the artistic theme.
*   **Margins:** Generous 5vw side margins ensure content never feels crowded.
*   **Section Gaps:** Large vertical gaps (up to 10rem) are used to separate projects or chapters, forcing the user to slow down and appreciate each piece of content individually.
*   **Mobile:** Transitions to a 4-column layout with 1rem gutters, maintaining the 5vw margin to preserve the "airy" feel on smaller screens.

## Elevation & Depth

This system avoids traditional shadows in favor of **Tonal Layering** and **Sketch Overlays**. 

*   **Tonal Tiers:** Depth is created by placing elements on surfaces that are slightly darker or lighter than the #F5F5DC background. 
*   **Flat & Crisp:** Borders are either 1px solid charcoal (#1A1A1A) or completely absent.
*   **Interactive Sketching:** Depth is suggested through "human" touches. For example, a card might not have a shadow, but rather a hand-drawn "drop shadow" consisting of a few charcoal-style hatch marks that appear only on hover.
*   **Z-Index:** Content overlaps (e.g., text over images) are encouraged to create a collage-like depth without relying on artificial lighting effects.

## Shapes

The shape language is **Sharp (0)**. 

To maintain the sophisticated, high-fashion editorial feel, all containers, buttons, and image frames use 90-degree corners. This evokes the edges of physical paper, canvases, and architectural precision. The only "softness" in the system should come from the hand-drawn interactive elements, providing a stark, intentional contrast to the rigid geometry of the layout.

## Components

### Buttons
Primary buttons are solid #1A1A1A with #F5F5DC text, sharp corners, and no shadow. Secondary buttons use a 1px border. Hover states should trigger a "sketch" effect—perhaps a rough, hand-drawn circle or underline appearing around the text.

### Input Fields
Minimalist 1px bottom-border only. Labels use `label-sm` (uppercase Inter) floating above the line. Focus state thickens the bottom border to 2px charcoal.

### Cards & Portfolio Items
Images should occupy the full width of the card with zero border-radius. Captions use `label-sm` for categories and `headline-md` for titles, placed directly below the image with no containing box.

### Chips & Tags
Simple text-only tags separated by a vertical pipe `|` or a hand-drawn "slash" `/`. No background fills to keep the interface light.

### Interactive "Sketches"
Cursors should change to a pencil or crosshair icon when hovering over interactive "sketch-based" zones. SVG paths for underlines and arrows should have a variable stroke width to mimic charcoal on paper.