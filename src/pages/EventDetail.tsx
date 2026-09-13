import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Artwork } from '../components/Artwork'
import { CalendarIcon, ClockIcon, PinIcon } from '../components/icons'
import { EVENTS } from '../data/events'
import { useCart } from '../context/CartContext'
import { MAX_PER_ORDER, ORDER_FEE, SERVICE_FEE_RATE } from '../lib/cart'
import {
  CATEGORY_LABELS,
  formatEventDate,
  formatEventTime,
  formatPrice,
} from '../lib/events'

export function EventDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { add } = useCart()
  const event = EVENTS.find((e) => e.slug === slug)

  const [quantities, setQuantities] = useState<Record<string, number>>({})

  if (!event) {
    return (
      <div className="wrap page">
        <div className="empty">
          <strong>We couldn't find that event</strong>
          It may have ended or been rescheduled. <Link to="/browse">Browse all events</Link>.
        </div>
      </div>
    )
  }

  function quantityFor(tierId: string): number {
    return quantities[tierId] ?? 0
  }

  function step(tierId: string, delta: number, available: number) {
    setQuantities((current) => {
      const ceiling = Math.min(available, MAX_PER_ORDER)
      const next = Math.min(Math.max((current[tierId] ?? 0) + delta, 0), ceiling)
      return { ...current, [tierId]: next }
    })
  }

  const selected = event.tiers
    .map((tier) => ({ tier, quantity: quantityFor(tier.id) }))
    .filter((row) => row.quantity > 0)

  const subtotal = selected.reduce((sum, row) => sum + row.tier.price * row.quantity, 0)
  const ticketCount = selected.reduce((sum, row) => sum + row.quantity, 0)
  const fees = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100
  const total = ticketCount > 0 ? Math.round((subtotal + fees + ORDER_FEE) * 100) / 100 : 0

  function addToCart() {
    for (const row of selected) {
      add(event!.id, row.tier.id, row.quantity, row.tier.available)
    }
    navigate('/cart')
  }

  return (
    <>
      <section className="detail__hero">
        <div className="detail__art">
          <Artwork seed={event.artwork} label={event.name} />
        </div>
        <div className="detail__scrim" />
        <div className="wrap detail__inner">
          <div className="crumbs">
            <Link to="/">Home</Link> ›{' '}
            <Link to={`/browse?category=${event.category}`}>{CATEGORY_LABELS[event.category]}</Link> ›{' '}
            {event.name}
          </div>
          <h1>{event.name}</h1>
          <p className="tagline">{event.tagline}</p>
          <div className="detail__facts">
            <div>
              <CalendarIcon />
              {formatEventDate(event.date)}
            </div>
            <div>
              <ClockIcon />
              {formatEventTime(event.date)}
            </div>
            <div>
              <PinIcon />
              {event.venue} — {event.city}, {event.state}
            </div>
          </div>
        </div>
      </section>

      <div className="wrap detail__body">
        <div>
          <div className="panel">
            <h2>Select tickets</h2>
            <p className="hint">
              Prices are per ticket and exclude fees. Limit {MAX_PER_ORDER} tickets per order.
            </p>

            {event.tiers.map((tier) => (
              <div className="tier" key={tier.id}>
                <div className="tier__info">
                  <div className="tier__name">{tier.name}</div>
                  <div className="tier__desc">{tier.description}</div>
                  {tier.available <= 20 && (
                    <div className="tier__left">Only {tier.available} left at this price</div>
                  )}
                </div>
                <div className="tier__price">
                  {formatPrice(tier.price)}
                  <small>each</small>
                </div>
                <div className="stepper">
                  <button
                    type="button"
                    aria-label={`Remove one ${tier.name} ticket`}
                    disabled={quantityFor(tier.id) === 0}
                    onClick={() => step(tier.id, -1, tier.available)}
                  >
                    −
                  </button>
                  <span aria-live="polite">{quantityFor(tier.id)}</span>
                  <button
                    type="button"
                    aria-label={`Add one ${tier.name} ticket`}
                    disabled={quantityFor(tier.id) >= Math.min(tier.available, MAX_PER_ORDER)}
                    onClick={() => step(tier.id, 1, tier.available)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="panel">
            <h2>Where you'll sit</h2>
            <p className="hint">A simplified view of {event.venue}.</p>
            <div className="seatmap">
              <div className="seatmap__stage">STAGE</div>
              <div className="seatmap__ring">
                {event.tiers.map((tier, i) => (
                  <div
                    key={tier.id}
                    className="seatmap__block"
                    style={{ background: ['#1d4ed8', '#7c3aed', '#0f766e', '#b45309'][i % 4] }}
                  >
                    {tier.name}
                  </div>
                ))}
              </div>
              <div className="seatmap__ring">
                {['A', 'B', 'C', 'D', 'E', 'F'].map((block) => (
                  <div key={block} className="seatmap__block" style={{ background: '#475569' }}>
                    {block}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <h2>Event info</h2>
            <p className="hint" style={{ marginBottom: 0 }}>
              Doors open one hour before showtime. Tickets are delivered to your Tixly account
              immediately after checkout and can be transferred to friends. All sales in this demo
              are simulated — no payment is taken and no real tickets are issued.
            </p>
          </div>
        </div>

        <aside className="aside">
          <div className="panel">
            <div className="aside__art">
              <Artwork seed={event.artwork} label={event.name} />
            </div>
            <h2 style={{ fontSize: 17 }}>Order summary</h2>

            {selected.length === 0 ? (
              <p className="hint" style={{ marginTop: 8, marginBottom: 16 }}>
                Choose a ticket type to see your total.
              </p>
            ) : (
              <div style={{ margin: '12px 0' }}>
                {selected.map((row) => (
                  <div className="summary__row" key={row.tier.id}>
                    <span>
                      {row.quantity} × {row.tier.name}
                    </span>
                    <span>{formatPrice(row.tier.price * row.quantity)}</span>
                  </div>
                ))}
                <div className="summary__row">
                  <span>Service fees</span>
                  <span>{formatPrice(fees)}</span>
                </div>
                <div className="summary__row">
                  <span>Order processing</span>
                  <span>{formatPrice(ORDER_FEE)}</span>
                </div>
                <div className="summary__row summary__row--total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            )}

            <button
              className="btn btn--accent btn--block"
              type="button"
              disabled={ticketCount === 0}
              onClick={addToCart}
            >
              {ticketCount === 0
                ? 'Select tickets'
                : `Add ${ticketCount} ticket${ticketCount === 1 ? '' : 's'} to cart`}
            </button>
            <p className="summary__note">
              Fees shown are estimates for this demo. You won't be charged.
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}
