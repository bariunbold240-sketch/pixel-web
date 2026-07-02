'use client'

import { useState } from 'react'

interface Feature { label: string; value: string }
interface Pkg { id: number; name: string; price: string; featured: boolean; features: Feature[]; order: number }

// ── Feature list editor ────────────────────────────────────────────────────
function FeatureEditor({ features, onChange }: { features: Feature[]; onChange: (f: Feature[]) => void }) {
  function update(i: number, key: keyof Feature, val: string) {
    const next = features.map((f, j) => j === i ? { ...f, [key]: val } : f)
    onChange(next)
  }
  function add()        { onChange([...features, { label: '', value: '' }]) }
  function remove(i: number) { onChange(features.filter((_, j) => j !== i)) }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
          Онцлогууд
        </label>
        <button
          type="button"
          onClick={add}
          className="text-[11px] font-bold px-2 py-1 rounded-lg border-0 cursor-pointer"
          style={{ background: 'rgba(111,99,255,0.15)', color: '#6f63ff' }}
        >
          + нэмэх
        </button>
      </div>

      <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
        {features.map((f, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={f.label}
              onChange={e => update(i, 'label', e.target.value)}
              placeholder="Нэр"
              className="flex-1 min-w-0 rounded-lg px-3 py-1.5 max-sm:py-2 text-[12px] text-pxwhite outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(111,99,255,0.15)' }}
            />
            <input
              value={f.value}
              onChange={e => update(i, 'value', e.target.value)}
              placeholder="Утга"
              className="w-14 max-sm:w-16 rounded-lg px-2 py-1.5 max-sm:py-2 text-[12px] text-pxwhite outline-none text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(111,99,255,0.15)' }}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 w-6 h-6 max-sm:w-8 max-sm:h-8 rounded-lg border-0 cursor-pointer text-[12px] flex items-center justify-center"
              style={{ background: 'rgba(255,79,100,0.1)', color: '#ff6b7a' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Package form modal ─────────────────────────────────────────────────────
function PackageModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Pkg
  onSave: (data: Omit<Pkg, 'id' | 'order'>) => Promise<void>
  onClose: () => void
}) {
  const [name,     setName]     = useState(initial?.name     ?? '')
  const [price,    setPrice]    = useState(initial?.price    ?? '')
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [features, setFeatures] = useState<Feature[]>(
    (initial?.features as Feature[]) ?? [{ label: '', value: '' }]
  )
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave({ name, price, featured, features: features.filter(f => f.label) })
    setSaving(false)
  }

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(111,99,255,0.2)' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="glass-card w-full max-w-lg rounded-2xl p-6 max-sm:p-5 flex flex-col gap-5 max-h-[90vh] max-sm:max-h-[85dvh] overflow-y-auto"
        style={{ border: '1px solid rgba(111,99,255,0.25)' }}>

        <div className="flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-black text-pxwhite">
            {initial ? 'Багц засах' : 'Шинэ багц нэмэх'}
          </h2>
          {/* p-2 -m-2 widens the tap area without moving a pixel */}
          <button onClick={onClose} className="border-0 bg-transparent cursor-pointer text-[22px] leading-none p-2 -m-2" style={{ color: 'rgba(184,194,221,0.5)' }}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
              Нэр
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Pixel Smart"
              required
              className="rounded-xl px-4 py-3 max-md:min-h-12 text-[14px] text-pxwhite outline-none"
              style={inputStyle}
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
              Үнэ
            </label>
            <input
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="₮990,000"
              className="rounded-xl px-4 py-3 max-md:min-h-12 text-[14px] text-pxwhite outline-none"
              style={inputStyle}
            />
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setFeatured(v => !v)}
              className="w-10 h-5 rounded-full transition-all duration-200 relative shrink-0"
              style={{ background: featured ? 'linear-gradient(135deg,#6f63ff,#ff4fd8)' : 'rgba(255,255,255,0.1)' }}
            >
              <div className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-200"
                style={{ left: featured ? '22px' : '2px' }} />
            </div>
            <span className="text-[13px] font-medium text-pxwhite">Онцлох багц (Most Popular)</span>
          </label>

          {/* Features */}
          <FeatureEditor features={features} onChange={setFeatures} />

          {/* Actions */}
          <div className="flex gap-3 pt-2 shrink-0">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl border-0 py-3 max-sm:min-h-12 text-[13px] font-bold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Хадгалж байна...' : 'Хадгалах'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border py-3 max-sm:min-h-12 text-[13px] font-bold cursor-pointer"
              style={{ background: 'transparent', borderColor: 'rgba(111,99,255,0.25)', color: 'rgba(184,194,221,0.6)' }}
            >
              Болих
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main manager ───────────────────────────────────────────────────────────
export default function PackagesManager({ initialPackages }: { initialPackages: Pkg[] }) {
  const [packages, setPackages] = useState<Pkg[]>(initialPackages)
  const [modal, setModal]       = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<Pkg | null>(null)
  const [deleting, setDeleting] = useState(false)

  function openAdd()       { setSelected(null); setModal('add') }
  function openEdit(p: Pkg){ setSelected(p);    setModal('edit') }
  function openDel(p: Pkg) { setSelected(p);    setModal('delete') }

  async function handleAdd(data: Omit<Pkg, 'id' | 'order'>) {
    const res = await fetch('/api/admin/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) { const pkg: Pkg = await res.json(); setPackages(prev => [...prev, pkg]) }
    setModal(null)
  }

  async function handleEdit(data: Omit<Pkg, 'id' | 'order'>) {
    if (!selected) return
    const res = await fetch(`/api/admin/packages/${selected.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const pkg: Pkg = await res.json()
      setPackages(prev => prev.map(p => p.id === pkg.id ? pkg : p))
    }
    setModal(null)
  }

  async function handleDelete() {
    if (!selected) return
    setDeleting(true)
    const res = await fetch(`/api/admin/packages/${selected.id}`, { method: 'DELETE' })
    if (res.ok) setPackages(prev => prev.filter(p => p.id !== selected.id))
    setDeleting(false)
    setModal(null)
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(184,194,221,0.4)' }}>
            05 / Багц
          </p>
          <h1 className="text-[24px] font-black tracking-tight text-pxwhite sm:text-[28px]">
            Багц удирдах
          </h1>
        </div>
        <button
          onClick={openAdd}
          className="w-full max-sm:min-h-12 rounded-xl border-0 px-5 py-2.5 text-[13px] font-bold sm:w-auto cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', color: '#fff', boxShadow: '0 6px 20px rgba(111,99,255,0.3)' }}
        >
          + Багц нэмэх
        </button>
      </div>

      {/* Packages grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="glass-card rounded-2xl p-5 flex flex-col gap-3 relative"
            style={{ border: pkg.featured ? '1px solid rgba(111,99,255,0.4)' : '1px solid rgba(111,99,255,0.15)' }}
          >
            {pkg.featured && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[10px] font-black text-white"
                style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)' }}>
                Онцлох
              </div>
            )}

            <div>
              <p className="text-[15px] font-black text-pxwhite">{pkg.name}</p>
              {pkg.price && (
                <p className="text-[13px] font-bold mt-0.5" style={{ color: '#6f63ff' }}>{pkg.price}</p>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-1">
              {(pkg.features as Feature[]).slice(0, 5).map((f, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-[11px] truncate" style={{ color: 'rgba(184,194,221,0.55)' }}>{f.label}</span>
                  <span className="text-[11px] font-bold shrink-0" style={{ color: f.value === '—' ? 'rgba(184,194,221,0.25)' : '#15a59a' }}>
                    {f.value}
                  </span>
                </div>
              ))}
              {(pkg.features as Feature[]).length > 5 && (
                <p className="text-[10px] mt-1" style={{ color: 'rgba(184,194,221,0.3)' }}>
                  +{(pkg.features as Feature[]).length - 5} дэлгэрэнгүй...
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'rgba(111,99,255,0.1)' }}>
              <button
                onClick={() => openEdit(pkg)}
                className="flex-1 rounded-xl border-0 py-2 max-sm:min-h-11 text-[12px] font-bold cursor-pointer"
                style={{ background: 'rgba(111,99,255,0.12)', color: '#6f63ff' }}
              >
                Засах
              </button>
              <button
                onClick={() => openDel(pkg)}
                className="flex-1 rounded-xl border-0 py-2 max-sm:min-h-11 text-[12px] font-bold cursor-pointer"
                style={{ background: 'rgba(255,79,100,0.08)', color: '#ff6b7a' }}
              >
                Устгах
              </button>
            </div>
          </div>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-[14px] font-bold text-pxwhite">Багц алга</p>
          <p className="text-[12px]" style={{ color: 'rgba(184,194,221,0.4)' }}>Дээрх товчоор багц нэмнэ үү</p>
        </div>
      )}

      {/* Modals */}
      {modal === 'add' && (
        <PackageModal onSave={handleAdd} onClose={() => setModal(null)} />
      )}
      {modal === 'edit' && selected && (
        <PackageModal initial={selected} onSave={handleEdit} onClose={() => setModal(null)} />
      )}
      {modal === 'delete' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="glass-card w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5" style={{ border: '1px solid rgba(255,79,100,0.25)' }}>
            <h2 className="text-[16px] font-black text-pxwhite">Багц устгах</h2>
            <p className="text-[14px]" style={{ color: 'rgba(184,194,221,0.7)' }}>
              <b className="text-pxwhite">{selected.name}</b> багцыг устгахдаа итгэлтэй байна уу?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-xl border-0 py-3 max-sm:min-h-12 text-[13px] font-bold text-white cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#ff4f64,#ff4fd8)', opacity: deleting ? 0.7 : 1 }}
              >
                {deleting ? 'Устгаж байна...' : 'Устгах'}
              </button>
              <button
                onClick={() => setModal(null)}
                className="flex-1 rounded-xl border py-3 max-sm:min-h-12 text-[13px] font-bold cursor-pointer"
                style={{ background: 'transparent', borderColor: 'rgba(111,99,255,0.25)', color: 'rgba(184,194,221,0.6)' }}
              >
                Болих
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
