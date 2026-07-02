'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function handleLogout() {
    setBusy(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={busy}
      className="flex w-full items-center gap-2.5 rounded-xl border-0 px-3 py-2.5 max-lg:min-h-11 text-[13px] font-medium transition-colors duration-200 cursor-pointer"
      style={{
        background: busy ? 'rgba(255,79,216,0.06)' : 'transparent',
        color: 'rgba(255,79,216,0.7)',
        border: '1px solid transparent',
      }}
      onMouseEnter={e => {
        if (!busy) {
          ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,79,216,0.08)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,79,216,0.2)'
        }
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      {busy ? 'Гарч байна...' : 'Гарах'}
    </button>
  )
}
