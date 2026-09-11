import u1 from '../assets/tickets/107-u-1.jpg'
import u2 from '../assets/tickets/107-u-2.jpg'
import u3 from '../assets/tickets/107-u-3.jpg'
import type { HeldTicket } from '../lib/types'

const SHARED = {
  eventName: "US Open — Men's Semifinal",
  session: 'Evening Session',
  date: '2026-09-11T19:00',
  venue: 'Arthur Ashe Stadium',
  complex: 'USTA Billie Jean King National Tennis Center',
  section: '107',
  row: 'U',
  gate: 'Pres Gate',
  ticketType: 'Standard Ticket',
  artwork: 7,
} as const

/**
 * Tickets held by the demo account: three adjacent seats for one session,
 * each with its own supplied artwork.
 */
export const MY_TICKETS: HeldTicket[] = [
  { ...SHARED, id: 'us-open-msf-107-u-1', seat: '1', image: u1 },
  { ...SHARED, id: 'us-open-msf-107-u-2', seat: '2', image: u2 },
  { ...SHARED, id: 'us-open-msf-107-u-3', seat: '3', image: u3 },
]
