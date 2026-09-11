import { describe, expect, it } from 'vitest'
import {
  addLine,
  computeTotals,
  countTickets,
  MAX_PER_ORDER,
  ORDER_FEE,
  removeLine,
  resolveLines,
  updateQuantity,
} from '../cart'
import type { CartLine, Event } from '../types'

const event: Event = {
  id: 'e1',
  slug: 'neon-harbor',
  name: 'Neon Harbor',
  tagline: 'The Afterglow Tour',
  category: 'concerts',
  date: '2026-10-04T20:00',
  venue: 'Lakeside Arena',
  city: 'Chicago',
  state: 'IL',
  artwork: 0,
  featured: true,
  justAnnounced: false,
  tiers: [
    { id: 't1', name: 'Floor', description: 'Standing', price: 100, available: 3 },
    { id: 't2', name: 'Upper', description: 'Seated', price: 50, available: 40 },
  ],
}

describe('addLine', () => {
  it('adds a new line', () => {
    const lines = addLine([], { eventId: 'e1', tierId: 't2', quantity: 2 }, 40)
    expect(lines).toEqual([{ eventId: 'e1', tierId: 't2', quantity: 2 }])
  })

  it('merges quantities for the same event and tier', () => {
    let lines = addLine([], { eventId: 'e1', tierId: 't2', quantity: 2 }, 40)
    lines = addLine(lines, { eventId: 'e1', tierId: 't2', quantity: 3 }, 40)
    expect(lines).toHaveLength(1)
    expect(lines[0]!.quantity).toBe(5)
  })

  it('keeps different tiers of the same event as separate lines', () => {
    let lines = addLine([], { eventId: 'e1', tierId: 't1', quantity: 1 }, 3)
    lines = addLine(lines, { eventId: 'e1', tierId: 't2', quantity: 1 }, 40)
    expect(lines).toHaveLength(2)
  })

  it('clamps to the tier availability', () => {
    const lines = addLine([], { eventId: 'e1', tierId: 't1', quantity: 6 }, 3)
    expect(lines[0]!.quantity).toBe(3)
  })

  it('clamps a merged quantity to the per-order maximum', () => {
    let lines = addLine([], { eventId: 'e1', tierId: 't2', quantity: 6 }, 40)
    lines = addLine(lines, { eventId: 'e1', tierId: 't2', quantity: 6 }, 40)
    expect(lines[0]!.quantity).toBe(MAX_PER_ORDER)
  })

  it('ignores non-positive quantities', () => {
    expect(addLine([], { eventId: 'e1', tierId: 't2', quantity: 0 }, 40)).toEqual([])
  })
})

describe('updateQuantity', () => {
  const lines: CartLine[] = [{ eventId: 'e1', tierId: 't2', quantity: 2 }]

  it('sets a new quantity', () => {
    expect(updateQuantity(lines, 'e1', 't2', 5)[0]!.quantity).toBe(5)
  })

  it('removes the line when the quantity drops to zero', () => {
    expect(updateQuantity(lines, 'e1', 't2', 0)).toEqual([])
  })
})

describe('removeLine', () => {
  it('removes only the matching event and tier', () => {
    const lines: CartLine[] = [
      { eventId: 'e1', tierId: 't1', quantity: 1 },
      { eventId: 'e1', tierId: 't2', quantity: 1 },
    ]
    expect(removeLine(lines, 'e1', 't1')).toEqual([{ eventId: 'e1', tierId: 't2', quantity: 1 }])
  })
})

describe('resolveLines', () => {
  it('joins lines to their event and tier', () => {
    const resolved = resolveLines([{ eventId: 'e1', tierId: 't1', quantity: 2 }], [event])
    expect(resolved).toHaveLength(1)
    expect(resolved[0]!.subtotal).toBe(200)
    expect(resolved[0]!.tier.name).toBe('Floor')
  })

  it('drops lines whose event or tier no longer exists', () => {
    const lines: CartLine[] = [
      { eventId: 'missing', tierId: 't1', quantity: 1 },
      { eventId: 'e1', tierId: 'missing', quantity: 1 },
    ]
    expect(resolveLines(lines, [event])).toEqual([])
  })
})

describe('computeTotals', () => {
  it('is all zeros for an empty cart', () => {
    const totals = computeTotals([])
    expect(totals).toEqual({
      subtotal: 0,
      serviceFees: 0,
      orderFee: 0,
      total: 0,
      ticketCount: 0,
    })
  })

  it('adds service fees and one flat order fee', () => {
    const resolved = resolveLines([{ eventId: 'e1', tierId: 't1', quantity: 2 }], [event])
    const totals = computeTotals(resolved)
    expect(totals.subtotal).toBe(200)
    expect(totals.serviceFees).toBe(30.4)
    expect(totals.orderFee).toBe(ORDER_FEE)
    expect(totals.total).toBe(235.35)
    expect(totals.ticketCount).toBe(2)
  })

  it('charges the order fee once across multiple lines', () => {
    const resolved = resolveLines(
      [
        { eventId: 'e1', tierId: 't1', quantity: 1 },
        { eventId: 'e1', tierId: 't2', quantity: 1 },
      ],
      [event],
    )
    expect(computeTotals(resolved).orderFee).toBe(ORDER_FEE)
  })
})

describe('countTickets', () => {
  it('sums quantities across lines', () => {
    expect(
      countTickets([
        { eventId: 'e1', tierId: 't1', quantity: 2 },
        { eventId: 'e1', tierId: 't2', quantity: 3 },
      ]),
    ).toBe(5)
  })
})
