import v11 from '../assets/tickets/119-v-11.jpg'
import v12 from '../assets/tickets/119-v-12.jpg'
import v13 from '../assets/tickets/119-v-13.jpg'
import type { HeldTicket } from '../lib/types'

const SHARED = {
  eventName: "US Open — Men's Semifinal",
  session: 'Evening Session',
  date: '2026-09-11T19:00',
  venue: 'Arthur Ashe Stadium',
  complex: 'USTA Billie Jean King National Tennis Center',
  section: '119',
  row: 'V',
  gate: 'Pres Gate',
  ticketType: 'Standard Ticket',
  artwork: 7,
} as const

/**
 * Tickets held by the demo account: three adjacent seats for one session,
 * each with its own supplied artwork.
 */
export const MY_TICKETS: HeldTicket[] = [
  { ...SHARED, id: 'us-open-msf-119-v-11', seat: '11', image: v11 },
  { ...SHARED, id: 'us-open-msf-119-v-12', seat: '12', image: v12 },
  { ...SHARED, id: 'us-open-msf-119-v-13', seat: '13', image: v13 },
]
