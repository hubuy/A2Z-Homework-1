import { describe, expect, it } from 'vitest'
import { groupTickets, relativeDay, ticketStatus } from '../tickets'
import { MY_TICKETS } from '../../data/tickets'
import type { HeldTicket } from '../types'

function makeTicket(row: string, seat: string, overrides: Partial<HeldTicket> = {}): HeldTicket {
  return {
    id: `t-${row}-${seat}`,
    eventName: "US Open — Men's Semifinal",
    session: 'Evening Session',
    date: '2026-09-11T19:00',
    venue: 'Arthur Ashe Stadium',
    complex: 'USTA Billie Jean King National Tennis Center',
    section: '117',
    row,
    seat,
    gate: 'Pres Gate',
    ticketType: 'Standard Ticket',
    artwork: 7,
    ...overrides,
  }
}

describe('seeded tickets', () => {
  it('holds three seats in one section', () => {
    expect(MY_TICKETS).toHaveLength(3)
    expect(new Set(MY_TICKETS.map((t) => t.section))).toEqual(new Set(['117']))
    expect(MY_TICKETS.map((t) => `${t.row}${t.seat}`).sort()).toEqual(['L6', 'V4', 'Z8'])
  })

  it('gives every ticket a unique id and its own artwork', () => {
    expect(new Set(MY_TICKETS.map((t) => t.id)).size).toBe(MY_TICKETS.length)
    expect(MY_TICKETS.every((t) => typeof t.image === 'string' && t.image.length > 0)).toBe(true)
    expect(new Set(MY_TICKETS.map((t) => t.image)).size).toBe(MY_TICKETS.length)
  })

  it('collapses into one group even though the rows differ', () => {
    const groups = groupTickets(MY_TICKETS)
    expect(groups).toHaveLength(1)
    expect(groups[0]!.tickets).toHaveLength(3)
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
