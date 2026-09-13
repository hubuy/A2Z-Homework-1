import { Link, Navigate, useLocation } from 'react-router-dom'
import { CheckIcon } from '../components/icons'
import { formatPrice } from '../lib/events'

type ConfirmationState = {
  reference?: string
  ticketCount?: number
  total?: number
}

export function Confirmation() {
  const location = useLocation()
  const state = (location.state ?? {}) as ConfirmationState

  if (!state.reference) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="wrap confirm">
      <div className="confirm__tick">
        <CheckIcon />
      </div>
      <h1>You're going!</h1>
      <p className="lede">
        {state.ticketCount} {state.ticketCount === 1 ? 'ticket is' : 'tickets are'} confirmed.
        {typeof state.total === 'number' && ` Total charged: ${formatPrice(state.total)} (simulated).`}
      </p>
      <div className="confirm__code">{state.reference}</div>
      <p className="lede">
        In a real storefront your tickets would now appear under My Tickets and arrive by email.
        This demo issues no tickets and took no payment.
      </p>
      <Link className="btn" to="/browse">
        Browse more events
      </Link>
    </div>
  )
}
