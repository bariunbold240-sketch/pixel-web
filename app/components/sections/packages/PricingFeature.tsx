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
    <li className="flex items-center justify-between gap-1 text-[12px] md:text-[13px] lg:text-[15px]">
      <span className={`flex items-center gap-1.5 min-w-0 ${included ? 'text-mute/80' : 'text-mute/25'}`}>
        <span
          className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
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
        <span className="truncate">{label}</span>
      </span>
      <span
        className="shrink-0 font-bold text-[12px] md:text-[13px] lg:text-[15px] ml-1"
        style={{ color: included ? (featured ? '#ff4fd8' : '#f7f9ff') : 'rgba(184,194,221,0.2)' }}
      >
        {value}
      </span>
    </li>
  )
}
