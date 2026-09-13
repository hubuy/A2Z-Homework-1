type IconProps = { size?: number }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export const SearchIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
)

export const TicketIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M3 9V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a2.5 2.5 0 0 0 0 5v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a2.5 2.5 0 0 0 0-5Z" />
    <path d="M13 6v12" strokeDasharray="2 3" />
  </svg>
)

export const CartIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h2.2l2.1 11.2a1.5 1.5 0 0 0 1.5 1.2h8.9a1.5 1.5 0 0 0 1.5-1.2L20 7H5" />
  </svg>
)

export const UserIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
)

export const PinIcon = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

export const CalendarIcon = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
)

export const ClockIcon = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.3l3.4 2" />
  </svg>
)

export const CheckIcon = ({ size = 30 }: IconProps) => (
  <svg {...base(size)} strokeWidth={2.6}>
    <path d="m5 12.5 4.6 4.6L19 7.5" />
  </svg>
)

/**
 * Wallet glyph for the "add to wallet" action: a card stack tucked into a
 * wallet. Drawn rather than imported so no third-party badge art is bundled.
 */
export const WalletIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden={true}>
    <rect x="6" y="2.5" width="12" height="6" rx="1.5" fill="#f59e0b" />
    <rect x="4.5" y="4.6" width="15" height="6" rx="1.5" fill="#22c55e" />
    <rect x="3" y="6.7" width="18" height="6" rx="1.5" fill="#3b82f6" />
    <rect x="2" y="10" width="20" height="11.5" rx="2.6" fill="#1f2937" />
    <rect x="13.5" y="13.4" width="8.5" height="4.7" rx="1.4" fill="#4b5563" />
    <circle cx="17" cy="15.75" r="1.15" fill="#e5e7eb" />
  </svg>
)
