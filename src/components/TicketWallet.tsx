import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { PassArt } from './PassArt'
import type { HeldTicket } from '../lib/types'

type Props = { tickets: HeldTicket[] }

/** One ticket per page, swiped horizontally — the way a phone wallet works. */
export function TicketWallet({ tickets }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const goTo = useCallback((next: number) => {
    const el = scroller.current
    if (!el) return
    const clamped = Math.min(Math.max(next, 0), tickets.length - 1)
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
  }, [tickets.length])

  // Track the page the user has swiped to, without fighting the native scroll.
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    let frame = 0
    function onScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!el || el.clientWidth === 0) return
        setIndex(Math.round(el.scrollLeft / el.clientWidth))
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('scroll', onScroll)
    }
  }, [])

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(index + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(index - 1)
    }
  }

  const current = tickets[index]

  return (
    <div className="wallet">
      <div
        className="wallet__track"
        ref={scroller}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Your tickets"
        onKeyDown={onKeyDown}
      >
        {tickets.map((ticket, i) => (
          <div
            className="wallet__page"
            key={ticket.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`Ticket ${i + 1} of ${tickets.length}, seat ${ticket.seat}`}
          >
            <div className="wallet__ticket">
              {ticket.image ? (
                <img
                  src={ticket.image}
                  alt={`${ticket.eventName} — Section ${ticket.section}, Row ${ticket.row}, Seat ${ticket.seat}`}
                  draggable={false}
                />
              ) : (
                <div className="wallet__fallback">
                  <PassArt seed={ticket.artwork} label={ticket.eventName} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="wallet__bar">
        <button
          className="wallet__arrow"
          type="button"
          aria-label="Previous ticket"
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
        >
          ‹
        </button>

        <div className="wallet__status">
          <div className="wallet__count">
            Ticket {index + 1} of {tickets.length}
          </div>
          {current && (
            <div className="wallet__seat">
              Sec {current.section} · Row {current.row} · Seat {current.seat}
            </div>
          )}
        </div>

        <button
          className="wallet__arrow"
          type="button"
          aria-label="Next ticket"
          disabled={index === tickets.length - 1}
          onClick={() => goTo(index + 1)}
        >
          ›
        </button>
      </div>

      <div className="wallet__dots">
        {tickets.map((ticket, i) => (
          <button
            key={ticket.id}
            type="button"
            className={i === index ? 'wallet__dot wallet__dot--on' : 'wallet__dot'}
            aria-label={`Go to ticket ${i + 1}, seat ${ticket.seat}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}
