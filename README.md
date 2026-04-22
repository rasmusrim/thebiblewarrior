# The Bible Warrior

A Norwegian-language Bible devotional PWA for kids, built around the *Bible Warrior* book series. Each book is a set of daily "missions" — a short audio reading of a Bible passage, paired with a prayer prompt and a reflection, plus occasional BibleProject video days.

Built with React + Ionic + Vite. No backend: all content is static JSON and MP3 files under `books/` (served to the browser via a symlink at `public/books`).

## Getting started

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually http://localhost:5173). Progress is stored in the browser's `localStorage`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Regenerate PWA icons, typecheck, and build `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run icons` | Regenerate the PWA icons from `assets/icon.*` (or the book-1 cover as a fallback). |

## Project layout

```
books/{N}/                  One directory per book — data.json, cover.jpg, audio/*.mp3
public/books -> ../books    Symlink so Vite serves the content from /books/...
src/pages/                  HomePage, BookPage, DayPage, VideoPage
src/hooks/                  useBook (data fetch + cache), useAudioPlayer
src/types/book.ts           Book / ReadingDay / VideoDay types
scripts/                    Offline audio pipeline (Whisper transcription, ffmpeg splitting, icon generation)
```

## Adding a book

See [`docs/ADDING_A_BOOK.md`](./docs/ADDING_A_BOOK.md) for the full authoring workflow (directory layout, `data.json` schema, audio processing, and the one-line change in `src/hooks/useBook.ts` needed to register a new book id).

## Deployment

The build in `dist/` is a pure static site. `public/.htaccess` is included for Apache hosting and handles SPA fallback, HTTPS redirect, and cache headers for the hashed build assets. On other hosts (Netlify, Vercel, S3+CloudFront, etc.) configure SPA fallback to `index.html` equivalently.

## Tech stack

- [React 18](https://react.dev/) + [Ionic React 8](https://ionicframework.com/docs/react)
- [React Router v5](https://v5.reactrouter.com/) (pinned by `@ionic/react-router`)
- [Vite 6](https://vitejs.dev/) + TypeScript 5
- `sharp` for PWA icon generation
- Python + [OpenAI Whisper](https://github.com/openai/whisper) + `ffmpeg` for the offline audio pipeline
