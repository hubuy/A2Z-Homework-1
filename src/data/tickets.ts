import seat5 from '../assets/tickets/seat-5.jpg'
import seat6 from '../assets/tickets/seat-6.jpg'
import seat7 from '../assets/tickets/seat-7.jpg'
import seat8 from '../assets/tickets/seat-8.jpg'
import type { HeldTicket } from '../lib/types'

const IMAGES: Record<number, string> = { 5: seat5, 6: seat6, 7: seat7, 8: seat8 }

/**
 * Tickets held by the demo account: four adjacent seats for one session,
 * each with its own supplied ticket artwork.
 */
export const MY_TICKETS: HeldTicket[] = [5, 6, 7, 8].map((seat) => ({
  id: `us-open-msf-115-k-${seat}`,
  eventName: "US Open — Men's Semifinal",
  session: 'Day Session',
  date: '2026-09-11T12:00',
  venue: 'Arthur Ashe Stadium',
  complex: 'USTA Billie Jean King National Tennis Center',
  section: '115',
  row: 'K',
  seat: String(seat),
  gate: 'Pres Gate',
  ticketType: 'Standard Ticket',
  artwork: 7,
  image: IMAGES[seat],
}))
