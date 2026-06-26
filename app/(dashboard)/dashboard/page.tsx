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
    <div className="p-8 flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(184,194,221,0.4)' }}>
          Хянах самбар
        </p>
        <h1 className="text-[28px] font-black text-pxwhite tracking-tight">Сайн байна уу 👋</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-5 flex flex-col gap-3"
            style={{ border: `1px solid ${s.color}22` }}>
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(184,194,221,0.5)' }}>
              {s.label}
            </p>
            <p className="text-[32px] font-black leading-none" style={{ color: s.color }}>
              {s.value}
            </p>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full self-start"
              style={{ background: `${s.color}18`, color: s.color }}>
              {s.change} өнгөрсөн сараас
            </span>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(111,99,255,0.15)' }}>
        <h2 className="text-[15px] font-black text-pxwhite mb-5">Сүүлийн үйлдлүүд</h2>
        <div className="flex flex-col gap-3">
          {RECENT.map((r, i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b"
              style={{ borderColor: 'rgba(111,99,255,0.08)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black text-white shrink-0"
                style={{ background: `linear-gradient(135deg,${r.color}cc,${r.color}44)` }}>
                {r.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-pxwhite truncate">{r.name}</p>
                <p className="text-[11px] truncate" style={{ color: 'rgba(184,194,221,0.5)' }}>{r.action}</p>
              </div>
              <span className="text-[11px] shrink-0" style={{ color: 'rgba(184,194,221,0.35)' }}>{r.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
