# EU membership + Eurozone quiz mode

**Issue:** [#1](https://github.com/freaxnx01/game-geography-quiz/issues/1) — feat(eu): add membership + Eurozone quiz mode

## Context

No EU-membership or Eurozone data exists anywhere in this repo (confirmed by
searching `geo-data.js` and `index.html` — no matches). The `cont: 'EU'` tag
already used throughout `COUNTRIES` means "the continent Europe", not "the
European Union" — an unrelated, pre-existing naming overlap that this feature
must not confuse itself with.

Issue #2 (already enriched, not yet implemented) separately adds a
`COUNTRY_CURRENCY`/`CURRENCIES` dataset to `geo-data.js` that happens to
include `'EUR'` as the currency code for Eurozone countries. This mode could
in principle reuse that for Eurozone status — but that would make this issue
undeployable until #2 lands, and brittle to any future change in #2's data
shape.

The quiz engine (`makeQuestions()` in `index.html`) builds a flat list of
independent question objects per round via `this._cycle(pool, len).map(...)`.
No existing mode has true per-question branching (a follow-up question that
only appears after seeing the previous answer) — every "combined" mode
(`caps`, and the currency mode from #2) achieves a two-facet quiz by
alternating question *type* across the flat list via `qi % 2`, not by
chaining questions together.

## Decisions (from brainstorming)

- **Self-contained data** — no dependency on issue #2. A small `EU_MEMBERS`
  set (27 countries) and `EUROZONE` set (20 countries) are added directly to
  `geo-data.js`, duplicating a handful of Eurozone country codes that also
  appear as `'EUR'` in #2's dataset once that lands. This is an accepted,
  minor tradeoff — EU/Eurozone membership rarely changes, and it lets this
  issue ship independently of #2's implementation order.
- **"Combined flow"**, made concrete within the engine's existing
  architecture: one quiz mode alternates two question types across a single
  round (via `qi % 2`, same technique `caps`/currency already use) —
  membership questions (any European country) and Eurozone questions (EU
  members only) — rather than inventing new per-question branching that no
  other mode has.
- **Answer shape:** Yes/No, reusing the existing `_mcq()` helper with a
  boolean value instead of a country/currency object — `_mcq` already accepts
  arbitrary value types via its `labelFn` (the existing `cont` mode passes
  continent-key strings, not country objects), so this is reuse of an
  established pattern, not new machinery. No `_distract()` call is needed —
  there's no distractor pool to search, just the literal opposite boolean.
- **Setup flow:** bypasses the continent/difficulty setup screen entirely,
  matching the existing `seas` mode — the quiz is inherently Europe-only, so
  a continent picker doesn't apply. It starts immediately from the
  home-screen card using the currently-selected difficulty chip.

## Design

### Data (`geo-data.js`)

Two new exported `Set`s, alongside `COUNTRIES`:

```js
// EU membership as of 2026 (27 states).
export const EU_MEMBERS = new Set([
  'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'de', 'gr',
  'hu', 'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk',
  'si', 'es', 'se'
]);

// Eurozone membership as of 2026 (20 states) — a subset of EU_MEMBERS.
export const EUROZONE = new Set([
  'at', 'be', 'hr', 'cy', 'ee', 'fi', 'fr', 'de', 'gr', 'ie', 'it', 'lv',
  'lt', 'lu', 'mt', 'nl', 'pt', 'sk', 'si', 'es'
]);
```

### Quiz logic (`index.html`)

New `mode === 'eu'` branch in `makeQuestions()`, modeled on the `seas`
branch's setup-bypass pattern and the `caps`/currency branches'
type-alternation pattern:

```js
if (mode === 'eu') {
  let p = D.COUNTRIES.filter(c => c.cont === 'EU' && c.d <= this.state.diff);
  if (p.length < 8) p = D.COUNTRIES.filter(c => c.cont === 'EU');
  return this._cycle(p, len).map((c, qi) => {
    const isMember = D.EU_MEMBERS.has(c.iso);
    if (qi % 2 === 1 && isMember) {
      const inEuro = D.EUROZONE.has(c.iso);
      return { prompt: this.fmt(T.euroQP, this.cname(c)), kind: 'text', main: this.cname(c), ctxImg: this.flag(c.iso, 80),
        opts: this._mcq(inEuro, [!inEuro], b => b ? T.usesEuro : T.noEuro) };
    }
    return { prompt: this.fmt(T.euMemberQP, this.cname(c)), kind: 'text', main: this.cname(c), ctxImg: this.flag(c.iso, 80),
      opts: this._mcq(isMember, [!isMember], b => b ? T.isMember : T.notMember) };
  });
}
```

- Pool is every European-continent country (`cont === 'EU'`, i.e. geographic
  Europe — the existing tag, unrelated to EU political membership),
  difficulty-filtered like every other mode, with the same "widen if too
  small" fallback `seas` already uses.
- Even `qi`, or an odd `qi` on a non-member: membership question, covering
  every European country (member and non-member alike) — satisfies "should
  cover all European countries, not just EU members" structurally, since
  non-members simply produce "No" as the correct answer rather than needing
  to be picked as a wrong MC option.
- Odd `qi` on a member: Eurozone question, restricted to EU members only
  (non-members are never asked about Euro usage, since that question
  wouldn't make sense for them).

### Hookup

- `MODES`: add `{ id: 'eu', sec: 0, icon: '<5-point star path>' }`, alongside
  `caps`/`curr`/`cont` — a star evokes the EU flag without needing a full
  12-star SVG.
- `openMode`: **no change needed.** Ids not explicitly handled already fall
  through to `this.startQuiz(id)` directly (the same path `seas` uses), which
  is exactly the desired "skip setup screen" behavior.
- Random-quiz pool (`index.html:~1253`): add `'eu'`.
- `I18N.en`/`I18N.de`: `m_eu`/`d_eu` (mode card title/description),
  `euMemberQP` ("Is {x} a member of the European Union?"), `euroQP` ("Does
  {x} use the Euro?"), `isMember`/`notMember` ("EU member" / "Not an EU
  member"), `usesEuro`/`noEuro` ("Uses the Euro" / "Doesn't use the Euro").

## Testing

This repo is buildless — manual in-browser playtest is the test gate (per
`.ai/stacks/browser-game.md`). No automated test runner exists here.

- Open the new EU mode from the home screen (no setup screen should appear —
  it starts immediately, like Seas).
- Play a full round in English; confirm both question types appear.
- Confirm a non-EU-member European country (e.g. Switzerland, Norway, UK)
  only ever gets asked the membership question, never the Eurozone one.
- Confirm a non-Eurozone EU member (e.g. Sweden, Poland) can get both the
  membership question (answer: "EU member") and the Eurozone question
  (answer: "Doesn't use the Euro") correctly.
- Switch to German mid-round; confirm prompts and answer labels update.
- Confirm no console errors.
