'use client'

import { useState, useRef } from 'react'

interface Photo { id: number; src: string; alt: string; order: number }

export default function GalleryManager({ initialPhotos }: { initialPhotos: Photo[] }) {
  const [photos,  setPhotos]  = useState<Photo[]>(initialPhotos)
  const [busy,    setBusy]    = useState<number | null>(null)
  const [addAlt,  setAddAlt]  = useState('')
  const [preview, setPreview] = useState('')
  const [adding,  setAdding]  = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setAdding(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
    if (res.ok) {
      const { url } = await res.json()
      setPreview(url)
    }
    setAdding(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!preview) return
    setAdding(true)
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ src: preview, alt: addAlt }),
    })
    if (res.ok) {
      const photo: Photo = await res.json()
      setPhotos(prev => [...prev, photo])
      setPreview(''); setAddAlt(''); setShowAdd(false)
    }
    setAdding(false)
  }

  async function handleDelete(id: number) {
    setBusy(id)
    const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
    if (res.ok) setPhotos(prev => prev.filter(p => p.id !== id))
    setBusy(null)
  }

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(111,99,255,0.2)' }

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(184,194,221,0.4)' }}>
            03 / Харилцаа
          </p>
          <h1 className="text-[24px] font-black tracking-tight text-pxwhite sm:text-[28px]">Галерей зурагнууд</h1>
        </div>
        <button
          onClick={() => { setShowAdd(v => !v); setPreview(''); setAddAlt('') }}
          className="w-full rounded-xl border-0 px-5 py-2.5 text-[13px] font-bold sm:w-auto cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', color: '#fff', boxShadow: '0 6px 20px rgba(111,99,255,0.3)' }}
        >
          + Зураг нэмэх
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd}
          className="glass-card rounded-2xl p-5 flex flex-col gap-4"
          style={{ border: '1px solid rgba(111,99,255,0.2)' }}>

          {/* File picker / preview */}
          {preview ? (
            <div className="relative w-full h-52 rounded-xl overflow-hidden group" style={{ border: '1px solid rgba(111,99,255,0.2)' }}>
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
              <button type="button" onClick={() => { setPreview(''); fileRef.current && (fileRef.current.value = '') }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full border-0 cursor-pointer text-[14px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(255,79,100,0.85)', color: '#fff' }}>×</button>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="absolute bottom-2 right-2 rounded-lg border-0 px-3 py-1.5 text-[11px] font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(111,99,255,0.85)', color: '#fff' }}>
                Солих
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} disabled={adding}
              className="flex flex-col items-center justify-center gap-2 w-full h-52 rounded-xl border-2 border-dashed cursor-pointer"
              style={{ borderColor: 'rgba(111,99,255,0.25)', background: 'rgba(111,99,255,0.04)', color: 'rgba(184,194,221,0.4)' }}>
              {adding ? <span className="text-[13px]">Байршуулж байна...</span> : (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-[13px] font-medium">Зураг сонгох</span>
                  <span className="text-[11px]">JPG, PNG, WEBP дэмжинэ</span>
                </>
              )}
            </button>
          )}

          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />

          {/* Alt text + submit — only show after image picked */}
          {preview && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
                  Тайлбар (alt)
                </label>
                <input value={addAlt} onChange={e => setAddAlt(e.target.value)}
                  placeholder="Зургийн тайлбар"
                  className="rounded-xl px-4 py-3 text-[14px] text-pxwhite outline-none"
                  style={inputStyle} />
              </div>
              <button type="submit" disabled={adding}
                className="rounded-xl border-0 px-6 py-3 text-[13px] font-bold text-white cursor-pointer shrink-0"
                style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', opacity: adding ? 0.7 : 1 }}>
                {adding ? 'Хадгалж байна...' : 'Хадгалах'}
              </button>
            </div>
          )}
        </form>
      )}

      {/* Photo grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {photos.map(photo => (
          <div key={photo.id} className="group relative rounded-2xl overflow-hidden"
            style={{ aspectRatio: '1/1', border: '1px solid rgba(111,99,255,0.15)', background: 'rgba(111,99,255,0.04)' }}>
            <img src={photo.src} alt={photo.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: 'rgba(5,5,13,0.75)', backdropFilter: 'blur(4px)' }}>
              <p className="text-[9px] font-mono px-2 text-center break-all" style={{ color: 'rgba(184,194,221,0.7)' }}>
                {photo.src.split('/').pop()}
              </p>
              <button onClick={() => handleDelete(photo.id)} disabled={busy === photo.id}
                className="rounded-lg border-0 px-3 py-1.5 text-[11px] font-bold cursor-pointer"
                style={{ background: 'rgba(255,79,100,0.15)', color: '#ff6b7a', border: '1px solid rgba(255,79,100,0.3)' }}>
                {busy === photo.id ? '...' : 'Устгах'}
              </button>
            </div>
            <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
              style={{ background: 'rgba(5,5,13,0.7)', color: 'rgba(255,79,216,0.9)', backdropFilter: 'blur(4px)' }}>
              {photo.order + 1}
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-[14px] font-bold text-pxwhite">Зураг алга</p>
          <p className="text-[12px]" style={{ color: 'rgba(184,194,221,0.4)' }}>Дээрх товчоор зураг нэмнэ үү</p>
        </div>
      )}
    </div>
  )
}
