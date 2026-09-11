import seat1 from '../assets/tickets/seat-1.jpg'
import seat2 from '../assets/tickets/seat-2.jpg'
import seat3 from '../assets/tickets/seat-3.jpg'
import seat4 from '../assets/tickets/seat-4.jpg'
import type { HeldTicket } from '../lib/types'

const IMAGES: Record<number, string> = { 1: seat1, 2: seat2, 3: seat3, 4: seat4 }

/**
 * Tickets held by the demo account: four adjacent seats for one session,
 * each with its own supplied ticket artwork.
 */
export const MY_TICKETS: HeldTicket[] = [1, 2, 3, 4].map((seat) => ({
  id: `us-open-msf-107-s-${seat}`,
  eventName: "US Open — Men's Semifinal",
  session: 'Day Session',
  date: '2026-09-11T12:00',
  venue: 'Arthur Ashe Stadium',
  complex: 'USTA Billie Jean King National Tennis Center',
  section: '107',
  row: 'S',
  seat: String(seat),
  gate: 'Pres Gate',
  ticketType: 'Standard Ticket',
  artwork: 7,
  image: IMAGES[seat],
}))
