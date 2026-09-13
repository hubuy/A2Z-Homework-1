import { Link } from 'react-router-dom'
import { Artwork } from './Artwork'
import { dateBadge, formatEventDate, formatEventTime, formatPrice, lowestPrice } from '../lib/events'
import type { Event } from '../lib/types'

export function EventCard({ event }: { event: Event }) {
  const badge = dateBadge(event.date)

  return (
    <Link className="card" to={`/events/${event.slug}`}>
      <div className="card__art">
        <Artwork seed={event.artwork} label={event.name} />
        <div className="card__badge">
          <span className="m">{badge.month}</span>
          <span className="d">{badge.day}</span>
        </div>
        {event.justAnnounced && <div className="card__flag">Just announced</div>}
      </div>
      <div className="card__body">
        <h3 className="card__title">{event.name}</h3>
        <p className="card__tagline">{event.tagline}</p>
        <div className="card__meta">
          {formatEventDate(event.date)} · {formatEventTime(event.date)}
          <br />
          {event.venue} — {event.city}, {event.state}
        </div>
        <div className="card__foot">
          <span className="card__price">
            <span>From </span>
            {formatPrice(lowestPrice(event))}
          </span>
          <span className="btn btn--ghost" style={{ padding: '7px 13px', fontSize: 13 }}>
            Tickets
          </span>
        </div>
      </div>
    </Link>
  )
}
