'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'

const NAV = [
  {
    href: '/admin/dashboard',
    label: 'Хянах самбар',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/admin/projects',
    label: 'Төслүүд',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: '/admin/gallery',
    label: 'Галерей',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    href: '/admin/icons',
    label: 'Icon',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      </svg>
    ),
  },
  {
    href: '/admin/packages',
    label: 'Багц',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
] as const

export default function AdminMobileNav() {
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
              Admin
            </p>
            <p className="truncate text-[13px] font-black uppercase tracking-widest text-pxwhite">PIXEL</p>
          </div>
        </div>

        <div className="shrink-0">
          <LogoutButton />
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className="flex min-w-33 min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-[13px] font-semibold no-underline transition-all duration-200"
              style={
                active
                  ? { background: 'linear-gradient(135deg,rgba(111,99,255,0.2),rgba(255,79,216,0.12))', color: '#f7f9ff', borderColor: 'rgba(111,99,255,0.35)', boxShadow: '0 6px 18px rgba(111,99,255,0.14)' }
                  : { background: 'rgba(255,255,255,0.02)', color: 'rgba(184,194,221,0.58)', borderColor: 'rgba(111,99,255,0.12)' }
              }
            >
              <span style={{ color: active ? '#6f63ff' : 'rgba(184,194,221,0.4)' }}>{item.icon}</span>
              <span className="truncate leading-none">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
