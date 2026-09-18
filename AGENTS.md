# Result Mini Harness

## Mission
Build a one-page 3D landing for the fictional product NEXUS.
Read `docs/brief.md` before planning or editing.

## Stack
- TypeScript, Next.js 16 App Router, React 19, Tailwind CSS.
- Three.js through React Three Fiber and Drei.
- The model lives at `public/models/ai-core.glb`.

## Layout
The repo root is the Next.js project root — there is no nested `app/` project.
- `app/` — App Router routes: `page.tsx`, `layout.tsx`, `globals.css`, `favicon.ico`
- `components/` — UI sections and the R3F client canvas
- `public/models/ai-core.glb` — the shipped GLB
- `assets/ai-core.blend`, `assets/ai-core.glb` — Blender source and export
- `docs/brief.md` — the product brief

## Working rules
1. Plan before editing.
2. Make one coherent change at a time.
3. Do not add remote assets, analytics, auth, a database or a CMS.
4. Keep 3D code inside a client component.
5. Support 390 px mobile width and reduced motion.
6. Before finishing, run `npm run lint` and `npm run build` from the repo root.

## Definition of done
- No console errors.
- The GLB loads and remains readable on mobile.
- The page works without mouse input.
- `lint` and `build` pass.
- The GLB is below 5 MB.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
