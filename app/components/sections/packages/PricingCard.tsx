'use client'

import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'
import PricingFeature from './PricingFeature'
import type { PackagePlan } from '../../../data/siteContent'

interface PricingCardProps {
  plan: PackagePlan
  globalIndex: number
  Icon: LucideIcon
  badgeLabel: string
}

// GSAP's useSectionAnim already handles entrance (fade-up + stagger via
// [data-anim]) for the whole site — kept here rather than duplicated with
// Framer Motion, since both would otherwise fight over this element's
// transform/opacity. `data-no-hover` opts the card out of useSectionAnim's
// generic hover handler; the richer lift/scale/glow hover below is plain
// CSS transitions instead, which never conflicts with GSAP's one-shot
// entrance write. Framer Motion is still used for the featured badge's
// float and the toggle's sliding pill, which are separate, unanimated-by-
// GSAP elements.
export default function PricingCard({ plan, globalIndex, Icon, badgeLabel }: PricingCardProps) {
  const isFeatured = !!plan.featured

  return (
    // Outer wrapper has NO overflow-hidden — the featured badge sits in this layer,
    // positioned above the card's top edge (-top-3), so it isn't clipped by the
    // inner card's rounded-corner overflow-hidden.
    <div
      data-anim
      data-card
      data-no-hover
      className={`group relative cursor-default w-full md:w-auto h-full
                transition-transform duration-300 ease-out md:hover:-translate-y-2 active:scale-[0.985]
                ${isFeatured ? 'md:scale-[1.03] md:hover:scale-[1.045] max-md:mt-4' : 'md:hover:scale-[1.02]'}`}
    >
      {isFeatured && (
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider whitespace-nowrap"
          style={{ background: 'linear-gradient(90deg,#6f63ff,#ff4fd8)', color: '#fff', boxShadow: '0 4px 16px rgba(111,99,255,0.5)' }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {badgeLabel}
        </motion.div>
      )}

      <div
        className="relative flex flex-col overflow-hidden rounded-[24px] h-full"
        style={{
          background: isFeatured
            ? 'linear-gradient(180deg, rgba(111,99,255,0.22) 0%, rgba(18,24,44,0.6) 100%)'
            : 'rgba(18,24,44,0.45)',
          border: isFeatured ? '1px solid rgba(111,99,255,0.55)' : '1px solid rgba(111,99,255,0.16)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          boxShadow: isFeatured
            ? '0 0 50px rgba(111,99,255,0.3), 0 0 90px rgba(255,79,216,0.12), 0 20px 50px rgba(0,0,0,0.5)'
            : '0 12px 32px rgba(0,0,0,0.32)',
        }}
      >
        {/* Animated gradient border sheen for the featured card */}
        {isFeatured && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[24px] pricing-border-flow"
            style={{
              padding: 1,
              background: 'linear-gradient(120deg,#6f63ff,#ff4fd8,#6f63ff)',
              backgroundSize: '200% 200%',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        )}

        <div className="relative z-10 p-4 max-md:p-5 lg:p-5 flex flex-col h-full gap-3.5 max-md:gap-4">
          {/* Top: icon + name + number */}
          <div className="flex items-center justify-between">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: isFeatured ? 'linear-gradient(135deg,#6f63ff,#ff4fd8)' : 'rgba(111,99,255,0.12)',
                boxShadow: isFeatured ? '0 0 16px rgba(111,99,255,0.5)' : 'none',
              }}
            >
              <Icon size={18} strokeWidth={2.2} color={isFeatured ? '#fff' : '#9d94ff'} />
            </div>
            <span
              className="text-[14px] font-mono tabular-nums"
              style={{ color: 'rgba(184,194,221,0.28)', letterSpacing: '0.08em' }}
            >
              {String(globalIndex + 1).padStart(2, '0')}
            </span>
          </div>

          <p className="text-[13px] font-bold tracking-[0.14em] uppercase text-mute/60 -mt-1">
            {plan.name}
          </p>

          {/* Middle: feature list */}
          <ul className="flex flex-col gap-1.5 max-md:gap-2.5 flex-1">
            {plan.features.map((f, j) => (
              <PricingFeature key={j} label={f.label} value={f.value} featured={isFeatured} />
            ))}
          </ul>

          {/* Bottom: price */}
          <div className="flex items-baseline gap-1.5 pt-3 mt-auto" style={{ borderTop: '1px solid rgba(111,99,255,0.14)' }}>
            <span
              className="text-[clamp(18px,1.8vw,24px)] font-black leading-none"
              style={isFeatured
                ? { background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', WebkitBackgroundClip: 'text', color: 'transparent' }
                : { color: '#f7f9ff' }}
            >
              {plan.price || <span className="text-mute/30 text-[13px]">—</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
