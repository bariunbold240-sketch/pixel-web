'use client'

import { N } from '../data'
import { useLang } from '../context/LangContext'
import { T } from '../data/translations'

interface NavDotsProps {
  cur: number
  vizCur?: number  // scroll-based active for mobile (defaults to cur)
  go: (n: number) => void
}

export default function NavDots({ cur, vizCur = cur, go }: NavDotsProps) {
  const { lang } = useLang()
  const names = T[lang].panelNames

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

      {/* Mobile + tablet (<1024px): horizontal bottom nav bar */}
      <nav
        className="flex lg:hidden fixed bottom-0 left-0 right-0 z-50 items-stretch justify-around"
        style={{
          background: 'rgba(5,5,20,0.94)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(111,99,255,0.14)',
          minHeight: 56,
        }}
      >
        {Array.from({ length: N }, (_, i) => {
          const active = vizCur === i  // use scroll-based position for highlight
          return (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={names[i]}
              className="flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer border-0 bg-transparent py-2 relative"
            >
              {/* Active indicator line at top */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-b-full transition-all duration-300"
                style={{
                  width: active ? 24 : 0,
                  background: 'linear-gradient(90deg,#6f63ff,#ff4fd8)',
                  boxShadow: active ? '0 0 8px rgba(255,79,216,0.7)' : 'none',
                }}
              />
              {/* Dot */}
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width:  active ? 18 : 5,
                  height: 5,
                  borderRadius: active ? 3 : '50%',
                  background: active
                    ? 'linear-gradient(90deg,#6f63ff,#ff4fd8)'
                    : 'rgba(184,194,221,0.22)',
                  boxShadow: active ? '0 0 10px rgba(255,79,216,0.6)' : 'none',
                  transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              />
              {/* Label */}
              <span
                className="text-[7.5px] font-bold uppercase tracking-[0.08em] transition-colors duration-250 leading-none"
                style={{ color: active ? '#ff4fd8' : 'rgba(184,194,221,0.3)' }}
              >
                {names[i]}
              </span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
