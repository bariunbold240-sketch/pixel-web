'use client'

import { Home, Eye, Award, Users, Package, Phone, type LucideIcon } from 'lucide-react'
import { N } from '../data'
import { useLang } from '../context/LangContext'
import { T } from '../data/translations'

interface NavDotsProps {
  cur: number
  vizCur?: number  // scroll-based active for mobile (defaults to cur)
  go: (n: number) => void
}

// One icon per section — order matches panelNames / tabShort.
const TAB_ICONS: LucideIcon[] = [Home, Eye, Award, Users, Package, Phone]

export default function NavDots({ cur, vizCur = cur, go }: NavDotsProps) {
  const { lang } = useLang()
  const names = T[lang].panelNames
  const short = T[lang].tabShort

  return (
    <>
      {/* Desktop (≥1024px): vertical dots on right side */}
      <div className="hidden lg:flex fixed right-[clamp(16px,3vw,34px)] top-1/2 -translate-y-1/2 z-40 flex-col gap-3.5">
        {Array.from({ length: N }, (_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`dot-btn w-[11px] h-[11px] rounded-full border border-line bg-transparent cursor-pointer p-0 transition-all duration-300 relative group ${
              cur === i ? 'on' : ''
            }`}
            aria-label={names[i]}
          />
        ))}
      </div>

      {/* Mobile + tablet (<1024px): horizontal bottom nav bar — icon + short
          single-line label per tab so every label fits (the full names wrapped). */}
      <nav
        className="flex lg:hidden fixed bottom-0 left-0 right-0 z-50 items-stretch justify-around px-1"
        style={{
          background: 'rgba(5,5,8,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          minHeight: 60,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {Array.from({ length: N }, (_, i) => {
          const active = vizCur === i  // use scroll-based position for highlight
          const Icon = TAB_ICONS[i] ?? Home
          return (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={names[i]}
              aria-current={active ? 'page' : undefined}
              className="flex-1 min-w-0 flex flex-col items-center justify-center gap-1 cursor-pointer border-0 bg-transparent px-0.5 pt-2 pb-1.5 relative min-h-14
                         transition-transform duration-150 active:scale-90"
            >
              {/* Active indicator line at top */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-b-full transition-all duration-300"
                style={{
                  width: active ? 22 : 0,
                  background: 'linear-gradient(90deg,#6f63ff,#ff4fd8)',
                  boxShadow: active ? '0 0 8px rgba(255,79,216,0.7)' : 'none',
                }}
              />
              {/* Icon */}
              <Icon
                size={19}
                strokeWidth={active ? 2.4 : 1.9}
                color={active ? '#ff4fd8' : 'rgba(184,194,221,0.55)'}
                style={{
                  transition: 'color 0.25s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  transform: active ? 'translateY(-1px) scale(1.08)' : 'none',
                  filter: active ? 'drop-shadow(0 0 6px rgba(255,79,216,0.5))' : 'none',
                }}
              />
              {/* Label — single line, always fits */}
              <span
                className="text-[9px] font-bold uppercase tracking-[0.02em] leading-none whitespace-nowrap transition-colors duration-[250ms]"
                style={{ color: active ? '#ff4fd8' : 'rgba(184,194,221,0.5)' }}
              >
                {short[i]}
              </span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
