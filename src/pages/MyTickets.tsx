import { Link } from 'react-router-dom'
import { CalendarIcon, ClockIcon, PinIcon, WalletIcon } from '../components/icons'
import { TicketWallet } from '../components/TicketWallet'
import { MY_TICKETS } from '../data/tickets'
import { formatEventDate, formatEventTime } from '../lib/events'
import { groupTickets, relativeDay, ticketStatus } from '../lib/tickets'

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
    <div className="tickets">
      <h1 className="tickets__title">My tickets</h1>

      {groups.map((group) => (
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
              <span className={`pill pill--${ticketStatus(group.date)}`}>
                {relativeDay(group.date)}
              </span>
            </header>

          <TicketWallet tickets={group.tickets} />

            <div className="holding__actions">
              <button className="btn btn--ghost" type="button">
                Transfer tickets
              </button>
              <button className="btn btn--ghost" type="button">
                <WalletIcon />
                Add to wallet
              </button>
            </div>
            <p className="holding__note">
              Swipe, or use the arrows, to move between tickets. These are sample passes seeded
              into the demo and are not valid for entry.
            </p>
        </section>
      ))}
    </div>
  )
}
