export type Category = 'concerts' | 'sports' | 'arts' | 'comedy'

export type TicketTier = {
  id: string
  name: string
  /** Section description shown under the tier name. */
  description: string
  /** Price per ticket in whole dollars, before fees. */
  price: number
  available: number
}

export type Event = {
  id: string
  slug: string
  name: string
  /** Supporting act, tour name or subtitle. */
  tagline: string
  category: Category
  /** ISO-8601 local date-time, e.g. 2026-10-04T20:00 */
  date: string
  venue: string
  city: string
  state: string
  tiers: TicketTier[]
  /** 0-11: picks the generated artwork gradient. */
  artwork: number
  featured: boolean
  /** Marks events added to the catalog recently. */
  justAnnounced: boolean
}

export type CartLine = {
  eventId: string
  tierId: string
  quantity: number
}
