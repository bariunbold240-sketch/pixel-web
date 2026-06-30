'use client'

import { useEffect, useRef } from 'react'
import TypewriterText from '../TypewriterText'
import { useLang } from '../../context/LangContext'

interface HeroSectionProps {
  active: boolean
  ready: boolean
  sectionRef: (el: HTMLElement | null) => void
}

const STATS = [
  { value: '120+', mn: 'ажилттай төсөл',  en: 'completed projects' },
  { value: '50+',  mn: 'клиент',           en: 'clients'            },
  { value: '24/7', mn: 'төлөвлөгөө',      en: 'plans'              },
  { value: '100%', mn: 'сэтгэл ханамж',   en: 'satisfaction'       },
]

export default function HeroSection({ active, ready, sectionRef }: HeroSectionProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  const { lang } = useLang()
  const mn = lang === 'mn'

  useEffect(() => {
    if (!active || !ready || !innerRef.current) return
    const el = innerRef.current
    let idleTimer: ReturnType<typeof setInterval>
    const off: (() => void)[] = []
    let alive = true

    import('gsap').then(({ default: gsap }) => {
      if (!alive) return

      const chars   = el.querySelectorAll<HTMLElement>('.ch')
      const eyebrow = el.querySelector<HTMLElement>('.eyebrow')
      const sub     = el.querySelector<HTMLElement>('.hero-sub')
      const btnRow  = el.querySelector<HTMLElement>('.hero-btns')
      const stats   = el.querySelectorAll<HTMLElement>('.stat-cell')

      gsap.set(chars,                    { y: 48, opacity: 0, rotateZ: 6 })
      gsap.set([eyebrow, sub, btnRow],   { y: 22, opacity: 0 })
      gsap.set(stats,                    { y: 20, opacity: 0 })

      gsap.timeline({ delay: 0.1 })
        .to(chars,   { y: 0, opacity: 1, rotateZ: 0, duration: 0.68, stagger: 0.06, ease: 'power4.out' })
        .to(eyebrow, { y: 0, opacity: 1, duration: 0.48, ease: 'power3.out' }, '-=0.3')
        .to(sub,     { y: 0, opacity: 1, duration: 0.48, ease: 'power3.out' }, '-=0.35')
        .to(btnRow,  { y: 0, opacity: 1, duration: 0.42, ease: 'back.out(1.4)' }, '-=0.3')
        .to(stats,   { y: 0, opacity: 1, duration: 0.42, stagger: 0.08, ease: 'power3.out' }, '-=0.25')
        .call(() => {
          if (!alive) return

          // Hover: chars bounce up individually
          chars.forEach(ch => {
            const onIn  = () => gsap.to(ch, { y: -8, scale: 1.12, duration: 0.2,  ease: 'power2.out',   overwrite: 'auto' })
            const onOut = () => gsap.to(ch, { y: 0,  scale: 1,    duration: 0.35, ease: 'power2.inOut', overwrite: 'auto' })
            ch.addEventListener('mouseenter', onIn)
            ch.addEventListener('mouseleave', onOut)
            off.push(
              () => ch.removeEventListener('mouseenter', onIn),
              () => ch.removeEventListener('mouseleave', onOut),
            )
          })

          // Hover: stat cells lift
          stats.forEach(s => {
            const onIn  = () => gsap.to(s, { y: -4, scale: 1.05, duration: 0.24, ease: 'power2.out',   overwrite: 'auto' })
            const onOut = () => gsap.to(s, { y: 0,  scale: 1,    duration: 0.38, ease: 'power2.inOut', overwrite: 'auto' })
            s.addEventListener('mouseenter', onIn)
            s.addEventListener('mouseleave', onOut)
            off.push(
              () => s.removeEventListener('mouseenter', onIn),
              () => s.removeEventListener('mouseleave', onOut),
            )
          })

          // Idle: alternate between char wave and tilt every ~8 s
          let cycle = 0
          idleTimer = setInterval(() => {
            if (!alive) return
            if (cycle % 2 === 0) {
              gsap.fromTo(chars,
                { y: 0 },
                { y: -10, duration: 0.24, stagger: 0.055, ease: 'power2.out', yoyo: true, repeat: 1 })
            } else {
              gsap.fromTo(chars,
                { rotateZ: 0 },
                { rotateZ: 4, duration: 0.2, stagger: 0.055, ease: 'power1.inOut', yoyo: true, repeat: 1 })
            }
            cycle++
          }, 8000)
        })
    })

    return () => {
      alive = false
      clearInterval(idleTimer)
      off.forEach(fn => fn())
    }
  }, [active, ready])

  return (
    <section
      className={`panel${active ? ' active' : ''}`}
      ref={sectionRef}
    >
      <div ref={innerRef} className="panel-inner h-full w-full flex flex-col max-w-[1440px] mx-auto">

        {/* ── Main content ─────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-start
                        px-[clamp(24px,6vw,96px)]
                        pt-20 md:pt-[clamp(200px,27vh,290px)]">

          <div
            id="heroTitle"
            className="hero-title text-[clamp(52px,13vw,180px)] font-black leading-[0.82] tracking-[-0.04em] select-none"
          >
            {'PIXEL'.split('').map((ch, i) => (
              <span key={i} className="ch">{ch}</span>
            ))}
          </div>

          <h1 className="eyebrow mt-4 font-black leading-[0.9] uppercase text-[clamp(14px,2.2vw,28px)] text-pxwhite">
            {mn ? <>ЗӨВ МЭССЭЖ<b className="text-hot"> ЗӨВ </b>ЗАХ ЗЭЭЛ</> : <>RIGHT MESSAGE<b className="text-hot"> RIGHT </b>MARKET</>}
          </h1>

          <p className="hero-sub mt-6 text-mute text-[clamp(13px,1.1vw,16px)] max-w-[520px] leading-[1.65]">
            <TypewriterText
              text={mn ? 'Бид брэндийн үнэ цэнийг бүтээж, дигитал орчинд тодорхой үр дүн гаргахад тань тусалдаг.' : 'We build brand value and help you achieve clear results in the digital world.'}
              active={active && ready}
              speed={22}
              delay={1800}
            />
          </p>

          <div className="hero-btns flex flex-wrap items-center gap-4 mt-8">
            <button className="rounded-xl bg-[linear-gradient(135deg,#6f63ff,#ff4fd8)] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(111,99,255,0.28)] hover:opacity-90 transition-opacity">
              {mn ? 'БИДНИЙ ТУХАЙ' : 'ABOUT US'}
            </button>
            <button className="rounded-xl border border-line bg-transparent px-6 py-3 text-sm font-bold text-pxwhite hover:border-hot hover:bg-white/5 transition-colors">
              {mn ? 'БАГЦ' : 'PACKAGES'}
            </button>
          </div>
        </div>

        {/* ── Stats bar ────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 shrink-0">
          {STATS.map((stat, i) => (
            <div
              key={stat.value}
              className={[
                'stat-cell flex flex-col items-center justify-center gap-2 py-4 md:py-0 md:h-[130px]',
                i % 2 === 0 ? 'border-r border-hot' : '',
                i < 2 ? 'border-b md:border-b-0 border-hot' : '',
                i < STATS.length - 1 ? 'md:border-r md:border-hot' : '',
              ].filter(Boolean).join(' ')}
            >
              <span className="text-[clamp(20px,2.4vw,36px)] font-bold text-hot leading-none">
                {stat.value}
              </span>
              <span className="text-[clamp(10px,0.9vw,13px)] text-mute tracking-wide text-center px-2">
                {mn ? stat.mn : stat.en}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
