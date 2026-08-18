# Straits & Gulfs Quiz Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 16 straits and 10 additional gulfs to the existing `SEAS` quiz
data so the "Seas & Oceans" mode quizzes them, without any code changes.

**Architecture:** `SEAS` (`geo-data.js:227-263`) is a flat array of
`{en, de, lat, lon, d}` records built with the `S(en, de, lat, lon, d)`
helper (`geo-data.js:226`). The `seas` quiz mode (`index.html:941-949`) reads
this array generically — pick a random entry, project its lat/lon onto the
map (`this.projSea`, `index.html:651-653`), and ask the player to name it
from multiple choice. Adding entries to the array is the entire change.

**Tech Stack:** Vanilla JS ES module (`geo-data.js`), no build step, no test
framework — see Global Constraints.

## Global Constraints

- Buildless vanilla-JS repo — no npm, no bundler, no test runner. Verification
  is the manual in-browser playtest checklist (see Task 1, Step 5), per the
  browser-game stack overlay.
- `en`/`de` names are both required for every entry — this repo supports only
  `de` and `en` (browser-game stack overlay, Localization section).
- Follow the existing `SEAS` array's exact formatting: one `S(...)` call per
  line, single blank-line-free block, trailing entry has no comma, array
  closes with `];`.
- Do not touch `index.html`, `i18n.js`, or any other file — the spec
  (`docs/superpowers/specs/2026-08-18-straits-gulfs-quiz-design.md`) confirms
  the `seas` mode, `seaQ` prompt strings, and `projSea` projection already
  operate generically over `D.SEAS` and need no change.
- Exact `en`, `de`, `lat`, `lon`, `d` values for every new entry are specified
  below — copied verbatim from the spec's tables. Do not invent, reorder, or
  adjust any value.

---

### Task 1: Add straits and gulfs to `SEAS`

**Files:**
- Modify: `geo-data.js:262` (append after the last existing entry, before the
  closing `];` on line 263)

**Interfaces:**
- Consumes: the existing `S(en, de, lat, lon, d)` helper defined at
  `geo-data.js:226`. No new helper is introduced.
- Produces: 26 new elements appended to the exported `SEAS` array
  (`geo-data.js:227`), consumed unchanged by `index.html:941-949`.

- [ ] **Step 1: Change the trailing comma and append the 26 new entries**

Open `geo-data.js`. Line 262 currently reads:

```js
  S('Java Sea','Javasee', -5, 111, 3)
];
```

Replace it with (note the added trailing comma on the `Java Sea` line, and
that entries are grouped gulfs-then-straits with a comment per group,
matching the array's existing single-comment-block style at line 225):

```js
  S('Java Sea','Javasee', -5, 111, 3),
  // Gulfs
  S('Gulf of Finland','Finnischer Meerbusen', 60.0, 26.5, 2),
  S('Gulf of Aden','Golf von Aden', 12.5, 48.5, 2),
  S('Gulf of Oman','Golf von Oman', 24.5, 58.5, 2),
  S('Gulf of California','Golf von Kalifornien', 28.0, -112.0, 2),
  S('Gulf of Riga','Rigaer Bucht', 57.5, 23.5, 3),
  S('Gulf of Bothnia','Bottnischer Meerbusen', 63.0, 20.5, 3),
  S('Gulf of Panama','Golf von Panama', 8.0, -79.0, 3),
  S('Gulf of Thailand','Golf von Thailand', 10.0, 101.0, 2),
  S('Gulf of Carpentaria','Golf von Carpentaria', -14.0, 139.0, 3),
  S('Gulf of St. Lawrence','Sankt-Lorenz-Golf', 48.0, -62.0, 3),
  // Straits
  S('Strait of Magellan','Magellanstraße', -53.0, -70.5, 1),
  S('Strait of Hormuz','Straße von Hormus', 26.5, 56.5, 1),
  S('Strait of Gibraltar','Straße von Gibraltar', 35.95, -5.6, 1),
  S('Bering Strait','Beringstraße', 65.5, -169.0, 1),
  S('Strait of Malacca','Straße von Malakka', 3.0, 100.5, 1),
  S('Bosphorus','Bosporus', 41.1, 29.05, 1),
  S('Dardanelles','Dardanellen', 40.2, 26.4, 2),
  S('Strait of Dover','Straße von Dover', 51.0, 1.4, 2),
  S('Cook Strait','Cookstraße', -41.2, 174.5, 2),
  S('Davis Strait','Davisstraße', 66.0, -58.0, 3),
  S('Drake Passage','Drakestraße', -59.0, -65.0, 3),
  S('Taiwan Strait','Taiwanstraße', 24.5, 119.5, 3),
  S('Torres Strait','Torresstraße', -10.0, 142.2, 3),
  S('Sunda Strait','Sundastraße', -6.0, 105.8, 3),
  S('Strait of Sicily','Straße von Sizilien', 37.3, 11.5, 3),
  S('Palk Strait','Palkstraße', 9.5, 79.5, 3)
];
```

- [ ] **Step 2: Verify the file still parses as a valid ES module**

Run: `node --input-type=module -e "import('./geo-data.js').then(m => console.log(m.SEAS.length))"`

Expected output: `59` (33 existing + 26 new).

- [ ] **Step 3: Verify no duplicate `en` names were introduced**

Run: `node --input-type=module -e "import('./geo-data.js').then(m => { const names = m.SEAS.map(s => s.en); const dupes = names.filter((n,i) => names.indexOf(n) !== i); console.log(dupes.length ? 'DUPES: ' + dupes.join(', ') : 'no dupes'); })"`

Expected output: `no dupes`

- [ ] **Step 4: Commit**

```bash
git add geo-data.js
git commit -m "feat(quiz): add straits and gulfs to seas quiz data

Closes #18"
```

- [ ] **Step 5: Manual playtest (buildless repo — this is the test gate)**

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`, open the browser devtools console, then:

- [ ] Page loads with an empty console (no errors/warnings)
- [ ] Start the "Seas & Oceans" quiz mode; play enough rounds (increase round
      length / play multiple rounds if needed) to see at least one new strait
      and one new gulf appear as a prompt, each rendering a pin at a
      plausible map location (e.g. Bering Strait pin near the
      Alaska/Russia gap, not in the middle of a continent)
- [ ] Switch the language to German (`de`) and confirm new entries show their
      German names (e.g. "Magellanstraße", "Finnischer Meerbusen")
- [ ] Reload the page mid-quiz and confirm `localStorage`-backed state
      (score/progress) persists

---

## Self-Review

**Spec coverage:** The spec's only concrete deliverable is the 26-row data
table (10 gulfs + 16 straits) appended to `SEAS` — covered by Task 1,
Step 1. The spec's "No code changes required" section is satisfied by this
plan touching only `geo-data.js`. The spec's testing checklist is covered by
Task 1, Step 5.

**Placeholder scan:** No TBD/TODO; every step has literal code or literal
commands.

**Type consistency:** Single task, single file, one helper (`S`) used
throughout — no cross-task signature drift possible.
