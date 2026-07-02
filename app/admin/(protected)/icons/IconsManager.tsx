'use client'

import { useState, useRef } from 'react'

interface Icon { id: number; src: string; label: string; order: number }

export default function IconsManager({ initialIcons }: { initialIcons: Icon[] }) {
  const [icons,    setIcons]    = useState<Icon[]>(initialIcons)
  const [busy,     setBusy]     = useState<number | null>(null)
  const [addLabel, setAddLabel] = useState('')
  const [preview,  setPreview]  = useState('')
  const [adding,   setAdding]   = useState(false)
  const [showAdd,  setShowAdd]  = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setAdding(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
    if (res.ok) { const { url } = await res.json(); setPreview(url) }
    setAdding(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!preview) return
    setAdding(true)
    const res = await fetch('/api/admin/icons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ src: preview, label: addLabel }),
    })
    if (res.ok) {
      const icon: Icon = await res.json()
      setIcons(prev => [...prev, icon])
      setPreview(''); setAddLabel(''); setShowAdd(false)
    }
    setAdding(false)
  }

  async function handleDelete(id: number) {
    setBusy(id)
    const res = await fetch(`/api/admin/icons/${id}`, { method: 'DELETE' })
    if (res.ok) setIcons(prev => prev.filter(ic => ic.id !== id))
    setBusy(null)
  }

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(111,99,255,0.2)' }

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(184,194,221,0.4)' }}>
            Бүтээгдэхүүн / Tech Strip
          </p>
          <h1 className="text-[24px] font-black tracking-tight text-pxwhite sm:text-[28px]">Харилцагч Icon</h1>
        </div>
        <button
          onClick={() => { setShowAdd(v => !v); setPreview(''); setAddLabel('') }}
          className="w-full max-sm:min-h-12 rounded-xl border-0 px-5 py-2.5 text-[13px] font-bold sm:w-auto cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', color: '#fff', boxShadow: '0 6px 20px rgba(111,99,255,0.3)' }}
        >
          + Icon нэмэх
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd}
          className="glass-card rounded-2xl p-5 flex flex-col gap-4 sm:flex-row sm:items-start"
          style={{ border: '1px solid rgba(111,99,255,0.2)' }}>

          {/* File picker / preview */}
          <div className="flex flex-col gap-3 sm:w-40 shrink-0">
            {preview ? (
              <div className="relative group w-full aspect-square rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(111,99,255,0.2)', background: 'rgba(111,99,255,0.06)' }}>
                <img src={preview} alt="preview" className="w-full h-full object-contain p-3" />
                <button type="button" onClick={() => { setPreview(''); fileRef.current && (fileRef.current.value = '') }}
                  className="touch-visible absolute top-1.5 right-1.5 w-6 h-6 max-md:w-9 max-md:h-9 rounded-full border-0 cursor-pointer text-[12px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(255,79,100,0.85)', color: '#fff' }}>×</button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} disabled={adding}
                className="w-full aspect-square rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-1.5"
                style={{ borderColor: 'rgba(111,99,255,0.25)', background: 'rgba(111,99,255,0.04)', color: 'rgba(184,194,221,0.4)' }}>
                {adding ? <span className="text-[11px]">Байршуулж байна...</span> : (
                  <>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="text-[11px]">Icon сонгох</span>
                  </>
                )}
              </button>
            )}
            {preview && (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="rounded-lg border-0 py-1.5 text-[11px] font-bold cursor-pointer"
                style={{ background: 'rgba(111,99,255,0.1)', color: '#6f63ff' }}>
                Солих
              </button>
            )}
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />

          {/* Label + submit */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
                Нэр (label)
              </label>
              <input value={addLabel} onChange={e => setAddLabel(e.target.value)}
                placeholder="Компанийн нэр" required
                className="rounded-xl px-4 py-3 max-md:min-h-12 text-[14px] text-pxwhite outline-none"
                style={inputStyle} />
            </div>
            <button type="submit" disabled={adding || !preview}
              className="rounded-xl border-0 px-6 py-3 max-md:min-h-12 text-[13px] font-bold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', opacity: (adding || !preview) ? 0.5 : 1 }}>
              {adding ? 'Хадгалж байна...' : 'Хадгалах'}
            </button>
          </div>
        </form>
      )}

      {/* Icons grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {icons.map(icon => (
          <div key={icon.id}
            className="group relative glass-card rounded-2xl p-4 flex flex-col items-center gap-3"
            style={{ border: '1px solid rgba(111,99,255,0.15)' }}>
            <img src={icon.src} alt={icon.label} className="w-14 h-14 object-contain" />
            <p className="text-[12px] font-bold text-pxwhite text-center">{icon.label}</p>
            {/* touch-visible: delete stays reachable on phones (no hover there) */}
            <button onClick={() => handleDelete(icon.id)} disabled={busy === icon.id}
              className="touch-visible w-full rounded-lg border-0 py-1.5 max-md:min-h-10 text-[11px] font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: 'rgba(255,79,100,0.12)', color: '#ff6b7a', border: '1px solid rgba(255,79,100,0.25)' }}>
              {busy === icon.id ? '...' : 'Устгах'}
            </button>
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
              style={{ background: 'rgba(111,99,255,0.2)', color: '#6f63ff' }}>
              {icon.order + 1}
            </div>
          </div>
        ))}
      </div>

      {icons.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-[14px] font-bold text-pxwhite">Icon алга</p>
          <p className="text-[12px]" style={{ color: 'rgba(184,194,221,0.4)' }}>Дээрх товчоор icon нэмнэ үү</p>
        </div>
      )}
    </div>
  )
}
