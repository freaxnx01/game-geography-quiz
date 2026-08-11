# Worldwide currency-country quiz mode

**Issue:** [#2](https://github.com/freaxnx01/game-geography-quiz/issues/2) — feat(currency): add worldwide currency-country quiz mode

## Context

No currency data exists anywhere in this repo today (`geo-data.js` has no
`currency`/`curr` field or lookup). The app's quiz engine is entirely
multiple-choice — there is no free-text answer input anywhere (the two
`<input>` elements in `index.html` are country-search boxes for the
Neighbours/Pin-city picker screens and the Compare screen, not quiz answers).

Every quiz mode follows the same shape: a `mode === '<id>'` branch in
`makeQuestions()` (`index.html:~901`) builds a list of `{ prompt, kind, main,
opts }` question objects via `this._cycle(pool, len)`, `this._distract(...)`,
and `this._mcq(...)`. The closest structural analog is `caps`
(`index.html:920-927`): it alternates direction every other question
(`qi % 2`) between "country → capital" and "capital → country", both driven
by the same underlying pool.

## Decisions (from brainstorming)

- **Multiple-choice only** — matches every existing mode; no free-text input
  is introduced.
- **Shared currencies** (Euro, CFA francs, East Caribbean dollar, etc.) are
  handled by *not* asking "which country uses currency X" when X is shared —
  that direction is restricted to countries whose currency is used by exactly
  one country in the dataset. The forward direction ("what currency does
  country X use") needs no special handling: `_distract`'s existing
  label-based dedup already prevents two options ever showing the same
  currency name, so shared currencies are automatically safe there.
- **Data coverage:** a curated subset, not all 197 countries — full ISO-4217
  coverage for every micro-state/edge case (multi-currency states, disputed
  territories, recent redenominations) would be hand-authored from training
  knowledge with no live verification, which is a real accuracy risk. Instead:
  complete coverage of Europe (well-known, low risk) plus a solid
  representative set across every other continent, deliberately including
  shared-currency examples (Eurozone, West/Central African CFA franc, East
  Caribbean dollar) so that code path is actually exercised. Genuinely
  uncertain cases (e.g. Zimbabwe's repeatedly-redenominated currency) are
  simply omitted — the same "partial coverage is fine" pattern the existing
  `shape` quiz mode already uses (`pool().filter(c => this.shapeD(c))`).

## Design

### Data storage (`geo-data.js`)

Two new exported module-level lookups, kept separate from the `C()` country
factory — adding a new positional field to `C()` would force touching all
197 existing call sites for an unrelated, surgical change:

```js
// iso2 -> ISO 4217 currency code. Partial coverage by design — see design doc.
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

147 countries, 107 unique currency codes, spanning all six continent tags
used by `COUNTRIES` (`EU`, `AS`, `AF`, `NA`, `SA`, `OC`).

### Quiz logic (`index.html`)

New helper methods (alongside the other small helpers like `cname`/`ccap`,
`index.html:~700-724`):

```js
curCode(c) { return this.DATA.COUNTRY_CURRENCY[c.iso] || null; }
curName(c) { const code = this.curCode(c); const cur = code && this.DATA.CURRENCIES[code]; return cur ? cur[this.state.lang] || cur.en : ''; }
curUnique(c) {
  const code = this.curCode(c); if (!code) return false;
  return Object.values(this.DATA.COUNTRY_CURRENCY).filter(x => x === code).length === 1;
}
```

New `mode === 'curr'` branch in `makeQuestions()`, modeled on `caps`:

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

- Forward direction (`qi % 2 === 0`, or a shared-currency country on an odd
  index) asks "What currency does `{country}` use?" with currency-name
  options — safe for shared currencies because `_distract`'s existing
  label-dedup (`if (!k || seen.has(k)) continue`) never produces two options
  with the same currency name.
- Reverse direction (`qi % 2 === 1` **and** the country's currency is unique)
  asks "Which country uses the `{currency}`?" with country-name options,
  drawn only from `uniqueP` plus the general `D.COUNTRIES` fallback pool (for
  wrong-answer distractors — a distractor with no currency data is
  automatically skipped by `_distract`'s `if (!k ...)` guard, so it's safe to
  pass the unfiltered `D.COUNTRIES` here exactly as `caps`/`shape`/etc.
  already do).

### Hookup

- `MODES` (`index.html:~451`): add `{ id: 'curr', sec: 0, icon: 'M12 3a9 9 0 100 18 9 9 0 000-18zM8 12h8M12 8v8' }` — a simple coin glyph (circle + cross), alongside `caps`/`cont`/`find`/`seas`/`shape` in section 0.
- `openMode` dispatch (`index.html:1095`): add `'curr'` to the id list that routes straight to the standard MC setup screen — `if (id === 'caps' || id === 'shape' || id === 'us' || id === 'chq' || id === 'cont' || id === 'curr') { ... }`.
- Random-quiz pool (`index.html:1253`): add `'curr'` to the `opts` array so the "Random Quiz" button can pick it.
- `I18N.en`/`I18N.de`: `m_curr`/`d_curr` (mode card title/description, matching `m_caps`/`d_caps`'s style), `currWhichP` ("Which currency does {x} use?" / "Welche Währung verwendet {x}?"), `currCountryP` ("Which country uses the {x}?" / "Welches Land verwendet den/die {x}?").

## Testing

This repo is buildless — manual in-browser playtest is the test gate (per
`.ai/stacks/browser-game.md`). No automated test runner exists here.

- Open the Currency mode from the home screen; play a full round in English.
- Confirm both directions appear (country → currency and currency → country).
- Confirm a shared-currency country (e.g. France or Germany, both EUR) never
  appears as the subject of a "which country uses X" question.
- Switch to German mid-round and confirm currency names and prompts update.
- Try different continent filters (including one with a smaller
  currency-covered pool, e.g. Oceania) and confirm the round still completes
  with valid, non-repeating multiple-choice options.
- Confirm no console errors.
