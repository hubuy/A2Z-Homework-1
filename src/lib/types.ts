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

/**
 * A ticket already owned by the signed-in user, shown under My Tickets.
 * Separate from catalog `Event`s, which are things still on sale.
 */
export type HeldTicket = {
  id: string
  eventName: string
  /** Session or round label, e.g. "Day Session". */
  session: string
  /** ISO-8601 local date-time. */
  date: string
  venue: string
  /** The wider grounds or complex the venue sits in. */
  complex: string
  section: string
  row: string
  seat: string
  /** Entry gate printed on the ticket. */
  gate: string
  ticketType: string
  artwork: number
  /** Artwork supplied with the ticket; falls back to generated art when absent. */
  image?: string
}
