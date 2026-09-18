# NEXUS — one-page 3D landing

Fictional product landing for **NEXUS**, an agentic runtime for product teams.
Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 and
React Three Fiber + Drei. The page is written in Russian.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
npm start
```

## Structure

| Path | Role |
| --- | --- |
| `app/page.tsx` | Server component: aurora layer, grain, hero → capabilities → workflow → final CTA |
| `app/layout.tsx` | Root layout, `lang="ru"`, metadata, self-hosted font loading |
| `app/globals.css` | Tailwind theme, texture, surfaces, and the CSS-only motion layer |
| `components/sections.tsx` | Header, hero, capability cards, workflow rail, integrations ticker, CTA, footer |
| `components/ai-core-canvas.tsx` | Client component: R3F `Canvas`, GLB, procedural environment, drag / scroll / tap interaction |
| `components/webgl-fallback.tsx` | Calm DOM stand-in + error boundary for canvas failures |
| `public/models/ai-core.glb` | The AI Core asset (247 KB, no textures, no Draco) |
| `assets/ai-core.blend` | Blender source of the same asset |

## Design direction

Precise and technical, per `docs/brief.md`: dark graphite, electric cyan with
restrained violet, no stock imagery. The page reads as an instrument panel
rather than a marketing page — but one that is lit.

- **Type** — Manrope (variable, `cyrillic` subset) for display and body,
  JetBrains Mono for every label, index and reading. Headlines run at weight
  800 with negative tracking; the second headline line carries a cyan gradient
  through `bg-clip-text`. All mono text uses tabular figures so columns of
  numbers stay on a grid.
- **Composition** — the hero is a 12-column grid in which the 3D core breaks
  out of the container: it starts behind the copy column, runs past the right
  edge and is trimmed by the section's overflow clip. Capability cards are
  three identical columns; the hub-and-spoke diagram they used to host now
  runs as a full-width blueprint band underneath them, and the workflow is a
  connected rail rather than four boxes.
- **Depth** — three layers, none of them an image: a fixed `.aurora` field of
  wide cyan/violet light bodies behind the page, a `feTurbulence` grain over
  it, and a breathing halo under the 3D core. Panels are `.panel`: a graphite
  plate with a lit top edge, a 1px hairline and a long, soft shadow.
- **Motion** — one accent per interaction: a reading-progress hairline under
  the header, a light sheen across the primary button, an endless integration
  ticker. All of it is CSS, driven by the scroll or view timeline.

## Behavior notes

- **3D scene**: one `Canvas` in a client component. Camera `[0, 0, 4.5]`,
  `fov 35`, `dpr [1.5, 2]`. Metallic graphite only reads as a surface when
  something is reflected in it, so the scene builds its own environment from
  four `Lightformer` cards at `resolution 256`, `frames 1` — reflections and
  highlights without an HDR file or a network request. Hemisphere, two
  directional lights and one point light sit on top of it.
- **Interaction** — four gestures, none of which is required:
  the core turns on its own; a horizontal drag spins it and leaves momentum; a
  vertical drag tilts it and springs back; the page scroll swings the whole
  assembly; and a tap emits an expanding billboard ring plus an emissive flash.
  A pointer hovering the core adds a small parallax and brightens the rings.
- **Touch** — the canvas is `touch-action: pan-y` with a crosshair cursor, so
  a vertical swipe still scrolls the page while a horizontal one rotates the
  model.
- **Motion**: no JavaScript choreographs the page. The hero staggers in with
  CSS keyframes and the sections reveal as they enter using the CSS view
  timeline (`animation-timeline: view()`), with a per-element offset into the
  range for the stagger. The headline wipe is a `clip-path` on the text
  itself, so a tight line-height can never shave a descender.
- **Degradation**: browsers without `view()` support, and anyone with
  JavaScript disabled, simply get the content at rest — the animated state is
  opt-in inside `@media (prefers-reduced-motion: no-preference)`, never the
  default. Reveals also resolve to their finished state under `@media print`.
- **Reduced motion**: `prefers-reduced-motion: reduce` drops every reveal and
  transition, stops the idle rotation and switches the canvas to
  `frameloop="demand"`. Drag and tap still work and request frames while they
  animate, so the GPU goes idle at rest.
- **Mobile (390 px)**: hero copy and CTA come first in the DOM, the 3D block
  follows below it; the technical grid re-masks towards the core. No horizontal
  overflow (`scrollWidth === clientWidth` at 390 px and 1440 px).
- **Fallbacks**: no WebGL → static diagram, GLB failure → static diagram with a
  distinct note, lost context → same, and the whole canvas is wrapped in an
  error boundary. The Russian caption stays available to assistive tech in
  every case.

## The asset

The shipped GLB is a smoothed rebuild of the Blender source: the icosphere core
was subdivided and projected back onto its exact original radius, the ring tubes
were subdivided once, and every face was set to smooth shading. The form is
unchanged; only the tessellation is. That is 16 560 triangles instead of 3 740,
which is what removes the faceted silhouette and the visible shading facets.

## Budget

`public/models/ai-core.glb` is 247 KB (limit: 5 MB). The browser fetches nothing
from a third party: the only image-like graphics are CSS and inline SVG, and
the woff2 files are served from this origin.

Note that `next/font/google` **downloads the Manrope and JetBrains Mono files
once at build time** and emits them into `_next/static/media`. That build step
needs network access; the running site never contacts Google.
