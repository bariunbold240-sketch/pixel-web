import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [photoCount, iconCount, packageCount, projectCount, recentPhotos, recentIcons] = await Promise.all([
    prisma.galleryPhoto.count(),
    prisma.techIcon.count(),
    prisma.package.count(),
    prisma.project.count(),
    prisma.galleryPhoto.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.techIcon.findMany({ orderBy: { createdAt: 'desc' }, take: 2 }),
  ])

  const STATS = [
    { label: 'Галерей зураг',   value: photoCount,    color: '#ff4fd8', suffix: '' },
    { label: 'Харилцагч Icon',  value: iconCount,     color: '#6f63ff', suffix: '' },
    { label: 'Багц',            value: packageCount,  color: '#15a59a', suffix: '' },
    { label: 'Төслүүд',         value: projectCount,  color: '#f4c20d', suffix: '' },
  ]

  type RecentItem = { label: string; sub: string; color: string; letter: string }

  const recent: RecentItem[] = [
    ...recentPhotos.map(p => ({
      label:  p.src.split('/').pop() ?? p.src,
      sub:    'Галерей зураг нэмэгдсэн',
      color:  '#ff4fd8',
      letter: '🖼',
    })),
    ...recentIcons.map(ic => ({
      label:  ic.label,
      sub:    'Icon нэмэгдсэн',
      color:  '#6f63ff',
      letter: '⭐',
    })),
  ]

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:p-8">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(184,194,221,0.4)' }}>
          Хянах самбар
        </p>
        <h1 className="text-[24px] font-black tracking-tight text-pxwhite sm:text-[28px]">Сайн байна уу 👋</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="glass-card flex flex-col gap-3 rounded-2xl p-5" style={{ border: `1px solid ${s.color}22` }}>
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
              {s.label}
            </p>
            <p className="text-[36px] font-black leading-none" style={{ color: s.color }}>
              {s.value}{s.suffix}
            </p>
            <span className="self-start rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: `${s.color}18`, color: s.color }}>
              DB-д хадгалагдсан
            </span>
          </div>
        ))}
      </div>

      {/* Recent additions */}
      <div className="glass-card rounded-2xl p-4 sm:p-6" style={{ border: '1px solid rgba(111,99,255,0.15)' }}>
        <h2 className="mb-5 text-[15px] font-black text-pxwhite">Сүүлд нэмэгдсэн</h2>

        {recent.length === 0 ? (
          <p className="text-[13px]" style={{ color: 'rgba(184,194,221,0.4)' }}>Одоогоор бичлэг алга</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recent.map((r, i) => (
              <div key={i} className="flex items-center gap-4 border-b py-2" style={{ borderColor: 'rgba(111,99,255,0.08)' }}>
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[14px]"
                  style={{ background: `${r.color}22`, border: `1px solid ${r.color}33` }}
                >
                  {r.letter}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-pxwhite">{r.label}</p>
                  <p className="truncate text-[11px]" style={{ color: 'rgba(184,194,221,0.5)' }}>{r.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/admin/gallery',   label: 'Галерей удирдах', sub: `${photoCount} зураг`,   color: '#ff4fd8' },
          { href: '/admin/icons',     label: 'Icon удирдах',    sub: `${iconCount} icon`,      color: '#6f63ff' },
          { href: '/admin/packages',  label: 'Багц удирдах',    sub: `${packageCount} багц`,  color: '#15a59a' },
          { href: '/admin/projects',  label: 'Төсөл удирдах',   sub: `${projectCount} төсөл`, color: '#f4c20d' },
        ].map(link => (
          <a
            key={link.href}
            href={link.href}
            className="glass-card flex items-center justify-between rounded-2xl p-5 no-underline transition-all duration-200 hover:scale-[1.01]"
            style={{ border: `1px solid ${link.color}20` }}
          >
            <div>
              <p className="text-[14px] font-bold text-pxwhite">{link.label}</p>
              <p className="text-[12px] mt-0.5" style={{ color: link.color }}>{link.sub}</p>
            </div>
            <span className="text-[20px]" style={{ color: `${link.color}88` }}>→</span>
          </a>
        ))}
      </div>
    </div>
  )
}
