import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Хянах самбар' }

const STATS = [
  { label: 'Нийт хэрэглэгч', value: '6,932', change: '+12%', color: '#15a59a' },
  { label: 'Төлбөр',         value: '2,949', change: '+8%',  color: '#6f63ff' },
  { label: 'Компани',        value: '197',   change: '+3%',  color: '#ff4fd8' },
  { label: 'Идэвхтэй',       value: '1,204', change: '+5%',  color: '#1e6fd4' },
]

const RECENT = [
  { name: 'Болд Э.',    action: 'гишүүнчлэл сунгасан', time: '2 мин',  color: '#15a59a' },
  { name: 'Сарнай М.', action: 'шинэ бүртгэл',        time: '14 мин', color: '#6f63ff' },
  { name: 'Ankhaa Gym', action: 'компани нэмэгдсэн',   time: '1 цаг',  color: '#ff4fd8' },
  { name: 'Дорж Б.',   action: 'төлбөр хийсэн',       time: '2 цаг',  color: '#1e6fd4' },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(184,194,221,0.4)' }}>
          Хянах самбар
        </p>
        <h1 className="text-[24px] font-black tracking-tight text-pxwhite sm:text-[28px]">Сайн байна уу 👋</h1>
      </div>

      {/* Stat cards — 2×2 on phones: four full-width cards pushed the activity
          list a screen below the fold */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="glass-card flex flex-col gap-3 rounded-2xl p-4 sm:p-5" style={{ border: `1px solid ${s.color}22` }}>
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
              {s.label}
            </p>
            <p className="text-[24px] font-black leading-none sm:text-[32px]" style={{ color: s.color }}>
              {s.value}
            </p>
            <span className="self-start rounded-full px-2 py-0.5 text-[11px] max-sm:text-[10px] font-bold" style={{ background: `${s.color}18`, color: s.color }}>
              {s.change} өнгөрсөн сараас
            </span>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="glass-card rounded-2xl p-4 sm:p-6" style={{ border: '1px solid rgba(111,99,255,0.15)' }}>
        <h2 className="mb-5 text-[15px] font-black text-pxwhite">Сүүлийн үйлдлүүд</h2>
        <div className="flex flex-col gap-3">
          {RECENT.map((r, i) => (
            <div key={i} className="flex items-center gap-4 border-b py-2" style={{ borderColor: 'rgba(111,99,255,0.08)' }}>
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[11px] font-black text-white"
                style={{ background: `linear-gradient(135deg,${r.color}cc,${r.color}44)` }}
              >
                {r.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-pxwhite">{r.name}</p>
                <p className="truncate text-[11px]" style={{ color: 'rgba(184,194,221,0.5)' }}>{r.action}</p>
              </div>
              <span className="shrink-0 text-[11px]" style={{ color: 'rgba(184,194,221,0.35)' }}>{r.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
