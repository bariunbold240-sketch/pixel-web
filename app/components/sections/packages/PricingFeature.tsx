'use client'

import { Check, Minus } from 'lucide-react'

interface PricingFeatureProps {
  label: string
  value: string
  featured: boolean
}

export default function PricingFeature({ label, value, featured }: PricingFeatureProps) {
  const included = value !== '—'

  return (
    // Mobile (<768px): single-column full-width — labels wrap to 2 lines instead
    // of truncating, rows are 14px, values right-aligned with a min-width so the
    // numbers line up vertically, inactive rows at 40% opacity. Desktop keeps its
    // original truncating single-line layout untouched (md:/lg: overrides).
    <li className={`flex items-center max-md:items-start justify-between gap-1 max-md:gap-3 text-[14px] md:text-[13px] lg:text-[15px] ${included ? '' : 'max-md:opacity-40'}`}>
      <span className={`flex items-center max-md:items-start gap-1.5 min-w-0 ${included ? 'text-mute/80' : 'text-mute/25 max-md:text-mute/90'}`}>
        <span
          className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center max-md:mt-0.5"
          style={{
            background: included
              ? (featured ? 'rgba(111,99,255,0.32)' : 'rgba(184,194,221,0.1)')
              : 'rgba(184,194,221,0.05)',
            boxShadow: included && featured ? '0 0 8px rgba(111,99,255,0.5)' : 'none',
          }}
        >
          {included
            ? <Check size={10} strokeWidth={3} color={featured ? '#9d94ff' : '#b8c2dd'} />
            : <Minus size={10} strokeWidth={2.5} color="rgba(184,194,221,0.25)" />}
        </span>
        <span className="md:truncate">{label}</span>
      </span>
      <span
        className={`shrink-0 font-bold text-[14px] md:text-[13px] lg:text-[15px] ml-1 max-md:tabular-nums max-md:text-right min-w-9 md:min-w-0 ${included ? '' : 'text-mute/20 max-md:text-mute/90'}`}
        style={included ? { color: featured ? '#ff4fd8' : '#f7f9ff' } : undefined}
      >
        {value}
      </span>
    </li>
  )
}
