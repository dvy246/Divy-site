<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Divy Yadav Atelier — Agent Guidelines

This document outlines the architectural, aesthetic, and behavioral principles governing this codebase. Future AI agents modifying this repository must follow these rules without exception.

---

## 1. Core Technology Stack
- **Framework:** Next.js (App Router, static compilation prerendering).
- **Styling:** Tailwind CSS v4.
  * Configured via `@import "tailwindcss"` and `@theme` parameters in [app/globals.css](file:///Users/divyyadav/Desktop/personal-website/nextapp/app/globals.css).
  * **Rule:** Do NOT create a `tailwind.config.js` or `tailwind.config.ts`. Custom styling configurations reside strictly in CSS.
- **3D Engine:** Three.js + React Three Fiber (R3F) + Drei.
- **Scroll Rig:** Lenis Smooth Scroll + GSAP ScrollTrigger.
- **Animations:** Framer Motion (magnetic anchors, spring physics, `<AnimatePresence>` exit handling) + react-rough-notation (hand-drawn wiggles).

---

## 2. Design System & Aesthetics (Non-Negotiable)
- **Background Color:** `#F5F5DC` (Warm Beige). This color dominates every layout.
- **Ink Color:** `#1b1c1c` (Warm Charcoal) for text, borders, and sketched paths.
- **Accent Color:** `#B5502D` (Deep Terracotta) used sparingly for active elements or wiggles.
- **Shapes:** Zero border-radius (`border-radius: 0 !important`) across all cards, buttons, images, and modules.
- **Shadows:** No box-shadow properties. Rely on tonal boundaries and ink borders.
- **Typography:**
  * **Headings:** Playfair Display (italic highlights and bold serifs).
  * **Body & Nav:** DM Sans (clean tracking and high readability).

---

## 3. High-End Motion & Layout Mechanics

### 3.1. Zero-Re-render 3D Frame Updates
To maintain a stable 60 FPS, coordinate WebGL positions inside R3F's `useFrame` hook using direct scroll progress calculations (`window.scrollY / delta`). Avoid storing scroll coordinates in React component state to prevent layout thrashing and re-renders on the canvas threads.

### 3.2. Droplet Margin Safeguards
Keep the interactive liquid glass droplets away from centered body copy:
- **Desktop:** Clamp horizontal coordinates strictly between `±36%` and `±37%` of the viewport width.
- **Mobile:** Keep vertical Y-coordinates high (between `2.0` and `2.2`) to frame the header while staying clear of scrolling body copy.

### 3.3. Non-Overlapping Scrollytelling Transitions
To prevent text from overlapping during scroll reveal transitions:
- Set explicit duration scopes (`duration: 0.17`) on GSAP timelines.
- Leverage `autoAlpha` (combines opacity and `visibility: hidden`) on exit animations so that hidden slides do not capture pointer-events.
- Use soft `60px` translations and `8px` camera blurs to keep transitions cinematic.

### 3.4. Secure Email Obfuscation
Always protect raw email addresses from automated crawlers. Use visual CSS text-direction reversal:
```tsx
<div style={{ direction: 'rtl', unicodeBidi: 'bidi-override' }}>
  moc.liamg@77yviddyaday
</div>
```

---

## 4. Verification Guardrails
- **Pre-commit Build Check:** Every code change must compile successfully without warnings. Always run `npm run build` locally before pushing updates upstream.
- **Data Preservation:** Real portfolio copy, article references, and stats are populated from json files under `/data/`. Ensure these files remain the single source of truth.
