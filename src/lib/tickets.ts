import type { HeldTicket } from './types'

export type TicketGroup = {
  key: string
  eventName: string
  session: string
  date: string
  venue: string
  complex: string
  section: string
  row: string
  gate: string
  ticketType: string
  artwork: number
  tickets: HeldTicket[]
}

/** Groups tickets that share an event, session, section and row. */
export function groupTickets(tickets: HeldTicket[]): TicketGroup[] {
  const groups = new Map<string, TicketGroup>()

  for (const ticket of tickets) {
    const key = [ticket.eventName, ticket.date, ticket.section, ticket.row].join('|')
    const existing = groups.get(key)
    if (existing) {
      existing.tickets.push(ticket)
      continue
    }
    groups.set(key, {
      key,
      eventName: ticket.eventName,
      session: ticket.session,
      date: ticket.date,
      venue: ticket.venue,
      complex: ticket.complex,
      section: ticket.section,
      row: ticket.row,
      gate: ticket.gate,
      ticketType: ticket.ticketType,
      artwork: ticket.artwork,
      tickets: [ticket],
    })
  }

  return [...groups.values()].sort((a, b) => a.date.localeCompare(b.date))
}

/** "Seats 1-4" when the seats run consecutively, otherwise "Seats 1, 4, 7". */
export function formatSeatRange(tickets: HeldTicket[]): string {
  const label = tickets.length === 1 ? 'Seat' : 'Seats'
  const numbers = tickets.map((t) => Number(t.seat))

  if (numbers.some(Number.isNaN)) {
    return `${label} ${tickets.map((t) => t.seat).join(', ')}`
  }

  const sorted = [...numbers].sort((a, b) => a - b)
  const consecutive = sorted.every((n, i) => i === 0 || n === sorted[i - 1]! + 1)

  if (consecutive && sorted.length > 1) {
    return `${label} ${sorted[0]}-${sorted[sorted.length - 1]}`
  }
  return `${label} ${sorted.join(', ')}`
}

export type TicketStatus = 'today' | 'upcoming' | 'past'

/** Compares calendar days, so an event earlier today still reads as "today". */
export function ticketStatus(iso: string, now: Date = new Date()): TicketStatus {
  const event = new Date(iso)
  const eventDay = Date.UTC(event.getFullYear(), event.getMonth(), event.getDate())
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  if (eventDay === today) return 'today'
  return eventDay > today ? 'upcoming' : 'past'
}

/** "in 3 days", "Today", "2 days ago" — a short line for the ticket header. */
export function relativeDay(iso: string, now: Date = new Date()): string {
  const event = new Date(iso)
  const eventDay = Date.UTC(event.getFullYear(), event.getMonth(), event.getDate())
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const days = Math.round((eventDay - today) / 86_400_000)

  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  return days > 0 ? `In ${days} days` : `${Math.abs(days)} days ago`
}
