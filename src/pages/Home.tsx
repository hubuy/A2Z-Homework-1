import { Link } from 'react-router-dom'
import { EventCard } from '../components/EventCard'
import { SearchBar } from '../components/SearchBar'
import { EVENTS } from '../data/events'
import { CATEGORY_LABELS, sortEvents } from '../lib/events'
import type { Category } from '../lib/types'

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]

export function Home() {
  const upcoming = sortEvents(EVENTS, 'date')
  const featured = upcoming.filter((e) => e.featured).slice(0, 4)
  const justAnnounced = upcoming.filter((e) => e.justAnnounced).slice(0, 4)
  const thisWeekend = upcoming.slice(0, 8)

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>
            Find your next night out.
          </h1>
          <p>
            Concerts, sports, theater and comedy — thousands of events, one checkout. Search by
            artist, team, venue or city.
          </p>
          <div className="hero__search">
            <SearchBar size="lg" />
          </div>
          <div className="hero__chips">
            {CATEGORIES.map((category) => (
              <Link key={category} className="chip" to={`/browse?category=${category}`}>
                {CATEGORY_LABELS[category]}
              </Link>
            ))}
            <Link className="chip" to="/browse?sort=price">
              Under $50
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <h2>Featured events</h2>
            <Link to="/browse">See all events</Link>
          </div>
          <div className="grid">
            {featured.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <div className="section__head">
            <h2>Just announced</h2>
            <Link to="/browse">Browse more</Link>
          </div>
          <div className="grid">
            {justAnnounced.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <h2>Coming up soon</h2>
            <Link to="/browse?sort=date">See the calendar</Link>
          </div>
          <div className="grid">
            {thisWeekend.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
