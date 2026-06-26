'use client'

import { useState } from 'react'

const SECTIONS = ['Профайл', 'Аюулгүй байдал', 'Мэдэгдэл', 'Дүр төрх'] as const
type Section = typeof SECTIONS[number]

export default function SettingsPage() {
  const [active, setActive] = useState<Section>('Профайл')
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(184,194,221,0.4)' }}>
          Систем
        </p>
        <h1 className="text-[28px] font-black text-pxwhite tracking-tight">Тохиргоо</h1>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="flex flex-col gap-1 w-44 shrink-0">
          {SECTIONS.map((s) => (
            <button key={s} onClick={() => setActive(s)}
              className="text-left px-4 py-2.5 rounded-xl text-[13px] font-medium border-0 cursor-pointer transition-all duration-150"
              style={
                active === s
                  ? { background: 'rgba(111,99,255,0.18)', color: '#f7f9ff', border: '1px solid rgba(111,99,255,0.3)' }
                  : { background: 'transparent', color: 'rgba(184,194,221,0.5)', border: '1px solid transparent' }
              }>
              {s}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(111,99,255,0.15)' }}>
          {active === 'Профайл' && (
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <h2 className="text-[16px] font-black text-pxwhite">Профайл мэдээлэл</h2>
              {[
                { label: 'Нэр',    placeholder: 'Таны нэр' },
                { label: 'И-мэйл', placeholder: 'name@example.com' },
                { label: 'Утас',   placeholder: '+976 9900 0000' },
              ].map((f) => (
                <div key={f.label} className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
                    {f.label}
                  </label>
                  <input type="text" placeholder={f.placeholder}
                    className="rounded-xl px-4 py-3 text-[14px] text-pxwhite placeholder-mute/30 outline-none max-w-sm"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(111,99,255,0.2)' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(111,99,255,0.55)')}
                    onBlur={e  => (e.target.style.borderColor = 'rgba(111,99,255,0.2)')}
                  />
                </div>
              ))}
              <div className="flex items-center gap-3 mt-2">
                <button type="submit"
                  className="px-6 py-2.5 rounded-xl text-[13px] font-bold border-0 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', color: '#fff' }}>
                  Хадгалах
                </button>
                {saved && (
                  <span className="text-[12px] font-bold" style={{ color: '#15a59a' }}>✓ Хадгалагдлаа</span>
                )}
              </div>
            </form>
          )}

          {active !== 'Профайл' && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(111,99,255,0.12)', border: '1px solid rgba(111,99,255,0.2)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6f63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="text-[14px] font-bold text-pxwhite">{active}</p>
              <p className="text-[12px]" style={{ color: 'rgba(184,194,221,0.4)' }}>Удахгүй нэмэгдэнэ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
