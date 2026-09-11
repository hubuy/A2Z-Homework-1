import type { Category, Event } from './types'

export const CATEGORY_LABELS: Record<Category, string> = {
  concerts: 'Concerts',
  sports: 'Sports',
  arts: 'Arts & Theater',
  comedy: 'Comedy',
}

export type EventQuery = {
  /** Free text matched against event name, tagline, venue and city. */
  search?: string
  category?: Category | 'all'
  city?: string | 'all'
  maxPrice?: number
}

export function lowestPrice(event: Event): number {
  return event.tiers.reduce((min, tier) => Math.min(min, tier.price), Infinity)
}

export function totalAvailable(event: Event): number {
  return event.tiers.reduce((sum, tier) => sum + tier.available, 0)
}

export function matchesQuery(event: Event, query: EventQuery): boolean {
  const { search = '', category = 'all', city = 'all', maxPrice } = query

  if (category !== 'all' && event.category !== category) return false
  if (city !== 'all' && event.city !== city) return false
  if (maxPrice !== undefined && lowestPrice(event) > maxPrice) return false

  const term = search.trim().toLowerCase()
  if (!term) return true

  const haystack = [event.name, event.tagline, event.venue, event.city, event.state]
    .join(' ')
    .toLowerCase()
  return term.split(/\s+/).every((word) => haystack.includes(word))
}

export function searchEvents(events: Event[], query: EventQuery): Event[] {
  return events.filter((event) => matchesQuery(event, query))
}

export type SortKey = 'date' | 'price' | 'name'

export function sortEvents(events: Event[], key: SortKey): Event[] {
  const sorted = [...events]
  sorted.sort((a, b) => {
    switch (key) {
      case 'price':
        return lowestPrice(a) - lowestPrice(b)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'date':
      default:
        return a.date.localeCompare(b.date)
    }
  })
  return sorted
}

export function uniqueCities(events: Event[]): string[] {
  return [...new Set(events.map((e) => e.city))].sort((a, b) => a.localeCompare(b))
}

const DATE_FMT = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const TIME_FMT = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
})

export function formatEventDate(iso: string): string {
  return DATE_FMT.format(new Date(iso))
}

export function formatEventTime(iso: string): string {
  return TIME_FMT.format(new Date(iso))
}

/** Compact date badge used on cards: { month: 'OCT', day: '04' }. */
export function dateBadge(iso: string): { month: string; day: string } {
  const d = new Date(iso)
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: String(d.getDate()).padStart(2, '0'),
  }
}

export function formatPrice(dollars: number): string {
  return dollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(dollars) ? 0 : 2,
    maximumFractionDigits: 2,
  })
}
