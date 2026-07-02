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

function ProjectMobileCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number]
  index: number
}) {
  const statusColor = STATUS_COLOR[project.status]

  return (
    <div className="glass-card rounded-2xl p-4" style={{ border: `1px solid ${project.color}22` }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="h-10 w-10 shrink-0 rounded-lg"
            style={{
              background: `linear-gradient(135deg,${project.color}44,${project.color}18)`,
              border: `1px solid ${project.color}33`,
            }}
          />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold text-pxwhite">{project.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: project.color }}>
              {project.status}
            </p>
          </div>
        </div>
        <span
          className="shrink-0 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{
            background: `${project.color}12`,
            color: project.color,
            borderColor: `${project.color}22`,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: `${project.color}12`, border: `1px solid ${project.color}20` }}>
          <p className="text-[9px] uppercase tracking-[0.16em]" style={{ color: 'rgba(184,194,221,0.45)' }}>
            Хэрэглэгч
          </p>
          <p className="mt-1 text-[18px] font-black leading-none" style={{ color: project.color }}>
            {project.members.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl p-3" style={{ background: 'rgba(111,99,255,0.06)', border: '1px solid rgba(111,99,255,0.12)' }}>
          <p className="text-[9px] uppercase tracking-[0.16em]" style={{ color: 'rgba(184,194,221,0.45)' }}>
            Статус
          </p>
          <p className="mt-1 text-[12px] font-semibold text-pxwhite" style={{ color: statusColor }}>
            {project.status}
          </p>
        </div>
      </div>

      {/* Secondary style: the page-level "+ Шинэ төсөл" keeps the gradient as the
          single primary CTA — four gradient buttons per screen flattened hierarchy */}
      <button
        className="mt-4 w-full min-h-12 rounded-xl border-0 px-4 py-3 text-[13px] font-bold cursor-pointer"
        style={{ background: 'rgba(111,99,255,0.12)', color: '#9d94ff', border: '1px solid rgba(111,99,255,0.25)' }}
      >
        Харах
      </button>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(184,194,221,0.4)' }}>
            Удирдлага
          </p>
          <h1 className="text-[24px] font-black tracking-tight text-pxwhite sm:text-[28px]">Төслүүд</h1>
        </div>
        <button
          className="w-full max-sm:min-h-12 rounded-xl border-0 px-5 py-2.5 text-[13px] font-bold sm:w-auto"
          style={{ background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', color: '#fff', boxShadow: '0 6px 20px rgba(111,99,255,0.3)' }}
        >
          + Шинэ төсөл
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        {PROJECTS.map((project, index) => (
          <ProjectMobileCard key={project.name} project={project} index={index} />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl sm:block glass-card" style={{ border: '1px solid rgba(111,99,255,0.15)' }}>
        {/* Table header */}
        <div
          className="grid grid-cols-[1fr_140px_120px_80px] gap-4 border-b px-6 py-3"
          style={{ borderColor: 'rgba(111,99,255,0.1)', background: 'rgba(111,99,255,0.04)' }}
        >
          {['Төслийн нэр', 'Статус', 'Хэрэглэгч', ''].map((h) => (
            <span key={h} className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.4)' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Table rows */}
        {PROJECTS.map((project, index) => (
          <div
            key={project.name}
            className="grid grid-cols-[1fr_140px_120px_80px] items-center gap-4 border-b px-6 py-4 transition-colors duration-150"
            style={{ borderColor: 'rgba(111,99,255,0.06)', background: index % 2 === 0 ? 'transparent' : 'rgba(111,99,255,0.02)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 shrink-0 rounded-lg"
                style={{
                  background: `linear-gradient(135deg,${project.color}44,${project.color}18)`,
                  border: `1px solid ${project.color}33`,
                }}
              />
              <span className="text-[14px] font-bold text-pxwhite">{project.name}</span>
            </div>
            <span
              className="self-start rounded-full px-3 py-1 text-[12px] font-bold"
              style={{ background: `${STATUS_COLOR[project.status]}18`, color: STATUS_COLOR[project.status] }}
            >
              {project.status}
            </span>
            <span className="text-[13px] font-medium" style={{ color: project.color }}>
              {project.members.toLocaleString()}
            </span>
            <button className="cursor-pointer rounded-lg border-0 bg-[rgba(111,99,255,0.1)] px-3 py-1.5 text-[12px] font-bold text-[#6f63ff] transition-colors duration-150">
              Харах
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
