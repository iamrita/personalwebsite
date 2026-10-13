# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is a personal website built with **Next.js 15** (static export) and two **Firebase Cloud Functions** backends. See `README.md` for the basics.

### Services

| Service | Directory | Run command | Notes |
|---|---|---|---|
| Next.js frontend | `/` (root) | `npm run dev` | Runs on `localhost:3000` |
| Strava Cloud Functions | `/strava` | `npm run build` (TypeScript) | Firebase emulators needed for local function testing |
| Contributions Cloud Functions | `/functions/contributions` | `npm run lint` for linting | Firebase emulators needed for local function testing |

### Case-sensitivity symlink (Linux)

The repo was developed on macOS (case-insensitive filesystem). On Linux, `styles/Home.module.css` must also be accessible as `styles/home.module.css`. A symlink is created by the update script:

```
ln -sf Home.module.css styles/home.module.css
```

Without this, both `npm run dev` and `npm run build` will fail with a "Module not found" error on `index.js`.

### Build & lint

- **Build**: `npm run build` (root) — produces static export in `out/`
- **Strava build**: `cd strava && npm run build` — compiles TypeScript to `lib/`
- **Lint (contributions)**: `cd functions/contributions && npm run lint` — has pre-existing style errors (quotes, semicolons, indentation); these are in the committed code
- **Prettier** is a devDependency but has no script configured

### Dev server notes

- The dev server shows a warning: `API Routes cannot be used with "output: export"` — this is expected since `pages/api/data.js` exists but the project uses static export mode.
- The `trailingSlash: true` config means routes redirect (308) from `/posts/about` to `/posts/about/`.

### External dependencies for optional features

- Activities page requires **Firebase Firestore** (either emulator or production credentials)
- Book recommendation page calls a production Cloud Run URL (`bookrecommend-*.a.run.app`)
- Contributions function requires `GITHUB_PERSONAL_ACCESS_TOKEN`
- Strava function requires `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`
- Book recommendation function requires `OPENAI_API_KEY`
