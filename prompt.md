# Portfolio Site Build Prompt — for Google Antigravity

How to use this: paste **Phase 0** first, let the agent finish and show you
the result, then paste Phase 1, then Phase 2, and so on. Attach your
portfolio PDF and LinkedIn PDF to Phase 0. Do not paste all phases at once —
agentic IDEs (Antigravity included) build more reliably in checkpoints than
in one giant one-shot request, and you get to catch a bad design direction
before it's baked into six pages of code.

---

## PHASE 0 — Context + Design Direction (attach portfolio PDF + LinkedIn PDF here)

You are building a personal portfolio website for **Divy Yadav**, positioned
as **"The Architect. Writer. Solopreneur."**

I've attached two documents: my existing portfolio content and my LinkedIn
export (PDF). Read both fully before doing anything else. Extract from them

it is in the divy directory:

- My real bio, career history, and current work (AI engineering technical
  writing, freelance client work, newsletter, YouTube).
- A real list of projects (with descriptions) to feature.
- A real list of skills/tools to use on the dedicated skills page.

Do not invent projects, employers, or skills that aren't in these documents.
If something is ambiguous or missing, leave a clearly marked placeholder
(`// TODO: confirm with Divy`) instead of guessing.

**Aesthetic direction — commit to this, don't hedge between styles:**

- Base palette: warm cream / off-white (`#F5EFE6`-ish family), with one
  confident dark ink color for text (not pure black — a warm charcoal/ink
  brown) and a single sharp accent color used sparingly (pick one: deep
  terracotta, ink blue, or forest green — not a gradient).
- Typography: pair a distinctive serif or editorial display font for
  headings with a clean, readable sans for body text. Do NOT use Inter,
  Roboto, Arial, or generic system fonts. Do NOT default to Space Grotesk —
  pick something with more character (e.g. a display serif like Fraunces or
  Canela-style, paired with a humanist sans like General Sans or Söhne-style).
- Illustration language: hand-sketched, notebook/whiteboard style —
  underlines, circles, arrows, and small doodles drawn as if by pen, in the
  same spirit as my "Illustrated by Divy" diagrams in my articles. Use this
  for section dividers, hover accents, and callouts. Rough/imperfect lines,
  not clean vector icons.
- 3D: use 3D as a **small number of signature moments**, not wallpaper on
  every section. One strong 3D hero centerpiece (e.g. a slowly rotating
  sketched/paper-craft object, or a particle field that reacts to the
  cursor) is worth more than 3D on every page. Everything else stays 2D with
  motion. This keeps the site fast and keeps the writing (the actual point
  of the site) readable.
- Overall reference feel: think an indie hand-crafted Awwwards-style site,
  not a SaaS landing page. Confident negative space. Asymmetry is fine.
  Purple gradients, glassmorphism-by-default, and generic "AI startup"
  aesthetics are explicitly banned.

**Before writing any code**, show me: the color tokens (as CSS variables),
the two font choices, and one static mockup (just the hero section) so I can
approve the direction before you build the rest of the site. Stop after this
and wait for my go-ahead.

---

## PHASE 1 — Tech Stack + Project Scaffold

Once I approve the direction, scaffold the project with this stack:

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS, with the approved palette as CSS variables/theme
  tokens (no hardcoded hex values in components)
- **3D:** React Three Fiber + `@react-three/drei` for the signature 3D hero
  moment
- **Scroll + motion choreography:** GSAP + ScrollTrigger for scroll-driven
  sequences, Lenis for smooth-scroll feel (keep the lerp value moderate —
  between 0.05 and 0.15 — so scrolling still feels responsive, not laggy)
- **UI micro-interactions:** Motion (Framer Motion) for component-level
  transitions (page load stagger, hover states, section reveals)
- **Sketch/hand-drawn 2D elements:** `rough.js` and/or `rough-notation` for
  hand-drawn underlines, circles, and highlight annotations around headings
  and callouts
- **Content:** all articles, newsletter issues, projects, and skills live in
  plain JSON files under `/data` (`articles.json`, `newsletters.json`,
  `projects.json`, `skills.json`) — NOT hardcoded in components. This lets
  me update content later without touching design code, and lets me sync
  `articles.json` automatically from my Medium RSS feed with a separate
  script.
- **Deployment target:** Vercel

Set up the folder structure, Tailwind theme config with my approved tokens,
and empty typed data files with the correct shape (title, url, date,
description/summary fields) for articles, newsletters, and projects, plus a
skill entry shape (name, category, proficiency-or-none, icon) for the skills
page. Do not build any page content yet — just the scaffold, the theme, and
the data contracts. Show me the folder structure when done.

---

## PHASE 2 — Core Pages

Build these pages using the JSON data files as the source of truth:

1. **Home / Hero** — My name "Divy Yadav" large and central, with "The
   Architect. Writer. Solopreneur." as an animated sub-line (staggered
   reveal, not all three words appearing identically — give each its own
   small personality/motion). The one signature 3D element lives here.
   Below the fold: a short real bio (from the attached documents) and a
   scroll cue.
2. **Articles** — Pulls from `articles.json`, each card links out to the
   real Medium URL, opens in a new tab. Include a short teaser/summary per
   article, not just a title.
3. **Newsletter** — Pulls from `newsletters.json`, same card pattern,
   linking out to Beehiiv issue URLs. Above the list, a "Subscribe" CTA
   button linking to my Beehiiv subscribe page.
4. **Projects** — Pulls from `projects.json`. Each project gets a real
   description, tech stack tags, and a link (live demo and/or repo, whatever
   is available per project — don't show a dead button if there's no link).
5. **Skills** (separate route, `/skills`) — Pulls from `skills.json`,
   grouped by category (e.g. AI/ML, writing, tools). Use the hand-sketched
   illustration style here more heavily since this page is inherently more
   list-like and needs personality to not feel like a boring resume table.

Every page shares the same nav and the same cream/ink/accent theme. Reuse
components, don't duplicate styling per page.

---

## PHASE 3 — Motion, Performance, and Accessibility Pass

- Respect `prefers-reduced-motion`: every GSAP/Motion animation and the 3D
  canvas must have a reduced/no-motion fallback that still shows all content.
- On mobile and lower-end devices, either simplify the 3D scene
  (lower particle count / simpler geometry) or replace it with a lightweight
  2D/sketched equivalent. Test what this looks like on a narrow viewport,
  not just desktop.
- Lazy-load the Three.js canvas (don't block first paint on WebGL init).
- Run a Lighthouse pass and report the scores (performance, accessibility,
  best practices, SEO) for both the home page and one content page. Fix
  anything under 90 before calling this done.
- Take and show me screenshots at desktop, tablet, and mobile widths for
  every page.

---

## Non-goals (explicitly out of scope)

- No CMS, no login, no backend/database — this is a static, JSON-driven site.
- No 3D on every single section — one hero centerpiece is the ceiling unless
  I explicitly ask for more after seeing it.
- No generic "AI-portfolio template" look: no purple gradients, no Inter/
  Space Grotesk defaults, no glassmorphism cards by default, no stock icon
  packs where a hand-sketched equivalent would fit the brand better.
- No fabricated projects, employers, testimonials, or skills — only what's
  in my attached documents or what I explicitly give you afterward.

---

## Definition of done

- All five pages (Home, Articles, Newsletter, Projects, Skills) built, using
  real data from the attached documents, no placeholder Lorem Ipsum left in.
- One signature 3D moment on the homepage, fast and reduced-motion safe.
- Hand-sketched illustration accents used consistently across sections.
- Lighthouse performance and accessibility both 90+.
- Deployed and reachable via a Vercel URL.