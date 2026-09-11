import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon } from './icons'

type Props = {
  size?: 'sm' | 'lg'
  initialValue?: string
  placeholder?: string
}

export function SearchBar({
  size = 'sm',
  initialValue = '',
  placeholder = 'Search events, artists, teams and venues',
}: Props) {
  const [value, setValue] = useState(initialValue)
  const navigate = useNavigate()

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const q = value.trim()
    navigate(q ? `/browse?q=${encodeURIComponent(q)}` : '/browse')
  }

  return (
    <form className={size === 'lg' ? 'search search--lg' : 'search'} onSubmit={onSubmit} role="search">
      <SearchIcon size={size === 'lg' ? 20 : 18} />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search events"
      />
      {size === 'lg' && (
        <button className="search__go" type="submit">
          Search
        </button>
      )}
    </form>
  )
}
