# Straits & Gulfs Quiz Mode — Design

Issue: [#18](https://github.com/freaxnx01/game-geography-quiz/issues/18)

## Problem

Issue #18 requests a quiz mode to identify straits and gulfs on the map, citing
Gulf of Finland, Strait of Magellan, and Strait of Hormuz as examples.

## Approach

Extend the existing `SEAS` data array (`geo-data.js:227-263`) with strait and
additional gulf entries, rather than building a new quiz mode.

**Rejected alternative:** a dedicated `straits`/`gulfs` mode with its own UI
entry, prompt text, and question-generation branch.

**Why:** `index.html:941-949` shows `seas` is already a generic "named water
body at a lat/lon → pin on the map, pick the name" mechanism. It already
contains gulfs (Gulf of Mexico, Persian Gulf, Gulf of Alaska, Gulf of Guinea —
`geo-data.js:235,241,251,259`) alongside seas and oceans. Adding straits to the
same array is a same-shape data addition; a new mode would duplicate the
question-generation branch (`index.html:941-949`), the topojson-loading gate
(`index.html:1066` `needsTopo`), and the mode registration
(`index.html:1253`) for no behavioral difference.

## Data additions

Using the existing `S(en, de, lat, lon, d)` constructor
(`geo-data.js:226`), append to `SEAS`:

**Gulfs** (10 new — existing gulfs listed above are untouched):

| en | de | lat | lon | d |
|---|---|---|---|---|
| Gulf of Finland | Finnischer Meerbusen | 60.0 | 26.5 | 2 |
| Gulf of Aden | Golf von Aden | 12.5 | 48.5 | 2 |
| Gulf of Oman | Golf von Oman | 24.5 | 58.5 | 2 |
| Gulf of California | Golf von Kalifornien | 28.0 | -112.0 | 2 |
| Gulf of Riga | Rigaer Bucht | 57.5 | 23.5 | 3 |
| Gulf of Bothnia | Bottnischer Meerbusen | 63.0 | 20.5 | 3 |
| Gulf of Panama | Golf von Panama | 8.0 | -79.0 | 3 |
| Gulf of Thailand | Golf von Thailand | 10.0 | 101.0 | 2 |
| Gulf of Carpentaria | Golf von Carpentaria | -14.0 | 139.0 | 3 |
| Gulf of St. Lawrence | Sankt-Lorenz-Golf | 48.0 | -62.0 | 3 |

**Straits** (16 new):

| en | de | lat | lon | d |
|---|---|---|---|---|
| Strait of Magellan | Magellanstraße | -53.0 | -70.5 | 1 |
| Strait of Hormuz | Straße von Hormus | 26.5 | 56.5 | 1 |
| Strait of Gibraltar | Straße von Gibraltar | 35.95 | -5.6 | 1 |
| Bering Strait | Beringstraße | 65.5 | -169.0 | 1 |
| Strait of Malacca | Straße von Malakka | 3.0 | 100.5 | 1 |
| Bosphorus | Bosporus | 41.1 | 29.05 | 1 |
| Dardanelles | Dardanellen | 40.2 | 26.4 | 2 |
| Strait of Dover | Straße von Dover | 51.0 | 1.4 | 2 |
| Cook Strait | Cookstraße | -41.2 | 174.5 | 2 |
| Davis Strait | Davisstraße | 66.0 | -58.0 | 3 |
| Drake Passage | Drakestraße | -59.0 | -65.0 | 3 |
| Taiwan Strait | Taiwanstraße | 24.5 | 119.5 | 3 |
| Torres Strait | Torresstraße | -10.0 | 142.2 | 3 |
| Sunda Strait | Sundastraße | -6.0 | 105.8 | 3 |
| Strait of Sicily | Straße von Sizilien | 37.3 | 11.5 | 3 |
| Palk Strait | Palkstraße | 9.5 | 79.5 | 3 |

Difficulty (`d`, 1-3) follows the existing scale in `SEAS`: 1 = famous/easy
(already-known chokepoints like Gibraltar, Hormuz, Bering, Malacca), 2 =
moderately known, 3 = less commonly known. `d` gates which entries appear at
lower difficulty settings (`index.html:942-943`).

## No code changes required

- `index.html:941-949` (question generation), `1066` (`needsTopo`), `1253`
  (mode list), and the `seaQ` prompt strings (`index.html:512,585`) are
  unchanged — they already operate generically over `D.SEAS`.
- `projSea` (`index.html:651-653`) already projects arbitrary lat/lon, so no
  map-rendering change is needed.

## Testing (per stack overlay's manual playtest gate)

- [ ] Page loads with an empty console
- [ ] Seas & Oceans quiz mode shows straits/gulfs as prompts and pin markers
      land at plausible positions on the map
- [ ] New entries appear in both `en` and `de` UI languages
- [ ] `localStorage` progress/score still persists across a reload

## Assumptions

- **A1** [high] Implemented as data additions to the existing `SEAS` array,
  not a new quiz mode. Rejected: dedicated straits/gulfs mode. `index.html:941-949`
  shows `seas` is already a generic "named water body → pin on map" mechanism
  that already contains gulfs.
- **A2** [med] Selected 26 total new entries (10 gulfs + 16 straits) —
  well-known bodies of water beyond the three named in the issue — since the
  issue said "more examples to be added" without specifying a final list or
  count. Rejected: implementing only the 3 named examples (too small a set
  to meaningfully expand the quiz) or an exhaustive list of all straits/gulfs
  worldwide (unbounded scope, diminishing quiz value from very obscure
  entries).
- **A3** [med] Assigned difficulty (`d` 1-3) by subjective general-knowledge
  familiarity, following the same informal scale visible in existing `SEAS`
  entries (e.g. `Pacific Ocean` d=1 vs `Java Sea` d=3, `geo-data.js:228,262`).
  No documented rubric exists for this field.
- **A4** [high] The existing `seaQ` prompt text ("Which sea or ocean is
  marked?" / German equivalent, `index.html:512,585`) is left unchanged. It
  already covers gulfs; a strait is a body of water in the same sense.
  Rejected: rewording to "Which body of water is marked?" — that touches
  existing UI copy in en/de for all `seas` questions, not just the new
  entries, which is out of scope for a data-only addition.
- **A5** [low] Coordinates are single representative points per strait/gulf
  (matching the existing `SEAS` pattern, e.g. `Persian Gulf` at one lat/lon,
  `geo-data.js:241`), not bounding boxes. No file evidence needed — this is
  the only representation the existing code path (`projSea`, `index.html:946`)
  supports.

## Consequences

- The `seas` mode's question pool grows from 33 to 59 entries — roughly 79%
  larger — which thins out repetition of any single entry across play
  sessions.
- Because 20 of the 26 new entries are `d` 2-3, players at lower difficulty
  settings (`this.state.diff`) see a smaller proportional increase than
  players at the highest difficulty, shifting the mode's felt difficulty
  slightly upward at max difficulty.
- Distractor generation (`_distract`, `index.html:947`) draws wrong answers
  from the full `SEAS` pool, so straits can now appear as wrong-answer options
  for sea/gulf questions and vice versa — no code change, but a new class of
  plausible-looking distractor appears in existing questions too.
