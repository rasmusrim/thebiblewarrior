# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server.
- `npm run build` — Regenerate PWA icons, run `tsc -b`, then `vite build` (output in `dist/`).
- `npm run preview` — Serve the built `dist/` locally.
- `npm run icons` — Regenerate `public/icons/*.png` from `assets/icon.*` or `public/books/1/cover.jpg` (run standalone when changing the icon source; `build` already invokes this).

There is no test runner and no linter configured.

## Architecture

This is a React + Ionic PWA (Vite + TypeScript) that delivers daily Bible reading/quiz/video "missions" to Norwegian-speaking kids. All content is **static assets served from `public/`** — there is no backend.

### Content model

Each book lives at `public/books/{N}/` and contains:

- `data.json` — the full book definition (title, cover, and per-day entries).
- `cover.jpg`
- `audio/day-NN.mp3` — one clip per reading day.

A day is either a `ReadingDay` (bible reference + audio + prayer + reflection) or a `VideoDay` (YouTube embed). See `src/types/book.ts` for the canonical shape, and `ADDING_A_BOOK.md` for the full authoring workflow including the data-generation pipeline.

**Book discovery is hardcoded**: `src/hooks/useBook.ts` has a literal `bookIds = [1, 2]` array in `useBookList()`. Adding a new book requires editing this list — there is no manifest file and no directory scan.

### Routing & state

- Ionic React (`@ionic/react` 8.x) with **React Router v5** (`react-router-dom` 5.x). Do not use v6 APIs (`useNavigate`, `Routes`, `element={...}`); use `useHistory`, `<Switch>`, and `component={...}`.
- Routes: `/books` → `HomePage`, `/book/:bookId` → `BookPage`, `/book/:bookId/day/:day` → `DayPage`, `/book/:bookId/video/:day` → `VideoPage`. `/` redirects to the last selected book (from localStorage) or to `/books`.
- **All user state lives in `localStorage`** — no Redux/Context/server:
  - `selectedBook` — last-opened book id (string).
  - `book-{id}-completed` — JSON array of completed day numbers for that book.
- `useBook` caches fetched book JSON in a module-level `Map` so navigation between days doesn't refetch.

### Audio

`useAudioPlayer` wraps a single `HTMLAudioElement` constructed once per mount. `DayPage` calls `audio.load(...)` in an effect keyed on the audio URL. Clips are produced at 64 kbps mono MP3 by the scripts below.

### Content pipeline (`scripts/`)

Audio assets are produced offline, not at build time:

1. `transcribe.py` — runs OpenAI Whisper over a full-book MP3 to get word-level timestamps.
2. `align_verses.py` — (partially stubbed) maps verse ranges to timestamps.
3. `split_audio.sh` / `split_audio_book2.sh` — `ffmpeg`-splits the master MP3 into per-day clips using a `assets/timestamps*.json` file. `split_audio.sh` is book-1 specific (also re-encodes `FILEM.mp3` as day-47); `split_audio_book2.sh` is book-2 (Acts). These write directly into `public/books/{N}/audio/`.
4. `LYDFIL_INSTRUKSJONER.md` is the Norwegian-language Audacity guide given to non-technical collaborators who produce clips manually instead of via the Python pipeline.

`generate-icons.mjs` uses `sharp` to build PWA icons with the brand-red background (`#c0392b`), including a maskable 512 with 20% padding.

### Deployment

The app is shipped as static files. `public/.htaccess` is included for Apache hosting and does three things that matter: SPA fallback (rewrite unknown paths to `index.html`), force HTTPS (with an ACME carve-out), and set long immutable cache headers on hashed build assets while keeping HTML/manifest/JSON uncached. `public/manifest.webmanifest` makes it installable as a PWA.

### Language

User-facing strings are **Norwegian** (`lang="no"`). When adding UI text, keep it in Norwegian unless the user says otherwise.
