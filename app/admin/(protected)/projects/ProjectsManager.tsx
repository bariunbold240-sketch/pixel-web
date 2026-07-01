'use client'

import { useState, useRef } from 'react'

const STATUS_COLOR: Record<string, string> = {
  'Идэвхтэй':    '#15a59a',
  'Хянаж байна': '#f4c20d',
  'Дууссан':     'rgba(184,194,221,0.4)',
}

interface Stat    { value: string; label: string }
interface Project {
  id: number; name: string; status: string; members: number
  color: string; image: string; description: string; stats: Stat[]; order: number
}
type FormData = Omit<Project, 'id' | 'order'>

// ── Modal shell ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)' }}>
      <div className="glass-card w-full max-w-md rounded-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        style={{ border: '1px solid rgba(111,99,255,0.25)' }}>
        <div className="flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-black text-pxwhite">{title}</h2>
          <button onClick={onClose} className="cursor-pointer border-0 bg-transparent text-[20px] leading-none" style={{ color: 'rgba(184,194,221,0.5)' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Image uploader ─────────────────────────────────────────────────────────
function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef    = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  async function handleFile(file: File) {
    setBusy(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
    if (res.ok) { const { url } = await res.json(); onChange(url) }
    setBusy(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>Зураг</label>

      {value ? (
        <div className="relative w-full h-36 rounded-xl overflow-hidden group" style={{ border: '1px solid rgba(111,99,255,0.2)' }}>
          <img src={value} alt="preview" className="w-full h-full object-cover object-top" />
          <button type="button" onClick={() => onChange('')}
            className="absolute top-2 right-2 w-6 h-6 rounded-full border-0 cursor-pointer text-[12px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(255,79,100,0.85)', color: '#fff' }}>×</button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
          className="flex flex-col items-center justify-center gap-2 w-full h-36 rounded-xl border-2 border-dashed cursor-pointer"
          style={{ borderColor: 'rgba(111,99,255,0.25)', background: 'rgba(111,99,255,0.04)', color: 'rgba(184,194,221,0.4)' }}>
          {busy ? <span className="text-[12px]">Байршуулж байна...</span> : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-[12px]">Зураг байршуулах</span>
            </>
          )}
        </button>
      )}

      {value && (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
          className="rounded-xl border-0 py-2 text-[12px] font-bold cursor-pointer"
          style={{ background: 'rgba(111,99,255,0.1)', color: '#6f63ff' }}>
          {busy ? 'Байршуулж байна...' : 'Зураг солих'}
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
    </div>
  )
}

// ── Stats editor ───────────────────────────────────────────────────────────
function StatsEditor({ stats, onChange }: { stats: Stat[]; onChange: (s: Stat[]) => void }) {
  function update(i: number, key: keyof Stat, val: string) {
    onChange(stats.map((s, j) => j === i ? { ...s, [key]: val } : s))
  }
  function add()        { onChange([...stats, { value: '', label: '' }]) }
  function remove(i: number) { onChange(stats.filter((_, j) => j !== i)) }

  const cellStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(111,99,255,0.15)' }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
          Статистик
        </label>
        <button type="button" onClick={add}
          className="text-[11px] font-bold px-2 py-1 rounded-lg border-0 cursor-pointer"
          style={{ background: 'rgba(111,99,255,0.15)', color: '#6f63ff' }}>
          + нэмэх
        </button>
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-[1fr_1fr_24px] gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-wider mb-0.5"
          style={{ color: 'rgba(184,194,221,0.35)' }}>
          <span>Утга (6,932)</span><span>Нэр (Хэрэглэгч)</span><span />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {stats.map((s, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_24px] gap-2 items-center">
            <input value={s.value} onChange={e => update(i, 'value', e.target.value)}
              placeholder="6,932"
              className="rounded-lg px-3 py-1.5 text-[12px] text-pxwhite outline-none"
              style={cellStyle} />
            <input value={s.label} onChange={e => update(i, 'label', e.target.value)}
              placeholder="Хэрэглэгч"
              className="rounded-lg px-3 py-1.5 text-[12px] text-pxwhite outline-none"
              style={cellStyle} />
            <button type="button" onClick={() => remove(i)}
              className="w-6 h-6 rounded-lg border-0 cursor-pointer text-[12px] flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,79,100,0.1)', color: '#ff6b7a' }}>×</button>
          </div>
        ))}
      </div>

      {stats.length === 0 && (
        <p className="text-[12px] text-center py-2" style={{ color: 'rgba(184,194,221,0.3)' }}>
          Статистик байхгүй
        </p>
      )}
    </div>
  )
}

// ── Project form ───────────────────────────────────────────────────────────
function ProjectForm({ initial, onSave, onCancel, saving }: {
  initial?: Partial<Project>
  onSave: (data: FormData) => void
  onCancel: () => void
  saving?: boolean
}) {
  const [name,        setName]        = useState(initial?.name        ?? '')
  const [status,      setStatus]      = useState(initial?.status      ?? 'Идэвхтэй')
  const [members,     setMembers]     = useState(String(initial?.members ?? ''))
  const [color,       setColor]       = useState(initial?.color       ?? '#6f63ff')
  const [image,       setImage]       = useState(initial?.image       ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [stats,       setStats]       = useState<Stat[]>((initial?.stats as Stat[]) ?? [])

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(111,99,255,0.2)' }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ name, status, members: Number(members), color, image, description, stats }) }}
      className="flex flex-col gap-4">

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>Нэр</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Төслийн нэр" required
          className="rounded-xl px-4 py-3 text-[14px] text-pxwhite outline-none" style={inputStyle} />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>Тайлбар</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
          placeholder="Фитнесс гишүүнчлэлийн менежментийн платформ…"
          className="rounded-xl px-4 py-3 text-[14px] text-pxwhite outline-none resize-none"
          style={inputStyle} />
      </div>

      {/* Stats */}
      <StatsEditor stats={stats} onChange={setStats} />

      {/* Members */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>Нийт хэрэглэгч</label>
        <input type="number" value={members} onChange={e => setMembers(e.target.value)} placeholder="0" required
          className="rounded-xl px-4 py-3 text-[14px] text-pxwhite outline-none" style={inputStyle} />
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>Статус</label>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="rounded-xl px-4 py-3 text-[14px] text-pxwhite outline-none"
          style={{ ...inputStyle, appearance: 'none' as const }}>
          {Object.keys(STATUS_COLOR).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Color */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>Өнгө</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)}
            className="h-10 w-16 cursor-pointer rounded-lg border-0 p-1"
            style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
        <div className="mt-4 h-10 w-10 rounded-lg"
          style={{ background: `linear-gradient(135deg,${color}66,${color}22)`, border: `1px solid ${color}33` }} />
      </div>

      {/* Image */}
      <ImageUploader value={image} onChange={setImage} />

      <div className="flex gap-3 mt-2">
        <button type="submit" disabled={saving}
          className="flex-1 rounded-xl border-0 py-3 text-[13px] font-bold text-white cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Хадгалж байна...' : 'Хадгалах'}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 rounded-xl border py-3 text-[13px] font-bold cursor-pointer"
          style={{ background: 'transparent', borderColor: 'rgba(111,99,255,0.25)', color: 'rgba(184,194,221,0.6)' }}>
          Болих
        </button>
      </div>
    </form>
  )
}

// ── Main manager ───────────────────────────────────────────────────────────
export default function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [modal,    setModal]    = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<Project | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleAdd(data: FormData) {
    setSaving(true)
    const res = await fetch('/api/admin/projects', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    })
    if (res.ok) { const p: Project = await res.json(); setProjects(prev => [...prev, p]) }
    setSaving(false); setModal(null)
  }

  async function handleEdit(data: FormData) {
    if (!selected) return
    setSaving(true)
    const res = await fetch(`/api/admin/projects/${selected.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    })
    if (res.ok) { const p: Project = await res.json(); setProjects(prev => prev.map(x => x.id === p.id ? p : x)) }
    setSaving(false); setModal(null)
  }

  async function handleDelete() {
    if (!selected) return
    setDeleting(true)
    const res = await fetch(`/api/admin/projects/${selected.id}`, { method: 'DELETE' })
    if (res.ok) setProjects(prev => prev.filter(p => p.id !== selected.id))
    setDeleting(false); setModal(null)
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(184,194,221,0.4)' }}>
            Удирдлага
          </p>
          <h1 className="text-[24px] font-black tracking-tight text-pxwhite sm:text-[28px]">Төслүүд</h1>
        </div>
        <button onClick={() => { setSelected(null); setModal('add') }}
          className="w-full rounded-xl border-0 px-5 py-2.5 text-[13px] font-bold sm:w-auto cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', color: '#fff', boxShadow: '0 6px 20px rgba(111,99,255,0.3)' }}>
          + Шинэ төсөл
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div key={project.id} className="glass-card rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${project.color}28` }}>

            {/* Image */}
            <div className="relative w-full h-40" style={{ background: `linear-gradient(135deg,${project.color}22,${project.color}08)` }}>
              {project.image ? (
                <img src={project.image} alt={project.name} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
                    style={{ color: `${project.color}60` }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
              <span className="absolute top-2 right-2 rounded-lg px-2 py-0.5 text-[10px] font-bold"
                style={{ background: `${project.color}cc`, color: '#fff' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-3">
              <div>
                <p className="text-[15px] font-bold text-pxwhite">{project.name}</p>
                {project.description && (
                  <p className="text-[12px] mt-1 line-clamp-2" style={{ color: 'rgba(184,194,221,0.55)' }}>
                    {project.description}
                  </p>
                )}
              </div>

              {/* Stats row */}
              {(project.stats as Stat[]).length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {(project.stats as Stat[]).map((s, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-[14px] font-black" style={{ color: project.color }}>{s.value}</span>
                      <span className="text-[10px]" style={{ color: 'rgba(184,194,221,0.45)' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{ background: `${STATUS_COLOR[project.status] ?? '#fff'}18`, color: STATUS_COLOR[project.status] ?? '#fff' }}>
                  {project.status}
                </span>
                <span className="text-[11px] font-medium" style={{ color: project.color }}>
                  {project.members.toLocaleString()} хэрэглэгч
                </span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => { setSelected(project); setModal('edit') }}
                  className="flex-1 rounded-xl border-0 py-2 text-[12px] font-bold cursor-pointer"
                  style={{ background: 'rgba(111,99,255,0.12)', color: '#6f63ff' }}>Засах</button>
                <button onClick={() => { setSelected(project); setModal('delete') }}
                  className="flex-1 rounded-xl border-0 py-2 text-[12px] font-bold cursor-pointer"
                  style={{ background: 'rgba(255,79,100,0.08)', color: '#ff6b7a' }}>Устгах</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-[14px] font-bold text-pxwhite">Төсөл алга</p>
          <p className="text-[12px]" style={{ color: 'rgba(184,194,221,0.4)' }}>Дээрх товчоор төсөл нэмнэ үү</p>
        </div>
      )}

      {modal === 'add' && (
        <Modal title="Шинэ төсөл нэмэх" onClose={() => setModal(null)}>
          <ProjectForm onSave={handleAdd} onCancel={() => setModal(null)} saving={saving} />
        </Modal>
      )}
      {modal === 'edit' && selected && (
        <Modal title="Төсөл засах" onClose={() => setModal(null)}>
          <ProjectForm initial={selected} onSave={handleEdit} onCancel={() => setModal(null)} saving={saving} />
        </Modal>
      )}
      {modal === 'delete' && selected && (
        <Modal title="Төсөл устгах" onClose={() => setModal(null)}>
          {selected.image && (
            <img src={selected.image} alt={selected.name}
              className="w-full h-28 object-cover object-top rounded-xl"
              style={{ border: '1px solid rgba(255,79,100,0.2)' }} />
          )}
          <p className="text-[14px]" style={{ color: 'rgba(184,194,221,0.7)' }}>
            <b className="text-pxwhite">{selected.name}</b> төслийг устгахдаа итгэлтэй байна уу?
          </p>
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 rounded-xl border-0 py-3 text-[13px] font-bold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#ff4f64,#ff4fd8)', opacity: deleting ? 0.7 : 1 }}>
              {deleting ? 'Устгаж байна...' : 'Устгах'}
            </button>
            <button onClick={() => setModal(null)}
              className="flex-1 rounded-xl border py-3 text-[13px] font-bold cursor-pointer"
              style={{ background: 'transparent', borderColor: 'rgba(111,99,255,0.25)', color: 'rgba(184,194,221,0.6)' }}>
              Болих
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
