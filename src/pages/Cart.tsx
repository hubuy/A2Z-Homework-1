import { Link } from 'react-router-dom'
import { Artwork } from '../components/Artwork'
import { useCart } from '../context/CartContext'
import { MAX_PER_ORDER } from '../lib/cart'
import { formatEventDate, formatEventTime, formatPrice } from '../lib/events'

export function Cart() {
  const { resolved, totals, setQuantity, remove } = useCart()

  if (resolved.length === 0) {
    return (
      <div className="wrap page">
        <h1>Your cart</h1>
        <div className="empty" style={{ marginTop: 20 }}>
          <strong>Your cart is empty</strong>
          Browse events and add tickets to get started.
          <div style={{ marginTop: 18 }}>
            <Link className="btn" to="/browse">
              Find events
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wrap page">
      <h1>Your cart</h1>
      <p className="lede">
        {totals.ticketCount} {totals.ticketCount === 1 ? 'ticket' : 'tickets'} held for the next 10
        minutes.
      </p>

      <div className="cols">
        <div className="panel">
          {resolved.map((line) => {
            const ceiling = Math.min(line.tier.available, MAX_PER_ORDER)
            return (
              <div className="line" key={`${line.eventId}-${line.tierId}`}>
                <div className="line__art">
                  <Artwork seed={line.event.artwork} label={line.event.name} />
                </div>
                <div className="line__info">
                  <div className="line__name">
                    <Link to={`/events/${line.event.slug}`}>{line.event.name}</Link>
                  </div>
                  <div className="line__meta">
                    {formatEventDate(line.event.date)} · {formatEventTime(line.event.date)}
                    <br />
                    {line.event.venue} — {line.event.city}, {line.event.state}
                    <br />
                    {line.tier.name} · {formatPrice(line.tier.price)} each
                  </div>
                </div>
                <div className="line__right">
                  <div className="line__price">{formatPrice(line.subtotal)}</div>
                  <div className="stepper">
                    <button
                      type="button"
                      aria-label={`Remove one ${line.tier.name} ticket for ${line.event.name}`}
                      onClick={() => setQuantity(line.eventId, line.tierId, line.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Add one ${line.tier.name} ticket for ${line.event.name}`}
                      disabled={line.quantity >= ceiling}
                      onClick={() => setQuantity(line.eventId, line.tierId, line.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="linkbtn"
                    type="button"
                    onClick={() => remove(line.eventId, line.tierId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <aside className="panel aside">
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Order summary</h2>
          <div className="summary__row">
            <span>Tickets ({totals.ticketCount})</span>
            <span>{formatPrice(totals.subtotal)}</span>
          </div>
          <div className="summary__row">
            <span>Service fees</span>
            <span>{formatPrice(totals.serviceFees)}</span>
          </div>
          <div className="summary__row">
            <span>Order processing</span>
            <span>{formatPrice(totals.orderFee)}</span>
          </div>
          <div className="summary__row summary__row--total">
            <span>Total</span>
            <span>{formatPrice(totals.total)}</span>
          </div>
          <div style={{ marginTop: 16 }}>
            <Link className="btn btn--accent btn--block" to="/checkout">
              Checkout
            </Link>
          </div>
          <div style={{ marginTop: 10 }}>
            <Link className="btn btn--ghost btn--block" to="/browse">
              Keep browsing
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
