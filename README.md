# NEXUS — one-page 3D landing

Fictional product landing for **NEXUS**, an agentic runtime for product teams.
Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 and
React Three Fiber + Drei.

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
| `app/page.tsx` | Server component: hero → capabilities → workflow → final CTA |
| `app/layout.tsx` | Root layout, metadata, self-hosted font loading |
| `app/globals.css` | Tailwind theme, texture, and the CSS-only motion layer |
| `components/sections.tsx` | Header, hero, capability cards, workflow rail, CTA, footer |
| `components/ai-core-canvas.tsx` | Client component: R3F `Canvas`, `useGLTF`, lights, pointer reaction |
| `components/webgl-fallback.tsx` | Calm DOM stand-in + error boundary for canvas failures |
| `public/models/ai-core.glb` | The AI Core asset (75 KB, no textures, no Draco) |

## Design direction

Precise and technical, per `docs/brief.md`: dark graphite, electric cyan with
restrained violet, no stock imagery. The page reads as an instrument panel
rather than a marketing page.

- **Type** — Archivo (variable, with its `wdth` axis) for display and body,
  JetBrains Mono for every label, index and reading. The hero headline is set
  at `font-stretch: 110%`, which is the expanded, engineered voice of the page;
  all mono text uses tabular figures so columns of numbers stay on a grid.
- **Composition** — the hero is a 12-column grid in which the 3D core breaks
  out of the container: it starts behind the copy column, runs past the right
  edge and is trimmed by the section's overflow clip. Capability cards use an
  uneven 5 / 4 / 3 cascade instead of three equal columns, and the workflow is
  a connected rail rather than four boxes.
- **Texture** — an inline feTurbulence grain over the whole page, a two-scale
  technical grid masked to the core, surveyor's crosses at panel corners and a
  tick-marked footer rule. All of it is CSS or inline SVG.

## Behavior notes

- **3D**: one `Canvas` in a client component. Camera `[0, 0, 4.5]`, `fov 35`;
  hemisphere + two directional lights and one point light, no postprocessing.
  The CSS glow behind the canvas provides depth instead of a bloom pass.
- **Pointer**: the core reacts to the pointer by a few degrees at most
  (~0.06–0.09 rad), damped in `useFrame`; keyboard-only visitors get the same
  page, since every action is a plain anchor.
- **Motion**: no JavaScript is involved. The hero staggers in with CSS
  keyframes and the sections reveal as they enter using the CSS view timeline
  (`animation-timeline: view()`), with a per-element offset into the range for
  the stagger. The headline wipe is a `clip-path` on the text itself, so a
  tight line-height can never shave a descender.
- **Degradation**: browsers without `view()` support, and anyone with
  JavaScript disabled, simply get the content at rest — the animated state is
  opt-in inside `@media (prefers-reduced-motion: no-preference)`, never the
  default. Reveals also resolve to their finished state under `@media print`.
- **Reduced motion**: `prefers-reduced-motion: reduce` drops every reveal and
  transition, and switches the canvas to `frameloop="demand"`. Pointer moves
  still request frames until the tilt settles, so the GPU goes idle at rest.
- **Mobile (390 px)**: hero copy and CTA come first in the DOM, the 3D block
  follows below it; the technical grid re-masks towards the core. No horizontal
  overflow (`scrollWidth === clientWidth` at 390 px and 1440 px).
- **Fallbacks**: no WebGL → static diagram, GLB failure → static diagram with a
  distinct note, lost context → same, and the whole canvas is wrapped in an
  error boundary. The caption stays available to assistive tech in every case.

## Budget

`public/models/ai-core.glb` is 75 KB (limit: 5 MB). The browser fetches nothing
from a third party: the only image-like graphics are CSS and inline SVG, and
the woff2 files are served from this origin.

Note that `next/font/google` **downloads the Archivo and JetBrains Mono files
once at build time** and emits them into `_next/static/media`. That build step
needs network access; the running site never contacts Google.
