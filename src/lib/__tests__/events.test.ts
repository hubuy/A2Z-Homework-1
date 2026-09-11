import { describe, expect, it } from 'vitest'
import {
  dateBadge,
  formatPrice,
  lowestPrice,
  searchEvents,
  sortEvents,
  uniqueCities,
} from '../events'
import type { Event } from '../types'

function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: 'x1',
    slug: 'test-event',
    name: 'Neon Harbor',
    tagline: 'The Afterglow Tour',
    category: 'concerts',
    date: '2026-10-04T20:00',
    venue: 'Lakeside Arena',
    city: 'Chicago',
    state: 'IL',
    artwork: 0,
    featured: false,
    justAnnounced: false,
    tiers: [
      { id: 't1', name: 'Floor', description: 'Standing', price: 120, available: 10 },
      { id: 't2', name: 'Upper', description: 'Seated', price: 55, available: 40 },
    ],
    ...overrides,
  }
}

describe('lowestPrice', () => {
  it('returns the cheapest tier price', () => {
    expect(lowestPrice(makeEvent())).toBe(55)
  })
})

describe('searchEvents', () => {
  const events = [
    makeEvent({ id: 'a', name: 'Neon Harbor', city: 'Chicago', category: 'concerts' }),
    makeEvent({ id: 'b', name: 'Coastal Open', city: 'San Diego', category: 'sports' }),
    makeEvent({
      id: 'c',
      name: 'Glasswing Symphony',
      city: 'Boston',
      category: 'arts',
      tiers: [{ id: 't1', name: 'Gallery', description: 'Upper', price: 300, available: 5 }],
    }),
  ]

  it('returns everything for an empty query', () => {
    expect(searchEvents(events, {})).toHaveLength(3)
  })

  it('matches on name regardless of case', () => {
    expect(searchEvents(events, { search: 'neon' }).map((e) => e.id)).toEqual(['a'])
  })

  it('matches on venue and city text', () => {
    expect(searchEvents(events, { search: 'san diego' }).map((e) => e.id)).toEqual(['b'])
  })

  it('requires every search word to match', () => {
    expect(searchEvents(events, { search: 'neon symphony' })).toHaveLength(0)
  })

  it('filters by category', () => {
    expect(searchEvents(events, { category: 'sports' }).map((e) => e.id)).toEqual(['b'])
  })

  it('filters by city', () => {
    expect(searchEvents(events, { city: 'Boston' }).map((e) => e.id)).toEqual(['c'])
  })

  it('excludes events whose cheapest ticket exceeds maxPrice', () => {
    expect(searchEvents(events, { maxPrice: 100 }).map((e) => e.id)).toEqual(['a', 'b'])
  })

  it('combines filters', () => {
    const result = searchEvents(events, { search: 'harbor', category: 'concerts', maxPrice: 60 })
    expect(result.map((e) => e.id)).toEqual(['a'])
  })
})

describe('sortEvents', () => {
  const events = [
    makeEvent({ id: 'a', name: 'Zephyr', date: '2026-12-01T20:00' }),
    makeEvent({
      id: 'b',
      name: 'Alpha',
      date: '2026-09-01T20:00',
      tiers: [{ id: 't1', name: 'GA', description: '', price: 400, available: 1 }],
    }),
  ]

  it('sorts by date ascending', () => {
    expect(sortEvents(events, 'date').map((e) => e.id)).toEqual(['b', 'a'])
  })

  it('sorts by lowest price ascending', () => {
    expect(sortEvents(events, 'price').map((e) => e.id)).toEqual(['a', 'b'])
  })

  it('sorts by name alphabetically', () => {
    expect(sortEvents(events, 'name').map((e) => e.id)).toEqual(['b', 'a'])
  })

  it('does not mutate the input array', () => {
    const input = [...events]
    sortEvents(input, 'name')
    expect(input.map((e) => e.id)).toEqual(['a', 'b'])
  })
})

describe('uniqueCities', () => {
  it('de-duplicates and sorts city names', () => {
    const events = [
      makeEvent({ city: 'Seattle' }),
      makeEvent({ city: 'Austin' }),
      makeEvent({ city: 'Seattle' }),
    ]
    expect(uniqueCities(events)).toEqual(['Austin', 'Seattle'])
  })
})

describe('formatting', () => {
  it('builds a compact date badge', () => {
    expect(dateBadge('2026-10-04T20:00')).toEqual({ month: 'OCT', day: '04' })
  })

  it('formats whole-dollar prices without cents', () => {
    expect(formatPrice(139)).toBe('$139')
  })

  it('formats fractional prices with cents', () => {
    expect(formatPrice(4.95)).toBe('$4.95')
  })
})
