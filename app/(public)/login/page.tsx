'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="glass-card rounded-2xl p-8 flex flex-col gap-6"
      style={{ border: '1px solid rgba(111,99,255,0.2)' }}>

      {/* Header */}
      <div className="text-center">
        <div className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center text-[13px] font-black text-white"
          style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)' }}>
          PX
        </div>
        <h1 className="text-[22px] font-black text-pxwhite tracking-tight">Нэвтрэх</h1>
        <p className="text-[13px] text-mute mt-1">Тавтай морил!</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
            И-мэйл
          </label>
          <input
            type="email" placeholder="name@example.com" required
            className="rounded-xl px-4 py-3 text-[14px] text-pxwhite placeholder-mute/30 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(111,99,255,0.2)' }}
            onFocus={e => (e.target.style.borderColor = 'rgba(111,99,255,0.55)')}
            onBlur={e  => (e.target.style.borderColor = 'rgba(111,99,255,0.2)')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
              Нууц үг
            </label>
            <Link href="/forgot-password" className="text-[11px] no-underline transition-colors duration-200"
              style={{ color: '#6f63ff' }}>
              Мартсан?
            </Link>
          </div>
          <input
            type="password" placeholder="••••••••" required
            className="rounded-xl px-4 py-3 text-[14px] text-pxwhite placeholder-mute/30 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(111,99,255,0.2)' }}
            onFocus={e => (e.target.style.borderColor = 'rgba(111,99,255,0.55)')}
            onBlur={e  => (e.target.style.borderColor = 'rgba(111,99,255,0.2)')}
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-3 rounded-xl text-[13px] font-bold uppercase tracking-wider border-0 cursor-pointer transition-opacity duration-200 mt-1"
          style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', color: '#fff',
            boxShadow: '0 8px 28px rgba(111,99,255,0.3)', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх →'}
        </button>
      </form>

      <p className="text-center text-[12px]" style={{ color: 'rgba(184,194,221,0.4)' }}>
        Бүртгэлгүй юу?{' '}
        <Link href="/register" className="font-bold no-underline" style={{ color: '#6f63ff' }}>
          Бүртгүүлэх
        </Link>
      </p>
    </div>
  )
}
