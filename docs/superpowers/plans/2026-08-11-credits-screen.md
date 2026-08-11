# Credits Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated, EN/DE-localized Credits screen (reached from a link on the home screen) that thanks Nataliia for her feedback and improvements.

**Architecture:** Single-file dc-tool app (`index.html`) — the whole game is an inline template (`<template data-dc-tpl>`) plus an inline component script. This change adds one new `view: 'credits'` state, following the exact pattern every other screen already uses (a `vXxx` boolean in `renderVals()`, an `sc-if` block in the template, a `✕`-back-button + title header). No new files, no build step (buildless repo, GitHub Pages serves `index.html` as-is).

**Tech Stack:** Vanilla JS, dc-tool runtime (`support.js`), inline SVG/HTML template. No test runner — this stack's test gate is manual in-browser playtest (per `.ai/stacks/browser-game.md`).

## Global Constraints

- No framework, bundler, or `package.json` may be introduced (browser-game stack overlay).
- This repo has no separate `source/` dir — `index.html` is the authored source; editing it directly is correct.
- Both the screen chrome and the thank-you quote must be localized into EN and DE (decided in spec) — no English-only strings for user-facing text.
- The link label is "Credits" in both languages (decided in spec — not "Danksagung").
- Credits are rendered as a list (`sc-for`) even with one entry today, for consistency with every other list in this codebase and to make future entries a data change, not a template change (decided in spec).
- Manual playtest (EN + DE, desktop + narrow/mobile viewport) is the verification gate — there is no automated test suite in this repo.

---

### Task 1: Add the Credits screen (data, strings, render props, template, entry link)

**Files:**
- Modify: `index.html:451` (module-level constants block, add `CREDITS`)
- Modify: `index.html:465-538` (`I18N.en` block, add two keys)
- Modify: `index.html:539-612` (`I18N.de` block, add two keys)
- Modify: `index.html:1629` (`renderVals()` — add `vCredits` flag)
- Modify: `index.html:1633` (`renderVals()` — add `openCredits` closure)
- Modify: `index.html:1641-1651` (`renderVals()` — add `credits` list, right after the `sections` computation)
- Modify: `index.html:93-95` (home screen template — add the Credits link, inside `vHome`, after the mode-sections `sc-for` closes, before the `vHome` `sc-if` closes)
- Modify: `index.html:96` (template — add the new Credits screen `sc-if` block, right after the `vHome` block's closing `</sc-if>`)

This is one cohesive, independently testable change — the data, strings, render props, and template pieces only produce a working, clickable screen together; splitting them would leave broken intermediate states (e.g. a template referencing `{{ t.credits }}` before the key exists).

**Interfaces:**
- Consumes: `this.T()` (existing, returns the active language's string dict), `this.state.view` (existing state field), `this.goHome` (existing handler, reused verbatim for the back button), `this.setState` (existing).
- Produces: `this.CREDITS` (module-level array `[{ key: string }]`), render props `vCredits: boolean`, `openCredits: () => void`, `credits: Array<{ text: string }>` — consumed only by the new template block in this same task, no other task depends on them.

- [ ] **Step 1: Add the `CREDITS` module-level constant**

In `index.html`, right after the `MODES` array closes (find the line reading exactly `];` that ends the `MODES = [...]` block starting at line 451 — it's immediately followed by the blank line before `I18N = {`), insert:

```js
  CREDITS = [
    { key: 'nataliia' }
  ];

```

- [ ] **Step 2: Add the EN strings**

In `index.html`, inside the `en: { ... }` block, immediately before its closing line:

```js
      mapError: 'Map data could not be loaded — shapes, seas and size comparison need an internet connection.'
```

change it to:

```js
      mapError: 'Map data could not be loaded — shapes, seas and size comparison need an internet connection.',
      credits: 'Credits',
      credit_nataliia: 'Thank you, Nataliia, for your valuable feedback and improvements.'
```

- [ ] **Step 3: Add the DE strings**

In `index.html`, inside the `de: { ... }` block, immediately before its closing line:

```js
      mapError: 'Kartendaten konnten nicht geladen werden – Umrisse, Meere und Grössenvergleich brauchen eine Internetverbindung.'
```

change it to:

```js
      mapError: 'Kartendaten konnten nicht geladen werden – Umrisse, Meere und Grössenvergleich brauchen eine Internetverbindung.',
      credits: 'Credits',
      credit_nataliia: 'Danke, Nataliia, für dein wertvolles Feedback und deine Verbesserungen.'
```

(Use the `\uXXXX` escape style already used throughout both blocks for accented characters, matching existing convention — `ü` is `ü`.)

- [ ] **Step 4: Add the `vCredits` render flag**

In `index.html:1629`, change:

```js
      vHome: st.view === 'home', vFlagHub: st.view === 'flaghub', vSetup: st.view === 'setup', vPick: st.view === 'pick',
```

to:

```js
      vHome: st.view === 'home', vFlagHub: st.view === 'flaghub', vSetup: st.view === 'setup', vPick: st.view === 'pick',
      vCredits: st.view === 'credits',
```

- [ ] **Step 5: Add the `openCredits` closure**

In `index.html:1633`, change:

```js
      randomQuiz: () => this.randomQuiz(),
```

to:

```js
      randomQuiz: () => this.randomQuiz(),
      openCredits: () => this.setState({ view: 'credits' }),
```

- [ ] **Step 6: Add the `credits` list computation**

In `index.html`, right after the `sections: [0, 1, 2].map(...)` computation ends (the `}))` that closes it, immediately before the final `};` that closes the whole `vals` object — currently:

```js
      sections: [0, 1, 2].map(sec => ({
        title: T['sec' + sec],
        cards: this.MODES.filter(m => m.sec === sec).map(m => {
          const b = Math.max(st.best[m.id + '.' + st.diff] || 0, st.best[m.id + 'map.' + st.diff] || 0);
          return {
            title: T['m_' + m.id], desc: T['d_' + m.id], icon: m.icon || '', img: m.img || '',
            best: m.id === 'cmp' ? '' : (b ? String(b) : ''),
            open: () => this.openMode(m.id)
          };
        })
      }))
    };
```

change to:

```js
      sections: [0, 1, 2].map(sec => ({
        title: T['sec' + sec],
        cards: this.MODES.filter(m => m.sec === sec).map(m => {
          const b = Math.max(st.best[m.id + '.' + st.diff] || 0, st.best[m.id + 'map.' + st.diff] || 0);
          return {
            title: T['m_' + m.id], desc: T['d_' + m.id], icon: m.icon || '', img: m.img || '',
            best: m.id === 'cmp' ? '' : (b ? String(b) : ''),
            open: () => this.openMode(m.id)
          };
        })
      })),
      credits: this.CREDITS.map(c => ({ text: T['credit_' + c.key] }))
    };
```

- [ ] **Step 7: Add the Credits link on the home screen**

In `index.html`, the home screen's `vHome` block currently ends like this (around lines 90-95):

```html
            </div>
          </div>
        </sc-for>
      </div>
    </sc-if>
```

Insert a centered text link right before the block's closing `</div>` (i.e. immediately after the `</sc-for>` that closes the mode-sections loop, still inside the `vHome` `<div>`):

```html
            </div>
          </div>
        </sc-for>
        <div style="text-align: center; margin-top: 24px;">
          <button onClick="{{ openCredits }}" style="background: none; border: none; color: #5D6E92; font-size: 13px; padding: 6px;" style-hover="color: #93A3C4;">{{ t.credits }}</button>
        </div>
      </div>
    </sc-if>
```

- [ ] **Step 8: Add the Credits screen template block**

In `index.html`, immediately after the `vHome` block's closing `</sc-if>` (the one edited in Step 7) and before the `vFlagHub` block's opening `<sc-if>`, insert a new screen block following the same header pattern used by the Quiz/Neighbors-map/Pin-map screens (`✕` back button + title):

```html
    <sc-if value="{{ vCredits }}" hint-placeholder-val="{{ false }}">
      <div data-screen-label="Credits" style="max-width: 640px; margin: 44px auto 0; animation: fadeUp .3s ease;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 22px;">
          <button onClick="{{ goHome }}" style="background: #131C30; border: 1px solid rgba(255,255,255,.1); color: #93A3C4; width: 36px; height: 36px; border-radius: 10px; font-size: 16px; display: grid; place-items: center;">✕</button>
          <div style="font-weight: 700; font-size: 18px;">{{ t.credits }}</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <sc-for list="{{ credits }}" as="c" hint-placeholder-count="1">
            <div style="background: #131C30; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; padding: 16px 18px; color: #ECF2FF; font-size: 15px; text-wrap: pretty;">{{ c.text }}</div>
          </sc-for>
        </div>
      </div>
    </sc-if>
```

(The `✕` is the literal `✕` character, matching the other back-button glyphs already in the file — write it as the actual `✕` character, not the escape sequence, consistent with how those buttons are written elsewhere, e.g. `index.html:170`.)

- [ ] **Step 9: Manual playtest — English**

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` with the browser's language/localStorage set to English (default on first load, or click "EN"). Verify:
- A "Credits" link appears centered below the home screen's mode sections.
- Clicking it shows the Credits screen: `✕` back button, "Credits" title, and the line "Thank you, Nataliia, for your valuable feedback and improvements."
- Clicking `✕` returns to the home screen.
- No console errors at any point.

- [ ] **Step 10: Manual playtest — German + narrow viewport**

Switch to German (click "DE" on the home screen, or on the Credits screen). Verify:
- The link now reads "Credits" (same word, per spec decision) and the screen shows "Danke, Nataliia, für dein wertvolles Feedback und deine Verbesserungen."
- Switching language while already on the Credits screen updates the quote live (same mechanism as every other screen's live re-render on language change — no special handling needed, confirm it isn't broken).
- Resize the browser to a narrow/mobile width (e.g. 375px) on both the home screen and the Credits screen: the link and the credit card don't overflow or break the layout.
- No console errors.

- [ ] **Step 11: Commit**

```bash
git add index.html
git commit -m "feat: add credits screen thanking Nataliia

Add a dedicated, EN/DE-localized Credits screen reached from a small
link on the home screen. Follows the existing view-switcher pattern
(vCredits/openCredits) and renders entries via sc-for over a new
CREDITS array, so future entries are a data change only.

Closes #12"
```

---

## Self-Review Notes

- **Spec coverage:** new view + entry point (Steps 4, 5, 7), screen layout matching existing header pattern (Step 8), EN/DE strings for both chrome and quote (Steps 2, 3), data-driven list for future extensibility (Steps 1, 6, 8), manual EN/DE/narrow-viewport testing (Steps 9, 10) — every spec decision has a corresponding step.
- **Placeholder scan:** no TBD/TODO; every step has literal before/after code or a concrete manual-test checklist.
- **Type/name consistency:** `CREDITS`, `credits`, `credit_nataliia`, `vCredits`, `openCredits`, `t.credits`, `c.text` all match across the data (Step 1), strings (Steps 2-3), render props (Steps 4-6), and template (Steps 7-8) — no naming drift.
