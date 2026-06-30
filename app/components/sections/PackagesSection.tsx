'use client'

import { useState, useRef, useEffect } from 'react'
import { packagePlans } from '../../data/siteContent'
import { useSectionAnim } from '../useSectionAnim'
import TypewriterText from '../TypewriterText'
import { useLang } from '../../context/LangContext'

interface PackagesSectionProps {
  active: boolean
  sectionRef: (el: HTMLElement | null) => void
}

export default function PackagesSection({ active, sectionRef }: PackagesSectionProps) {
  const innerRef = useSectionAnim(active)
  const { lang } = useLang()
  const mn = lang === 'mn'
  const [page, setPage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Mobile: show all 8 plans at once. Desktop: paginate 4 per page.
  const plansToShow = isMobile ? packagePlans : packagePlans.slice(page * 4, page * 4 + 4)
  const indexOffset = isMobile ? 0 : page * 4

  const sectionEl    = useRef<HTMLElement | null>(null)
  const gridRef      = useRef<HTMLDivElement | null>(null)
  const pageRef      = useRef(page)
  const prevPage     = useRef(page)
  const cooldown     = useRef(false)
  const firstRender  = useRef(true)

  useEffect(() => { pageRef.current = page }, [page])

  // Card entrance animation on page switch
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    const dir = page > prevPage.current ? 1 : -1
    prevPage.current = page
    import('gsap').then(({ default: gsap }) => {
      const cards = gridRef.current?.querySelectorAll('[data-card]')
      if (!cards?.length) return
      gsap.fromTo(cards,
        { opacity: 0, x: dir * 36, scale: 0.96 },
        { opacity: 1, x: 0, scale: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out', overwrite: true }
      )
    })
  }, [page])

  useEffect(() => {
    const el = sectionEl.current
    if (!el || isMobile) return  // wheel pagination not needed on mobile

    const onWheel = (e: WheelEvent) => {
      if (cooldown.current) { e.stopPropagation(); return }

      if (e.deltaY > 0 && pageRef.current === 0) {
        e.stopPropagation()
        setPage(1)
        cooldown.current = true
        setTimeout(() => { cooldown.current = false }, 1100)
      } else if (e.deltaY < 0 && pageRef.current === 1) {
        e.stopPropagation()
        setPage(0)
        cooldown.current = true
        setTimeout(() => { cooldown.current = false }, 1100)
      }
      // otherwise: let event bubble → parent navigates to next/prev section
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [isMobile])  // re-run when mobile state resolves

  return (
    <section
      className={`panel${active ? ' active' : ''}`}
      ref={(el) => { sectionEl.current = el; sectionRef(el) }}
    >

      {/* Glow orbs */}
      <div className="glow-orb w-[500px] h-[500px] top-[-20%] left-[30%]"
        style={{ background: 'radial-gradient(circle, rgba(111,99,255,0.22) 0%, transparent 70%)' }} />
      <div className="glow-orb w-[300px] h-[300px] bottom-[0%] right-[10%]"
        style={{ background: 'radial-gradient(circle, rgba(255,79,216,0.15) 0%, transparent 70%)' }} />

      <div ref={innerRef} className="panel-inner h-full w-full flex flex-col max-w-[1440px] mx-auto
                      px-[clamp(28px,6vw,96px)] pt-20 md:pt-[clamp(72px,9vh,100px)] pb-8">

        {/* Header */}
        <div className="text-center mb-4 mt-8">
          <p data-anim className="text-[11px] font-bold tracking-[0.22em] uppercase text-hot mb-3">
            <TypewriterText text={mn ? '05 — Багц' : '05 — Packages'} active={active} speed={22} delay={150} />
          </p>
          <h2 data-anim className="text-[clamp(30px,4vw,56px)] font-black uppercase pt-5 leading-[0.9] tracking-[-0.02em]">
            <TypewriterText text={mn ? 'Багц, ' : 'Packages, '} active={active} speed={45} delay={380} />
            <span className="gradient-text">
              <TypewriterText text={mn ? 'Төлөвлөгөө' : 'Plans'} active={active} speed={52} delay={670} />
            </span>
          </h2>
        </div>

        {/* Page toggle — desktop only; mobile shows all cards at once */}
        <div data-anim className="hidden md:flex justify-center gap-2 pt-5 mb-4">
          {[0, 1].map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="px-5 py-1.5 rounded-full text-[16px] font-bold uppercase tracking-wider cursor-pointer border-0 transition-all duration-200"
              style={
                page === p
                  ? { background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', color: '#fff', boxShadow: '0 4px 16px rgba(111,99,255,0.35)' }
                  : { background: 'rgba(111,99,255,0.1)', color: 'rgba(184,194,221,0.6)', border: '1px solid rgba(111,99,255,0.2)' }
              }
            >
              {p === 0 ? (mn ? 'Багц - 1' : 'Package 1') : (mn ? 'Багц - 2' : 'Package 2')}
            </button>
          ))}
        </div>

        {/* Cards: all on mobile scroll, 4-column paginated on desktop */}
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5">
          {plansToShow.map((plan, i) => {
            const globalIndex = indexOffset + i
            const isFeatured = !!plan.featured
            return (
              <div
                key={globalIndex}
                data-anim
                data-card
                className="relative flex flex-col overflow-hidden rounded-xl cursor-default"
                style={
                  isFeatured
                    ? {
                        background: 'linear-gradient(180deg, rgba(111,99,255,0.18) 0%, rgba(18,24,44,0.52) 100%)',
                        border: '1px solid rgba(111,99,255,0.5)',
                        boxShadow: '0 0 40px rgba(111,99,255,0.25), 0 0 80px rgba(255,79,216,0.1)',
                      }
                    : {
                        background: 'var(--color-glass)',
                        border: '1px solid var(--color-line)',
                        backdropFilter: 'blur(24px)',
                      }
                }
              >
                {/* Top gradient line */}
                {isFeatured && (
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(90deg,#6f63ff,#ff4fd8)' }} />
                )}

                <div className="p-2.5 md:p-4 flex flex-col h-full">
                  {/* Featured badge — in-flow so it doesn't overlap plan name */}
                  {isFeatured && (
                    <div className="self-start text-[7px] font-black tracking-wider px-2 py-0.5 rounded-full mb-2"
                      style={{ background: 'linear-gradient(90deg,#6f63ff,#ff4fd8)', color: '#fff' }}>
                      {mn ? 'САНАЛ БОЛГОХ' : 'RECOMMENDED'}
                    </div>
                  )}
                  {/* Name + Price */}
                  <div className="mb-3 pb-3 border-b border-line/40">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[13px] font-bold tracking-[0.14em] uppercase text-mute/60 truncate">
                        {plan.name}
                      </p>
                      <span className="shrink-0 ml-2 text-[14px] font-mono tabular-nums"
                        style={{ color: 'rgba(184,194,221,0.25)', letterSpacing: '0.08em' }}>
                        {String(globalIndex + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p
                      className="text-[clamp(16px,1.6vw,22px)] font-black leading-none"
                      style={isFeatured ? { background: 'linear-gradient(135deg,#6f63ff,#ff4fd8)', WebkitBackgroundClip: 'text', color: 'transparent' } : { color: '#f7f9ff' }}
                    >
                      {plan.price || <span className="text-mute/30 text-[13px]"></span>}
                    </p>
                  </div>

                  {/* Features list */}
                  <ul className="flex flex-col gap-1.5 flex-1" style={{ scrollbarWidth: 'none' }}>
                    {plan.features.map((f, j) => {
                      const included = f.value !== '—'
                      return (
                        <li key={j} className="flex items-center justify-between gap-1 text-[11px] md:text-[15px]">
                          <span className={`flex items-center gap-1.5 min-w-0 ${included ? 'text-mute/80' : 'text-mute/25'}`}>
                            <span className="shrink-0 w-3 h-3 rounded-full flex items-center justify-center text-[7px]"
                              style={{
                                background: included
                                  ? (isFeatured ? 'rgba(111,99,255,0.3)' : 'rgba(184,194,221,0.1)')
                                  : 'rgba(184,194,221,0.05)',
                                color: included
                                  ? (isFeatured ? '#6f63ff' : '#b8c2dd')
                                  : 'rgba(184,194,221,0.2)',
                              }}>
                              {included ? '✓' : '·'}
                            </span>
                            <span className="truncate">{f.label}</span>
                          </span>
                          <span
                            className="shrink-0 font-bold text-[11px] md:text-[15px] ml-1"
                            style={{ color: included ? (isFeatured ? '#ff4fd8' : '#f7f9ff') : 'rgba(184,194,221,0.2)' }}
                          >
                            {f.value}
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  {/* CTA */}
                  
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-line/30 flex items-center justify-between">
          <span className="section-num">05 / 06</span>
          <p className="text-[11px] text-mute/50 text-center">
            {mn ? 'Холбоо барих:' : 'Contact:'}{' '}
            <span className="text-hot font-bold">7270 3873</span>
          </p>
          <span className="text-[10px] text-mute/40 uppercase tracking-[0.18em]">{mn ? 'Багц' : 'Packages'}</span>
        </div>
      </div>
    </section>
  )
}
