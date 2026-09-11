import { Link, NavLink, useSearchParams } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { CartIcon, TicketIcon, UserIcon } from './icons'
import { useCart } from '../context/CartContext'
import { CATEGORY_LABELS } from '../lib/events'
import type { Category } from '../lib/types'

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]

export function Header() {
  const { ticketCount } = useCart()
  const [params] = useSearchParams()
  const activeCategory = params.get('category')

  return (
    <header className="header">
      <div className="wrap header__bar">
        <Link className="logo" to="/">
          <span className="logo__mark">
            <TicketIcon size={18} />
          </span>
          Tixly
        </Link>

        <div className="header__search">
          <SearchBar />
        </div>

        <div className="header__actions">
          <button className="iconbtn" type="button">
            <UserIcon />
            <span>Sign in</span>
          </button>
          <Link className="iconbtn" to="/cart">
            <CartIcon />
            <span>Cart</span>
            {ticketCount > 0 && <span className="iconbtn__badge">{ticketCount}</span>}
          </Link>
        </div>
      </div>

      <nav className="header__nav" aria-label="Event categories">
        <div className="wrap">
          <NavLink
            className={({ isActive }) =>
              isActive && !activeCategory ? 'navlink navlink--active' : 'navlink'
            }
            to="/browse"
            end
          >
            All Events
          </NavLink>
          {CATEGORIES.map((category) => (
            <NavLink
              key={category}
              className={activeCategory === category ? 'navlink navlink--active' : 'navlink'}
              to={`/browse?category=${category}`}
            >
              {CATEGORY_LABELS[category]}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
