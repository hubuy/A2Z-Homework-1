import type { HeldTicket } from '../lib/types'

/**
 * Tickets held by the demo account. Seeded from a real order so the My Tickets
 * screen has true-to-life data: four adjacent seats for one session.
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
}))
