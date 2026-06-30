'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    href: '/dashboard',
    label: 'Хянах самбар',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/projects',
    label: 'Төслүүд',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: '/settings',
    label: 'Тохиргоо',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
] as const

function NavItemLink({
  item,
  active,
}: {
  item: (typeof NAV)[number]
  active: boolean
}) {
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className="flex min-w-[132px] shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-[12px] font-semibold no-underline transition-all duration-200"
      style={
        active
          ? {
              background: 'linear-gradient(135deg,rgba(111,99,255,0.2),rgba(255,79,216,0.12))',
              color: '#f7f9ff',
              borderColor: 'rgba(111,99,255,0.35)',
              boxShadow: '0 6px 18px rgba(111,99,255,0.14)',
            }
          : {
              background: 'rgba(255,255,255,0.02)',
              color: 'rgba(184,194,221,0.58)',
              borderColor: 'rgba(111,99,255,0.12)',
            }
      }
    >
      <span style={{ color: active ? '#6f63ff' : 'rgba(184,194,221,0.4)' }}>{item.icon}</span>
      <span className="truncate leading-none">{item.label}</span>
    </Link>
  )
}

export default function MobileDashboardNav() {
  const pathname = usePathname()

  return (
    <div
      className="relative z-30 border-b lg:hidden"
      style={{ background: 'rgba(5,5,13,0.98)', borderColor: 'rgba(111,99,255,0.15)' }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-white"
            style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)' }}
          >
            PX
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: 'rgba(184,194,221,0.34)' }}>
              Dashboard
            </p>
            <p className="truncate text-[13px] font-black uppercase tracking-widest text-pxwhite">
              PIXEL
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="rounded-lg border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] no-underline"
          style={{ color: 'rgba(184,194,221,0.62)', borderColor: 'rgba(111,99,255,0.18)' }}
        >
          Нүүр
        </Link>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
        {NAV.map((item) => {
          const active = pathname === item.href
          return <NavItemLink key={item.href} item={item} active={active} />
        })}
      </nav>
    </div>
  )
}
