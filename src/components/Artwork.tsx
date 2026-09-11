/**
 * Deterministic generated event artwork. Avoids shipping binary images while
 * still giving every event a distinct, stable poster.
 */
const PALETTES: Array<[string, string, string]> = [
  ['#7c3aed', '#2563eb', '#06b6d4'],
  ['#b45309', '#db2777', '#4c1d95'],
  ['#059669', '#0891b2', '#1e3a8a'],
  ['#be123c', '#7c2d12', '#1f2937'],
  ['#d97706', '#dc2626', '#7c3aed'],
  ['#0ea5e9', '#4338ca', '#111827'],
  ['#c026d3', '#4f46e5', '#0f766e'],
  ['#15803d', '#ca8a04', '#78350f'],
  ['#e11d48', '#9333ea', '#1e40af'],
  ['#0f766e', '#115e59', '#134e4a'],
  ['#f59e0b', '#b91c1c', '#111827'],
  ['#2563eb', '#0ea5e9', '#14b8a6'],
]

type Props = {
  /** Index into the palette list; wraps around. */
  seed: number
  /** Short text drawn over the artwork, usually the event name. */
  label?: string
  className?: string
}

export function Artwork({ seed, label, className }: Props) {
  const palette = PALETTES[Math.abs(seed) % PALETTES.length]!
  const [a, b, c] = palette
  const id = `art-${Math.abs(seed) % PALETTES.length}`

  return (
    <svg
      className={className}
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label ? `Artwork for ${label}` : 'Event artwork'}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="55%" stopColor={b} />
          <stop offset="100%" stopColor={c} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.75" cy="0.2" r="0.8">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${id}-bg)`} />
      <rect width="320" height="180" fill={`url(#${id}-glow)`} />
      <g fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.5">
        <circle cx="248" cy="42" r="34" />
        <circle cx="248" cy="42" r="54" />
        <circle cx="248" cy="42" r="76" />
      </g>
      <g fill="#ffffff" fillOpacity="0.16">
        <rect x="-10" y="132" width="70" height="60" transform="skewX(-12)" />
        <rect x="70" y="146" width="48" height="46" transform="skewX(-12)" />
        <rect x="132" y="158" width="120" height="34" transform="skewX(-12)" />
      </g>
    </svg>
  )
}
