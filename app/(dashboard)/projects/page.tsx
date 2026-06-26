const PROJECTS = [
  { name: 'GYMHUB Фитнесс',    status: 'Идэвхтэй', members: 6932, color: '#15a59a' },
  { name: 'NOVA MIND Acadем',  status: 'Идэвхтэй', members: 420,  color: '#6f63ff' },
  { name: 'BLUEBELL Цэцэгхан', status: 'Хянаж байна', members: 118, color: '#ff4fd8' },
  { name: 'Модон Гэрийн Тавилга', status: 'Дууссан', members: 890, color: '#1e6fd4' },
]

const STATUS_COLOR: Record<string, string> = {
  'Идэвхтэй':    '#15a59a',
  'Хянаж байна': '#f4c20d',
  'Дууссан':     'rgba(184,194,221,0.4)',
}

export default function ProjectsPage() {
  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(184,194,221,0.4)' }}>
            Удирдлага
          </p>
          <h1 className="text-[28px] font-black text-pxwhite tracking-tight">Төслүүд</h1>
        </div>
        <button
          className="px-5 py-2.5 rounded-xl text-[13px] font-bold border-0 cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', color: '#fff',
            boxShadow: '0 6px 20px rgba(111,99,255,0.3)' }}>
          + Шинэ төсөл
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(111,99,255,0.15)' }}>
        {/* Table header */}
        <div className="grid grid-cols-[1fr_140px_120px_80px] gap-4 px-6 py-3 border-b"
          style={{ borderColor: 'rgba(111,99,255,0.1)', background: 'rgba(111,99,255,0.04)' }}>
          {['Төслийн нэр', 'Статус', 'Хэрэглэгч', ''].map((h) => (
            <span key={h} className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: 'rgba(184,194,221,0.4)' }}>{h}</span>
          ))}
        </div>

        {/* Table rows */}
        {PROJECTS.map((p, i) => (
          <div key={i}
            className="grid grid-cols-[1fr_140px_120px_80px] gap-4 items-center px-6 py-4 border-b transition-colors duration-150"
            style={{ borderColor: 'rgba(111,99,255,0.06)',
              background: i % 2 === 0 ? 'transparent' : 'rgba(111,99,255,0.02)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg shrink-0"
                style={{ background: `linear-gradient(135deg,${p.color}44,${p.color}18)`,
                  border: `1px solid ${p.color}33` }} />
              <span className="text-[14px] font-bold text-pxwhite">{p.name}</span>
            </div>
            <span className="text-[12px] font-bold px-3 py-1 rounded-full self-start mt-0.5"
              style={{ background: `${STATUS_COLOR[p.status]}18`, color: STATUS_COLOR[p.status] }}>
              {p.status}
            </span>
            <span className="text-[13px] font-medium" style={{ color: p.color }}>{p.members.toLocaleString()}</span>
            <button className="text-[12px] font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-colors duration-150"
              style={{ background: 'rgba(111,99,255,0.1)', color: '#6f63ff' }}>
              Харах
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
