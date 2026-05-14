<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

- `middleware` → `proxy` (file & function name). Already migrated — see `proxy.ts`.
- `params` and `searchParams` in pages/layouts/routes are Promises: `await props.params`.
- `cookies()`, `headers()`, `draftMode()` are async only.
- `next lint` removed — uses ESLint CLI directly (`npm run lint`).
- Turbopack is the default build tool.
<!-- END:nextjs-agent-rules -->

# Verve Run Club

Next.js 16.2 + React 19.2 App Router run-club platform with Strava integration.

## Commands

| Action | Command |
|--------|---------|
| Dev | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Typecheck | `npx tsc --noEmit` |

No test runner configured yet.

## Architecture

- **Auth**: Custom cookie-based session (`verve_user_id`, `verve_strava_id`, etc.) set in `/api/auth/callback`. Supabase SSR helpers used in `proxy.ts` and `lib/supabase/server.ts`, but some routes use raw `createClient` with `SUPABASE_SERVICE_ROLE_KEY`.
- **Auth flow**: Strava OAuth → callback creates Supabase auth user (email: `strava-{id}@verve.run`) → sets cookies → redirects to `/dashboard`.
- **Styling**: Tailwind CSS v4 with `@theme` in `globals.css`. Motion (v12, **not** Framer Motion) for animations. `cn()` helper via `tailwind-merge` + `clsx`.
- **Path alias**: `@/*` maps to project root.
- **Cron jobs**: Vercel Cron Jobs (`/api/cron/`) — always check `authorization: Bearer ${CRON_SECRET}`.
- **Custom cursor**: `cursor: none` on `<body>`, re-enabled on `@media (pointer: coarse)`.

## Key files

| Path | Purpose |
|------|---------|
| `proxy.ts` | Supabase session refresh for all routes (was `middleware.ts`) |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server Supabase client (async cookies) |
| `lib/session.ts` | Read session cookies server-side |
| `lib/xp.ts` | XP calculation & tier logic |
| `lib/badges.ts` | Automated badge awarding |
| `lib/strava.ts` | Strava token refresh & activity fetch |
| `supabase/schema.sql` | DB schema (profiles, runs, badges, challenges, kudos) |
| `vercel.json` | Vercel Cron schedules |

## Known issues (unfixed)

- `app/profile/[id]/page.tsx` accesses `params.id` synchronously — must be `await params.id` in Next.js 16 (will fail at runtime).
- No tests or test framework defined.
