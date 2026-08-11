# Worldwide Currency-Country Quiz Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "Currency" quiz mode that quizzes country ↔ currency in both directions, spanning all continents, with full EN/DE localization.

**Architecture:** Single-file dc-tool app. Currency data lives in `geo-data.js` as two new exported lookups (`COUNTRY_CURRENCY`, `CURRENCIES`), kept separate from the existing `C()` country factory so no existing call site changes. The quiz logic itself is a new `mode === 'curr'` branch in `index.html`'s `makeQuestions()`, modeled directly on the existing `caps` branch, plus the same three-line hookup (`MODES`, `openMode`, random-quiz pool) every other simple MC mode already has. No build step (buildless repo, GitHub Pages serves `index.html`/`geo-data.js` as-is).

**Tech Stack:** Vanilla JS, ES modules (`geo-data.js` is `import()`ed by `index.html`), dc-tool runtime. No test runner — this stack's test gate is manual in-browser playtest (per `.ai/stacks/browser-game.md`).

## Global Constraints

- No framework, bundler, or `package.json` may be introduced (browser-game stack overlay).
- Multiple-choice only — no free-text answer input (decided in spec; matches every existing mode).
- Currency data does NOT go into the `C()` factory's positional params — it's a separate lookup so no existing `COUNTRIES` call site is touched.
- Data coverage is intentionally partial (147 of 197 countries) — see spec for the exact accuracy-risk rationale. Do not "fill in" additional countries beyond what's specified below.
- Reverse-direction questions ("which country uses currency X") only fire for countries whose currency is used by exactly one country in `COUNTRY_CURRENCY` — never for shared currencies (Euro, CFA francs, East Caribbean dollar, etc.).
- Manual playtest (EN + DE, multiple continent filters) is the verification gate — there is no automated test suite in this repo.

---

### Task 1: Add currency data to `geo-data.js`

**Files:**
- Modify: `geo-data.js` (append at end of file, after the `FLAG_SPECIAL` export closes)

**Interfaces:**
- Consumes: nothing (pure data, no dependency on existing exports).
- Produces: `export const COUNTRY_CURRENCY` — `{ [iso2: string]: string }` mapping a country's ISO2 code to an ISO 4217 currency code, for 147 of the 197 countries in `COUNTRIES`. `export const CURRENCIES` — `{ [isoCode: string]: { en: string, de: string } }` mapping each of the 107 currency codes used in `COUNTRY_CURRENCY` to its localized name. Both consumed by Task 2's `this.DATA.COUNTRY_CURRENCY` / `this.DATA.CURRENCIES` (the module is loaded wholesale via `import()` and assigned to `this.DATA`, so any export here is automatically available the same way `this.DATA.COUNTRIES` already is).

- [ ] **Step 1: Append the two exports to `geo-data.js`**

At the end of `geo-data.js` (after the `FLAG_SPECIAL` array's closing `];`), add:

```js

// iso2 -> ISO 4217 currency code. Partial coverage by design — countries
// with genuinely uncertain/volatile currencies (e.g. recently redenominated)
// are omitted rather than guessed. See docs/superpowers/specs/2026-08-11-currency-quiz-mode-design.md.
export const COUNTRY_CURRENCY = {
  // ---- Europe ----
  al: 'ALL', ad: 'EUR', at: 'EUR', by: 'BYN', be: 'EUR', ba: 'BAM', bg: 'BGN',
  hr: 'EUR', cz: 'CZK', dk: 'DKK', ee: 'EUR', fi: 'EUR', fr: 'EUR', de: 'EUR',
  gr: 'EUR', hu: 'HUF', is: 'ISK', ie: 'EUR', it: 'EUR', xk: 'EUR', lv: 'EUR',
  li: 'CHF', lt: 'EUR', lu: 'EUR', mt: 'EUR', md: 'MDL', mc: 'EUR', me: 'EUR',
  nl: 'EUR', mk: 'MKD', no: 'NOK', pl: 'PLN', pt: 'EUR', ro: 'RON', ru: 'RUB',
  sm: 'EUR', rs: 'RSD', sk: 'EUR', si: 'EUR', es: 'EUR', se: 'SEK', ch: 'CHF',
  ua: 'UAH', gb: 'GBP', va: 'EUR',
  // ---- Asia ----
  cn: 'CNY', cy: 'EUR', in: 'INR', id: 'IDR', ir: 'IRR', iq: 'IQD', il: 'ILS',
  jp: 'JPY', jo: 'JOD', kw: 'KWD', lb: 'LBP', my: 'MYR', mv: 'MVR', kp: 'KPW',
  om: 'OMR', pk: 'PKR', ph: 'PHP', qa: 'QAR', sa: 'SAR', sg: 'SGD', kr: 'KRW',
  lk: 'LKR', sy: 'SYP', tw: 'TWD', th: 'THB', tr: 'TRY', ae: 'AED', vn: 'VND',
  bd: 'BDT', np: 'NPR',
  // ---- Africa ----
  dz: 'DZD', ao: 'AOA', bj: 'XOF', bf: 'XOF', cm: 'XAF', cv: 'CVE', td: 'XAF',
  ci: 'XOF', eg: 'EGP', et: 'ETB', ga: 'XAF', gh: 'GHS', ke: 'KES', ly: 'LYD',
  mg: 'MGA', ma: 'MAD', mu: 'MUR', mz: 'MZN', na: 'NAD', ng: 'NGN', rw: 'RWF',
  sn: 'XOF', sc: 'SCR', za: 'ZAR', tz: 'TZS', tg: 'XOF', tn: 'TND', ug: 'UGX',
  zm: 'ZMW',
  // ---- North America ----
  ag: 'XCD', bs: 'BSD', bb: 'BBD', bz: 'BZD', ca: 'CAD', cr: 'CRC', cu: 'CUP',
  dm: 'XCD', do: 'DOP', sv: 'USD', gd: 'XCD', gt: 'GTQ', ht: 'HTG', hn: 'HNL',
  jm: 'JMD', mx: 'MXN', ni: 'NIO', pa: 'PAB', kn: 'XCD', lc: 'XCD', vc: 'XCD',
  tt: 'TTD', us: 'USD',
  // ---- South America ----
  ar: 'ARS', bo: 'BOB', br: 'BRL', cl: 'CLP', co: 'COP', ec: 'USD', gy: 'GYD',
  py: 'PYG', pe: 'PEN', sr: 'SRD', uy: 'UYU', ve: 'VES',
  // ---- Oceania ----
  au: 'AUD', fj: 'FJD', ki: 'AUD', nz: 'NZD', pg: 'PGK', ws: 'WST', to: 'TOP',
  vu: 'VUV'
};

// ISO 4217 code -> localized name
export const CURRENCIES = {
  ALL: { en: 'Albanian Lek', de: 'Albanischer Lek' },
  EUR: { en: 'Euro', de: 'Euro' },
  BYN: { en: 'Belarusian Ruble', de: 'Weißrussischer Rubel' },
  BAM: { en: 'Convertible Mark', de: 'Konvertible Mark' },
  BGN: { en: 'Bulgarian Lev', de: 'Bulgarischer Lew' },
  CZK: { en: 'Czech Koruna', de: 'Tschechische Krone' },
  DKK: { en: 'Danish Krone', de: 'Dänische Krone' },
  HUF: { en: 'Hungarian Forint', de: 'Ungarischer Forint' },
  ISK: { en: 'Icelandic Króna', de: 'Isländische Krone' },
  MDL: { en: 'Moldovan Leu', de: 'Moldauischer Leu' },
  MKD: { en: 'Macedonian Denar', de: 'Mazedonischer Denar' },
  NOK: { en: 'Norwegian Krone', de: 'Norwegische Krone' },
  PLN: { en: 'Polish Złoty', de: 'Polnischer Złoty' },
  RON: { en: 'Romanian Leu', de: 'Rumänischer Leu' },
  RUB: { en: 'Russian Ruble', de: 'Russischer Rubel' },
  RSD: { en: 'Serbian Dinar', de: 'Serbischer Dinar' },
  SEK: { en: 'Swedish Krona', de: 'Schwedische Krone' },
  CHF: { en: 'Swiss Franc', de: 'Schweizer Franken' },
  UAH: { en: 'Ukrainian Hryvnia', de: 'Ukrainische Hrywnja' },
  GBP: { en: 'British Pound', de: 'Britisches Pfund' },
  CNY: { en: 'Chinese Yuan', de: 'Chinesischer Yuan' },
  INR: { en: 'Indian Rupee', de: 'Indische Rupie' },
  IDR: { en: 'Indonesian Rupiah', de: 'Indonesische Rupiah' },
  IRR: { en: 'Iranian Rial', de: 'Iranischer Rial' },
  IQD: { en: 'Iraqi Dinar', de: 'Irakischer Dinar' },
  ILS: { en: 'Israeli Shekel', de: 'Israelischer Schekel' },
  JPY: { en: 'Japanese Yen', de: 'Japanischer Yen' },
  JOD: { en: 'Jordanian Dinar', de: 'Jordanischer Dinar' },
  KWD: { en: 'Kuwaiti Dinar', de: 'Kuwait-Dinar' },
  LBP: { en: 'Lebanese Pound', de: 'Libanesisches Pfund' },
  MYR: { en: 'Malaysian Ringgit', de: 'Malaysischer Ringgit' },
  MVR: { en: 'Maldivian Rufiyaa', de: 'Malediven-Rufiyaa' },
  KPW: { en: 'North Korean Won', de: 'Nordkoreanischer Won' },
  OMR: { en: 'Omani Rial', de: 'Omanischer Rial' },
  PKR: { en: 'Pakistani Rupee', de: 'Pakistanische Rupie' },
  PHP: { en: 'Philippine Peso', de: 'Philippinischer Peso' },
  QAR: { en: 'Qatari Riyal', de: 'Katar-Riyal' },
  SAR: { en: 'Saudi Riyal', de: 'Saudi-Riyal' },
  SGD: { en: 'Singapore Dollar', de: 'Singapur-Dollar' },
  KRW: { en: 'South Korean Won', de: 'Südkoreanischer Won' },
  LKR: { en: 'Sri Lankan Rupee', de: 'Sri-Lanka-Rupie' },
  SYP: { en: 'Syrian Pound', de: 'Syrisches Pfund' },
  TWD: { en: 'Taiwan Dollar', de: 'Taiwan-Dollar' },
  THB: { en: 'Thai Baht', de: 'Thailändischer Baht' },
  TRY: { en: 'Turkish Lira', de: 'Türkische Lira' },
  AED: { en: 'UAE Dirham', de: 'VAE-Dirham' },
  VND: { en: 'Vietnamese Đồng', de: 'Vietnamesischer Dong' },
  BDT: { en: 'Bangladeshi Taka', de: 'Bangladesch-Taka' },
  NPR: { en: 'Nepalese Rupee', de: 'Nepalesische Rupie' },
  DZD: { en: 'Algerian Dinar', de: 'Algerischer Dinar' },
  AOA: { en: 'Angolan Kwanza', de: 'Angolanischer Kwanza' },
  XOF: { en: 'West African CFA Franc', de: 'CFA-Franc BCEAO' },
  XAF: { en: 'Central African CFA Franc', de: 'CFA-Franc BEAC' },
  CVE: { en: 'Cape Verdean Escudo', de: 'Kap-Verde-Escudo' },
  EGP: { en: 'Egyptian Pound', de: 'Ägyptisches Pfund' },
  ETB: { en: 'Ethiopian Birr', de: 'Äthiopischer Birr' },
  GHS: { en: 'Ghanaian Cedi', de: 'Ghanaischer Cedi' },
  KES: { en: 'Kenyan Shilling', de: 'Kenia-Schilling' },
  LYD: { en: 'Libyan Dinar', de: 'Libyscher Dinar' },
  MGA: { en: 'Malagasy Ariary', de: 'Madagassischer Ariary' },
  MAD: { en: 'Moroccan Dirham', de: 'Marokkanischer Dirham' },
  MUR: { en: 'Mauritian Rupee', de: 'Mauritius-Rupie' },
  MZN: { en: 'Mozambican Metical', de: 'Mosambikanischer Metical' },
  NAD: { en: 'Namibian Dollar', de: 'Namibia-Dollar' },
  NGN: { en: 'Nigerian Naira', de: 'Nigerianische Naira' },
  RWF: { en: 'Rwandan Franc', de: 'Ruanda-Franc' },
  SCR: { en: 'Seychellois Rupee', de: 'Seychellen-Rupie' },
  ZAR: { en: 'South African Rand', de: 'Südafrikanischer Rand' },
  TZS: { en: 'Tanzanian Shilling', de: 'Tansania-Schilling' },
  TND: { en: 'Tunisian Dinar', de: 'Tunesischer Dinar' },
  UGX: { en: 'Ugandan Shilling', de: 'Uganda-Schilling' },
  ZMW: { en: 'Zambian Kwacha', de: 'Sambischer Kwacha' },
  XCD: { en: 'East Caribbean Dollar', de: 'Ostkaribischer Dollar' },
  BSD: { en: 'Bahamian Dollar', de: 'Bahama-Dollar' },
  BBD: { en: 'Barbadian Dollar', de: 'Barbados-Dollar' },
  BZD: { en: 'Belize Dollar', de: 'Belize-Dollar' },
  CAD: { en: 'Canadian Dollar', de: 'Kanadischer Dollar' },
  CRC: { en: 'Costa Rican Colón', de: 'Costa-Rica-Colón' },
  CUP: { en: 'Cuban Peso', de: 'Kubanischer Peso' },
  DOP: { en: 'Dominican Peso', de: 'Dominikanischer Peso' },
  USD: { en: 'US Dollar', de: 'US-Dollar' },
  GTQ: { en: 'Guatemalan Quetzal', de: 'Guatemaltekischer Quetzal' },
  HTG: { en: 'Haitian Gourde', de: 'Haitianische Gourde' },
  HNL: { en: 'Honduran Lempira', de: 'Honduranischer Lempira' },
  JMD: { en: 'Jamaican Dollar', de: 'Jamaika-Dollar' },
  MXN: { en: 'Mexican Peso', de: 'Mexikanischer Peso' },
  NIO: { en: 'Nicaraguan Córdoba', de: 'Nicaraguanischer Córdoba' },
  PAB: { en: 'Panamanian Balboa', de: 'Panamaischer Balboa' },
  TTD: { en: 'Trinidad and Tobago Dollar', de: 'Trinidad-und-Tobago-Dollar' },
  ARS: { en: 'Argentine Peso', de: 'Argentinischer Peso' },
  BOB: { en: 'Bolivian Boliviano', de: 'Bolivianischer Boliviano' },
  BRL: { en: 'Brazilian Real', de: 'Brasilianischer Real' },
  CLP: { en: 'Chilean Peso', de: 'Chilenischer Peso' },
  COP: { en: 'Colombian Peso', de: 'Kolumbianischer Peso' },
  GYD: { en: 'Guyanese Dollar', de: 'Guyana-Dollar' },
  PYG: { en: 'Paraguayan Guaraní', de: 'Paraguayischer Guaraní' },
  PEN: { en: 'Peruvian Sol', de: 'Peruanischer Sol' },
  SRD: { en: 'Surinamese Dollar', de: 'Suriname-Dollar' },
  UYU: { en: 'Uruguayan Peso', de: 'Uruguayischer Peso' },
  VES: { en: 'Venezuelan Bolívar', de: 'Venezolanischer Bolívar' },
  AUD: { en: 'Australian Dollar', de: 'Australischer Dollar' },
  FJD: { en: 'Fijian Dollar', de: 'Fidschi-Dollar' },
  NZD: { en: 'New Zealand Dollar', de: 'Neuseeland-Dollar' },
  PGK: { en: 'Papua New Guinean Kina', de: 'Papua-Neuguinea-Kina' },
  WST: { en: 'Samoan Tala', de: 'Samoanischer Tala' },
  TOP: { en: 'Tongan Paʻanga', de: 'Tongaischer Paʻanga' },
  VUV: { en: 'Vanuatu Vatu', de: 'Vanuatu-Vatu' }
};
```

(Note: this repo's existing string literals use `\uXXXX` escapes for
non-ASCII characters — e.g. `'Österreich'` for `Österreich` — so the
block above follows that convention. If you're pasting via an editor that
already writes the literal UTF-8 characters, that's equally correct and
consistent with a few other lines in the file, e.g. `São Tomé`; either form
is acceptable, just don't mix mojibake.)

- [ ] **Step 2: Verify the file still parses and the data loads correctly**

```bash
node --check geo-data.js
node -e "
import('./geo-data.js').then(m => {
  const countryCount = Object.keys(m.COUNTRY_CURRENCY).length;
  const currencyCount = Object.keys(m.CURRENCIES).length;
  console.log('countries:', countryCount, 'currencies:', currencyCount);
  if (countryCount !== 147) throw new Error('expected 147 countries, got ' + countryCount);
  if (currencyCount !== 107) throw new Error('expected 107 currencies, got ' + currencyCount);
  // every code used in COUNTRY_CURRENCY must exist in CURRENCIES
  const missing = Object.values(m.COUNTRY_CURRENCY).filter(code => !m.CURRENCIES[code]);
  if (missing.length) throw new Error('currency codes missing from CURRENCIES: ' + missing.join(','));
  // every iso2 key must exist in COUNTRIES
  const isoSet = new Set(m.COUNTRIES.map(c => c.iso));
  const badIso = Object.keys(m.COUNTRY_CURRENCY).filter(iso => !isoSet.has(iso));
  if (badIso.length) throw new Error('iso2 codes not found in COUNTRIES: ' + badIso.join(','));
  console.log('OK');
}).catch(e => { console.error(e); process.exit(1); });
"
```

Expected output: `countries: 147 currencies: 107` then `OK`. If the counts
don't match, you introduced a duplicate key or miscounted while pasting —
diff against Step 1's literal block rather than manually re-deriving numbers.

- [ ] **Step 3: Commit**

```bash
git add geo-data.js
git commit -m "feat(currency): add currency data for 147 countries

Adds COUNTRY_CURRENCY (iso2 -> ISO 4217 code) and CURRENCIES (code ->
localized name) as new exports, kept separate from the C() country
factory so no existing call site changes. Coverage is intentionally
partial — see docs/superpowers/specs/2026-08-11-currency-quiz-mode-design.md
for which countries are included and why."
```

---

### Task 2: Add the Currency quiz mode to `index.html`

**Files:**
- Modify: `index.html:451-463` (`MODES` array — add the `curr` entry)
- Modify: `index.html:474` (`I18N.en` — add `m_curr`/`d_curr` near `m_caps`/`d_caps`)
- Modify: `index.html:508-509` (`I18N.en` — add `currWhichP`/`currCountryP` near `capOfP`/`capWhichP`)
- Modify: `index.html:547` (`I18N.de` — add `m_curr`/`d_curr`)
- Modify: `index.html:581-582` (`I18N.de` — add `currWhichP`/`currCountryP`)
- Modify: `index.html:709-710` (component helpers — add `curCode`/`curName`/`curUnique`)
- Modify: `index.html:917-927` (`makeQuestions()` — add the `mode === 'curr'` branch, right before the existing `if (mode === 'caps')` block or right after it — placed after per Step 4 below)
- Modify: `index.html:1095` (`openMode` dispatch — add `curr` to the id list)
- Modify: `index.html:1253` (random-quiz `opts` array — add `'curr'`)

**Interfaces:**
- Consumes: `this.DATA.COUNTRY_CURRENCY`, `this.DATA.CURRENCIES` (from Task 1), `this.pool()`, `this._cycle()`, `this._distract()`, `this._mcq()`, `this.cname()`, `this.fmt()` (all pre-existing).
- Produces: `this.curCode(c) -> string|null`, `this.curName(c) -> string`, `this.curUnique(c) -> boolean` — new helper methods, used only within this task's own `mode === 'curr'` branch (no other task depends on them).

- [ ] **Step 1: Add the `curr` entry to `MODES`**

In `index.html`, change (lines 451-463):

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
    { id: 'curr', sec: 0, icon: 'M12 3a9 9 0 100 18 9 9 0 000-18zM8 12h8M12 8v8' },
    { id: 'cont', sec: 0, icon: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c-3.2 3.5-3.2 14.5 0 18M12 3c3.2 3.5 3.2 14.5 0 18' },
```

(Only the two lines around the new `curr` entry are shown for context; the
rest of the `MODES` array below `cont` is unchanged.)

- [ ] **Step 2: Add the EN strings**

In `index.html:474`, change:

```js
      m_caps: 'Capitals', d_caps: 'Do you know every capital?',
```

to:

```js
      m_caps: 'Capitals', d_caps: 'Do you know every capital?',
      m_curr: 'Currencies', d_curr: 'Match every country to its currency.',
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
      currWhichP: 'What currency does {x} use?',
      currCountryP: 'Which country uses the {x}?',
```

- [ ] **Step 3: Add the DE strings**

In `index.html:547`, change:

```js
      m_caps: 'Hauptstädte', d_caps: 'Kennst du alle Hauptstädte?',
```

to:

```js
      m_caps: 'Hauptstädte', d_caps: 'Kennst du alle Hauptstädte?',
      m_curr: 'Währungen', d_curr: 'Ordne jedem Land seine Währung zu.',
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
      currWhichP: 'Welche Währung verwendet {x}?',
      currCountryP: 'Welches Land verwendet den/die {x}?',
```

- [ ] **Step 4: Add the currency helper methods**

In `index.html:709-710`, change:

```js
  cname(c) { return this.state.lang === 'de' ? c.de : c.en; }
  ccap(c) { return this.state.lang === 'de' ? c.capDe : c.cap; }
```

to:

```js
  cname(c) { return this.state.lang === 'de' ? c.de : c.en; }
  ccap(c) { return this.state.lang === 'de' ? c.capDe : c.cap; }
  curCode(c) { return this.DATA.COUNTRY_CURRENCY[c.iso] || null; }
  curName(c) { const code = this.curCode(c); const cur = code && this.DATA.CURRENCIES[code]; return cur ? (cur[this.state.lang] || cur.en) : ''; }
  curUnique(c) {
    const code = this.curCode(c); if (!code) return false;
    return Object.values(this.DATA.COUNTRY_CURRENCY).filter(x => x === code).length === 1;
  }
```

- [ ] **Step 5: Add the `mode === 'curr'` branch to `makeQuestions()`**

In `index.html`, immediately before the existing `if (mode === 'caps') {` line (line 917), insert:

```js
    if (mode === 'curr') {
      const p = this.pool().filter(c => this.curCode(c));
      const curKey = c => this.curName(c);
      const uniqueP = p.filter(c => this.curUnique(c));
      return this._cycle(p, len).map((c, qi) => {
        if (qi % 2 === 1 && uniqueP.includes(c)) {
          const wrong = this._distract(c, [uniqueP, D.COUNTRIES], 3, nameKey);
          return { prompt: this.fmt(T.currCountryP, curKey(c)), kind: 'text', main: curKey(c), opts: this._mcq(c, wrong, nameKey) };
        }
        const wrong = this._distract(c, [p, D.COUNTRIES.filter(x => x.cont === c.cont), D.COUNTRIES], 3, curKey);
        return { prompt: T.currWhichP, kind: 'text', main: this.cname(c), ctxImg: this.flag(c.iso, 80), opts: this._mcq(c, wrong, curKey) };
      });
    }
```

(This goes before `caps` rather than after purely by convention — `MODES`
already lists `curr` right after `caps`, so keeping the branches in the same
order makes the file easier to scan. `nameKey` is already defined earlier in
`makeQuestions()`, at the top of the function — see `index.html:904` — so it's
already in scope here, same as it is for the `caps`/`flags`/`shape` branches.)

- [ ] **Step 6: Hook `curr` into `openMode`**

In `index.html:1095`, change:

```js
    if (id === 'caps' || id === 'shape' || id === 'us' || id === 'chq' || id === 'cont') { this.setState({ view: 'setup', mode: id, variant: 'mc' }); return; }
```

to:

```js
    if (id === 'caps' || id === 'shape' || id === 'us' || id === 'chq' || id === 'cont' || id === 'curr') { this.setState({ view: 'setup', mode: id, variant: 'mc' }); return; }
```

- [ ] **Step 7: Add `curr` to the random-quiz pool**

In `index.html:1253`, change:

```js
    const opts = ['flags', 'flagsim', 'flagspec', 'flagzoom', 'flagblur', 'flagcap', 'flagcont', 'flagspeed', 'caps', 'cont', 'seas', 'shape', 'us', 'chq', 'nb', 'pin', 'find'];
```

to:

```js
    const opts = ['flags', 'flagsim', 'flagspec', 'flagzoom', 'flagblur', 'flagcap', 'flagcont', 'flagspeed', 'caps', 'curr', 'cont', 'seas', 'shape', 'us', 'chq', 'nb', 'pin', 'find'];
```

- [ ] **Step 8: Manual playtest — English, default continent/difficulty**

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in English. From the home screen, open the new
"Currencies" card (in the same section as Capitals/Continents/Shapes).
Verify:
- The setup screen shows normally (continent/difficulty pickers, start button).
- Starting a round shows valid questions in both directions: some ask "What
  currency does `<country>` use?" with currency-name options; others ask
  "Which country uses the `<currency>`?" with country-name options.
- Play through a full round; scoring and the result screen work as with any
  other mode.
- No console errors.

- [ ] **Step 9: Manual playtest — shared-currency check**

Start a new Currency round filtered to Europe, difficulty "all" (so
Eurozone countries are in the pool). Play multiple rounds if needed until
you've seen several questions. Verify:
- No question ever asks "Which country uses the Euro?" (or any other shared
  currency in the dataset — CFA franc, East Caribbean dollar). Those
  countries should only ever appear in the "what currency does `<country>`
  use?" direction.
- A non-shared-currency European country (e.g. Switzerland/CHF, Poland/PLN)
  can appear in either direction.

- [ ] **Step 10: Manual playtest — German + narrow continent pool**

Switch to German and start a Currency round filtered to Oceania (the
smallest currency-covered pool — 8 countries). Verify:
- Prompts and currency names are in German ("Welche Währung verwendet
  ...?" / "Welches Land verwendet den/die ...?").
- The round completes without errors or repeated/invalid multiple-choice
  options, despite the small pool.
- No console errors.

- [ ] **Step 11: Commit**

```bash
git add index.html
git commit -m "feat(currency): add worldwide currency-country quiz mode

Adds a bidirectional Currency quiz mode (country -> currency and
currency -> country), following the existing caps-mode pattern.
Reverse-direction questions are restricted to countries with a unique
currency, since the quiz engine marks exactly one MC option correct;
shared currencies (Euro, CFA francs, East Caribbean dollar, etc.) are
naturally deduplicated in the forward direction by the existing
_distract() label-based dedup, so no special handling is needed there.

Closes #2"
```

---

## Self-Review Notes

- **Spec coverage:** data storage as separate lookups (Task 1), MC-only bidirectional quiz logic with shared-currency handling (Task 2 Step 5), full hookup — MODES/openMode/random-quiz/i18n (Task 2 Steps 1-3, 6-7), manual EN/DE/shared-currency/narrow-pool testing (Task 2 Steps 8-10) — every spec decision has a corresponding step.
- **Placeholder scan:** no TBD/TODO; every step has literal before/after code, the full literal dataset, or a concrete manual-test checklist.
- **Type/name consistency:** `COUNTRY_CURRENCY`, `CURRENCIES`, `curCode`, `curName`, `curUnique`, `m_curr`/`d_curr`, `currWhichP`/`currCountryP` are used identically across Task 1's data, Task 2's helpers, Task 2's quiz branch, and Task 2's i18n strings — no naming drift. `nameKey` and `D` referenced in Task 2 Step 5 are confirmed pre-existing in scope (`index.html:904` and the top of `makeQuestions()` respectively), not invented.
