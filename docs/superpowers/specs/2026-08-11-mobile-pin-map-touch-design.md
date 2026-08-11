# Mobile touch support for the map-pin quiz mode

**Issue:** [#13](https://github.com/freaxnx01/game-geography-quiz/issues/13) — fix(mobile): make all quiz modes playable on mobile

## Context

Investigation across all quiz modes found only one that is actually broken on
mobile: the **map-pin mode** (`index.html:320`, drag-to-pan / wheel-to-zoom /
tap-to-place-pin on an SVG map). It wires only `onMouseDown` / `onMouseMove` /
`onMouseUp` / `onWheel`, and sets `touch-action: none` on the SVG — which
suppresses the browser's native touch panning/pinch-zoom without providing any
touch-driven replacement. Result: on a touchscreen there is no reliable way to
pan the map or place a pin.

Every other quiz mode (continents/seas/neighbours/find-on-map, flags,
capitals, shapes, cantons, US states, etc.) uses plain `onClick` on SVG paths
or buttons, which already works with a tap. They are out of scope for this
fix.

The dc-tool runtime (`support.js:336-341`) already recognizes Pointer Event
props (`onPointerDown`, `onPointerMove`, `onPointerUp`, `onPointerCancel`,
etc.) alongside Mouse and Touch Event props — this mode simply never adopted
them.

## Scope

Fix map-pin mode's drag/zoom/place interaction so it works on touchscreens.

Explicitly out of scope (decided during brainstorming):

- Pinch-to-zoom (two-finger gesture). The mode already has on-screen +/−/reset
  zoom buttons; those are sufficient on mobile. Single-finger drag pans, tap
  places the pin.
- General mobile tap-target sizing polish (e.g. the 34–36px zoom/close
  buttons). Not part of this issue.

## Design

**`index.html`, SVG element (~line 320):**

Replace:

```html
onMouseDown="{{ pinDown }}" onMouseMove="{{ pinMove }}" onMouseUp="{{ pinUp }}" onMouseLeave="{{ pinUp }}"
```

with:

```html
onPointerDown="{{ pinDown }}" onPointerMove="{{ pinMove }}" onPointerUp="{{ pinUp }}" onPointerCancel="{{ pinUp }}"
```

`onWheel="{{ pinWheel }}"` is untouched — desktop-only, a harmless no-op on
touch devices. `touch-action: none` is untouched — it's what allows the
pointer stream to drive panning instead of the browser fighting it with
native scroll/zoom gestures.

**`pinDown` (~`index.html:1468`):**

Add pointer capture so drag tracking survives the finger/cursor moving
outside the SVG's bounds mid-drag (easy to happen on a small screen, doesn't
happen with a mouse):

```js
pinDown(e) {
  const g = this.state.pinGame; if (!g) return;
  e.currentTarget.setPointerCapture(e.pointerId);
  this._pdrag = { sx: e.clientX, sy: e.clientY, vb: g.vb.slice(), p: this._svgPt(e, g), moved: false };
}
```

**`_svgPt`, `pinMove`:** no logic change. `PointerEvent.clientX`/`clientY` and
`e.currentTarget` behave identically to `MouseEvent`, so the existing
pan-vs-tap threshold (`>4px` movement = drag, else = tap-to-place) and viewBox
math are reused as-is.

**`pinUp`:** release the pointer capture alongside the existing
place-pin-if-not-dragged logic:

```js
pinUp(e) {
  const g = this.state.pinGame, d = this._pdrag; this._pdrag = null;
  if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  if (!g || !d) return;
  if (!d.moved && !g.reveal) this.pinPlace(d.p[0], d.p[1]);
}
```

**Data flow / error handling:** unchanged. This is purely an input-event-source
swap — `pinPlace`, `_pinZoom`, `pinReset`, `pinNext`, scoring, and the
+/−/reset buttons are untouched.

## Testing

This repo is buildless — manual in-browser playtest is the test gate (per
`.ai/stacks/browser-game.md`). No automated test runner exists here.

- **Desktop:** pin-map drag-to-pan, click-to-place, wheel-to-zoom, and the
  +/−/reset buttons still work exactly as before.
- **Mobile** (real device or Chrome DevTools touch emulation): single-finger
  drag pans the map; a tap (no movement) places the pin; the +/−/reset
  buttons zoom; dropping the finger off the SVG mid-drag doesn't strand the
  pan.
- Confirm no console errors on load in both cases.
