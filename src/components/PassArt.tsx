/**
 * Artwork band for a ticket pass: concentric arcs radiating from a court at
 * the base. Generated from the seed so each event reads differently, with no
 * binary image assets.
 */
const COLORS = [
  '#f4c430', '#e8552d', '#8b5cf6', '#22c1dc',
  '#3fb950', '#ec4899', '#f97316', '#6366f1',
]

const RINGS = [44, 62, 80, 98, 116, 134, 152, 170]
const SEGMENTS = 6

type Props = { seed: number; label?: string }

export function PassArt({ seed, label }: Props) {
  const cx = 160
  const cy = 200
  const arcs: Array<{ d: string; dash: string; offset: number; color: string; width: number }> = []

  RINGS.forEach((r, ring) => {
    const length = Math.PI * r
    const step = length / SEGMENTS
    for (let i = 0; i < SEGMENTS; i += 1) {
      // Vary segment fill so the rings read as broken bands, not solid circles.
      const fraction = 0.55 + (((seed + ring * 3 + i * 5) % 4) * 0.1)
      arcs.push({
        d: `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`,
        dash: `${step * fraction} ${length}`,
        offset: -i * step,
        color: COLORS[(seed + ring * 2 + i * 3) % COLORS.length]!,
        width: ring % 2 === 0 ? 11 : 8,
      })
    }
  })

  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label={label ? `Artwork for ${label}` : 'Ticket artwork'}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <rect width="320" height="200" fill="#0b2560" />
      <g fill="none" strokeLinecap="butt">
        {arcs.map((arc, i) => (
          <path
            key={i}
            d={arc.d}
            stroke={arc.color}
            strokeWidth={arc.width}
            strokeDasharray={arc.dash}
            strokeDashoffset={arc.offset}
            opacity={0.92}
          />
        ))}
      </g>
      {/* Court at the base, the focal point the arcs radiate from. */}
      <g>
        <rect x="112" y="168" width="96" height="34" rx="2" fill="#2f7fd4" />
        <rect x="112" y="168" width="96" height="34" rx="2" fill="none" stroke="#eaf4ff" strokeWidth="1.4" />
        <path d="M160 168v34M124 168v34M196 168v34" stroke="#eaf4ff" strokeWidth="1.1" fill="none" />
        <path d="M112 185h96" stroke="#eaf4ff" strokeWidth="1.1" fill="none" />
      </g>
    </svg>
  )
}
