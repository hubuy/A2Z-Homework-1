import l6 from '../assets/tickets/117-l-6.jpg'
import v4 from '../assets/tickets/117-v-4.jpg'
import z8 from '../assets/tickets/117-z-8.jpg'
import type { HeldTicket } from '../lib/types'

const SHARED = {
  eventName: "US Open — Men's Semifinal",
  session: 'Evening Session',
  date: '2026-09-11T19:00',
  venue: 'Arthur Ashe Stadium',
  complex: 'USTA Billie Jean King National Tennis Center',
  section: '117',
  gate: 'Pres Gate',
  ticketType: 'Standard Ticket',
  artwork: 7,
} as const

/**
 * Tickets held by the demo account: one session, three seats scattered across
 * rows rather than sold together, each with its own supplied artwork.
 */
export const MY_TICKETS: HeldTicket[] = [
  { ...SHARED, id: 'us-open-msf-117-l-6', row: 'L', seat: '6', image: l6 },
  { ...SHARED, id: 'us-open-msf-117-v-4', row: 'V', seat: '4', image: v4 },
  { ...SHARED, id: 'us-open-msf-117-z-8', row: 'Z', seat: '8', image: z8 },
]
