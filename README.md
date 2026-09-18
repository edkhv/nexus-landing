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
| `app/layout.tsx` | Root layout, metadata, system font stack |
| `app/globals.css` | Tailwind theme (graphite, electric cyan, restrained violet) |
| `components/sections.tsx` | Header, hero copy/CTA, capability cards, workflow, footer |
| `components/ai-core-canvas.tsx` | Client component: R3F `Canvas`, `useGLTF`, lights, pointer reaction |
| `components/webgl-fallback.tsx` | Calm DOM stand-in + error boundary for canvas failures |
| `public/models/ai-core.glb` | The AI Core asset (75 KB, no textures, no Draco) |

## Behavior notes

- **3D**: one `Canvas` in a client component. Camera `[0, 0, 4.5]`, `fov 35`;
  hemisphere + two directional lights and one point light, no postprocessing.
  The CSS glow behind the canvas provides depth instead of a bloom pass.
- **Pointer**: the core reacts to the pointer by a few degrees at most
  (~0.06–0.09 rad), damped in `useFrame`; keyboard-only visitors get the same
  page, since every action is a plain anchor.
- **Reduced motion**: `prefers-reduced-motion: reduce` switches the canvas to
  `frameloop="demand"` and stops the idle spin. Pointer moves still request
  frames until the tilt settles, so the GPU goes idle at rest.
- **Mobile (390 px)**: hero copy and CTA come first in the DOM, the 3D block
  follows below it; no horizontal overflow.
- **Fallbacks**: no WebGL → static diagram, GLB failure → static diagram with a
  distinct note, lost context → same, and the whole canvas is wrapped in an
  error boundary. The caption stays available to assistive tech in every case.

## Budget

`public/models/ai-core.glb` is 75 KB (limit: 5 MB). No remote assets are
fetched: fonts are system stacks and the only image-like graphics are CSS and
inline SVG.