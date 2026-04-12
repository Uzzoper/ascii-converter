<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — eslint
- `npm run test` — run tests (vitest)

## Stack
- Next.js 16.2.2 + React 19 + TypeScript
- Tailwind CSS v4 (uses `@import "tailwindcss"`, NOT `@tailwind`)
- No `tailwind.config.js` — configuration lives in CSS via `@theme`
- lucide-react for icons
- No shadcn/ui — all components styled with raw Tailwind
- `@vercel/analytics` for page view tracking

## Architecture
- Client-side only app — no API routes, no backend
- Canvas API in browser for image processing
- Conversion state extracted into `useAsciiConverter` hook
- Fullscreen logic extracted into `useFullscreen` hook
- All conversion logic in `src/utils/`, components in `src/components/`, hooks in `src/hooks/`
- Path alias: `@/*` → `./src/*`

## Conventions
- Semantic commits: `feat:`, `chore:`, `fix:`
- One component/hook per file
- No extra dependencies beyond what's installed
- Dark hacker aesthetic: bg `#0a0a0a`, text `#00ff41`, accent `#ffb000`, monospace only
- Use CSS variables defined in `globals.css` (e.g. `text-foreground`, `bg-surface`) — no hardcoded hex colors
