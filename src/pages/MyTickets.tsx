import { Link } from 'react-router-dom'
import { PassArt } from '../components/PassArt'
import { CalendarIcon, ClockIcon, PinIcon, TicketIcon } from '../components/icons'
import { MY_TICKETS } from '../data/tickets'
import { formatEventDate, formatEventTime } from '../lib/events'
import { formatSeatRange, groupTickets, relativeDay, ticketStatus } from '../lib/tickets'

function shortDate(iso: string): string {
  const d = new Date(iso)
  return `${d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()} ${d.getDate()}`
}

export function MyTickets() {
  const groups = groupTickets(MY_TICKETS)

  if (groups.length === 0) {
    return (
      <div className="wrap page">
        <h1>My tickets</h1>
        <div className="empty" style={{ marginTop: 20 }}>
          <strong>No tickets yet</strong>
          Tickets you buy will appear here, ready to scan at the gate.
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
      <h1>My tickets</h1>
      <p className="lede">
        {MY_TICKETS.length} {MY_TICKETS.length === 1 ? 'ticket' : 'tickets'} across{' '}
        {groups.length} {groups.length === 1 ? 'event' : 'events'}.
      </p>

      {groups.map((group) => {
        const status = ticketStatus(group.date)
        return (
          <section className="holding" key={group.key}>
            <header className="holding__head">
              <div>
                <h2>{group.eventName}</h2>
                <div className="holding__meta">
                  <span>
                    <CalendarIcon />
                    {formatEventDate(group.date)}
                  </span>
                  <span>
                    <ClockIcon />
                    {formatEventTime(group.date)}
                  </span>
                  <span>
                    <PinIcon />
                    {group.venue}
                  </span>
                </div>
                <div className="holding__complex">{group.complex}</div>
              </div>
              <div className="holding__status">
                <span className={`pill pill--${status}`}>{relativeDay(group.date)}</span>
                <span className="holding__seats">
                  Sec {group.section} · Row {group.row} · {formatSeatRange(group.tickets)}
                </span>
              </div>
            </header>

            <div className="passes">
              {group.tickets.map((ticket) => (
                <article className="pass" key={ticket.id}>
                  <div className="pass__top">
                    <div className="pass__head">
                      <span className="pass__event">{ticket.eventName.replace(/^.*— /, '')}</span>
                      <span className="pass__when">
                        {shortDate(ticket.date)}
                        <small>{formatEventTime(ticket.date)}</small>
                      </span>
                    </div>
                    <div className="pass__mark">
                      <TicketIcon size={26} />
                      <span>Tixly</span>
                    </div>
                    <div className="pass__session">{ticket.session}</div>
                  </div>

                  <div className="pass__art">
                    <PassArt seed={ticket.artwork} label={ticket.eventName} />
                  </div>

                  <div className="pass__seat">
                    <div className="pass__gate">
                      <span>Enter</span>
                      {ticket.gate}
                    </div>
                    <dl className="pass__grid">
                      <div>
                        <dt>Sec</dt>
                        <dd>{ticket.section}</dd>
                      </div>
                      <div>
                        <dt>Row</dt>
                        <dd>{ticket.row}</dd>
                      </div>
                      <div>
                        <dt>Seat</dt>
                        <dd>{ticket.seat}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="pass__foot">
                    <div className="pass__fine">
                      <div>{ticket.ticketType}</div>
                      <div>{ticket.venue}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="holding__actions">
              <button className="btn btn--ghost" type="button">
                Transfer tickets
              </button>
              <button className="btn btn--ghost" type="button">
                Add to wallet
              </button>
            </div>
            <p className="holding__note">
              Sample passes seeded into this demo. They carry no barcode and are not valid for
              entry.
            </p>
          </section>
        )
      })}
    </div>
  )
}
