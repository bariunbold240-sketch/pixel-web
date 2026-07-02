'use client'

import { useSectionAnim } from '../useSectionAnim'
import TypewriterText from '../TypewriterText'
import { useLang } from '../../context/LangContext'

const VISION_MN = 'Бид байгуулагуудын зөв санаа, зөв стратегийг зөв зах зээлд хүргэж, маркетингийг зардал бус өсөлтийн бодит хөдөлгөгч хүч болгодог итгэлтэй түнш агентлаг байхыг зорьдог.'
const VISION_EN = 'We are a trusted partner agency that delivers the right message, the right strategy to the right market — turning marketing from a cost into a real driver of growth.'

const VALUES = [
  { mn: 'Зөв мессежийг зөв газарт хүргэнэ', en: 'Deliver the right message to the right place', color: '#6f63ff' },
  { mn: 'Итгэл ба ёс зүйг эрхэмлэнэ',        en: 'Uphold trust and ethics',                        color: '#ff4fd8' },
  { mn: 'Хамтын өсөлтийг бүтээнэ',            en: 'Build shared growth',                            color: '#15a59a' },
]

const STATS = [
  { n: '120+', mn: 'Дууссан төсөл',   en: 'Completed Projects', color: '#6f63ff' },
  { n: '50+',  mn: 'Сэтгэл ханамж',   en: 'Satisfied Clients',  color: '#ff4fd8' },
  { n: '4+',   mn: 'Жилийн туршлага', en: 'Years Experience',   color: '#15a59a' },
]

interface VisionSectionProps {
  active: boolean
  sectionRef: (el: HTMLElement | null) => void
}

export default function VisionSection({ active, sectionRef }: VisionSectionProps) {
  const innerRef = useSectionAnim(active)
  const { lang } = useLang()
  const mn = lang === 'mn'

  return (
    <section className={`panel${active ? ' active' : ''}`} ref={sectionRef}>

      {/* Glow orbs */}
      <div className="glow-orb top-[-20%] right-[-10%]"
        style={{ width: 'clamp(380px,90vw,700px)', height: 'clamp(380px,90vw,700px)', background: 'radial-gradient(circle, rgba(111,99,255,0.2) 0%, transparent 70%)' }} />
      <div className="glow-orb w-[400px] h-[400px] bottom-[-5%] left-[-8%]"
        style={{ background: 'radial-gradient(circle, rgba(255,79,216,0.15) 0%, transparent 70%)' }} />
      <div className="glow-orb w-[280px] h-[280px] top-[40%] left-[36%]"
        style={{ background: 'radial-gradient(circle, rgba(21,165,154,0.1) 0%, transparent 70%)' }} />

      <div ref={innerRef} className="panel-inner h-full w-full flex flex-col max-w-[1440px] mx-auto
                      px-[clamp(28px,6vw,96px)] pt-20 md:pt-[clamp(80px,10vh,110px)] pb-8">

        {/* Header */}
        <div className="mb-5 lg:mb-10 flex items-end justify-between">
          <div>
            <p data-anim className="text-[11px] font-bold tracking-[0.22em] uppercase text-hot mb-3">
              <TypewriterText text={mn ? '02 — Алсын Харааа · Үнэт Зүйл' : '02 — Vision · Values'} active={active} speed={22} delay={150} />
            </p>
            <h2 data-anim className="text-[clamp(32px,4.5vw,60px)] font-black uppercase leading-[0.9] tracking-[-0.02em]">
              <TypewriterText text={mn ? 'Алсын Харааа, ' : 'Vision, '} active={active} speed={42} delay={400} />
              <span className="gradient-text">
                <TypewriterText text={mn ? 'Үнэт Зүйл' : 'Values'} active={active} speed={50} delay={1020} />
              </span>
            </h2>
          </div>

          {/* Status pill */}
          <div data-anim className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: 'rgba(111,99,255,0.1)', border: '1px solid rgba(111,99,255,0.25)' }}>
            <span className="w-2 h-2 rounded-full"
              style={{ background: '#6f63ff', boxShadow: '0 0 6px rgba(111,99,255,0.8)' }} />
            <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: 'rgba(184,194,221,0.6)' }}>
              Vision 2025
            </span>
          </div>
        </div>

        {/* Body: 2-column on desktop and tablet, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_360px] gap-5 lg:gap-6 md:flex-1 md:min-h-0">

          {/* ── Left: Vision card ── */}
          <div data-anim className="glass-card rounded-2xl p-5 md:p-8 flex flex-col relative overflow-hidden">

            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: 'linear-gradient(90deg, #6f63ff, #ff4fd8, transparent)' }} />

            {/* Decorative large quote */}
            <div className="hidden md:block absolute top-2 right-5 text-[130px] font-black leading-none pointer-events-none select-none"
              style={{ color: 'rgba(111,99,255,0.06)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>
              "
            </div>

            {/* Icon + label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,rgba(111,99,255,0.28),rgba(255,79,216,0.18))',
                  border: '1px solid rgba(111,99,255,0.3)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6f63ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(184,194,221,0.5)' }}>
                {mn ? 'Алсын Харааа' : 'Vision'}
              </span>
            </div>

            {/* Body text */}
            <p className="text-[clamp(14px,1.35vw,17px)] leading-[1.9] font-medium flex-1 relative z-10"
              style={{ color: 'rgba(184,194,221,0.85)' }}>
              <TypewriterText
                text={mn ? VISION_MN : VISION_EN}
                active={active} speed={9} delay={1500}
              />
            </p>

            {/* Divider + stats */}
            <div className="mt-7 pt-6 grid grid-cols-3 gap-6"
              style={{ borderTop: '1px solid rgba(111,99,255,0.12)' }}>
              {STATS.map((s) => (
                <div key={s.n} className="flex flex-col gap-1.5">
                  <p className="text-[clamp(22px,2.2vw,30px)] font-black leading-none"
                    style={{ color: s.color }}>
                    {s.n}
                  </p>
                  <p className="text-[11px] tracking-wide" style={{ color: 'rgba(184,194,221,0.5)' }}>
                    {mn ? s.mn : s.en}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Values ── */}
          <div className="flex flex-col gap-3">

            {/* Section label */}
            <div data-anim className="flex items-center gap-3 mb-2">
              <div className="w-1 h-5 rounded-full"
                style={{ background: 'linear-gradient(180deg, #6f63ff, #ff4fd8)' }} />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(184,194,221,0.5)' }}>
                {mn ? 'Үнэт Зүйл' : 'Values'}
              </span>
            </div>

            {/* Horizontal swipe carousel below 768px (full mobile-width column with room to
                spare from md: up, where the original vertical stack is restored) */}
            <div className="values-scroll flex flex-nowrap overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3
                            -mx-[clamp(28px,6vw,96px)] px-[clamp(28px,6vw,96px)]
                            md:flex-col md:overflow-visible md:snap-none md:mx-0 md:px-0">
              {VALUES.map((v, i) => (
                <div
                  key={i}
                  data-anim
                  className="values-card shrink-0 w-[78vw] snap-center md:w-auto md:shrink
                            glass-card rounded-2xl px-5 py-5 group cursor-default relative overflow-hidden"
                  style={{ borderLeft: `2px solid ${v.color}55` }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 25% 50%, ${v.color}0e, transparent 70%)`,
                      transition: 'opacity 0.4s' }} />

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black"
                      style={{ background: `linear-gradient(135deg,${v.color}28,${v.color}0e)`,
                        border: `1px solid ${v.color}30`, color: v.color }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>

                    <p className="flex-1 text-[clamp(13px,1.05vw,14px)] font-medium leading-[1.55]"
                      style={{ color: 'rgba(247,249,255,0.85)' }}>
                      {mn ? v.mn : v.en}
                    </p>

                    <span className="shrink-0 text-[13px] group-hover:translate-x-0.5 transition-transform duration-300"
                      style={{ color: v.color + '50' }}>
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote card */}
            <div data-anim className="mt-auto rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg,rgba(111,99,255,0.12),rgba(255,79,216,0.07))',
                border: '1px solid rgba(111,99,255,0.18)' }}>

              <div className="absolute top-1 left-4 text-[60px] font-black leading-none pointer-events-none select-none"
                style={{ color: 'rgba(111,99,255,0.22)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>
                "
              </div>

              <p className="text-[clamp(12px,0.95vw,14px)] leading-[1.75] italic relative z-10 mt-5 pl-1"
                style={{ color: 'rgba(247,249,255,0.7)' }}>
                {mn ? 'Зөв мессеж · Зөв зах зээл' : 'Right Message · Right Market'}
              </p>

              <div className="flex items-center gap-3 mt-3 relative z-10">
                <div className="h-px flex-1"
                  style={{ background: 'linear-gradient(90deg,rgba(111,99,255,0.45),transparent)' }} />
                <p className="text-[10px] font-black tracking-widest" style={{ color: '#ff4fd8' }}>
                  — PIXEL Agency
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(111,99,255,0.12)' }}>
          <span className="section-num">02 / 06</span>
          <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'rgba(184,194,221,0.35)' }}>
            {mn ? 'Алсын Харааа' : 'Vision'}
          </span>
        </div>
      </div>
    </section>
  )
}
