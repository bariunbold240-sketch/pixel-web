'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="glass-card rounded-2xl p-8 flex flex-col gap-6"
      style={{ border: '1px solid rgba(111,99,255,0.2)' }}>

      <div className="text-center">
        <div className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center text-[13px] font-black text-white"
          style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)' }}>
          PX
        </div>
        <h1 className="text-[22px] font-black text-pxwhite tracking-tight">Нууц үг сэргээх</h1>
        <p className="text-[13px] text-mute mt-1">
          {sent ? 'Имэйл илгээгдлээ' : 'Бүртгэлтэй и-мэйлээ оруулна уу'}
        </p>
      </div>

      {sent ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(111,99,255,0.25),rgba(255,79,216,0.2))' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6f63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-[13px] text-mute text-center leading-relaxed">
            Нууц үг сэргээх холбоосыг таны и-мэйл рүү илгээлээ.<br />
            Хэдэн минутын дотор ирнэ.
          </p>
          <Link href="/login" className="text-[13px] font-bold no-underline mt-2" style={{ color: '#6f63ff' }}>
            ← Нэвтрэх хуудас руу
          </Link>
        </div>
      ) : (
        <>
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
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-[13px] font-bold uppercase tracking-wider border-0 cursor-pointer mt-1"
              style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', color: '#fff',
                boxShadow: '0 8px 28px rgba(111,99,255,0.3)' }}>
              Холбоос илгээх →
            </button>
          </form>
          <Link href="/login" className="text-center text-[12px] no-underline" style={{ color: 'rgba(184,194,221,0.4)' }}>
            ← Буцах
          </Link>
        </>
      )}
    </div>
  )
}
