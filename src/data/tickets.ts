import c1 from '../assets/tickets/109-c-1.jpg'
import c2 from '../assets/tickets/109-c-2.jpg'
import type { HeldTicket } from '../lib/types'

const SESSION = {
  eventName: "US Open — Men's Singles Final",
  session: 'Day Session',
  date: '2026-09-13T14:00',
  venue: 'Arthur Ashe Stadium',
  complex: 'USTA Billie Jean King National Tennis Center',
  gate: 'Pres Gate',
  ticketType: 'Standard Ticket',
  artwork: 7,
} as const

/**
 * Tickets held by the demo account: two seats for one session, each with its
 * own supplied artwork.
 */
export const MY_TICKETS: HeldTicket[] = [
  { ...SESSION, id: 'us-open-msf-109-c-1', section: '109', row: 'C', seat: '1', image: c1 },
  { ...SESSION, id: 'us-open-msf-109-c-2', section: '109', row: 'C', seat: '2', image: c2 },
]
