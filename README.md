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
