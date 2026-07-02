'use client'

import { useState, useRef, useEffect } from 'react'
import { Zap, Layers, Boxes, Rocket, Gem, Flame, Shield, Crown, type LucideIcon } from 'lucide-react'
import { packagePlans } from '../../data/siteContent'
import { useSectionAnim } from '../useSectionAnim'
import TypewriterText from '../TypewriterText'
import { useLang } from '../../context/LangContext'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import PricingCard from './packages/PricingCard'
import PricingToggle from './packages/PricingToggle'
import InfoPanel from './packages/InfoPanel'

interface PackagesSectionProps {
  active: boolean
  sectionRef: (el: HTMLElement | null) => void
}

// One icon per plan, purely decorative — order matches packagePlans.
const PLAN_ICONS: LucideIcon[] = [Zap, Layers, Boxes, Rocket, Gem, Flame, Shield, Crown]

export default function PackagesSection({ active, sectionRef }: PackagesSectionProps) {
  const innerRef = useSectionAnim(active)
  const { lang } = useLang()
  const mn = lang === 'mn'
  const [page, setPage] = useState(0)
  // Deck-vs-scroll nav mode is keyed to the same 767px line as page.tsx/globals.css —
  // intentionally not the tablet/lg lines used by the grid-column fix below.
  const { isMobile } = useBreakpoint()

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

      {/* Glow orbs — unchanged */}
      <div className="glow-orb w-[500px] h-[500px] top-[-20%] left-[30%]"
        style={{ background: 'radial-gradient(circle, rgba(111,99,255,0.22) 0%, transparent 70%)' }} />
      <div className="glow-orb w-[300px] h-[300px] bottom-[0%] right-[10%]"
        style={{ background: 'radial-gradient(circle, rgba(255,79,216,0.15) 0%, transparent 70%)' }} />
      {/* Very light grid texture for extra depth, additive only */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage: 'linear-gradient(rgba(111,99,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(111,99,255,1) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />

      <div ref={innerRef} className="panel-inner h-full w-full flex flex-col max-w-[1440px] mx-auto
                      px-[clamp(28px,6vw,96px)] pt-20 md:pt-[clamp(72px,9vh,100px)] pb-8">

        {/* Header */}
        <div className="text-center mb-2 mt-2">
          <p data-anim className="text-[11px] font-bold tracking-[0.22em] uppercase text-hot mb-2">
            <TypewriterText text={mn ? '05 — Багц' : '05 — Packages'} active={active} speed={22} delay={150} />
          </p>
          <h2 data-anim className="text-[clamp(26px,3.4vw,48px)] font-black uppercase pt-2 leading-[0.9] tracking-[-0.02em]">
            <TypewriterText text={mn ? 'Багц, ' : 'Packages, '} active={active} speed={45} delay={380} />
            <span className="gradient-text">
              <TypewriterText text={mn ? 'Төлөвлөгөө' : 'Plans'} active={active} speed={52} delay={670} />
            </span>
          </h2>
          <p data-anim className="text-[12px] md:text-[13px] text-mute/55 mt-1.5 max-w-100 mx-auto">
            {mn ? 'Танд тохирсон төлөвлөгөөг сонгоорой' : 'Pick the plan that fits your brand'}
          </p>
        </div>

        {/* Page toggle — floating segmented control, desktop only */}
        <PricingToggle
          page={page}
          onChange={setPage}
          labels={mn ? ['Онцго - 1', 'Бусад - 2'] : ['Package 1', 'Package 2']}
        />

        {/* Cards: swipeable carousel on small mobile, 2-up grid from 430px (tablet too), 4-col paginated on desktop */}
        <div
          ref={gridRef}
          className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory no-scrollbar z-10 gap-3 pt-3
                    -mx-[clamp(28px,6vw,96px)] px-[clamp(28px,6vw,96px)]
                    xs:grid xs:grid-cols-2 xs:overflow-visible xs:snap-none xs:mx-0 xs:px-0
                    md:grid-cols-2 lg:grid-cols-4"
        >
          {plansToShow.map((plan, i) => {
            const globalIndex = indexOffset + i
            return (
              <PricingCard
                key={globalIndex}
                plan={plan}
                globalIndex={globalIndex}
                Icon={PLAN_ICONS[globalIndex % PLAN_ICONS.length]}
                badgeLabel={mn ? 'Хамгийн онцго' : 'Most Popular'}
              />
            )
          })}
        </div>

        {/* Premium info panel */}
        <div className="mt-4">
          <InfoPanel mn={mn} phone="7270 3873" />
        </div>

        {/* Footer — unchanged, matches the rest of the site's per-section marker */}
        <div className="mt-4 pt-3 border-t border-line/30 flex items-center justify-between">
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
