'use client'

import { motion } from 'framer-motion'

interface PricingToggleProps {
  page: number
  onChange: (p: number) => void
  labels: string[]
}

// Floating segmented control — page switcher for the paginated plan sets.
// Shown on every breakpoint (mobile paginates 4-up too), centered above the cards.
export default function PricingToggle({ page, onChange, labels }: PricingToggleProps) {
  if (labels.length === 0) return null

  return (
    <div
      data-anim
      className="inline-flex mx-auto mt-3 md:mt-0 p-1 rounded-full gap-1 max-w-full"
      style={{ background: 'rgba(111,99,255,0.08)', border: '1px solid rgba(111,99,255,0.18)' }}
    >
      {labels.map((label, p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className="relative px-5 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider cursor-pointer border-0 bg-transparent"
        >
          {page === p && (
            <motion.span
              layoutId="pricing-toggle-pill"
              className="absolute inset-0 rounded-full"
              style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', boxShadow: '0 4px 16px rgba(111,99,255,0.35)' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          )}
          <span
            className="relative z-10 transition-colors duration-200"
            style={{ color: page === p ? '#fff' : 'rgba(184,194,221,0.6)' }}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}
