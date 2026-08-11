# Credits screen

**Issue:** [#12](https://github.com/freaxnx01/game-geography-quiz/issues/12) — feat: add credits entry for Nataliia

## Context

The app has no credits/about UI anywhere (confirmed by searching `index.html`,
`README.md`, `i18n.js` — no matches for "credit"/"thank"/"acknowledg"). The
request is to add a credits entry thanking Nataliia for feedback and
improvements.

The app is a single-page dc-tool component (`index.html`) with a `view`-based
screen switcher already established for every existing screen (`vHome`,
`vFlagHub`, `vSetup`, `vQuiz`, `vNbMap`, `vPinMap`, `vResult`, `vCompare`, all
computed as `st.view === '...'` booleans in `renderVals()`, `index.html:~1628`)
and full EN/DE localization via a module-level `I18N` object
(`index.html:~465` for `en`, `~538` for `de`) accessed through `this.T()`.

## Decisions (from brainstorming)

- **Placement:** a new dedicated Credits screen, not a footer snippet or
  README-only mention — reached via a small link on the home screen.
- **Localization:** both the screen chrome (title, back button — reusing the
  existing pattern) and the thank-you quote itself are localized into EN/DE,
  consistent with the rest of the app.
- **Link label:** "Credits" in both languages (reads fine as a loanword in
  German UI copy; avoids inventing a heavier German word for one line of
  text).

## Design

**New view:** `view: 'credits'`, following the exact pattern every other
screen uses (`goHome`/`✕` back button + title, same header markup as e.g. the
Quiz/Neighbors-map/Pin-map screens at `index.html:169-179`, `267-269`,
`307-317`).

**Entry point:** a small centered text button on the home screen, below the
existing mode `sc-for` sections (`index.html:73` block, after its closing
`</sc-for>` and before the closing `</sc-if>` of `vHome`), labelled
`{{ t.credits }}`, `onClick="{{ openCredits }}"`.

**Screen content:** header (`✕` back + `{{ t.credits }}` title) then a list of
credit entries rendered via `sc-for` — consistent with how every other list in
this codebase is rendered (`sections`, `MODES`, `diffChips`, etc.), even
though there's a single entry today; this makes adding a second credit later
a data change, not a template change:

```
✕  Credits

"Thank you, Nataliia, for your valuable feedback and improvements."
```

German: `"Danke, Nataliia, für dein wertvolles Feedback und deine Verbesserungen."`

**Data model:** a module-level `CREDITS` array, alongside the existing
`MODES`/`PALETTE` module-level constants (`index.html:~451`):

```js
CREDITS = [
  { key: 'nataliia' }
];
```

**I18N additions** (`index.html`, both `en` and `de` blocks — anywhere among
the existing flat key list is consistent with current style, no grouping
enforced elsewhere in the object):

- `en`: `credits: 'Credits'`, `credit_nataliia: 'Thank you, Nataliia, for your valuable feedback and improvements.'`
- `de`: `credits: 'Credits'`, `credit_nataliia: 'Danke, Nataliia, für dein wertvolles Feedback und deine Verbesserungen.'`

**`renderVals()` additions** (`index.html:~1628-1629` for the `vXxx` flags,
`~1618` for action closures, alongside other list-computations near
`sections`):

```js
vCredits: st.view === 'credits',
openCredits: () => this.setState({ view: 'credits' }),
credits: this.CREDITS.map(c => ({ text: T['credit_' + c.key] })),
```

**Navigation:** the back button reuses the existing `goHome` handler and `✕`
button markup already used by other screens — no new navigation logic.

## Testing

This repo is buildless — manual in-browser playtest is the test gate (per
`.ai/stacks/browser-game.md`). No automated test runner exists here.

- Open the app, confirm the "Credits" link appears at the bottom of the home
  screen and doesn't break the existing home layout (including on a narrow
  mobile viewport).
- Click it: the Credits screen shows the `✕` back button, "Credits" title,
  and Nataliia's thank-you line.
- Click `✕`: returns to the home screen.
- Switch language (EN ⇄ DE) both from the home screen and while on the
  Credits screen: the link label, title, and quote all update correctly in
  both directions.
- Confirm no console errors on load or navigation.
