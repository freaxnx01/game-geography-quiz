# Mobile Pin-Map Touch Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the map-pin quiz mode's drag-to-pan and tap-to-place-pin interactions work on touchscreens by switching its input handling from Mouse Events to Pointer Events.

**Architecture:** Single-file dc-tool app (`index.html`) — the whole game is an inline template (`<template data-dc-tpl>`) plus an inline component script, hydrated by the runtime in `support.js`. This change touches only the map-pin mode's SVG event bindings and its `pinDown`/`pinUp` handlers inside that inline script. No new files, no build step (this repo is buildless — GitHub Pages serves `index.html` as-is).

**Tech Stack:** Vanilla JS, dc-tool runtime (`support.js`), inline SVG. No test runner — this stack's test gate is manual in-browser playtest (per `.ai/stacks/browser-game.md`).

## Global Constraints

- No framework, bundler, or `package.json` may be introduced (browser-game stack overlay).
- No hand-editing of a *generated* bundle — this repo has no separate `source/` dir; `index.html` itself is the authored source (confirmed: no `data-dc-script` companion source file exists), so editing it directly is correct.
- Pinch-to-zoom is explicitly out of scope — the existing +/−/reset buttons are the mobile zoom mechanism (decided in spec).
- `touch-action: none` on the pin-map SVG must remain — it's what allows the pointer stream to drive panning instead of the browser fighting it with native scroll/zoom.
- `onWheel="{{ pinWheel }}"` must remain untouched — desktop-only, harmless no-op on touch.
- Manual playtest (desktop + mobile/touch-emulation) is the verification gate — there is no automated test suite in this repo.

---

### Task 1: Switch pin-map SVG from Mouse Events to Pointer Events

**Files:**
- Modify: `index.html:320` (SVG element event bindings)
- Modify: `index.html:1468` (`pinDown`)
- Modify: `index.html:1477` (`pinUp`)

**Interfaces:**
- Consumes: `this.state.pinGame` (existing state shape: `{ c, map, cities, targets, kmPerPx, idx, results, pin, target, reveal, lastKm, vb }`), `this._pdrag` (existing drag-tracking field: `{ sx, sy, vb, p, moved }`), `this._svgPt(e, g)` (existing helper, unchanged — returns `[vx, vy]` viewBox coords from `e.clientX/clientY` + `e.currentTarget.getBoundingClientRect()`), `this.pinPlace(vx, vy)` (existing, unchanged).
- Produces: no new public interface — `pinDown`/`pinMove`/`pinUp`/`pinWheel` keep their existing names and signatures `(e) => void`, now driven by `PointerEvent` instead of `MouseEvent` for down/move/up (wheel is unchanged, still `WheelEvent`).

This is one cohesive, independently testable change — splitting the template edit from the handler edit would leave the app in a broken intermediate state (bound to Pointer events with no capture logic, or vice versa), so it's a single task.

- [ ] **Step 1: Edit the SVG element's event bindings**

In `index.html`, on line 320, replace:

```html
<svg viewBox="{{ pinVB }}" onWheel="{{ pinWheel }}" onMouseDown="{{ pinDown }}" onMouseMove="{{ pinMove }}" onMouseUp="{{ pinUp }}" onMouseLeave="{{ pinUp }}" style="width: 100%; display: block; background: #0C1B2E; border-radius: 14px; cursor: crosshair; touch-action: none;">
```

with:

```html
<svg viewBox="{{ pinVB }}" onWheel="{{ pinWheel }}" onPointerDown="{{ pinDown }}" onPointerMove="{{ pinMove }}" onPointerUp="{{ pinUp }}" onPointerCancel="{{ pinUp }}" style="width: 100%; display: block; background: #0C1B2E; border-radius: 14px; cursor: crosshair; touch-action: none;">
```

(`onMouseLeave` is dropped — pointer capture in Step 2 makes it unnecessary and, unlike mouse events, a touch pointer moving off the element mid-drag should keep dragging, not release early. `onPointerCancel` replaces it as the failure-path release, e.g. if the OS interrupts the gesture.)

- [ ] **Step 2: Add pointer capture to `pinDown`**

On line 1468, replace:

```js
pinDown(e) { const g = this.state.pinGame; if (!g) return; this._pdrag = { sx: e.clientX, sy: e.clientY, vb: g.vb.slice(), p: this._svgPt(e, g), moved: false }; }
```

with:

```js
pinDown(e) {
  const g = this.state.pinGame; if (!g) return;
  e.currentTarget.setPointerCapture(e.pointerId);
  this._pdrag = { sx: e.clientX, sy: e.clientY, vb: g.vb.slice(), p: this._svgPt(e, g), moved: false };
}
```

(Pointer capture ensures `pinMove`/`pinUp` keep receiving events targeted at this SVG even if the finger/cursor moves outside its bounds mid-drag — easy to happen on a small screen, doesn't happen with a mouse.)

- [ ] **Step 3: Release pointer capture in `pinUp`**

On line 1477 (now shifted by the Step 2 edit — locate by content, not line number), replace:

```js
pinUp(e) { const g = this.state.pinGame, d = this._pdrag; this._pdrag = null; if (!g || !d) return; if (!d.moved && !g.reveal) this.pinPlace(d.p[0], d.p[1]); }
```

with:

```js
pinUp(e) {
  const g = this.state.pinGame, d = this._pdrag; this._pdrag = null;
  if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  if (!g || !d) return;
  if (!d.moved && !g.reveal) this.pinPlace(d.p[0], d.p[1]);
}
```

(Runs on both `onPointerUp` and `onPointerCancel` per Step 1's binding, so the capture is always released, and — for cancel — no pin is placed since the gesture didn't end in a controlled way at a specific point; the existing `!d.moved && !g.reveal` guard means a cancelled drag simply does nothing, same as an aborted mouse drag would.)

- [ ] **Step 4: Verify `_svgPt` and `pinMove` need no changes**

Read `index.html` around the `_svgPt` (line ~1462) and `pinMove` (line ~1469) methods and confirm they reference only `e.clientX`, `e.clientY`, and `e.currentTarget` — all present and identical in shape on `PointerEvent` as on `MouseEvent`. No edit needed; this step is a confirmation, not a change.

- [ ] **Step 5: Manual desktop playtest**

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in a desktop browser. Navigate to the map-pin quiz mode (Setup → pick a country/region that offers "pin the city" — check the quiz mode list on the home screen for the pin-map entry). Verify:
- Click-drag pans the map.
- A click without dragging places a pin and reveals the result.
- Mouse wheel zooms in/out.
- The +/−/reset buttons still zoom/reset as before.
- No console errors.

- [ ] **Step 6: Manual mobile/touch playtest**

In the same running server, open Chrome DevTools → toggle device toolbar (touch emulation) or use a real touchscreen device on the same network. Repeat the map-pin mode:
- Single-finger drag pans the map.
- A tap (no movement) places a pin and reveals the result.
- Dragging a finger outside the SVG's edge mid-drag and releasing there still pans correctly (does not strand the pan or throw).
- The +/−/reset buttons work via tap.
- No console errors.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "fix(mobile): support touch input in map-pin quiz mode

Switch the map-pin mode's drag-to-pan / tap-to-place from Mouse Events
to Pointer Events, with pointer capture so a drag survives the
finger/cursor leaving the SVG mid-gesture. Wheel-to-zoom and the
existing +/-/reset buttons are unchanged; pinch-to-zoom stays
explicitly out of scope per the design doc.

Closes #13"
```

---

## Self-Review Notes

- **Spec coverage:** the spec's entire scope (SVG binding swap, `pinDown` capture, `pinUp` release, `_svgPt`/`pinMove` no-op confirmation, desktop + mobile manual test) is covered by Task 1 — the spec was intentionally scoped to a single cohesive change, so a single task is correct here, not a sign of missing decomposition.
- **Placeholder scan:** no TBD/TODO; every step has literal before/after code or a concrete manual-test checklist.
- **Type/name consistency:** `pinDown`, `pinMove`, `pinUp`, `pinWheel`, `_svgPt`, `pinPlace`, `_pinZoom`, `this.state.pinGame`, `this._pdrag` — all names match the existing code read directly from `index.html`, not invented.
