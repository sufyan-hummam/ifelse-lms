<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# IF/ELSE LMS Project Rules

## Tech Stack
- Framework: Next.js (App Router) + TypeScript strict
- Styling: Tailwind CSS + customized dark-first AI-lab look
- Database & ORM: Neon Postgres + Prisma ORM 7 (`@prisma/adapter-pg` runtime pooler, `DIRECT_URL` CLI migrations)
- Authentication: Session-based auth with HTTP-only signed cookies, roles `STUDENT`, `INSTRUCTOR`, `ADMIN`
- AI Integration: Server-side Google Gemini API only (grounded RAG with course lesson citations, rate limiting)
- Deployment Target: Vercel

## Design Tokens & Brand System
- Brand palette:
  - `brand-navy`: `#1B2F5B`
  - `brand-navy-deep`: `#12213F`
  - `brand-blue`: `#2F5BD0` (primary action in dark mode)
  - `brand-sky`: `#6FA0FF` (accents, links, focus rings, glows in dark mode)
- Dark mode (default):
  - Base: `#080b12`
  - Surfaces: `#0F1522`, `#151D2E`
  - Border: `rgba(255, 255, 255, 0.08)`
  - Text: `#E8EDF7`
  - Muted: `#8B97AD`
- Light mode:
  - Background: `#F6F8FC`
  - Surface: `#FFFFFF`
  - Text: `#12213F`
  - Primary: `brand-navy` (`#1B2F5B`)
- Semantic tokens:
  - Success: `#2DD4A0`
  - Warning: `#F5B544`
  - Danger: `#F25C6B`
- Motifs: `<IF/E>` brandmark, `/` and `< >` branching logic chips, monospace telemetry accents, 8px spacing grid, WCAG AA contrast.

## Directory Structure
- `src/app`: App Router route handlers, layouts, error/loading boundaries, and pages
- `src/components`: Reusable UI primitives (`/ui`), layout components (`/layout`), theme providers
- `src/features`: Domain modules (`auth`, `courses`, `player`, `progress`, `studio`, `admin`, `ai-buddy`, `dashboard`)
- `src/lib`: Core singletons and utilities (`db.ts`, `auth.ts`, `env.ts`, `utils.ts`, `security.ts`)
- `prisma`: Schema (`schema.prisma`), migrations, seed script (`seed.ts`)
- `public`: Static assets, branding, and logos

## Engineering & Security Rules
- Server Components by default; client components (`"use client"`) only for interactive trees.
- Async route params: dynamic `params` and `searchParams` in Next.js App Router must be awaited (`await params`).
- Authentication & Authorization: Every route and server action must verify session validity and role ownership server-side.
- Security: HTTP-only secure cookies (`SameSite=Lax`), strict CSP, security headers, rate limiting on auth and AI endpoints.
- Environment variables: Strict Zod validation on startup; never log, print, or commit secrets.
- Real features only: Sandboxed client-side execution for code playground, real BM25/keyword retrieval for AI Study Buddy, real database-backed certificate verification and PDF export.
