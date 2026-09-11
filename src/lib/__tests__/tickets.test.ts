import { describe, expect, it } from 'vitest'
import { formatSeatRange, groupTickets, relativeDay, ticketStatus } from '../tickets'
import { MY_TICKETS } from '../../data/tickets'
import type { HeldTicket } from '../types'

function makeTicket(seat: string, overrides: Partial<HeldTicket> = {}): HeldTicket {
  return {
    id: `t-${seat}`,
    eventName: 'US Open — Men\'s Semifinal',
    session: 'Day Session',
    date: '2026-09-11T12:00',
    venue: 'Arthur Ashe Stadium',
    complex: 'USTA Billie Jean King National Tennis Center',
    section: '107',
    row: 'S',
    seat,
    gate: 'Pres Gate',
    ticketType: 'Standard Ticket',
    artwork: 7,
    ...overrides,
  }
}

describe('seeded tickets', () => {
  it('holds four seats in one row', () => {
    expect(MY_TICKETS).toHaveLength(4)
    expect(MY_TICKETS.map((t) => t.seat)).toEqual(['1', '2', '3', '4'])
    expect(new Set(MY_TICKETS.map((t) => t.section))).toEqual(new Set(['107']))
    expect(new Set(MY_TICKETS.map((t) => t.row))).toEqual(new Set(['S']))
  })

  it('gives every ticket a unique id', () => {
    expect(new Set(MY_TICKETS.map((t) => t.id)).size).toBe(MY_TICKETS.length)
  })

  it('collapses into a single group covering seats 1-4', () => {
    const groups = groupTickets(MY_TICKETS)
    expect(groups).toHaveLength(1)
    expect(groups[0]!.tickets).toHaveLength(4)
    expect(formatSeatRange(groups[0]!.tickets)).toBe('Seats 1-4')
  })
})

describe('groupTickets', () => {
  it('splits tickets in different rows', () => {
    const groups = groupTickets([makeTicket('1'), makeTicket('2', { row: 'T' })])
    expect(groups).toHaveLength(2)
  })

  it('splits tickets for different events', () => {
    const groups = groupTickets([
      makeTicket('1'),
      makeTicket('1', { eventName: 'Coastal Open', date: '2026-10-02T13:00' }),
    ])
    expect(groups).toHaveLength(2)
  })

  it('orders groups by date', () => {
    const groups = groupTickets([
      makeTicket('1', { date: '2026-12-01T19:00', eventName: 'Later' }),
      makeTicket('1', { date: '2026-09-11T12:00', eventName: 'Sooner' }),
    ])
    expect(groups.map((g) => g.eventName)).toEqual(['Sooner', 'Later'])
  })
})

describe('formatSeatRange', () => {
  it('uses a range for consecutive seats', () => {
    expect(formatSeatRange([makeTicket('1'), makeTicket('2'), makeTicket('3')])).toBe('Seats 1-3')
  })

  it('lists non-consecutive seats', () => {
    expect(formatSeatRange([makeTicket('1'), makeTicket('4')])).toBe('Seats 1, 4')
  })

  it('sorts out-of-order seats', () => {
    expect(formatSeatRange([makeTicket('4'), makeTicket('2'), makeTicket('3')])).toBe('Seats 2-4')
  })

  it('uses the singular label for one ticket', () => {
    expect(formatSeatRange([makeTicket('9')])).toBe('Seat 9')
  })

  it('falls back to a plain list for non-numeric seats', () => {
    expect(formatSeatRange([makeTicket('A'), makeTicket('B')])).toBe('Seats A, B')
  })
})

describe('ticketStatus', () => {
  const now = new Date('2026-09-11T18:00')

  it('reads as today even after the start time has passed', () => {
    expect(ticketStatus('2026-09-11T12:00', now)).toBe('today')
  })

  it('detects upcoming and past dates', () => {
    expect(ticketStatus('2026-09-12T12:00', now)).toBe('upcoming')
    expect(ticketStatus('2026-09-10T12:00', now)).toBe('past')
  })
})

describe('relativeDay', () => {
  const now = new Date('2026-09-11T09:00')

  it('labels nearby days in words', () => {
    expect(relativeDay('2026-09-11T12:00', now)).toBe('Today')
    expect(relativeDay('2026-09-12T12:00', now)).toBe('Tomorrow')
    expect(relativeDay('2026-09-10T12:00', now)).toBe('Yesterday')
  })

  it('counts further days in each direction', () => {
    expect(relativeDay('2026-09-16T12:00', now)).toBe('In 5 days')
    expect(relativeDay('2026-09-05T12:00', now)).toBe('6 days ago')
  })
})
