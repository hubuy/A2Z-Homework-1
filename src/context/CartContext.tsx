import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  addLine,
  computeTotals,
  countTickets,
  removeLine,
  resolveLines,
  updateQuantity,
  type CartTotals,
  type ResolvedLine,
} from '../lib/cart'
import { EVENTS } from '../data/events'
import type { CartLine } from '../lib/types'

const STORAGE_KEY = 'tixly.cart.v1'

type CartContextValue = {
  lines: CartLine[]
  resolved: ResolvedLine[]
  totals: CartTotals
  ticketCount: number
  add: (eventId: string, tierId: string, quantity: number, available: number) => void
  setQuantity: (eventId: string, tierId: string, quantity: number) => void
  remove: (eventId: string, tierId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readStoredLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (l): l is CartLine =>
        typeof l === 'object' &&
        l !== null &&
        typeof (l as CartLine).eventId === 'string' &&
        typeof (l as CartLine).tierId === 'string' &&
        typeof (l as CartLine).quantity === 'number',
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredLines)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Storage may be unavailable; the cart still works for this session.
    }
  }, [lines])

  const add = useCallback(
    (eventId: string, tierId: string, quantity: number, available: number) => {
      setLines((current) => addLine(current, { eventId, tierId, quantity }, available))
    },
    [],
  )

  const setQuantity = useCallback((eventId: string, tierId: string, quantity: number) => {
    setLines((current) => updateQuantity(current, eventId, tierId, quantity))
  }, [])

  const remove = useCallback((eventId: string, tierId: string) => {
    setLines((current) => removeLine(current, eventId, tierId))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo<CartContextValue>(() => {
    const resolved = resolveLines(lines, EVENTS)
    return {
      lines,
      resolved,
      totals: computeTotals(resolved),
      ticketCount: countTickets(lines),
      add,
      setQuantity,
      remove,
      clear,
    }
  }, [lines, add, setQuantity, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside a CartProvider')
  return ctx
}
