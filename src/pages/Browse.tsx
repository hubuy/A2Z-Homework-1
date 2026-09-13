import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EventCard } from '../components/EventCard'
import { EVENTS } from '../data/events'
import {
  CATEGORY_LABELS,
  formatPrice,
  searchEvents,
  sortEvents,
  uniqueCities,
  type SortKey,
} from '../lib/events'
import type { Category } from '../lib/types'

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]
const PRICE_CEILING = 500
const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: 'date', label: 'Date — soonest first' },
  { value: 'price', label: 'Price — lowest first' },
  { value: 'name', label: 'Name — A to Z' },
]

export function Browse() {
  const [params, setParams] = useSearchParams()

  const search = params.get('q') ?? ''
  const category = (params.get('category') as Category | null) ?? 'all'
  const city = params.get('city') ?? 'all'
  const maxPrice = Number(params.get('maxPrice') ?? PRICE_CEILING)
  const sort = (params.get('sort') as SortKey | null) ?? 'date'

  const cities = useMemo(() => uniqueCities(EVENTS), [])

  const results = useMemo(() => {
    const matched = searchEvents(EVENTS, {
      search,
      category,
      city,
      maxPrice: maxPrice < PRICE_CEILING ? maxPrice : undefined,
    })
    return sortEvents(matched, sort)
  }, [search, category, city, maxPrice, sort])

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const heading =
    category !== 'all' ? CATEGORY_LABELS[category] : search ? `Results for “${search}”` : 'All events'
  const hasFilters = Boolean(search) || category !== 'all' || city !== 'all' || maxPrice < PRICE_CEILING

  return (
    <div className="wrap browse">
      <aside className="filters" aria-label="Filter events">
        <h3>Filters</h3>

        <div className="filters__group">
          <label htmlFor="filter-city">City</label>
          <select id="filter-city" value={city} onChange={(e) => update('city', e.target.value)}>
            <option value="all">All cities</option>
            {cities.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="filters__group" style={{ border: 0, padding: 0, margin: '0 0 18px' }}>
          <legend className="filters__legend">Category</legend>
          <label className="filters__radio">
            <input
              type="radio"
              name="category"
              checked={category === 'all'}
              onChange={() => update('category', 'all')}
            />
            All categories
          </label>
          {CATEGORIES.map((value) => (
            <label className="filters__radio" key={value}>
              <input
                type="radio"
                name="category"
                checked={category === value}
                onChange={() => update('category', value)}
              />
              {CATEGORY_LABELS[value]}
            </label>
          ))}
        </fieldset>

        <div className="filters__group">
          <label htmlFor="filter-price">
            Max price — {maxPrice >= PRICE_CEILING ? 'Any' : formatPrice(maxPrice)}
          </label>
          <input
            id="filter-price"
            type="range"
            min={20}
            max={PRICE_CEILING}
            step={10}
            value={maxPrice}
            onChange={(e) => update('maxPrice', e.target.value)}
          />
        </div>

        {hasFilters && (
          <button className="linkbtn" type="button" onClick={() => setParams({}, { replace: true })}>
            Clear all filters
          </button>
        )}
      </aside>

      <section>
        <div className="results__head">
          <div>
            <h1>{heading}</h1>
            <span className="results__count">
              {results.length} {results.length === 1 ? 'event' : 'events'}
            </span>
          </div>
          <label>
            <span className="results__count" style={{ marginRight: 8 }}>
              Sort by
            </span>
            <select
              value={sort}
              onChange={(e) => update('sort', e.target.value)}
              style={{ height: 38, borderRadius: 8, border: '1px solid var(--line)', padding: '0 10px' }}
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="empty">
            <strong>No events match those filters</strong>
            Try widening the price range, picking another city, or searching for something else.
          </div>
        ) : (
          <div className="grid">
            {results.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
