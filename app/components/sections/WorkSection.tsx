'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

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
}

const PROJECTS = [
  {
    num: '04',
    tag: 'Дижитал Бүтээгдэхүүн',
    title: ['GYMHUB', 'Фитнесс Хөтөлбөр'],
    description:
      'Фитнесс гишүүнчлэлийн менежментийн платформ — хэрэглэгч, төлбөр, компани, дашбоард аналитик.',
    tech: ['Figma', 'React', 'Next.js', 'Tailwind CSS'],
    stats: [
      { n: '6,932', l: 'Хэрэглэгч' },
      { n: '2,949', l: 'Төлбөр' },
      { n: '197',   l: 'Компани' },
    ],
    accent: '#15a59a',
    mockupGrad: 'linear-gradient(135deg, #0d4f4a 0%, #0a3d55 50%, #05050d 100%)',
  },
  {
    num: '05',
    tag: 'Вэбсайт',
    title: ['NOVA MIND', 'Acadем'],
    description:
      'Боловсролын төвийн вэбсайт — хөтөлбөрийн каталог, бүртгэл, хоёр хэлний интерфэйс.',
    tech: ['Figma', 'React', 'Node.js', 'MongoDB'],
    stats: [
      { n: '65%',  l: 'Хөрвөлт өсөлт' },
      { n: '40%',  l: 'Зочлогч өсөлт' },
      { n: '80%',  l: 'Өмнөхөөс дээр' },
    ],
    accent: '#6f63ff',
    mockupGrad: 'linear-gradient(135deg, #1a1060 0%, #2d1b6e 50%, #05050d 100%)',
  },
  {
    num: '06',
    tag: 'Instagram Маркетинг',
    title: ['BLUEBELL', 'Flower Shop'],
    description:
      'Instagram контент, брэндинг ба фолловер өсөлт — 1,065+ дагагч, тогтмол рийл бүтээл.',
    tech: ['Figma', 'Canva', 'Instagram', 'Reels'],
    stats: [
      { n: '1,065+', l: 'Дагагч' },
      { n: '18',     l: 'Постер' },
      { n: '320%',   l: 'Өсөлт' },
    ],
    accent: '#ff4fd8',
    mockupGrad: 'linear-gradient(135deg, #4d0035 0%, #7a0055 50%, #05050d 100%)',
  },
]

function LeftContent({ p, activeIdx, totalCount, goTo, idxRef }: LeftContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    let idleTimer: ReturnType<typeof setInterval>
    const off: (() => void)[] = []

    import('gsap').then(({ default: gsap }) => {
      // ── Initial hidden state ──────────────────────────────
      gsap.set(el.querySelector('[data-anim="tag"]'),      { x: -28, opacity: 0 })
      gsap.set(el.querySelectorAll('[data-anim="title"]'), { y: '108%' })
      gsap.set(el.querySelector('[data-anim="desc"]'),     { y: 20, opacity: 0 })
      gsap.set(el.querySelectorAll('[data-anim="tech"]'),  { scale: 0.72, opacity: 0 })
      gsap.set(el.querySelectorAll('[data-anim="stat"]'),  { y: 24, opacity: 0 })
      gsap.set(el.querySelector('[data-anim="dots"]'),     { opacity: 0 })

      // ── Entrance timeline ─────────────────────────────────
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
          // ── Hover effects ─────────────────────────────────
          const hover = (
            sel: string,
            inV: object,
            outV: object,
          ) => {
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

          hover('[data-anim="tag"]',
            { x: 7 },
            { x: 0 })
          hover('[data-anim="title"]',
            { x: 5, scale: 1.018, transformOrigin: '0% 50%' },
            { x: 0, scale: 1 })
          hover('[data-anim="tech"]',
            { y: -6, scale: 1.12 },
            { y: 0,  scale: 1 })
          hover('[data-anim="stat"]',
            { y: -5, scale: 1.06 },
            { y: 0,  scale: 1 })

          // ── Idle animation every ~8 s ─────────────────────
          let cycle = 0
          idleTimer = setInterval(() => {
            if (!document.contains(el)) return
            const techs  = el.querySelectorAll('[data-anim="tech"]')
            const stats  = el.querySelectorAll('[data-anim="stat"]')
            const titles = el.querySelectorAll('[data-anim="title"]')

            if (cycle % 3 === 0) {
              // wave the tech badges
              gsap.fromTo(techs,
                { y: 0 },
                { y: -8, duration: 0.28, stagger: 0.09,
                  ease: 'power2.out', yoyo: true, repeat: 1 })
            } else if (cycle % 3 === 1) {
              // pulse the stat cards
              gsap.fromTo(stats,
                { scale: 1 },
                { scale: 1.07, duration: 0.25, stagger: 0.1,
                  ease: 'power2.out', yoyo: true, repeat: 1 })
            } else {
              // title ghost-slide then snap back
              gsap.fromTo(titles,
                { x: 0, opacity: 1 },
                { x: 8, opacity: 0.6, duration: 0.22, stagger: 0.1,
                  ease: 'power1.in', yoyo: true, repeat: 1 })
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
        {p.num} — Хамтрагчид · {p.tag}
      </p>

      <h2 className="text-[clamp(36px,4.8vw,68px)] font-black uppercase leading-[0.88] tracking-[-0.03em]">
        <div className="overflow-hidden">
          <span data-anim="title" className="gradient-text block">{p.title[0]}</span>
        </div>
        <div className="overflow-hidden">
          <span data-anim="title" className="block text-pxwhite">{p.title[1]}</span>
        </div>
      </h2>

      <p
        data-anim="desc"
        className="text-[clamp(14px,1.2vw,17px)] text-mute leading-[1.85] max-w-110"
      >
        {p.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {p.tech.map((t) => (
          <span
            data-anim="tech"
            key={t}
            className="glass-card px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
            style={{ color: p.accent }}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {p.stats.map((s) => (
          <div data-anim="stat" key={s.l} className="glass-card rounded-2xl p-4 text-center">
            <p
              className="text-[clamp(18px,2vw,28px)] font-black leading-none mb-1"
              style={{ color: p.accent }}
            >
              {s.n}
            </p>
            <p className="text-[10px] text-mute tracking-wide">{s.l}</p>
          </div>
        ))}
      </div>

      <div data-anim="dots" className="flex items-center gap-2">
        {Array.from({ length: totalCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > idxRef.current ? 1 : -1)}
            className="h-1 rounded-full transition-all duration-300 border-0 cursor-pointer"
            style={{
              width: i === activeIdx ? 28 : 10,
              background: i === activeIdx ? p.accent : 'rgba(184,194,221,0.2)',
            }}
          />
        ))}
        <span className="ml-2 text-[11px] text-mute/50">
          {String(activeIdx + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

export default function WorkSection({ active, sectionRef }: WorkSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const mockupRefs  = useRef<(HTMLDivElement | null)[]>([])
  const rightColRef = useRef<HTMLDivElement>(null)
  const textKey     = useRef(0)
  const busyRef     = useRef(false)
  const idxRef      = useRef(0)   // mirror of activeIdx for use inside event handlers

  useEffect(() => { idxRef.current = activeIdx }, [activeIdx])

  /* ── card transition: old fades out, new slides in from right ─ */
  function goTo(next: number, dir: 1 | -1 = 1) {
    if (busyRef.current) return
    if (next < 0 || next >= PROJECTS.length) return
    if (next === idxRef.current) return
    busyRef.current = true

    const oldEl = mockupRefs.current[idxRef.current]
    const newEl = mockupRefs.current[next]

    import('gsap').then(({ default: gsap }) => {
      // old card: fade out in place (no x movement — avoids "flying away" look)
      if (oldEl) {
        gsap.to(oldEl, {
          opacity: 0,
          duration: 0.22,
          ease: 'power1.in',
          overwrite: true,
        })
      }

      // new card: slide in from right (or left when going back), pure x
      if (newEl) {
        gsap.fromTo(
          newEl,
          { x: dir > 0 ? 140 : -140, y: 0, opacity: 0 },
          {
            x: 0, y: 0, opacity: 1,
            duration: 0.65,
            ease: 'power4.out',
            delay: 0.08,
            overwrite: true,
            onComplete: () => { busyRef.current = false },
          },
        )
      } else {
        busyRef.current = false
      }

      textKey.current += 1
      setActiveIdx(next)
    })
  }

  /* ── Initial hidden state (GSAP owns transform+opacity, not React) */
  useEffect(() => {
    import('gsap').then(({ default: gsap }) => {
      mockupRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, { x: i === 0 ? 0 : 160, y: 0, opacity: i === 0 ? 1 : 0 })
      })
    })
  }, [])

  /* ── Reset + show first card when panel activates ─────────────── */
  useEffect(() => {
    if (!active) return
    busyRef.current = false
    setActiveIdx(0)
    textKey.current += 1

    import('gsap').then(({ default: gsap }) => {
      // hide all cards off to the right
      mockupRefs.current.forEach((el) => {
        if (el) gsap.set(el, { x: 200, y: 0, opacity: 0, overwrite: true })
      })
      // first card slides in after panel fade-in settles
      const el = mockupRefs.current[0]
      if (el) {
        setTimeout(() => {
          gsap.fromTo(el,
            { x: 200, y: 0, opacity: 0 },
            { x: 0, y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', overwrite: true },
          )
        }, 180)
      }
    })
  }, [active])

  /* ── Wheel: window capture while panel active ────────────────── */
  /* useLayoutEffect so listener is added before browser paints,
     preventing inertia events from slipping to the page handler  */
  useLayoutEffect(() => {
    if (!active) return

    let timer: ReturnType<typeof setTimeout>

    const onWheel = (e: WheelEvent) => {
      // ignore tiny inertia tails (trackpad rubber-band / deceleration)
      if (Math.abs(e.deltaY) < 10) return

      const dir = (e.deltaY > 0 ? 1 : -1) as 1 | -1
      const next = idxRef.current + dir

      // at boundary → let outer page navigate to next/prev panel
      if (next < 0 || next >= PROJECTS.length) return

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
  }, [active])

  const p = PROJECTS[activeIdx]

  return (
    <section className={`panel${active ? ' active' : ''}`} ref={sectionRef}>
      <div className="panel-inner w-full flex flex-col md:flex-row md:h-full">

        {/* ── LEFT: project info ────────────────────────────── */}
        <div
          className="shrink-0 flex flex-col md:justify-center relative overflow-hidden w-full md:w-[48%] md:h-full"
          style={{ padding: 'clamp(28px,5vw,80px)', paddingTop: 'max(80px, clamp(28px,5vw,80px))' }}
        >
          <div
            className="pointer-events-none absolute w-[420px] h-[420px] rounded-full"
            style={{
              left: '-12%', top: '10%',
              background: `radial-gradient(circle, ${p.accent}18 0%, transparent 70%)`,
              filter: 'blur(70px)',
              transition: 'background 0.7s ease',
            }}
          />

          <LeftContent
            key={`${activeIdx}-${textKey.current}`}
            p={p}
            activeIdx={activeIdx}
            totalCount={PROJECTS.length}
            goTo={goTo}
            idxRef={idxRef}
          />
        </div>

        {/* ── RIGHT: overlapping mockup cards ──────────────── */}
        <div
          ref={rightColRef}
          className="w-full h-[60vw] md:flex-1 md:h-full relative overflow-hidden"
          style={{ overscrollBehavior: 'none', touchAction: 'none' }}
        >
          {PROJECTS.map((proj, i) => (
            <div
              key={i}
              ref={(el) => { mockupRefs.current[i] = el }}
              className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
              /* GSAP owns transform + opacity — nothing set here */
            >
              <div className="relative w-full" style={{ maxWidth: 500 }}>
                {/* Screen */}
                <div
                  className="relative rounded-2xl overflow-hidden mockup-shine"
                  style={{
                    background: proj.mockupGrad,
                    aspectRatio: '16/10',
                    boxShadow: `0 40px 80px -20px ${proj.accent}44, 0 0 0 1px rgba(255,255,255,0.06)`,
                  }}
                >
                  {/* Browser bar */}
                  <div
                    className="flex items-center gap-1.5 px-4 py-2.5 border-b"
                    style={{ borderColor: `${proj.accent}22`, background: 'rgba(0,0,0,0.3)' }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    <div className="ml-3 flex-1 h-5 rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  </div>

                  {/* UI skeleton */}
                  <div className="p-5 flex flex-col gap-3 h-full">
                    <div className="flex gap-3">
                      <div className="rounded-xl flex-1 h-14" style={{ background: `${proj.accent}22` }} />
                      <div className="rounded-xl flex-1 h-14" style={{ background: `${proj.accent}16` }} />
                      <div className="rounded-xl flex-1 h-14" style={{ background: `${proj.accent}0c` }} />
                    </div>
                    <div className="rounded-xl flex-1" style={{ background: `${proj.accent}10` }} />
                    <div className="flex gap-3">
                      <div className="rounded-xl h-8 flex-1" style={{ background: `${proj.accent}18` }} />
                      <div
                        className="rounded-xl h-8 w-24"
                        style={{ background: `linear-gradient(90deg,${proj.accent}99,${proj.accent}55)` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Laptop base */}
                <div className="mt-1 mx-8 h-3 rounded-b-lg" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="mt-0.5 mx-4 h-1.5 rounded-b-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />

                {/* Floating tag */}
                <div
                  className="absolute -top-4 -right-4 glass-card rounded-xl px-4 py-2 float-anim"
                  style={{ borderColor: `${proj.accent}44` }}
                >
                  <p className="text-[10px] font-bold" style={{ color: proj.accent }}>{proj.tag}</p>
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
