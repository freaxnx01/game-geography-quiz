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

- Europe/Asia split on the continents map no longer follows country borders
  for transcontinental countries: Russia's landmass is now split along an
  approximate Ural Mountains / Ural River line (European Russia vs.
  Siberia + the Far East), and Turkey's along the Bosphorus/Dardanelles
  (East Thrace vs. Anatolia) — previously the whole country was one color,
  so Siberia counted as Europe. Both countries are also excluded from the
  single-answer "which continent is this on?" quiz questions (Continents,
  Flag → Continent, continents-map click-quiz), since a transcontinental
  country has no single correct answer there. The "Find the Country" mode
  and each country's `cont` grouping field are unaffected — Russia and
  Turkey still render as one clickable shape there.
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
