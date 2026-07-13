# Terra — Geography Quiz

A fast, bilingual (English / German) geography quiz browser game. Pure HTML + JavaScript — no build step, no dependencies to install. Just static files served over HTTP.

**Play:** open the deployed GitHub Pages URL, or run locally (see below).

## Features

- **Multiple quiz modes:** flags, capitals, continents, seas, country shapes, US states, cantons, neighbours, map-pin and find-on-map.
- **Fun with Flags** — a dedicated hub of 8 flag mini-games:
  - **Classic** — match flag ↔ country
  - **Lookalikes** — pick the right flag among near-identical ones (Chad/Romania, Indonesia/Monaco, Nordic crosses…)
  - **Special Flags** — unusual shapes and distinctive emblems (Nepal, Bhutan, Switzerland, etc.) with a fact revealed on answer
  - **Zoomed In** — name the flag from a close-up crop
  - **Through the Blur** — guess the flag behind a blur
  - **Flag → Capital** — see a flag, name its capital
  - **Flag → Continent** — see a flag, name its continent
  - **Speed Run** — as many flags as you can in 60 seconds
- **Three difficulty levels**, best-score tracking (saved in `localStorage`), and full EN/DE localization.

## Tech notes

- Single-page app built as a self-contained component. Entry point is **`index.html`**.
- `index.html` loads `support.js` (the tiny runtime) and dynamically `import()`s `geo-data.js` (the dataset).
- Flag images come from [flagcdn.com](https://flagcdn.com); fonts from Google Fonts. Both load over the network — an internet connection is needed for flags/fonts to appear.
- **Must be served over HTTP(S).** The dynamic `import()` of `geo-data.js` is blocked by browsers on the `file://` protocol, so double-clicking `index.html` will show a blank page. Use a local server or GitHub Pages.

## Run locally

```bash
# any static file server works, e.g.:
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

This repo is a static site — GitHub Pages serves it as-is with no build. See `CLAUDE.md` for step-by-step publish instructions.

## Files

- `index.html` — the game
- `support.js` — runtime
- `geo-data.js` — countries, capitals, continents, US states, cantons, flag metadata
