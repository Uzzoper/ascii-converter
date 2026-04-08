<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — eslint
- No test runner configured yet

## Stack
- Next.js 16.2.2 + React 19 + TypeScript
- Tailwind CSS v4 (uses `@import "tailwindcss"`, NOT `@tailwind`)
- No `tailwind.config.js` — configuration lives in CSS via `@theme`
- lucide-react for icons
- No shadcn/ui — all components styled with raw Tailwind

## Architecture
- Client-side only app — no API routes, no backend
- Canvas API in browser for image processing
- All conversion logic in `src/utils/`, components in `src/components/`
- Path alias: `@/*` → `./src/*`

## Conventions
- Semantic commits: `feat:`, `chore:`, `fix:`
- One component per file
- No extra dependencies beyond what's installed
- Dark hacker aesthetic: bg `#0a0a0a`, text `#00ff41`, accent `#ffb000`, monospace only
