# EU Membership + Eurozone Quiz Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "EU" quiz mode that asks, per round, either "is this European country an EU member?" (any European country) or "does this EU member use the Euro?" (members only), alternating between the two within a single round.

**Architecture:** Single-file dc-tool app. EU/Eurozone membership data lives in `geo-data.js` as two new exported `Set`s (`EU_MEMBERS`, `EUROZONE`), self-contained and independent of issue #2's currency data (no cross-issue dependency). The quiz logic is a new `mode === 'eu'` branch in `index.html`'s `makeQuestions()`, alternating question type via `qi % 2` (the same technique the existing `caps` mode already uses), with a Yes/No answer shape built by reusing the existing `_mcq()` helper on a boolean value (the same generalization the existing `cont` mode already uses by passing continent-key strings instead of country objects). The mode bypasses the setup screen entirely, exactly like the existing `seas` mode, since it's inherently Europe-only. No build step (buildless repo, GitHub Pages serves `index.html`/`geo-data.js` as-is).

**Tech Stack:** Vanilla JS, ES modules (`geo-data.js` is `import()`ed by `index.html`), dc-tool runtime. No test runner — this stack's test gate is manual in-browser playtest (per `.ai/stacks/browser-game.md`).

## Global Constraints

- No framework, bundler, or `package.json` may be introduced (browser-game stack overlay).
- This mode's data (`EU_MEMBERS`, `EUROZONE`) must be self-contained — it does NOT reuse or depend on issue #2's `COUNTRY_CURRENCY` data, so this issue can ship regardless of #2's implementation order (decided in spec).
- No new setup-screen UI — the mode bypasses setup entirely, matching the existing `seas` mode's pattern (decided in spec).
- The Eurozone question only ever fires for EU members; non-members are never asked about Euro usage (decided in spec).
- Manual playtest (EN + DE, membership + Eurozone question types, non-member vs. non-Eurozone-member cases) is the verification gate — there is no automated test suite in this repo.

---

### Task 1: Add EU/Eurozone data to `geo-data.js`

**Files:**
- Modify: `geo-data.js` (append at end of file, after the `FLAG_SPECIAL` export closes at line 418)

**Interfaces:**
- Consumes: nothing (pure data, no dependency on existing exports).
- Produces: `export const EU_MEMBERS` — `Set<string>` of 27 ISO2 codes. `export const EUROZONE` — `Set<string>` of 20 ISO2 codes, a subset of `EU_MEMBERS`. Both consumed by Task 2 via `this.DATA.EU_MEMBERS` / `this.DATA.EUROZONE` (the module is loaded wholesale via `import()` and assigned to `this.DATA`, so any export here is automatically available the same way `this.DATA.COUNTRIES` already is).

- [ ] **Step 1: Append the two exports to `geo-data.js`**

At the very end of `geo-data.js` (after the `FLAG_SPECIAL` array's closing `];` on line 418), add:

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

- [ ] **Step 2: Verify the file still parses and the data is correct**

```bash
node --check geo-data.js
node -e "
import('./geo-data.js').then(m => {
  if (m.EU_MEMBERS.size !== 27) throw new Error('expected 27 EU members, got ' + m.EU_MEMBERS.size);
  if (m.EUROZONE.size !== 20) throw new Error('expected 20 Eurozone members, got ' + m.EUROZONE.size);
  // every Eurozone country must also be an EU member
  const notEu = [...m.EUROZONE].filter(iso => !m.EU_MEMBERS.has(iso));
  if (notEu.length) throw new Error('Eurozone countries not in EU_MEMBERS: ' + notEu.join(','));
  // every iso2 in both sets must exist in COUNTRIES
  const isoSet = new Set(m.COUNTRIES.map(c => c.iso));
  const badIso = [...m.EU_MEMBERS, ...m.EUROZONE].filter(iso => !isoSet.has(iso));
  if (badIso.length) throw new Error('iso2 codes not found in COUNTRIES: ' + badIso.join(','));
  console.log('OK');
}).catch(e => { console.error(e); process.exit(1); });
"
```

Expected output: `OK`. If it throws, diff your pasted `Set` contents against
Step 1's literal list rather than manually re-deriving membership.

- [ ] **Step 3: Commit**

```bash
git add geo-data.js
git commit -m "feat(eu): add EU membership and Eurozone data

Adds EU_MEMBERS (27 countries) and EUROZONE (20 countries, a subset)
as new self-contained exports — deliberately independent of issue
#2's currency data so this can ship regardless of #2's implementation
order. See docs/superpowers/specs/2026-08-11-eu-membership-quiz-mode-design.md."
```

---

### Task 2: Add the EU quiz mode to `index.html`

**Files:**
- Modify: `index.html:451-463` (`MODES` array — add the `eu` entry after `cont`)
- Modify: `index.html:474` (`I18N.en` — add `m_eu`/`d_eu` near `m_caps`/`d_caps`)
- Modify: `index.html:508-509` (`I18N.en` — add `euMemberQP`/`euroQP`/`isMember`/`notMember`/`usesEuro`/`noEuro` near `capOfP`/`capWhichP`)
- Modify: `index.html:547` (`I18N.de` — add `m_eu`/`d_eu`)
- Modify: `index.html:581-582` (`I18N.de` — add the German equivalents)
- Modify: `index.html:929-941` (`makeQuestions()` — insert the `mode === 'eu'` branch between the end of the `cont` branch and the start of the `seas` branch)
- Modify: `index.html:1253` (random-quiz `opts` array — add `'eu'`)

No change to `openMode` (`index.html:1090-1096`) — `'eu'` is not one of the
ids special-cased there, so it already falls through to `this.startQuiz(id)`
on line 1096, which is exactly the desired "skip the setup screen" behavior
(the same path `seas` uses).

**Interfaces:**
- Consumes: `this.DATA.EU_MEMBERS`, `this.DATA.EUROZONE` (from Task 1), `this.state.diff`, `this._cycle()`, `this._mcq()`, `this.cname()`, `this.fmt()`, `this.flag()` (all pre-existing).
- Produces: nothing consumed by any other task — this is the final task.

- [ ] **Step 1: Add the `eu` entry to `MODES`**

In `index.html`, change (lines 451-454):

```js
  MODES = [
    { id: 'flags', sec: 0, icon: 'M6 21V4m0 0h11l-2.5 3.5L17 11H6' },
    { id: 'caps', sec: 0, icon: 'M12 3.5l2.4 5 5.4.7-4 3.8 1 5.4-4.8-2.7-4.8 2.7 1-5.4-4-3.8 5.4-.7z' },
    { id: 'cont', sec: 0, icon: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c-3.2 3.5-3.2 14.5 0 18M12 3c3.2 3.5 3.2 14.5 0 18' },
```

to:

```js
  MODES = [
    { id: 'flags', sec: 0, icon: 'M6 21V4m0 0h11l-2.5 3.5L17 11H6' },
    { id: 'caps', sec: 0, icon: 'M12 3.5l2.4 5 5.4.7-4 3.8 1 5.4-4.8-2.7-4.8 2.7 1-5.4-4-3.8 5.4-.7z' },
    { id: 'cont', sec: 0, icon: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c-3.2 3.5-3.2 14.5 0 18M12 3c3.2 3.5 3.2 14.5 0 18' },
    { id: 'eu', sec: 0, icon: 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.2l7.1-.6z' },
```

(The rest of `MODES` below is unchanged — only these four lines are shown for
context.)

- [ ] **Step 2: Add the EN strings**

In `index.html:474`, change:

```js
      m_caps: 'Capitals', d_caps: 'Do you know every capital?',
```

to:

```js
      m_caps: 'Capitals', d_caps: 'Do you know every capital?',
      m_eu: 'European Union', d_eu: 'Who is in the EU — and who uses the Euro?',
```

In `index.html:508-509`, change:

```js
      capOfP: 'What is the capital of {x}?',
      capWhichP: 'Which country has this capital?',
```

to:

```js
      capOfP: 'What is the capital of {x}?',
      capWhichP: 'Which country has this capital?',
      euMemberQP: 'Is {x} a member of the European Union?',
      euroQP: 'Does {x} use the Euro?',
      isMember: 'EU member', notMember: 'Not an EU member',
      usesEuro: 'Uses the Euro', noEuro: 'Does not use the Euro',
```

- [ ] **Step 3: Add the DE strings**

In `index.html:547`, change:

```js
      m_caps: 'Hauptstädte', d_caps: 'Kennst du alle Hauptstädte?',
```

to:

```js
      m_caps: 'Hauptstädte', d_caps: 'Kennst du alle Hauptstädte?',
      m_eu: 'Europäische Union', d_eu: 'Wer ist in der EU — und wer hat den Euro?',
```

In `index.html:581-582`, change:

```js
      capOfP: 'Was ist die Hauptstadt von {x}?',
      capWhichP: 'Welches Land hat diese Hauptstadt?',
```

to:

```js
      capOfP: 'Was ist die Hauptstadt von {x}?',
      capWhichP: 'Welches Land hat diese Hauptstadt?',
      euMemberQP: 'Ist {x} Mitglied der Europäischen Union?',
      euroQP: 'Verwendet {x} den Euro?',
      isMember: 'EU-Mitglied', notMember: 'Kein EU-Mitglied',
      usesEuro: 'Verwendet den Euro', noEuro: 'Verwendet den Euro nicht',
```

- [ ] **Step 4: Add the `mode === 'eu'` branch to `makeQuestions()`**

In `index.html`, the `cont` branch currently ends and is immediately followed
by the `seas` branch like this (lines 929-941):

```js
    if (mode === 'cont') {
      // ru/tr are transcontinental — a whole-country cont field has no single
      // correct answer for them, so they never become the quizzed country.
      const p = this.DATA.COUNTRIES.filter(c => c.d <= this.state.diff && c.iso !== 'ru' && c.iso !== 'tr');
      const li = this.state.lang === 'de' ? 1 : 0;
      const conts = Object.keys(D.CONTINENTS);
      return this._cycle(p, len).map(c => {
        const wrong = this._shuffle(conts.filter(k => k !== c.cont)).slice(0, 3);
        return { prompt: T.contOfP, kind: 'text', main: this.cname(c), ctxImg: this.flag(c.iso, 80),
          opts: this._mcq(c.cont, wrong, k => D.CONTINENTS[k][li]) };
      });
    }
    if (mode === 'seas') {
```

Insert the new branch between the `cont` block's closing `}` and the `seas`
block's opening `if`:

```js
    if (mode === 'cont') {
      // ru/tr are transcontinental — a whole-country cont field has no single
      // correct answer for them, so they never become the quizzed country.
      const p = this.DATA.COUNTRIES.filter(c => c.d <= this.state.diff && c.iso !== 'ru' && c.iso !== 'tr');
      const li = this.state.lang === 'de' ? 1 : 0;
      const conts = Object.keys(D.CONTINENTS);
      return this._cycle(p, len).map(c => {
        const wrong = this._shuffle(conts.filter(k => k !== c.cont)).slice(0, 3);
        return { prompt: T.contOfP, kind: 'text', main: this.cname(c), ctxImg: this.flag(c.iso, 80),
          opts: this._mcq(c.cont, wrong, k => D.CONTINENTS[k][li]) };
      });
    }
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
    if (mode === 'seas') {
```

(`D` and `T` are already defined at the top of `makeQuestions()` — `const T =
this.T(), len = this.roundLen(); const D = this.DATA;`, confirmed in the
`cont`/`caps`/`flags` branches above, so both are already in scope here; no
new destructuring needed.)

- [ ] **Step 5: Add `eu` to the random-quiz pool**

In `index.html:1253`, change:

```js
    const opts = ['flags', 'flagsim', 'flagspec', 'flagzoom', 'flagblur', 'flagcap', 'flagcont', 'flagspeed', 'caps', 'cont', 'seas', 'shape', 'us', 'chq', 'nb', 'pin', 'find'];
```

to:

```js
    const opts = ['flags', 'flagsim', 'flagspec', 'flagzoom', 'flagblur', 'flagcap', 'flagcont', 'flagspeed', 'caps', 'cont', 'eu', 'seas', 'shape', 'us', 'chq', 'nb', 'pin', 'find'];
```

- [ ] **Step 6: Manual playtest — English**

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in English. From the home screen, click the new
"European Union" card. Verify:
- No setup screen appears — the quiz starts immediately (same behavior as
  clicking "Seas").
- Both question types appear across the round: some ask "Is `<country>` a
  member of the European Union?" (Yes/No-style two-button answer: "EU
  member" / "Not an EU member"); others ask "Does `<country>` use the Euro?"
  ("Uses the Euro" / "Doesn't use the Euro").
- Play through a full round; scoring and the result screen work as with any
  other mode.
- No console errors.

- [ ] **Step 7: Manual playtest — non-member and non-Eurozone-member cases**

Play additional rounds (or replay) until you see:
- A non-EU-member European country (e.g. Switzerland, Norway, or the UK) —
  confirm it is only ever asked the membership question ("Not an EU member"
  is the correct answer), never the Eurozone question.
- A non-Eurozone EU member (e.g. Sweden or Poland) — confirm it can be asked
  either question correctly: membership → "EU member"; Eurozone → "Doesn't
  use the Euro".

- [ ] **Step 8: Manual playtest — German**

Switch to German and play another round. Verify:
- The mode card reads "Europäische Union".
- Prompts read "Ist `<country>` Mitglied der Europäischen Union?" and
  "Verwendet `<country>` den Euro?", with answer labels "EU-Mitglied" / "Kein
  EU-Mitglied" and "Verwendet den Euro" / "Verwendet den Euro nicht".
- No console errors.

- [ ] **Step 9: Commit**

```bash
git add index.html
git commit -m "feat(eu): add EU membership and Eurozone quiz mode

Adds a combined EU mode that alternates two question types across a
round: EU membership (any European country) and Eurozone status (EU
members only), reusing the existing qi%2 alternation pattern (caps)
and generalizing _mcq() to boolean answers (same pattern the cont
mode already uses for continent-key strings). Bypasses the setup
screen like the existing seas mode, since the quiz is inherently
Europe-only.

Closes #1"
```

---

## Self-Review Notes

- **Spec coverage:** self-contained data (Task 1), combined-flow alternation logic with membership-then-Eurozone-for-members-only semantics (Task 2 Step 4), setup-screen bypass (Task 2 — explicitly no `openMode` change, confirmed the existing fallthrough already does this), full hookup — MODES/random-quiz/i18n (Task 2 Steps 1-3, 5), manual EN/DE/non-member/non-Eurozone testing (Task 2 Steps 6-8) — every spec decision has a corresponding step.
- **Placeholder scan:** no TBD/TODO; every step has literal before/after code, the full literal dataset, or a concrete manual-test checklist.
- **Type/name consistency:** `EU_MEMBERS`, `EUROZONE`, `m_eu`/`d_eu`, `euMemberQP`/`euroQP`, `isMember`/`notMember`/`usesEuro`/`noEuro` are used identically across Task 1's data and Task 2's quiz branch and i18n strings — no naming drift. `D`/`T` scope claims in Task 2 Step 4 are confirmed pre-existing (visible directly in the `cont` branch shown in that same step), not invented.
