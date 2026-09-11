import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="wrap page">
      <div className="empty">
        <strong>Page not found</strong>
        The page you were looking for doesn't exist.
        <div style={{ marginTop: 18 }}>
          <Link className="btn" to="/">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
