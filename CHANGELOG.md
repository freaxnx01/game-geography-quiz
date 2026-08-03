# Changelog

All notable changes to this project are documented here, following
[Keep a Changelog](https://keepachangelog.com) and
[Semantic Versioning](https://semver.org).

## [Unreleased]

### Added

- Antarctica to the continent list (`CONTINENTS`), so it now appears as an
  answer option in the Continents and Flag → Continent quizzes and as a
  "click this continent" target in Continents · Kids / Map. The Antarctica
  landmass is wired into the continent map via the `EXTRA` feature map.

### Fixed

- Europe/Asia split no longer follows country borders for Russia: Russia is
  now classified as Asia (geographic majority — Siberia), consistent with the
  existing Kazakhstan/Turkey/Georgia/Azerbaijan entries. Previously Russia was
  counted as Europe (by capital), which miscategorised Siberia.
- Eliminated ~39 SVG "Expected number" console errors and 8 image 404s that
  fired at page load before the app hydrated. The dc template is now held in an
  inert `<template data-dc-tpl>` instead of a live `<x-dc>` element, so the
  browser no longer parses its `{{ }}` placeholders in SVG attributes
  (`d`/`cx`/`cy`) and `<img src>` as real DOM. `support.js` reads the template
  from the `<template>` as well as `<x-dc>`.

## [0.1.0] - 2026-07-18

### Added

- Initial versioned release of game-geography-quiz.
- In-game version badge sourced from `version.js`.
