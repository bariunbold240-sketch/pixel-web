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
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:p-8">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(184,194,221,0.4)' }}>
          Систем
        </p>
        <h1 className="text-[24px] font-black tracking-tight text-pxwhite sm:text-[28px]">Тохиргоо</h1>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Sidebar tabs */}
        <div className="flex w-full gap-2 overflow-x-auto pb-1 no-scrollbar lg:w-44 lg:flex-col lg:overflow-visible lg:pb-0">
          {SECTIONS.map((section) => (
            <button
              key={section}
              onClick={() => setActive(section)}
              className="shrink-0 rounded-xl px-4 py-2.5 text-left text-[13px] font-medium transition-all duration-150 lg:w-full"
              style={
                active === section
                  ? { background: 'rgba(111,99,255,0.18)', color: '#f7f9ff', border: '1px solid rgba(111,99,255,0.3)' }
                  : { background: 'transparent', color: 'rgba(184,194,221,0.5)', border: '1px solid transparent' }
              }
            >
              {section}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 glass-card rounded-2xl p-4 sm:p-6" style={{ border: '1px solid rgba(111,99,255,0.15)' }}>
          {active === 'Профайл' && (
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <h2 className="text-[16px] font-black text-pxwhite">Профайл мэдээлэл</h2>
              {[
                { label: 'Нэр',    placeholder: 'Таны нэр' },
                { label: 'И-мэйл', placeholder: 'name@example.com' },
                { label: 'Утас',   placeholder: '+976 9900 0000' },
              ].map((field) => (
                <div key={field.label} className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full max-w-none rounded-xl px-4 py-3 text-[14px] text-pxwhite outline-none placeholder-mute/30 sm:max-w-sm"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(111,99,255,0.2)' }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(111,99,255,0.55)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(111,99,255,0.2)')}
                  />
                </div>
              ))}
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="w-full rounded-xl border-0 px-6 py-2.5 text-[13px] font-bold text-white sm:w-auto"
                  style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)' }}
                >
                  Хадгалах
                </button>
                {saved && (
                  <span className="text-[12px] font-bold" style={{ color: '#15a59a' }}>✓ Хадгалагдлаа</span>
                )}
              </div>
            </form>
          )}

          {active !== 'Профайл' && (
            <div className="flex flex-col items-center justify-center gap-3 py-14 sm:py-16">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: 'rgba(111,99,255,0.12)', border: '1px solid rgba(111,99,255,0.2)' }}
              >
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
