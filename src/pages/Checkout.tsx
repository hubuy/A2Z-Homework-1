import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatEventDate, formatPrice } from '../lib/events'

function orderReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 8; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return `TX-${out.slice(0, 4)}-${out.slice(4)}`
}

export function Checkout() {
  const { resolved, totals, clear } = useCart()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  if (resolved.length === 0 && !submitting) {
    return <Navigate to="/cart" replace />
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const reference = orderReference()
    const count = totals.ticketCount
    clear()
    navigate('/confirmation', { state: { reference, ticketCount: count, total: totals.total } })
  }

  return (
    <div className="wrap page">
      <h1>Checkout</h1>
      <p className="lede">
        <Link to="/cart">← Back to cart</Link>
      </p>

      <div className="notice">
        This is a demo storefront. Do not enter real card details — the form below is not connected
        to any payment processor and nothing is charged.
      </div>

      <form className="cols" onSubmit={onSubmit}>
        <div>
          <div className="panel">
            <fieldset className="fieldset">
              <legend>Contact</legend>
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email for ticket delivery</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>
            </fieldset>
          </div>

          <div className="panel">
            <fieldset className="fieldset">
              <legend>Payment</legend>
              <div className="field">
                <label htmlFor="card">Card number</label>
                <input id="card" name="card" inputMode="numeric" placeholder="4242 4242 4242 4242" required />
              </div>
              <div className="field__row">
                <div className="field">
                  <label htmlFor="expiry">Expiry</label>
                  <input id="expiry" name="expiry" placeholder="MM / YY" required />
                </div>
                <div className="field">
                  <label htmlFor="cvc">Security code</label>
                  <input id="cvc" name="cvc" inputMode="numeric" placeholder="123" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="zip">Billing ZIP</label>
                <input id="zip" name="zip" inputMode="numeric" placeholder="60601" required />
              </div>
            </fieldset>
          </div>

          <div className="panel">
            <fieldset className="fieldset">
              <legend>Delivery</legend>
              <div className="field">
                <label htmlFor="delivery">Method</label>
                <select id="delivery" name="delivery" defaultValue="mobile">
                  <option value="mobile">Mobile tickets — free</option>
                  <option value="print">Print at home — free</option>
                  <option value="willcall">Will call at the box office</option>
                </select>
              </div>
            </fieldset>
          </div>
        </div>

        <aside className="panel aside">
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Your order</h2>
          {resolved.map((line) => (
            <div className="summary__row" key={`${line.eventId}-${line.tierId}`}>
              <span>
                {line.quantity} × {line.event.name}
                <br />
                <span style={{ color: 'var(--muted)', fontSize: 12.5 }}>
                  {line.tier.name} · {formatEventDate(line.event.date)}
                </span>
              </span>
              <span>{formatPrice(line.subtotal)}</span>
            </div>
          ))}
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
            <button className="btn btn--accent btn--block" type="submit" disabled={submitting}>
              Place order
            </button>
          </div>
          <p className="summary__note">
            By placing this simulated order you agree to nothing at all. No payment is processed.
          </p>
        </aside>
      </form>
    </div>
  )
}
