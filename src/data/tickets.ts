import e5 from '../assets/tickets/121-e-5.jpg'
import e6 from '../assets/tickets/121-e-6.jpg'
import e7 from '../assets/tickets/121-e-7.jpg'
import type { HeldTicket } from '../lib/types'

const SHARED = {
  eventName: "US Open — Men's Semifinal",
  session: 'Evening Session',
  date: '2026-09-11T19:00',
  venue: 'Arthur Ashe Stadium',
  complex: 'USTA Billie Jean King National Tennis Center',
  section: '121',
  row: 'E',
  gate: 'Pres Gate',
  ticketType: 'Standard Ticket',
  artwork: 7,
} as const

/**
 * Tickets held by the demo account: three adjacent seats for one session,
 * each with its own supplied artwork.
 */
export const MY_TICKETS: HeldTicket[] = [
  { ...SHARED, id: 'us-open-msf-121-e-5', seat: '5', image: e5 },
  { ...SHARED, id: 'us-open-msf-121-e-6', seat: '6', image: e6 },
  { ...SHARED, id: 'us-open-msf-121-e-7', seat: '7', image: e7 },
]
