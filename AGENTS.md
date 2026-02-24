# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Personal website/blog built with **Next.js 15** (static export to Firebase Hosting). Three npm packages:

| Package | Path | Purpose |
|---|---|---|
| Frontend (Next.js) | `/` (root) | Main website at `localhost:3000` |
| Strava Cloud Functions | `/strava/` | TypeScript Firebase Functions (Strava webhooks, book recommender) |
| Contributions Functions | `/functions/contributions/` | JS Firebase Function (GitHub/GitLab contributions API) |

### Running the dev server

```
npm run dev
```

Starts Next.js at `http://localhost:3000`. The `output: 'export'` config produces an API routes warning — this is expected and harmless in dev mode.

### Case-sensitivity gotcha (Linux)

The codebase was developed on macOS (case-insensitive filesystem). On Linux, the import `../styles/home.module.css` fails because the file is `styles/Home.module.css`. A symlink `styles/home.module.css -> Home.module.css` is needed on case-sensitive systems. The update script handles this automatically.

### Build

- Frontend: `npm run build` (from root)
- Strava functions: `cd strava && npm run build` (runs `tsc`)

### Lint / Format

- Prettier: `npx prettier --check .` (from root). Pre-existing formatting issues exist — this is expected.
- Strava has ESLint configured but no `lint` script; run `npx eslint src/` from `/strava/`.

### External dependencies (optional, not required for basic dev)

- **Firebase Firestore** — Activities page reads from Firestore; works without it but shows no data.
- **Strava API** — Requires `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET` env vars in `/strava/.env`.
- **OpenAI API** — Book recommender requires `OPENAI_API_KEY` in `/strava/.env`.
- **GitHub API** — Contributions function uses `GITHUB_PERSONAL_ACCESS_TOKEN` Firebase secret.

### Important notes

- Do NOT run `npm run build` while the dev server is running — it overwrites `.next/` and causes 500 errors. Stop the dev server first, or delete `.next/` before restarting.
- The `functions/contributions` package declares `engines.node: "18"` but works fine with Node 22.
