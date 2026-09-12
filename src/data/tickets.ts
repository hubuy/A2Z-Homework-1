import e5 from '../assets/tickets/121-e-5.jpg'
import e6 from '../assets/tickets/121-e-6.jpg'
import e7 from '../assets/tickets/121-e-7.jpg'
import z5 from '../assets/tickets/107-z-5.jpg'
import z6 from '../assets/tickets/107-z-6.jpg'
import type { HeldTicket } from '../lib/types'

const SESSION = {
  eventName: "US Open — Men's Semifinal",
  session: 'Evening Session',
  date: '2026-09-11T19:00',
  venue: 'Arthur Ashe Stadium',
  complex: 'USTA Billie Jean King National Tennis Center',
  gate: 'Pres Gate',
  ticketType: 'Standard Ticket',
  artwork: 7,
} as const

/**
 * Tickets held by the demo account: five seats for one session, bought in two
 * blocks in different sections, each with its own supplied artwork.
 */
export const MY_TICKETS: HeldTicket[] = [
  { ...SESSION, id: 'us-open-msf-121-e-5', section: '121', row: 'E', seat: '5', image: e5 },
  { ...SESSION, id: 'us-open-msf-121-e-6', section: '121', row: 'E', seat: '6', image: e6 },
  { ...SESSION, id: 'us-open-msf-121-e-7', section: '121', row: 'E', seat: '7', image: e7 },
  { ...SESSION, id: 'us-open-msf-107-z-5', section: '107', row: 'Z', seat: '5', image: z5 },
  { ...SESSION, id: 'us-open-msf-107-z-6', section: '107', row: 'Z', seat: '6', image: z6 },
]
