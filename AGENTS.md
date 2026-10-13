# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Personal website (amritav.com) built with **Next.js 15** (static export). Three independent npm packages:

| Package | Path | Purpose |
|---|---|---|
| Root (frontend) | `/workspace` | Next.js app — `npm run dev` on port 3000 |
| Contributions function | `/workspace/functions/contributions` | Firebase Cloud Function (Node 18) |
| Strava function | `/workspace/strava` | Firebase Cloud Function in TypeScript (Node 22) — run `npm run build` to compile |

### Running the frontend

```
npm run dev        # starts Next.js dev server on port 3000
npm run build      # static export to out/
```

### Lint / Format

- **Root**: `npx prettier --check .` (formatter only; no ESLint configured at root)
- **functions/contributions**: `npx eslint .`
- **strava**: `npx eslint .` (also `npm run build` to type-check via `tsc`)

### Known caveats

- **Case-sensitivity symlink**: `styles/home.module.css` is a symlink to `Home.module.css`. The code imports the lowercase name, which works on macOS (case-insensitive FS) but fails on Linux without this symlink. The update script recreates it automatically.
- **API routes warning**: `next build` emits a warning about API routes and `output: 'export'` — this is expected and harmless since the site is statically exported.
- **Cloud Functions are optional for frontend dev**: The frontend calls deployed Firebase Cloud Function URLs, not localhost. To develop Cloud Functions locally, you need `firebase-tools` CLI and the relevant API keys (`STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `OPENAI_API_KEY`, `GITHUB_PERSONAL_ACCESS_TOKEN`).
- **Pre-existing lint issues**: Both `functions/contributions` and `strava` have pre-existing ESLint warnings/errors; `prettier --check` also reports formatting issues across the codebase.
