'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'

const NAV = [
  {
    href: '/admin/dashboard',
    label: 'Хянах самбар',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/admin/projects',
    label: 'Төслүүд',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: '/admin/gallery',
    label: 'Галерей',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    href: '/admin/icons',
    label: 'Харилцагч Icon',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      </svg>
    ),
  },
  {
    href: '/admin/packages',
    label: 'Багц',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="flex flex-col h-full shrink-0 border-r"
      style={{ width: 240, background: 'rgba(5,5,13,0.98)', borderColor: 'rgba(111,99,255,0.15)' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-16 border-b shrink-0" style={{ borderColor: 'rgba(111,99,255,0.15)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white shrink-0"
          style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)' }}>
          PX
        </div>
        <span className="font-black text-[13px] tracking-widest uppercase text-pxwhite">PIXEL</span>
        <span className="ml-auto rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{ background: 'rgba(111,99,255,0.15)', color: '#6f63ff', border: '1px solid rgba(111,99,255,0.25)' }}>
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 p-3 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-2 mt-1" style={{ color: 'rgba(184,194,221,0.3)' }}>
          Үндсэн
        </p>
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 no-underline"
              style={
                active
                  ? { background: 'linear-gradient(135deg,rgba(111,99,255,0.2),rgba(255,79,216,0.1))', color: '#f7f9ff', border: '1px solid rgba(111,99,255,0.3)' }
                  : { color: 'rgba(184,194,221,0.55)', border: '1px solid transparent' }
              }
            >
              <span style={{ color: active ? '#6f63ff' : 'rgba(184,194,221,0.4)' }}>{item.icon}</span>
              {item.label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)' }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t flex flex-col gap-1" style={{ borderColor: 'rgba(111,99,255,0.15)' }}>
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-colors duration-200 no-underline"
          style={{ color: 'rgba(184,194,221,0.38)', border: '1px solid transparent' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Нүүр хуудас
        </Link>
        <LogoutButton />
      </div>
    </aside>
  )
}
