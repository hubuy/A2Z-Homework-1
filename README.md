# Tixly — A2Z Homework 1

A ticketing storefront in the style of a large event-ticketing site: browse
concerts, sports, theater and comedy, pick a seating tier, and run through a
simulated checkout.

> **This is a demo.** Tixly is not affiliated with any real ticketing company.
> Every artist, team, venue, production and price in the catalog is invented,
> no payment is processed, and no tickets are issued.

## Features

- **Home** — hero search, category shortcuts, featured / just-announced / upcoming rails
- **Browse** — text search across event, venue and city, plus category, city, max-price filters and date/price/name sorting; all filter state lives in the URL, so results are shareable
- **Event detail** — hero, ticket tiers with per-tier availability, quantity steppers, simplified seat map, live order summary with fees
- **Cart** — persisted to `localStorage`, quantity editing, per-line removal, fee breakdown
- **Checkout → confirmation** — contact/payment/delivery form and an order reference
- Responsive down to phone width; artwork is generated SVG, so there are no binary image assets

**Live:** <https://hubuy.github.io/A2Z-Homework-1/>

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |

## Deployment

GitHub Pages serves this repository from the `gh-pages` branch, which holds the
built site rather than source. To publish the current `HEAD`:

```bash
scripts/deploy-gh-pages.sh
```

It builds, replaces the files on `gh-pages` with `dist/`, and pushes. The
branch's history is kept — no force push.

`.github/workflows/pages.yml` deploys the same build through GitHub Actions
instead, but it only works once **Settings → Pages → Source** is switched to
**GitHub Actions**. While Pages serves from a branch, the deployment API
rejects it (`Deployments are only allowed from gh-pages`), so that workflow is
manual-dispatch only. After switching the source, set it to run on pushes to
`master` and drop the script.

The build uses relative asset URLs (`base: './'`) and hash routing, so it runs
unchanged from the `/A2Z-Homework-1/` project path.

## Project layout

```
src/
  components/   Header, Footer, EventCard, SearchBar, generated Artwork, icons
  context/      CartContext — cart state, persistence, derived totals
  data/         events.ts — the fictional event catalog
  lib/          types, event search/sort/formatting, cart & pricing math
  pages/        Home, Browse, EventDetail, Cart, Checkout, Confirmation, NotFound
```

Business logic is kept in `src/lib` as pure functions so it can be tested
without rendering: `npm test` covers search, filtering, sorting, price
formatting, cart merging and clamping, and fee/total calculation (32 tests).

## Stack

React 18 · TypeScript (strict) · Vite 6 · React Router (hash routing, so the
build runs from any static host) · Vitest.
