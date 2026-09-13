import type { CartLine, Event, TicketTier } from './types'

/** Per-ticket service fee, as a share of face value. */
export const SERVICE_FEE_RATE = 0.152
/** Flat per-order fulfillment fee, in dollars. */
export const ORDER_FEE = 4.95
/** Most tickets one person can buy for a single event. */
export const MAX_PER_ORDER = 8

export type ResolvedLine = CartLine & {
  event: Event
  tier: TicketTier
  subtotal: number
}

export type CartTotals = {
  subtotal: number
  serviceFees: number
  orderFee: number
  total: number
  ticketCount: number
}

export function findTier(event: Event, tierId: string): TicketTier | undefined {
  return event.tiers.find((t) => t.id === tierId)
}

export function resolveLines(lines: CartLine[], events: Event[]): ResolvedLine[] {
  const resolved: ResolvedLine[] = []
  for (const line of lines) {
    const event = events.find((e) => e.id === line.eventId)
    if (!event) continue
    const tier = findTier(event, line.tierId)
    if (!tier) continue
    resolved.push({ ...line, event, tier, subtotal: tier.price * line.quantity })
  }
  return resolved
}

export function computeTotals(lines: ResolvedLine[]): CartTotals {
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0)
  const ticketCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const serviceFees = round2(subtotal * SERVICE_FEE_RATE)
  const orderFee = ticketCount > 0 ? ORDER_FEE : 0
  return {
    subtotal,
    serviceFees,
    orderFee,
    total: round2(subtotal + serviceFees + orderFee),
    ticketCount,
  }
}

/**
 * Adds tickets to the cart, merging with an existing line for the same tier.
 * Quantity is clamped to what the tier has left and to MAX_PER_ORDER.
 */
export function addLine(
  lines: CartLine[],
  next: CartLine,
  tierAvailable: number,
): CartLine[] {
  if (next.quantity <= 0) return lines
  const ceiling = Math.min(tierAvailable, MAX_PER_ORDER)
  const index = lines.findIndex(
    (l) => l.eventId === next.eventId && l.tierId === next.tierId,
  )
  if (index === -1) {
    return [...lines, { ...next, quantity: Math.min(next.quantity, ceiling) }]
  }
  const existing = lines[index]!
  const merged: CartLine = {
    ...existing,
    quantity: Math.min(existing.quantity + next.quantity, ceiling),
  }
  return lines.map((line, i) => (i === index ? merged : line))
}

export function updateQuantity(
  lines: CartLine[],
  eventId: string,
  tierId: string,
  quantity: number,
): CartLine[] {
  if (quantity <= 0) return removeLine(lines, eventId, tierId)
  return lines.map((line) =>
    line.eventId === eventId && line.tierId === tierId ? { ...line, quantity } : line,
  )
}

export function removeLine(lines: CartLine[], eventId: string, tierId: string): CartLine[] {
  return lines.filter((line) => !(line.eventId === eventId && line.tierId === tierId))
}

export function countTickets(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0)
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}
