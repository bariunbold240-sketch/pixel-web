'use client'

import { useState } from 'react'
import { parseYoutubeId, youtubeThumbnail, youtubeWatchUrl } from '@/lib/youtube'

interface Video { id: number; youtubeId: string; title: string; order: number }

export default function VideosManager({ initialVideos }: { initialVideos: Video[] }) {
  const [videos,   setVideos]   = useState<Video[]>(initialVideos)
  const [busy,     setBusy]     = useState<number | null>(null)
  const [addUrl,   setAddUrl]   = useState('')
  const [addTitle, setAddTitle] = useState('')
  const [adding,   setAdding]   = useState(false)
  const [showAdd,  setShowAdd]  = useState(false)
  const [error,    setError]    = useState('')

  // Live preview — the same parser the API validates with, so what the admin
  // sees here is exactly what will be stored.
  const previewId = parseYoutubeId(addUrl)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!previewId) { setError('YouTube линк буруу байна'); return }
    setAdding(true)
    setError('')
    const res = await fetch('/api/admin/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: addUrl, title: addTitle }),
    })
    if (res.ok) {
      const video: Video = await res.json()
      setVideos(prev => [...prev, video])
      setAddUrl(''); setAddTitle(''); setShowAdd(false)
    } else {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Хадгалахад алдаа гарлаа')
    }
    setAdding(false)
  }

  async function handleDelete(id: number) {
    setBusy(id)
    const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' })
    if (res.ok) setVideos(prev => prev.filter(v => v.id !== id))
    setBusy(null)
  }

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(111,99,255,0.2)' }

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(184,194,221,0.4)' }}>
            Баг / Онцлох видео
          </p>
          <h1 className="text-[24px] font-black tracking-tight text-pxwhite sm:text-[28px]">Бичлэгүүд</h1>
        </div>
        <button
          onClick={() => { setShowAdd(v => !v); setAddUrl(''); setAddTitle(''); setError('') }}
          className="w-full max-sm:min-h-12 rounded-xl border-0 px-5 py-2.5 text-[13px] font-bold sm:w-auto cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', color: '#fff', boxShadow: '0 6px 20px rgba(111,99,255,0.3)' }}
        >
          + Бичлэг нэмэх
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd}
          className="glass-card rounded-2xl p-5 flex flex-col gap-4 sm:flex-row sm:items-start"
          style={{ border: '1px solid rgba(111,99,255,0.2)' }}>

          {/* Thumbnail preview */}
          <div className="sm:w-52 shrink-0">
            {previewId ? (
              <img
                src={youtubeThumbnail(previewId)}
                alt="preview"
                className="w-full aspect-video rounded-xl object-cover"
                style={{ border: '1px solid rgba(111,99,255,0.2)' }}
              />
            ) : (
              <div className="w-full aspect-video rounded-xl border-2 border-dashed flex items-center justify-center text-center px-3"
                style={{ borderColor: 'rgba(111,99,255,0.25)', background: 'rgba(111,99,255,0.04)', color: 'rgba(184,194,221,0.4)' }}>
                <span className="text-[11px]">Линк оруулбал зураг харагдана</span>
              </div>
            )}
          </div>

          {/* URL + title + submit */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
                YouTube линк
              </label>
              <input value={addUrl} onChange={e => { setAddUrl(e.target.value); setError('') }}
                placeholder="https://www.youtube.com/watch?v=..." required
                className="rounded-xl px-4 py-3 max-md:min-h-12 text-[14px] text-pxwhite outline-none"
                style={inputStyle} />
              <p className="text-[10px]" style={{ color: 'rgba(184,194,221,0.35)' }}>
                watch, youtu.be, shorts, embed — аль ч хэлбэр болно
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
                Гарчиг
              </label>
              <input value={addTitle} onChange={e => setAddTitle(e.target.value)}
                placeholder="Бичлэгийн нэр" required
                className="rounded-xl px-4 py-3 max-md:min-h-12 text-[14px] text-pxwhite outline-none"
                style={inputStyle} />
            </div>

            {error && (
              <p className="text-[12px] font-bold" style={{ color: '#ff6b7a' }}>{error}</p>
            )}

            <button type="submit" disabled={adding || !previewId || !addTitle.trim()}
              className="rounded-xl border-0 px-6 py-3 max-md:min-h-12 text-[13px] font-bold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', opacity: (adding || !previewId || !addTitle.trim()) ? 0.5 : 1 }}>
              {adding ? 'Хадгалж байна...' : 'Хадгалах'}
            </button>
          </div>
        </form>
      )}

      {/* Videos grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {videos.map(video => (
          <div key={video.id}
            className="group relative glass-card rounded-2xl p-3 flex flex-col gap-3"
            style={{ border: '1px solid rgba(111,99,255,0.15)' }}>
            <a href={youtubeWatchUrl(video.youtubeId)} target="_blank" rel="noopener noreferrer" className="block">
              <img src={youtubeThumbnail(video.youtubeId)} alt={video.title}
                className="w-full aspect-video rounded-xl object-cover" />
            </a>
            <p className="text-[12px] font-bold text-pxwhite px-1">{video.title}</p>
            {/* touch-visible: delete stays reachable on phones (no hover there) */}
            <button onClick={() => handleDelete(video.id)} disabled={busy === video.id}
              className="touch-visible w-full rounded-lg py-1.5 max-md:min-h-10 text-[11px] font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: 'rgba(255,79,100,0.12)', color: '#ff6b7a', border: '1px solid rgba(255,79,100,0.25)' }}>
              {busy === video.id ? '...' : 'Устгах'}
            </button>
            <div className="absolute top-5 right-5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
              style={{ background: 'rgba(5,5,13,0.75)', color: '#fff' }}>
              {video.order + 1}
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-[14px] font-bold text-pxwhite">Бичлэг алга</p>
          <p className="text-[12px]" style={{ color: 'rgba(184,194,221,0.4)' }}>Дээрх товчоор бичлэг нэмнэ үү</p>
        </div>
      )}
    </div>
  )
}
