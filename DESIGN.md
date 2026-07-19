# DESIGN.md — Divy Yadav Portfolio
## Single source of design tokens, extracted from Stitch "Ethereal Sketch" system

> **Source**: Three Stitch exports in `designs/` (all three share the same token
> set — `Ethereal Sketch` theme). Reconciled with visual direction in `prompt.md`.
> Do **not** re-derive these by eyeballing screenshots.

---

## 1. Color Tokens

```css
/* ─── Core surfaces ─── */
--color-background:        #F5F5DC; /* warm beige / sketch-bg — dominant surface */
--color-surface:           #fbf9f9; /* near-white surface inside cards */
--color-surface-dim:       #dbdad9; /* dimmed surface / skeleton states */
--color-surface-container: #efeded; /* container backgrounds */
--color-surface-container-low: #f5f3f3;
--color-surface-container-high: #e9e8e7;
--color-surface-container-highest: #e3e2e2; /* deepest tonal tier */
--color-parchment:         #E8E8D0; /* hover / subtle container accent */

/* ─── Ink / text ─── */
--color-ink:               #1b1c1c; /* warm charcoal — all primary text */
--color-ink-secondary:     #444748; /* on-surface-variant — captions, labels */
--color-neutral:           #747878; /* outline / secondary info */
--color-neutral-variant:   #c4c7c7; /* outline-variant / dividers */

/* ─── Accent (one, used sparingly) ─── */
/* prompt.md asks to pick ONE: terracotta | ink-blue | forest-green
   Stitch uses primary = #000000 with secondary in olive (#5e604d).
   Chosen: deep terracotta — warm, editorial, not purple, not generic */
--color-accent:            #B5502D; /* deep terracotta — confirm with Divy */
--color-accent-muted:      #e1e1c9; /* secondary-container — used for tags/chips */

/* ─── Inverse / footer ─── */
--color-inverse-surface:   #303031; /* dark footer / nav reverse mode */
--color-inverse-on-surface: #f2f0f0;
```

---

## 2. Typography

| Role | Family | Size (desktop) | Size (mobile) | Weight | Line-height | Tracking |
|---|---|---|---|---|---|---|
| Display / H1 | Playfair Display | 120px | 48px | 700 | 110% | -0.02em |
| Headline LG | Playfair Display | 64px | 40px | 700 | 120% | — |
| Headline MD | Playfair Display | 48px | 32px | 600 | 120% | — |
| Body LG | DM Sans | 20px | 18px | 400 | 160% | — |
| Body MD | DM Sans | 16px | 15px | 400 | 160% | — |
| Label SM | DM Sans | 12px | 11px | 600 | 100% | 0.1em |

> Stitch spec says `Inter` for body, but `prompt.md` explicitly bans Inter/Roboto/Arial.
> **Substitution: DM Sans** — humanist, geometric, similar rhythm to Inter but with
> more character. Pair: Playfair Display (serif display) + DM Sans (body).

**Google Fonts import:**
```
family=Playfair+Display:ital,wght@0,600;0,700;1,700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400
```

---

## 3. Spacing Scale

| Token | Value | Use |
|---|---|---|
| `--space-page-margin` | 5vw | Horizontal page gutters |
| `--space-gutter` | 2rem | Column gaps |
| `--space-section` | 10rem | Between major page sections |
| `--space-element` | 1.5rem | Between adjacent elements |

---

## 4. Shape Language

- Border-radius: **0** on all cards, image frames, containers
- Sharp 90-degree corners everywhere — evokes cut paper, architectural drawings
- The only "softness" comes from hand-drawn SVG sketch overlays

---

## 5. Elevation / Depth

- **No box-shadows** — depth is tonal only (surface tiers, parchment hover)
- Cards: no shadow; on hover, a rough.js charcoal hatch SVG appears as pseudo-shadow
- 1px `--color-ink` border OR no border — never gradients or glows

---

## 6. Motion Tokens

| Token | Value | Note |
|---|---|---|
| `--ease-out-expo` | `cubic-bezier(0.16,1,0.3,1)` | Primary easing for reveals |
| `--ease-in-out-circ` | `cubic-bezier(0.85,0,0.15,1)` | Page transitions |
| `--duration-fast` | 180ms | Hover micro-interactions |
| `--duration-base` | 350ms | Component entry animations |
| `--duration-slow` | 700ms | Scroll-triggered section reveals |
| Lenis lerp | 0.08 | Responsive smooth-scroll feel |

---

## 7. Sketch Accent Rules

> **Golden rule**: restrained accents at interaction boundaries — NOT ambient decoration.

- Used on: section dividers, heading underlines, callout annotations, skill tags
- Library: `rough-notation` + `roughjs`
- Stroke: variable width 1–2.5px, charcoal `#1b1c1c`, roughness factor 1.5–2.5
- Timing: underlines animate in on scroll or hover — not all at once on load
- Cursor: crosshair in sketch-interactive zones

---

## 8. 3D Hero Token

- Material: MeshPhysicalMaterial, metalness 0.9, roughness 0.1, env map
- Background: `#F5F5DC` (warm beige)
- Lighting: warm ambient + single directional key, no blue-toned HDRI
- Rotation: slow auto-rotation (0.003 rad/frame), responds to cursor
- Mobile fallback: static 2D SVG of sketched form (per stitch0 screen reference)
- `prefers-reduced-motion`: disable rotation, show static pose

---

## 9. Reconciliation — Clean vs. Sketched

**Two tensions held together intentionally:**
1. Disciplined grid + generous whitespace → premium editorial signal
2. Restrained sketch accents at interaction edges → "Illustrated by Divy" identity

Rule: sketch appears **at interaction boundaries** (hover, scroll-entry, section edge).

---

*Phase 0 extraction — confirm `--color-accent` terracotta vs. other options with Divy.*
