'use client'

import { useState, useRef, useEffect } from 'react'
import { Zap, Layers, Boxes, Rocket, Gem, Flame, Shield, Crown, type LucideIcon } from 'lucide-react'
import { packagePlans as DEFAULT_PACKAGE_PLANS, type PackagePlan } from '../../data/siteContent'
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

interface PackageRecord {
  id: number
  name: string
  price: string
  featured: boolean
  features: unknown
  order: number
}

function normalizeFeatures(features: unknown): PackagePlan['features'] {
  if (!Array.isArray(features)) return []

  return features
    .map((feature): PackagePlan['features'][number] | null => {
      if (!feature || typeof feature !== 'object') return null

      const candidate = feature as { label?: unknown; value?: unknown }
      if (typeof candidate.label !== 'string' || typeof candidate.value !== 'string') return null

      const label = candidate.label.trim()
      const value = candidate.value.trim()
      if (!label && !value) return null

      return { label, value }
    })
    .filter((feature): feature is PackagePlan['features'][number] => feature !== null)
}

function buildPlans(records: PackageRecord[]): PackagePlan[] {
  if (records.length === 0) return DEFAULT_PACKAGE_PLANS

  return records.map((record, index) => {
    const fallback = DEFAULT_PACKAGE_PLANS[index % DEFAULT_PACKAGE_PLANS.length]
    const features = normalizeFeatures(record.features)

    return {
      name: record.name?.trim() || fallback.name,
      price: record.price?.trim() || fallback.price,
      featured: record.featured ?? fallback.featured ?? false,
      features: features.length > 0 ? features : fallback.features,
    }
  })
}

export default function PackagesSection({ active, sectionRef }: PackagesSectionProps) {
  const innerRef = useSectionAnim(active)
  const { lang } = useLang()
  const mn = lang === 'mn'
  const [page, setPage] = useState(0)
  const [plans, setPlans] = useState<PackagePlan[]>(DEFAULT_PACKAGE_PLANS)
  // Deck-vs-scroll nav mode is keyed to the same 767px line as page.tsx/globals.css —
  // intentionally not the tablet/lg lines used by the grid-column fix below.
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    let cancelled = false

    async function loadPackages() {
      try {
        const res = await fetch('/api/packages', { cache: 'no-store' })
        if (!res.ok) return

        const data = await res.json() as PackageRecord[]
        const nextPlans = buildPlans(Array.isArray(data) ? data : [])
        if (!cancelled && nextPlans.length > 0) {
          setPlans(nextPlans)
        }
      } catch {
        // Keep the built-in fallback plan set if the API is unavailable.
      }
    }

    void loadPackages()

    return () => {
      cancelled = true
    }
  }, [])

  const pageSize = 4
  const pageCount = Math.max(1, Math.ceil(plans.length / pageSize))
  const activePage = Math.min(page, pageCount - 1)
  // Same paginated 4-up view on every breakpoint (mobile stacks them in one column).
  // Keeping the original order means each card keeps its real number — the featured
  // Pixel Core plan stays "02" instead of being renumbered to "01" by a mobile-only
  // reorder — and it still stands out via its scale/glow/badge styling wherever it sits.
  // Paginating on mobile too restores the 01/02 page toggle for the second plan set.
  const plansToShow = plans.slice(activePage * pageSize, activePage * pageSize + pageSize)
  const indexOffset = activePage * pageSize

  const sectionEl    = useRef<HTMLElement | null>(null)
  const gridRef      = useRef<HTMLDivElement | null>(null)
  const pageRef      = useRef(page)
  const prevPage     = useRef(page)
  const cooldown     = useRef(false)
  const firstRender  = useRef(true)

  useEffect(() => {
    pageRef.current = activePage
    if (page !== activePage) {
      setPage(activePage)
    }
  }, [activePage, page])

  // Card entrance animation on page switch
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    const dir = activePage > prevPage.current ? 1 : -1
    prevPage.current = activePage
    import('gsap').then(({ default: gsap }) => {
      const cards = gridRef.current?.querySelectorAll('[data-card]')
      if (!cards?.length) return
      gsap.fromTo(cards,
        { opacity: 0, x: dir * 36, scale: 0.96 },
        { opacity: 1, x: 0, scale: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out', overwrite: true }
      )
    })
  }, [activePage])

  useEffect(() => {
    const el = sectionEl.current
    if (!el || isMobile || pageCount <= 1) return  // wheel pagination not needed on mobile or single-page mode

    const onWheel = (e: WheelEvent) => {
      if (cooldown.current) { e.stopPropagation(); return }

      if (e.deltaY > 0 && pageRef.current < pageCount - 1) {
        e.stopPropagation()
        setPage((current) => Math.min(current + 1, pageCount - 1))
        cooldown.current = true
        setTimeout(() => { cooldown.current = false }, 1100)
      } else if (e.deltaY < 0 && pageRef.current > 0) {
        e.stopPropagation()
        setPage((current) => Math.max(current - 1, 0))
        cooldown.current = true
        setTimeout(() => { cooldown.current = false }, 1100)
      }
      // otherwise: let event bubble → parent navigates to next/prev section
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [isMobile, pageCount])  // re-run when layout/page count resolves

  return (
    <section
      className={`panel${active ? ' active' : ''}`}
      ref={(el) => { sectionEl.current = el; sectionRef(el) }}
    >

      {/* Mobile-only ambient glow behind the featured plan — soft purple so the
          pricing block doesn't read flat. Contained by the panel's overflow-x:clip. */}
      <div
        className="mobile-ambient md:hidden"
        aria-hidden="true"
        style={{ top: '26%', left: '50%', transform: 'translateX(-50%)', width: '75vw', height: '75vw', background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)' }}
      />

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
        <div className="text-center mb-2 mt-2 max-md:mt-0">
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
        {pageCount > 1 && (
          <PricingToggle
            page={activePage}
            onChange={setPage}
            labels={Array.from({ length: pageCount }, (_, i) => String(i + 1).padStart(2, '0'))}
          />
        )}

        {/* Cards: single-column full-width stack on mobile (<768px), 2-up grid on
            tablet, 4-col paginated on desktop */}
        <div
          ref={gridRef}
          className="flex flex-col gap-4 pt-3 z-10
                    md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-4"
        >
          {plansToShow.map((plan, i) => {
            const globalIndex = indexOffset + i
            return (
              <PricingCard
                key={globalIndex}
                plan={plan}
                globalIndex={globalIndex}
                Icon={PLAN_ICONS[globalIndex % PLAN_ICONS.length]}
                badgeLabel={mn ? 'Хамгийн онцгой' : 'Most Popular'}
              />
            )
          })}
        </div>

        {/* Premium info panel */}
        <div className="mt-4">
          <InfoPanel mn={mn} phone="99988130" />
        </div>

        {/* Footer — unchanged, matches the rest of the site's per-section marker */}
        <div className="mt-4 pt-3 border-t border-line/30 flex items-center justify-between">
          <span className="section-num">05 / 06</span>
          <p className="text-[11px] text-mute/50 text-center">
            {mn ? 'Холбоо барих:' : 'Contact:'}{' '}
            <span className="text-hot font-bold">99988130</span>
          </p>
          <span className="text-[10px] text-mute/40 uppercase tracking-[0.18em]">{mn ? 'Багц' : 'Packages'}</span>
        </div>
      </div>
    </section>
  )
}
