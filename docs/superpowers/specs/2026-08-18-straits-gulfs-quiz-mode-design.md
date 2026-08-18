# Straits & Gulfs quiz mode

**Issue:** [#18](https://github.com/freaxnx01/game-geography-quiz/issues/18) — feat(quiz): add straits and gulfs quiz mode

## Context

The app already has a near-identical mode: **Seas & Oceans** (`m_seas`/`seaQ`,
`index.html:941-948`, `SEAS` array in `geo-data.js:227-262`). It marks a
lat/lng point on the world map (`kind: 'sea'` question, rendered via
`vals.qIsSea`/`seaX`/`seaY` at `index.html:1805-1806`) and asks a
multiple-choice "which sea/ocean is marked?" question, built with the same
`_cycle`/`_distract`/`_mcq` engine every other mode uses. `SEAS` already
contains several gulfs (Gulf of Mexico, Persian Gulf, Gulf of Guinea, Gulf of
Alaska, Bay of Bengal — the last two even carry German names using "Golf"/
"Straße", i.e. gulf/strait) and one channel (Mozambique Channel).

The `seas` mode never shows the continent-filter setup screen — `openMode`
(`index.html:1089-1097`) has no case for `'seas'`, so it falls through to
`this.startQuiz(id)` directly and always plays worldwide. This matches what a
"mark a point on a world map" mode needs: continent filtering doesn't make
much sense when the pool is inherently global and small.

## Decisions (from brainstorming)

- **New, separate mode** (`straits`), not an extension of `seas` — matches
  the issue's own framing ("add ... quiz mode") and keeps Seas & Oceans'
  difficulty curve and pool undiluted.
- **Same point-marker mechanism as `seas`** — no new map-rendering code. A
  strait is a narrow feature, but a single labelled point is exactly what
  `seas` already does for similarly narrow features (Mozambique Channel,
  Bering Sea between two coastlines), so this is a proven, sufficient
  representation, not a gap.
- **One small refactor**: the question field `kind: 'sea'` is a generic
  "point marked on the map" indicator, not sea-specific — with a second mode
  using the same mechanism, keeping the `'sea'` label on straits/gulfs
  questions would be misleading internally. Renamed to `kind: 'geopoint'` at
  its two use sites (`index.html:948`, `1805-1806`).
- **Duplicate overlap with `SEAS`**: gulfs/channels already in `SEAS` (Gulf
  of Mexico, Persian Gulf, Gulf of Guinea, Gulf of Alaska, Bay of Bengal,
  Mozambique Channel) are duplicated into the new dataset rather than
  excluded, so `straits` is a complete, self-contained pool regardless of
  what `seas` also covers.
- **No continent filter** — mirrors `seas` exactly: `openMode` falls through
  to `startQuiz('straits')`, always worldwide.
- **Curated dataset, ~28 entries**, resolving the issue's "more examples to
  be added." Same accuracy posture as `SEAS` and the currency dataset before
  it: hand-authored coordinates/names from training knowledge, not live
  API-verified — acceptable for this buildless, offline-first repo.

## Design

### Data storage (`geo-data.js`)

Reuses the existing `S(en, de, lat, lon, d)` factory as-is (already generic,
not sea-specific despite its comment) — no factory changes needed. New
export placed directly after `SEAS`:

```js
// Straits & gulfs: {en, de, lat, lon, d}. Overlapping SEAS entries
// (gulfs/channels already there) are duplicated so this pool is
// self-contained. See docs/superpowers/specs/2026-08-18-straits-gulfs-quiz-mode-design.md.
export const STRAITS_GULFS = [
  // ---- duplicated from SEAS ----
  S('Gulf of Mexico','Golf von Mexiko', 25, -90, 1),
  S('Persian Gulf','Persischer Golf', 26.5, 51.5, 2),
  S('Gulf of Guinea','Golf von Guinea', 2, 2, 2),
  S('Gulf of Alaska','Golf von Alaska', 57, -145, 3),
  S('Bay of Bengal','Golf von Bengalen', 13, 88, 2),
  S('Mozambique Channel','Straße von Mosambik', -18, 41, 3),
  // ---- gulfs ----
  S('Gulf of Finland','Finnischer Meerbusen', 60, 26, 2),
  S('Gulf of Bothnia','Bottnischer Meerbusen', 62, 20, 3),
  S('Gulf of Riga','Rigaischer Meerbusen', 57.5, 23.5, 3),
  S('Gulf of Aden','Golf von Aden', 12.5, 48, 2),
  S('Gulf of Oman','Golf von Oman', 24.5, 58.5, 2),
  S('Gulf of Thailand','Golf von Thailand', 10, 101, 2),
  S('Gulf of California','Kalifornischer Golf', 28, -112, 2),
  S('Gulf of Panama','Golf von Panama', 8, -79, 3),
  S('Gulf of Saint Lawrence','Golf von Sankt-Lorenz', 48, -62, 3),
  S('Gulf of Carpentaria','Golf von Carpentaria', -14, 139, 3),
  // ---- straits ----
  S('Strait of Magellan','Magellanstraße', -53.5, -70.5, 2),
  S('Strait of Hormuz','Straße von Hormus', 26.5, 56.5, 1),
  S('Strait of Gibraltar','Straße von Gibraltar', 36, -5.5, 1),
  S('Bosphorus','Bosporus', 41, 29, 2),
  S('Bering Strait','Beringstraße', 65.5, -169, 2),
  S('English Channel','Ärmelkanal', 50, 0, 1),
  S('Strait of Malacca','Straße von Malakka', 3, 100, 2),
  S('Taiwan Strait','Taiwanstraße', 24, 119, 2),
  S('Strait of Dover','Straße von Dover', 51, 1.5, 2),
  S('Torres Strait','Torresstraße', -10, 142, 3),
  S('Strait of Messina','Straße von Messina', 38, 15.6, 3),
  S('Cook Strait','Cookstraße', -41, 174.5, 3),
  S('Davis Strait','Davisstraße', 66, -58, 3),
  S('Strait of Otranto','Straße von Otranto', 40, 19, 3)
];
```

### Question builder (`index.html`)

New `mode === 'straits'` branch in `makeQuestions()`, placed directly after
the existing `seas` branch and structurally identical to it:

```js
if (mode === 'straits') {
  let p = D.STRAITS_GULFS.filter(s => s.d <= this.state.diff);
  if (p.length < 8) p = D.STRAITS_GULFS;
  const sKey = s => (this.state.lang === 'de' ? s.de : s.en);
  return this._cycle(p, len).map(s => {
    const pt = this.projSea([s.lon, s.lat]);
    const wrong = this._distract(s, [p, D.STRAITS_GULFS], 3, sKey);
    return { prompt: T.straitQ, kind: 'geopoint', sea: { x: Math.round(pt[0]), y: Math.round(pt[1]) }, opts: this._mcq(s, wrong, sKey) };
  });
}
```

Structurally identical to the `seas` branch (`index.html:941-950`) — same
`this.projSea([lon, lat])` projection call, same `sKey` pattern, only the
dataset (`D.STRAITS_GULFS`), prompt (`T.straitQ`), and `kind` differ.

### `kind: 'sea'` → `kind: 'geopoint'` rename

Two existing use sites renamed so the field name matches what it actually
represents (a marked point on the map, not "this is a sea"):

- `index.html:948` (the `seas` branch's returned question object)
- `index.html:1805-1806` (`vals.qIsSea = q.kind === 'sea'` → `q.kind === 'geopoint'`)

The `vals.qIsSea` variable name itself, and the `seaX`/`seaY`/`sea:` field
names, are left as-is — they're template/render-layer plumbing shared by
both modes now, and renaming them is not required for correctness. Renaming
only the `kind` value (the thing that was actually semantically wrong) keeps
this refactor targeted.

### Hookup

- `MODES` (`index.html:~456`, alongside `seas`): add
  `{ id: 'straits', sec: 0, icon: 'M4 12c3-4 6 4 9 0s6 4 9 0' }` — a wavy
  channel/strait glyph, distinct from the `seas` icon's double-wave.
- `openMode` (`index.html:1089-1097`): **no new case** — `straits` falls
  through to `this.startQuiz(id)` exactly like `seas` does today (no
  continent-filter setup screen).
- `needsTopo` (`index.html:1066`): add `|| mode === 'straits'` — it needs the
  same world map topology `seas` does.
- Random-quiz pool (`index.html:1253`): add `'straits'` to the `opts` array.
- World-label condition (`index.html:1783`): add `|| quiz.mode === 'straits'`
  alongside the existing `'seas'` check, so the in-quiz header reads "World"
  rather than a specific continent name.
- `I18N.en`/`I18N.de`: `m_straits`/`d_straits` (mode card title/description,
  matching `m_seas`/`d_seas`'s style) and `straitQ` ("Which strait or gulf is
  marked?" / "Welche Straße oder welcher Golf ist markiert?").

## Testing

This repo is buildless — manual in-browser playtest is the test gate (per
`.ai/stacks/browser-game.md`). No automated test runner exists here.

- Open the Straits & Gulfs mode from the home screen; confirm it starts
  immediately (no setup/continent screen), matching Seas & Oceans.
- Play a full round in English; confirm each marked point lands at a
  plausible location on the map and the multiple-choice options are
  sensible (no duplicate labels, no empty options).
- Switch to German mid-round and confirm strait/gulf names and the prompt
  update correctly.
- Confirm difficulty filtering (`this.state.diff`) still yields a usable
  pool at the "Easy" setting (falls back to the full dataset if the filtered
  pool is under 8, matching `seas`'s behavior).
- Confirm the Random Quiz button can select this mode.
- Confirm no console errors.
