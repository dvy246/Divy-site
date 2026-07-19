# Divy Yadav — Creative Portfolio & Atelier

An Awwwards-level, premium, highly interactive personal portfolio website for **Divy Yadav** — AI Engineer, Technical Writer, and Solopreneur. Styled as an editorial magazine crossed with a creative technologist's sketchbook, featuring warm beige backgrounds, hand-drawn vector elements, and physics-based 3D interactions.

Live Production URL: [personal-website-ten-mauve-32.vercel.app](https://personal-website-ten-mauve-32.vercel.app)

---

## 🛠️ Technology Stack

* **Framework**: Next.js 16 (App Router, static site generation, Turbopack)
* **Styling**: Tailwind CSS v4 (PostCSS configuration)
* **3D Rendering**: React Three Fiber, React Three Drei, Three.js
* **Physics & Motion**: Framer Motion (spring layouts), GSAP (ScrollTrigger ticker)
* **Smooth Scrolling**: Lenis (momentum-based scrolling)
* **Decorative Accents**: RoughJS, React Rough Notation (hand-drawn scribbles)

---

## ✨ Premium Interactive Features

### 1. Generative 3D Sketch Torus Knot
* **Refractive Core**: A physical glass-chrome mesh base with clearcoat, transmission refraction, and iridescent spectrum shifting.
* **Double-Grid Wireframe**: Layered ink-pencil contour guidelines (`scale: 1.0015`) and sparse terracotta Redline construct lines (`scale: 1.003`) overlay the solid core to simulate an interactive architectural sketch model.
* **Planetary Orbital Wires**: Dual concentric ring hoops rotating in opposite directions around the gyroscope with gold/terracotta sparkles.
* **Animated Light Reflections**: Spotlight coordinates orbit and sway dynamically on frame updates, casting moving iridescence highlights over the geometry.

### 2. Symmetrical Apple-Style Split Navigation
* **Symmetrical Split Layout**: The monogram logo `DY` sits perfectly centered in the sticky header, flanked by menu categories on either side:
  `[ Writing   Newsletter ]`    `[ DY ]`    `[ Projects   Skills   SUBSCRIBE ]`
* **Magnetic Snapping**: Nav elements, CTA buttons, and monograms are wrapped in a spring physics attraction wrapper, tactilely pulling toward the cursor on hover.
* **Frosted Glass**: Styled with a 20px blur frosted glass background (`backdrop-filter: blur(20px)`), subtle borders, and soft shadows on scroll.

### 3. Tactile Morphing Custom Cursor
* **Lagging Outer Ring**: Renders a hollow circle that follows the cursor using custom spring lerp equations, combined with an instant center dot.
* **Contextual Morphing**: On hover of links and cards, the cursor scales up, changes color blend mode (`mix-blend-mode: difference`), and reveals context-aware text labels (e.g. `"READ"`, `"VIEW"`).

### 4. 3D Perspective Tilt & Sheen Overlays
* **Cursor Coordinate Physics**: Article, project, and skill cards tilt dynamically on the X and Y axes depending on mouse coordinates inside a 3D perspective field.
* **Diagonal Light Glare**: A linear-gradient reflection sheen glides across cards on mousemove, tracking cursor coordinates.

### 5. 3D Scroll Reveal Pop-Ups
* **About / Bio Folds**: The bio text block tilts forward (`rotationX: 18`), shifts down (`y: 90`), and scales up dynamically as the viewport enters the container range, swinging into alignment with a spring ease profile.
* **Stats counter 3D pop**: Statistics blocks pop forward inside a `1200px` perspective field as the user scrolls, rotating on the X-axis (`rotationX: 22`).
* **Latest Writings swing-in**: Article cards slide, scale, and rotate on both X and Y axes (`rotationX: 25`, `rotationY: -8`) sequentially.

### 6. Automatic Medium RSS Synchronization
* **Compile-Time Sync**: Integrates `scripts/sync-medium.mjs` directly into the build pipeline.
* **RSS Fetcher**: Automatically pulls the 10 latest articles from Medium at compile-time, cleans RSS formatting/truncation suffixes, maps category tags, and saves output locally to `data/articles.json`.

---

## 📂 Project Structure

```
├── app/                  # App Router pages and page transitions
│   ├── articles/         # Category list & filtered writings grid
│   ├── newsletter/       # Subscriptions and newsletter archives
│   ├── projects/         # Featured open-source showcase
│   ├── skills/           # Capability pipe-flow segments
│   ├── layout.tsx        # Ambient breathing backgrounds, global cursor and scroll
│   └── page.tsx          # Homepage, hero canvas, bio, latest writing preview
├── components/           # Reusable interactive components
│   ├── ArticleCard.tsx   # Double-sided 3D flip card with mouse tilt/sheen
│   ├── CustomCursor.tsx  # Lagging ring with blend inversion and text labels
│   ├── HeroCanvas.tsx    # Layered wireframe 3D TorusKnot R3F canvas
│   ├── Magnetic.tsx      # Spring attraction hover wrapper
│   ├── Nav.tsx           # Auto-hide symmetrical split navigation bar
│   ├── ScrollReveal3D.tsx# 3D fold-in scroll entrance wrapper
│   └── SmoothScroll.tsx  # Lenis scroll controller connected to GSAP ticker
├── data/                 # Local JSON datasets (articles, projects, skills, etc.)
├── scripts/              # Medium RSS sync pipeline scripts
├── public/               # Asset fallback files, static SVGs
└── next.config.ts        # Turbopack Next.js configuration
```

---

## 🚀 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dvy246/Divy-site.git
   cd Divy-site
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Synchronize Medium articles manually**:
   ```bash
   npm run sync-medium
   ```

4. **Run local dev server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the interactive site.

5. **Build for production static generation**:
   ```bash
   npm run build
   ```
