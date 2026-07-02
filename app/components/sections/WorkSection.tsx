'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLang } from '../../context/LangContext'
import { useBreakpoint } from '../../hooks/useBreakpoint'

interface WorkSectionProps {
  active: boolean
  sectionRef: (el: HTMLElement | null) => void
}

interface LeftContentProps {
  p: typeof PROJECTS[0]
  activeIdx: number
  totalCount: number
  goTo: (i: number, dir: 1 | -1) => void
  idxRef: React.MutableRefObject<number>
  mn: boolean
}

const PROJECTS = [
  {
    num: '04',
    tag: { mn: 'Дижитал Бүтээгдэхүүн', en: 'Digital Product' },
    title: { mn: ['GYMHUB', 'Фитнесс Хөтөлбөр'], en: ['GYMHUB', 'Fitness Platform'] },
    description: {
      mn: 'Фитнесс гишүүнчлэлийн менежментийн платформ — хэрэглэгч, төлбөр, компани, дашбоард аналитик.',
      en: 'Fitness membership management platform — users, payments, companies, and dashboard analytics.',
    },
    stats: [
      { n: '6,932', mn: 'Хэрэглэгч', en: 'Users'     },
      { n: '2,949', mn: 'Төлбөр',    en: 'Payments'  },
      { n: '197',   mn: 'Компани',   en: 'Companies' },
    ],
    accent: '#15a59a',
    mockupGrad: 'linear-gradient(135deg, #0d4f4a 0%, #0a3d55 50%, #05050d 100%)',
    img: '/portfolio/gymhub.jpg',
  },
  {
    num: '05',
    tag: { mn: 'Вэбсайт', en: 'Website' },
    title: { mn: ['NOVA MIND', 'Acadемy'], en: ['NOVA MIND', 'Academy'] },
    description: {
      mn: 'Боловсролын төвийн вэбсайт — хөтөлбөрийн каталог, бүртгэл, хоёр хэлний интерфэйс.',
      en: 'Education center website — program catalog, registration, and bilingual interface.',
    },
    stats: [
      { n: '65%', mn: 'Хөрвөлт өсөлт', en: 'Conversion Growth' },
      { n: '40%', mn: 'Зочлогч өсөлт',  en: 'Visitor Growth'    },
      { n: '80%', mn: 'Өмнөхөөс дээр',  en: 'Improvement'       },
    ],
    accent: '#6f63ff',
    mockupGrad: 'linear-gradient(135deg, #1a1060 0%, #2d1b6e 50%, #05050d 100%)',
    img: '/portfolio/novaMind.jpg',
  },
  {
    num: '06',
    tag: { mn: 'Instagram Маркетинг', en: 'Instagram Marketing' },
    title: { mn: ['BLUEBELL', 'Flower Shop'], en: ['BLUEBELL', 'Flower Shop'] },
    description: {
      mn: 'Instagram контент, брэндинг ба фолловер өсөлт — 1,065+ дагагч, тогтмол рийл бүтээл.',
      en: 'Instagram content, branding and follower growth — 1,065+ followers, consistent reel creation.',
    },
    stats: [
      { n: '1,065+', mn: 'Дагагч', en: 'Followers' },
      { n: '18',     mn: 'Постер', en: 'Posts'      },
      { n: '320%',   mn: 'Өсөлт', en: 'Growth'     },
    ],
    accent: '#ff4fd8',
    mockupGrad: 'linear-gradient(135deg, #4d0035 0%, #7a0055 50%, #05050d 100%)',
    img: '/portfolio/bluebell_flower.jpg',
  },
]

interface TechIconItem {
  src: string
  label: string
}

const DEFAULT_TECH_ICONS: TechIconItem[] = [
  { src: '/icon/icon1.png', label: 'Car Care' },
  { src: '/icon/icon2.png', label: 'Badal' },
  { src: '/icon/icon3.png', label: 'GymHub' },
  { src: '/icon/icon4.png', label: 'Nova Mind' },
  { src: '/icon/icon5.png', label: 'Bluebell' },
]

type ProjectSlide = typeof PROJECTS[0]

interface ProjectRecord {
  id: number
  name: string
  status: string
  members: number
  color: string
  image: string
  description: string
  stats: unknown
  order: number
}

function splitTitle(name: string, fallback: string[]): [string, string] {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return [fallback[0] || '', fallback[1] || fallback[0] || '']
  if (words.length === 1) return [words[0], fallback[1] || words[0]]

  const splitAt = Math.ceil(words.length / 2)
  const left = words.slice(0, splitAt).join(' ')
  const right = words.slice(splitAt).join(' ')
  return [left, right || fallback[1] || left]
}

function normalizeHexColor(input: string | undefined, fallback: string) {
  const value = (input ?? '').trim()
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value
  return fallback
}

function hexToRgba(hex: string, alpha: number) {
  const match = /^#?([0-9a-fA-F]{6})$/.exec(hex)
  if (!match) return `rgba(111,99,255,${alpha})`

  const value = Number.parseInt(match[1], 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  return `rgba(${r},${g},${b},${alpha})`
}

function normalizeStats(rawStats: unknown, fallback: ProjectSlide['stats']): ProjectSlide['stats'] {
  if (Array.isArray(rawStats)) {
    const stats = rawStats
      .map((item): ProjectSlide['stats'][number] | null => {
        if (!item || typeof item !== 'object') return null

        const value = typeof (item as { value?: unknown }).value === 'string'
          ? ((item as { value?: string }).value ?? '').trim()
          : ''
        const label = typeof (item as { label?: unknown }).label === 'string'
          ? ((item as { label?: string }).label ?? '').trim()
          : ''

        if (!value && !label) return null

        return {
          n: value || label,
          mn: label || value,
          en: label || value,
        }
      })
      .filter((item): item is ProjectSlide['stats'][number] => item !== null)

    if (stats.length > 0) return stats
  }

  return fallback
}

function buildSlides(projects: ProjectRecord[]): ProjectSlide[] {
  if (projects.length === 0) return PROJECTS

  return projects.map((project, index) => {
    const fallback = PROJECTS[index % PROJECTS.length]
    const accent = normalizeHexColor(project.color, fallback.accent)
    const title = splitTitle(project.name || fallback.title.en.join(' '), fallback.title.en)
    const description = project.description?.trim() || fallback.description.en

    return {
      num: String(index + 4).padStart(2, '0'),
      tag: fallback.tag,
      title: {
        mn: title,
        en: title,
      },
      description: {
        mn: description,
        en: description,
      },
      stats: normalizeStats(project.stats, fallback.stats),
      accent,
      mockupGrad: `linear-gradient(135deg, ${hexToRgba(accent, 0.28)} 0%, ${hexToRgba(accent, 0.12)} 50%, #05050d 100%)`,
      img: project.image?.trim() || fallback.img,
    }
  })
}

function LeftContent({ p, activeIdx, totalCount, goTo, idxRef, mn }: LeftContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    let idleTimer: ReturnType<typeof setInterval>
    const off: (() => void)[] = []

    import('gsap').then(({ default: gsap }) => {
      gsap.set(el.querySelector('[data-anim="tag"]'),      { x: -28, opacity: 0 })
      gsap.set(el.querySelectorAll('[data-anim="title"]'), { y: '108%' })
      gsap.set(el.querySelector('[data-anim="desc"]'),     { y: 20, opacity: 0 })
      gsap.set(el.querySelectorAll('[data-anim="tech"]'),  { scale: 0.72, opacity: 0 })
      gsap.set(el.querySelectorAll('[data-anim="stat"]'),  { y: 24, opacity: 0 })
      gsap.set(el.querySelector('[data-anim="dots"]'),     { opacity: 0 })

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to(el.querySelector('[data-anim="tag"]'),
          { x: 0, opacity: 1, duration: 0.44 }, 0.08)
        .to(el.querySelectorAll('[data-anim="title"]'),
          { y: '0%', duration: 0.72, stagger: 0.14, ease: 'power4.out' }, 0.2)
        .to(el.querySelector('[data-anim="desc"]'),
          { y: 0, opacity: 1, duration: 0.52 }, '-=0.36')
        .to(el.querySelectorAll('[data-anim="tech"]'),
          { scale: 1, opacity: 1, duration: 0.38, stagger: 0.075, ease: 'back.out(1.8)' }, '-=0.32')
        .to(el.querySelectorAll('[data-anim="stat"]'),
          { y: 0, opacity: 1, duration: 0.44, stagger: 0.1 }, '-=0.3')
        .to(el.querySelector('[data-anim="dots"]'),
          { opacity: 1, duration: 0.36 }, '-=0.2')
        .call(() => {
          // No pointer hover capability (touch) — skip hover listeners AND the idle
          // showcase cycle entirely. This LeftContent instance isn't gated by `active`
          // (mobile mounts every section's content simultaneously), so an ungated idle
          // timer here would run GSAP tweens forever even while the user is elsewhere.
          const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
          if (canHover) {
            const hover = (sel: string, inV: object, outV: object) => {
              el.querySelectorAll<HTMLElement>(sel).forEach(elem => {
                const onIn  = () => gsap.to(elem, { ...inV,  duration: 0.26, ease: 'power2.out',   overwrite: 'auto' })
                const onOut = () => gsap.to(elem, { ...outV, duration: 0.42, ease: 'power2.inOut', overwrite: 'auto' })
                elem.addEventListener('mouseenter', onIn)
                elem.addEventListener('mouseleave', onOut)
                off.push(
                  () => elem.removeEventListener('mouseenter', onIn),
                  () => elem.removeEventListener('mouseleave', onOut),
                )
              })
            }

            hover('[data-anim="tag"]',   { x: 7 },                          { x: 0 })
            hover('[data-anim="title"]', { x: 5, scale: 1.018, transformOrigin: '0% 50%' }, { x: 0, scale: 1 })
            hover('[data-anim="tech"]',  { y: -6, scale: 1.12 },            { y: 0, scale: 1 })
            hover('[data-anim="stat"]',  { y: -5, scale: 1.06 },            { y: 0, scale: 1 })
          }

          if (!canHover) return

          let cycle = 0
          idleTimer = setInterval(() => {
            if (!document.contains(el)) return
            const techs  = el.querySelectorAll('[data-anim="tech"]')
            const stats  = el.querySelectorAll('[data-anim="stat"]')
            const titles = el.querySelectorAll('[data-anim="title"]')

            if (cycle % 3 === 0) {
              gsap.fromTo(techs,  { y: 0 }, { y: -8, duration: 0.28, stagger: 0.09, ease: 'power2.out', yoyo: true, repeat: 1 })
            } else if (cycle % 3 === 1) {
              gsap.fromTo(stats,  { scale: 1 }, { scale: 1.07, duration: 0.25, stagger: 0.1, ease: 'power2.out', yoyo: true, repeat: 1 })
            } else {
              gsap.fromTo(titles, { x: 0, opacity: 1 }, { x: 8, opacity: 0.6, duration: 0.22, stagger: 0.1, ease: 'power1.in', yoyo: true, repeat: 1 })
            }
            cycle++
          }, 8000)
        })
    })

    return () => {
      clearInterval(idleTimer)
      off.forEach(fn => fn())
    }
  }, [])

  return (
    <div ref={ref} className="flex flex-col gap-6 relative z-10">
      <p
        data-anim="tag"
        className="text-[11px] font-bold tracking-[0.22em] uppercase"
        style={{ color: p.accent }}
      >
        {p.num} — {mn ? 'Хамтрагчид' : 'Partners'} · {mn ? p.tag.mn : p.tag.en}
      </p>

      <h2 className="text-[clamp(36px,4.8vw,68px)] font-black uppercase leading-[0.88] tracking-[-0.03em]">
        <div className="overflow-hidden">
          <span data-anim="title" className="gradient-text block">
            {mn ? p.title.mn[0] : p.title.en[0]}
          </span>
        </div>
        <div className="overflow-hidden">
          <span data-anim="title" className="block text-pxwhite">
            {mn ? p.title.mn[1] : p.title.en[1]}
          </span>
        </div>
      </h2>

      <p
        data-anim="desc"
        className="text-[clamp(14px,1.2vw,17px)] text-mute leading-[1.85] max-w-[36rem]"
      >
        {mn ? p.description.mn : p.description.en}
      </p>

      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {p.stats.map((s) => (
          <div data-anim="stat" key={s.en} className="glass-card rounded-2xl p-3 md:p-4 text-center">
            <p
              className="text-[clamp(18px,2vw,28px)] font-black leading-none mb-1"
              style={{ color: p.accent }}
            >
              {s.n}
            </p>
            <p className="text-[10px] text-mute tracking-wide">{mn ? s.mn : s.en}</p>
          </div>
        ))}
      </div>

      <div data-anim="dots" className="flex items-center gap-2">
        {Array.from({ length: totalCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > idxRef.current ? 1 : -1)}
            aria-label={`${mn ? 'Төсөл' : 'Project'} ${i + 1}`}
            className="flex items-center justify-center min-h-11 lg:min-h-0 px-0.5 border-0 cursor-pointer bg-transparent"
          >
            <span
              className="block h-1 rounded-full transition-all duration-300"
              style={{
                width: i === activeIdx ? 28 : 10,
                background: i === activeIdx ? p.accent : 'rgba(184,194,221,0.2)',
              }}
            />
          </button>
        ))}
        <span className="ml-2 text-[11px] text-mute/50">
          {String(activeIdx + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

export default function WorkSection({ active, sectionRef }: WorkSectionProps) {
  const { lang } = useLang()
  const mn = lang === 'mn'
  const { isDesktop } = useBreakpoint()
  const [activeIdx, setActiveIdx] = useState(0)
  const [projects, setProjects] = useState<ProjectSlide[]>(PROJECTS)
  const [techIcons, setTechIcons] = useState<TechIconItem[]>(DEFAULT_TECH_ICONS)
  const mockupRefs  = useRef<(HTMLDivElement | null)[]>([])
  const rightColRef = useRef<HTMLDivElement>(null)
  const textKey     = useRef(0)
  const busyRef     = useRef(false)
  const idxRef      = useRef(0)
  const totalCount  = projects.length
  const stripIcons   = techIcons.length > 0 ? techIcons : DEFAULT_TECH_ICONS

  useEffect(() => { idxRef.current = activeIdx }, [activeIdx])

  useEffect(() => {
    let cancelled = false

    async function loadProjects() {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' })
        if (!res.ok) return

        const data = await res.json() as ProjectRecord[]
        const nextProjects = buildSlides(Array.isArray(data) ? data : [])
        if (cancelled || nextProjects.length === 0) return

        setProjects(nextProjects)
        setActiveIdx((current) => Math.min(current, nextProjects.length - 1))
      } catch {
        // Keep the fallback showcase if the public API is unavailable.
      }
    }

    void loadProjects()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadTechIcons() {
      try {
        const res = await fetch('/api/icons', { cache: 'no-store' })
        if (!res.ok) return

        const data = await res.json() as Array<{ src?: string | null; label?: string | null }>
        const nextIcons = data
          .map((icon) => ({
            src: icon.src?.trim() ?? '',
            label: icon.label?.trim() ?? '',
          }))
          .filter((icon) => icon.src.length > 0 && icon.label.length > 0)

        if (!cancelled && nextIcons.length > 0) {
          setTechIcons(nextIcons)
        }
      } catch {
        // Keep the built-in strip if the public API is unavailable.
      }
    }

    void loadTechIcons()

    return () => {
      cancelled = true
    }
  }, [])

  function goTo(next: number, dir: 1 | -1 = 1) {
    if (busyRef.current) return
    if (next < 0 || next >= totalCount) return
    if (next === idxRef.current) return
    busyRef.current = true

    const oldEl = mockupRefs.current[idxRef.current]
    const newEl = mockupRefs.current[next]

    import('gsap').then(({ default: gsap }) => {
      if (oldEl) {
        gsap.to(oldEl, { opacity: 0, duration: 0.22, ease: 'power1.in', overwrite: true })
      }
      if (newEl) {
        gsap.fromTo(
          newEl,
          { x: dir > 0 ? 140 : -140, y: 0, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 0.65, ease: 'power4.out', delay: 0.08, overwrite: true, onComplete: () => { busyRef.current = false } },
        )
      } else {
        busyRef.current = false
      }

      textKey.current += 1
      setActiveIdx(next)
    })
  }

  useEffect(() => {
    import('gsap').then(({ default: gsap }) => {
      mockupRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, { x: i === 0 ? 0 : 160, y: 0, opacity: i === 0 ? 1 : 0 })
      })
    })
  }, [])

  useEffect(() => {
    if (!active) return
    busyRef.current = false
    setActiveIdx(0)
    textKey.current += 1

    import('gsap').then(({ default: gsap }) => {
      mockupRefs.current.forEach((el) => {
        if (el) gsap.set(el, { x: 200, y: 0, opacity: 0, overwrite: true })
      })
      const el = mockupRefs.current[0]
      if (el) {
        setTimeout(() => {
          gsap.fromTo(el, { x: 200, y: 0, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', overwrite: true })
        }, 180)
      }
    })
  }, [active])

  useLayoutEffect(() => {
    // Wheel-driven mini-carousel is desktop-deck-navigation behavior; on
    // mobile/tablet the page is normal-scroll, so skip attaching entirely.
    if (!active || !isDesktop) return
    let timer: ReturnType<typeof setTimeout>

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 10) return
      const dir = (e.deltaY > 0 ? 1 : -1) as 1 | -1
      const next = idxRef.current + dir
      if (next < 0 || next >= totalCount) return
      e.stopPropagation()
      e.preventDefault()
      clearTimeout(timer)
      timer = setTimeout(() => goTo(next, dir), 80)
    }

    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true })
      clearTimeout(timer)
    }
  }, [active, isDesktop, totalCount])

  const p = projects[activeIdx] ?? projects[0]

  return (
    <section className={`panel${active ? ' active' : ''}`} ref={sectionRef}>
      {/* ── Technology Showcase Strip (desktop only) ── */}
      <div className="hidden lg:block absolute z-20" style={{ left: '50%', transform: 'translateX(-50%)', width: 560, bottom: 32 }}>
        <div
          className="pointer-events-none absolute inset-x-0"
          style={{ top: -40, height: 140, background: `radial-gradient(ellipse 60% 100% at 50% 100%, ${p.accent}14 0%, transparent 70%)` }}
        />
        <p
          className="text-[10px] font-bold tracking-[0.25em] uppercase mb-3 text-center"
          style={{ color: `${p.accent}99` }}
        >
          {mn ? 'Pixel' : 'Pixel'}
        </p>
        <div
          className="tech-strip-wrap overflow-hidden"
          style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)', paddingTop: 12, paddingBottom: 4 }}
        >
          <div className="tech-strip-track flex gap-8 items-stretch">
            {[...Array(10)].flatMap((_, rep) =>
              stripIcons.map((icon, index) => (
                <div key={`${rep}-${index}-${icon.label}`} className="tech-icon-card">
                  <div className="tech-glow" style={{ background: `radial-gradient(ellipse 80% 55% at 50% -5%, ${p.accent}2e 0%, transparent 68%)` }} />
                  <div className="tech-icon-img-wrap">
                    <img src={icon.src} alt={icon.label} style={{ width: 52, height: 52, objectFit: 'contain', display: 'block' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* self-padded: children carry their own horizontal padding — opts out of the
          ≤480px .panel-inner padding override in globals.css (would double up here) */}
      <div className="panel-inner self-padded w-full flex flex-col md:flex-row md:h-full">

        {/* ── LEFT: project info ── */}
        <div
          className="shrink-0 flex flex-col md:justify-center relative overflow-hidden w-full md:w-[46%] md:h-full lg:w-[48%]"
          style={{ padding: 'clamp(28px,5vw,80px)', paddingTop: 'max(80px, clamp(28px,5vw,80px))' }}
        >
          <div
            className="pointer-events-none absolute w-[420px] h-[420px] rounded-full"
            style={{ left: '-12%', top: '10%', background: `radial-gradient(circle, ${p.accent}18 0%, transparent 70%)`, filter: 'blur(70px)', transition: 'background 0.7s ease' }}
          />
          <LeftContent
            key={`${activeIdx}-${textKey.current}-${lang}`}
            p={p}
            activeIdx={activeIdx}
            totalCount={totalCount}
            goTo={goTo}
            idxRef={idxRef}
            mn={mn}
          />
        </div>

        {/* ── RIGHT: overlapping mockup cards ── */}
        {/* touch-action:none is deck-mode (md+) behavior only — on mobile normal-scroll
            it would block the page from scrolling when a swipe starts on the mockup */}
        <div
          ref={rightColRef}
          className="w-full aspect-[16/10] md:aspect-auto md:flex-1 md:h-full lg:flex-1 relative overflow-hidden
                     md:touch-none md:overscroll-none"
        >
          {projects.map((proj, i) => (
            <div
              key={i}
              ref={(el) => { mockupRefs.current[i] = el }}
              className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
            >
              <div className="relative w-full" style={{ maxWidth: 500 }}>
                <div
                  className="relative rounded-2xl overflow-hidden mockup-shine flex flex-col"
                  style={{ background: proj.mockupGrad, aspectRatio: '16/10', boxShadow: `0 40px 80px -20px ${proj.accent}44, 0 0 0 1px rgba(255,255,255,0.06)` }}
                >
                  <div
                    className="flex items-center gap-1.5 px-4 py-2.5 border-b shrink-0"
                    style={{ borderColor: `${proj.accent}22`, background: 'rgba(0,0,0,0.3)' }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    <div className="ml-3 flex-1 h-5 rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  </div>
                  <div className="mockup-body relative flex-1 min-h-0 overflow-hidden">
                    <img
                      src={proj.img}
                      alt={mn ? proj.title.mn.join(' ') : proj.title.en.join(' ')}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="mt-1 mx-8 h-3 rounded-b-lg" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="mt-0.5 mx-4 h-1.5 rounded-b-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
                <div
                  className="hidden md:block absolute -top-4 -right-4 glass-card rounded-xl px-4 py-2 float-anim"
                  style={{ borderColor: `${proj.accent}44` }}
                >
                  <p className="text-[10px] font-bold" style={{ color: proj.accent }}>
                    {mn ? proj.tag.mn : proj.tag.en}
                  </p>
                </div>
                {i === activeIdx && (
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: `0 0 0 2px ${proj.accent}66, 0 0 60px ${proj.accent}22` }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
