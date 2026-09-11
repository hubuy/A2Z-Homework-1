import h5 from '../assets/tickets/115-h-5.jpg'
import h6 from '../assets/tickets/115-h-6.jpg'
import h7 from '../assets/tickets/115-h-7.jpg'
import type { HeldTicket } from '../lib/types'

const SHARED = {
  eventName: "US Open — Men's Semifinal",
  session: 'Evening Session',
  date: '2026-09-11T19:00',
  venue: 'Arthur Ashe Stadium',
  complex: 'USTA Billie Jean King National Tennis Center',
  section: '115',
  row: 'H',
  gate: 'Pres Gate',
  ticketType: 'Standard Ticket',
  artwork: 7,
} as const

/**
 * Tickets held by the demo account: three adjacent seats for one session,
 * each with its own supplied artwork.
 */
export const MY_TICKETS: HeldTicket[] = [
  { ...SHARED, id: 'us-open-msf-115-h-5', seat: '5', image: h5 },
  { ...SHARED, id: 'us-open-msf-115-h-6', seat: '6', image: h6 },
  { ...SHARED, id: 'us-open-msf-115-h-7', seat: '7', image: h7 },
]
