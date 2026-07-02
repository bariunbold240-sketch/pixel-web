'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Алдаа гарлаа. Дахин оролдоно уу.')
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setError('Сүлжээний алдаа. Дахин оролдоно уу.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(111,99,255,0.2)',
  }

  return (
    <div
      className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
      style={{ border: '1px solid rgba(111,99,255,0.2)' }}
    >
      {/* Header */}
      <div className="text-center">
        <div
          className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center text-[13px] font-black text-white"
          style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)' }}
        >
          PX
        </div>
        <h1 className="text-[22px] font-black text-pxwhite tracking-tight">Нэвтрэх</h1>
        <p className="text-[13px] text-mute mt-1">Admin панел</p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-xl px-4 py-3 text-[13px] font-medium"
          style={{ background: 'rgba(255,79,100,0.1)', border: '1px solid rgba(255,79,100,0.25)', color: '#ff6b7a' }}
        >
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
            И-мэйл
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@pixel.mn"
            required
            autoComplete="email"
            className="rounded-xl px-4 py-3 max-md:min-h-12 text-[14px] text-pxwhite placeholder-mute/30 outline-none"
            style={inputStyle}
            onFocus={e  => (e.target.style.borderColor = 'rgba(111,99,255,0.55)')}
            onBlur={e   => (e.target.style.borderColor = 'rgba(111,99,255,0.2)')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
            Нууц үг
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="rounded-xl px-4 py-3 max-md:min-h-12 text-[14px] text-pxwhite placeholder-mute/30 outline-none"
            style={inputStyle}
            onFocus={e  => (e.target.style.borderColor = 'rgba(111,99,255,0.55)')}
            onBlur={e   => (e.target.style.borderColor = 'rgba(111,99,255,0.2)')}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 max-md:min-h-12 rounded-xl text-[13px] font-bold uppercase tracking-wider border-0 cursor-pointer transition-opacity duration-200 mt-1"
          style={{
            background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)',
            color: '#fff',
            boxShadow: '0 8px 28px rgba(111,99,255,0.3)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх →'}
        </button>
      </form>
    </div>
  )
}
