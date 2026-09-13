import { describe, expect, it } from 'vitest'
import { groupTickets, relativeDay, ticketStatus } from '../tickets'
import { MY_TICKETS } from '../../data/tickets'
import type { HeldTicket } from '../types'

function makeTicket(row: string, seat: string, overrides: Partial<HeldTicket> = {}): HeldTicket {
  return {
    id: `t-${row}-${seat}-${overrides.section ?? '121'}`,
    eventName: "US Open — Men's Semifinal",
    session: 'Evening Session',
    date: '2026-09-11T19:00',
    venue: 'Arthur Ashe Stadium',
    complex: 'USTA Billie Jean King National Tennis Center',
    section: '121',
    row,
    seat,
    gate: 'Pres Gate',
    ticketType: 'Standard Ticket',
    artwork: 7,
    ...overrides,
  }
}

describe('seeded tickets', () => {
  // Asserts what must hold of whatever seats are seeded, not the seat list
  // itself: the seats get swapped out often, and a hard-coded list only ever
  // failed because it was stale.
  it('holds seats for one session', () => {
    expect(MY_TICKETS.length).toBeGreaterThan(0)
    expect(new Set(MY_TICKETS.map((t) => `${t.eventName}|${t.date}|${t.session}`)).size).toBe(1)
  })

  it('gives every ticket a distinct seat', () => {
    const seats = MY_TICKETS.map((t) => `${t.section}-${t.row}${t.seat}`)
    expect(new Set(seats).size).toBe(seats.length)
  })

  it('gives every ticket a unique id and its own artwork', () => {
    expect(new Set(MY_TICKETS.map((t) => t.id)).size).toBe(MY_TICKETS.length)
    expect(MY_TICKETS.every((t) => typeof t.image === 'string' && t.image.length > 0)).toBe(true)
    expect(new Set(MY_TICKETS.map((t) => t.image)).size).toBe(MY_TICKETS.length)
  })

  it('collapses into a single group holding every seat', () => {
    const groups = groupTickets(MY_TICKETS)
    expect(groups).toHaveLength(1)
    expect(groups[0]!.tickets).toHaveLength(MY_TICKETS.length)
    expect(groups[0]!.session).toBe(MY_TICKETS[0]!.session)
  })
})

describe('groupTickets', () => {
  it('keeps seats in different rows of the same session together', () => {
    const groups = groupTickets([makeTicket('Z', '8'), makeTicket('L', '6')])
    expect(groups).toHaveLength(1)
    expect(groups[0]!.tickets).toHaveLength(2)
  })

  it('splits tickets for different events', () => {
    const groups = groupTickets([
      makeTicket('L', '6'),
      makeTicket('L', '6', { eventName: 'Coastal Open', date: '2026-10-02T13:00' }),
    ])
    expect(groups).toHaveLength(2)
  })

  it('splits the day and evening sessions of the same event', () => {
    const groups = groupTickets([
      makeTicket('L', '6'),
      makeTicket('L', '6', { session: 'Day Session', date: '2026-09-11T12:00' }),
    ])
    expect(groups).toHaveLength(2)
  })

  it('orders seats by row, then by seat number', () => {
    const groups = groupTickets([
      makeTicket('Z', '8'),
      makeTicket('L', '10'),
      makeTicket('L', '6'),
      makeTicket('V', '4'),
    ])
    expect(groups[0]!.tickets.map((t) => `${t.row}${t.seat}`)).toEqual(['L6', 'L10', 'V4', 'Z8'])
  })

  it('orders by section before row, numerically', () => {
    const groups = groupTickets([
      makeTicket('E', '5', { section: '121' }),
      makeTicket('Z', '5', { section: '107' }),
      makeTicket('A', '1', { section: '9' }),
    ])
    expect(groups[0]!.tickets.map((t) => t.section)).toEqual(['9', '107', '121'])
  })

  it('orders groups by date', () => {
    const groups = groupTickets([
      makeTicket('L', '6', { date: '2026-12-01T19:00', eventName: 'Later' }),
      makeTicket('L', '6', { date: '2026-09-11T19:00', eventName: 'Sooner' }),
    ])
    expect(groups.map((g) => g.eventName)).toEqual(['Sooner', 'Later'])
  })
})

describe('ticketStatus', () => {
  const now = new Date('2026-09-11T22:00')

  it('reads as today even after the start time has passed', () => {
    expect(ticketStatus('2026-09-11T19:00', now)).toBe('today')
  })

  it('detects upcoming and past dates', () => {
    expect(ticketStatus('2026-09-12T19:00', now)).toBe('upcoming')
    expect(ticketStatus('2026-09-10T19:00', now)).toBe('past')
  })
})

describe('relativeDay', () => {
  const now = new Date('2026-09-11T09:00')

  it('labels nearby days in words', () => {
    expect(relativeDay('2026-09-11T19:00', now)).toBe('Today')
    expect(relativeDay('2026-09-12T19:00', now)).toBe('Tomorrow')
    expect(relativeDay('2026-09-10T19:00', now)).toBe('Yesterday')
  })

  it('counts further days in each direction', () => {
    expect(relativeDay('2026-09-16T19:00', now)).toBe('In 5 days')
    expect(relativeDay('2026-09-05T19:00', now)).toBe('6 days ago')
  })
})
