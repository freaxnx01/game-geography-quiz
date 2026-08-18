# TODO

Session of 2026-08-18 — shepherding issue #18 through agent-workflow end-to-end.

## PR #19 — straits & gulfs quiz mode (issue #18)

https://github.com/freaxnx01/game-geography-quiz/pull/19 — approved, ready, **awaiting merge**

- [ ] Run the manual playtest — `python3 -m http.server 8000`, then:
      page loads with empty console · "Seas & Oceans" surfaces a new strait and
      a new gulf with plausible pins · German names render (e.g.
      "Magellanstraße", "Finnischer Meerbusen") · score persists across reload
- [ ] Merge PR #19

Verified already (no need to redo): only `geo-data.js` changed (+29/−1),
net 26 new entries, `SEAS.length` = 61, no duplicate `en` names.

- [ ] Optional — correct issue #18's AC baseline. It says `SEAS.length is 59
      (33 existing + 26 new)`; the real pre-existing count is **35**, so the
      correct total is **61**. The implementing agent caught this and documented
      it in the PR body rather than deleting entries to hit 59. Leave it or fix
      the record.

## agent-workflow follow-ups (different repo)

Four issues filed from this session, all `bug` + `needs-enrichment`:

- [ ] [#260](https://github.com/freaxnx01/agent-workflow/issues/260) — pre-review reviews the diff in isolation, never checks the issue's AC
- [ ] [#261](https://github.com/freaxnx01/agent-workflow/issues/261) — moving `v1` tag never updated (consumers run a 100-commit-stale pipeline)
- [ ] [#262](https://github.com/freaxnx01/agent-workflow/issues/262) — input mismatch against pinned ref fails as bare `startup_failure`, no diagnostic
- [ ] [#263](https://github.com/freaxnx01/agent-workflow/issues/263) — pre-preview promotes draft→ready when a manual test gate never ran

**Ordering constraint — load-bearing:** #260 must land **before** any release
carrying `self-fix`. `self-fix` is on `main` but in no tag through `v1.11.1`,
so #261's catch-up would ship it incidentally. A self-fixing loop on top of a
reviewer that can't read the AC is exactly what would have deleted two correct
entries from PR #19.

Suggested order: **#260 → #263 decision → #261 → #262**

- [ ] Decide #261's open question — how far to jump the `v1` tag (blast radius
      across all `game-*` consumers)
- [ ] Decide #263's open question — label-and-promote vs block promotion vs
      consumer opt-in
- [ ] Consider dropping `needs-enrichment` from #260 and #262 — both already
      carry full AC and are arguably dispatch-ready
- [ ] Triage: `Add issues to project` workflow failed on `b1e53ae` when #260/#261
      were created. Board automation only; issues themselves are fine.

A ready-to-paste prompt for a fresh agent-workflow session was produced in this
session's transcript (front-loads the two decisions, hard-codes the ordering
constraint).

## Shipped this session — no action needed

- `agent-workflow@80a4dbf` — buildless contract variant added to
  `commands/gh/implementation-contract.md` (new rule 4; old rule 4 → 5).
  `gate-selftest` and `lint` both passed. Also applied to the installed copy at
  `~/.claude/commands/gh/`, so it survives `/update-commands`.
- This repo: `self-fix: true` was added then reverted (`6a8dbf7`) — the input
  doesn't exist on the pinned `v1` and broke every dispatch at
  `startup_failure`. Do **not** re-add it until #261 ships a release with it.

## Pre-existing — not from this session

Open PRs untouched here, listed so they aren't forgotten:

- [ ] #17 — feat(currency): worldwide currency-country quiz mode (ready)
- [ ] #16 — feat(eu): membership + Eurozone quiz mode (draft)
- [ ] #15 — feat: credits screen thanking Nataliia (ready)
- [ ] #14 — fix(mobile): touch input in map-pin quiz mode (draft)
