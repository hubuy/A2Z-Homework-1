import type { HeldTicket } from './types'

export type TicketGroup = {
  key: string
  eventName: string
  session: string
  date: string
  venue: string
  complex: string
  tickets: HeldTicket[]
}

/** Orders seats within a group by row, then by seat number. */
function bySeat(a: HeldTicket, b: HeldTicket): number {
  const row = a.row.localeCompare(b.row)
  if (row !== 0) return row
  const na = Number(a.seat)
  const nb = Number(b.seat)
  if (Number.isNaN(na) || Number.isNaN(nb)) return a.seat.localeCompare(b.seat)
  return na - nb
}

/**
 * Groups tickets by the session they admit to, so seats bought together and
 * seats scattered across rows both read as one set of tickets for one event.
 */
export function groupTickets(tickets: HeldTicket[]): TicketGroup[] {
  const groups = new Map<string, TicketGroup>()

  for (const ticket of tickets) {
    const key = [ticket.eventName, ticket.date, ticket.session].join('|')
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
      tickets: [ticket],
    })
  }

  for (const group of groups.values()) {
    group.tickets.sort(bySeat)
  }

  return [...groups.values()].sort((a, b) => a.date.localeCompare(b.date))
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
