'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { flushSync } from 'react-dom'
import Orb from './components/Orb'
import AppNav from './components/AppNav'
import NavDots from './components/NavDots'
import LoadingScreen from './components/LoadingScreen'
import HeroSection from './components/sections/HeroSection'
import VisionSection from './components/sections/VisionSection'
import TeamSection from './components/sections/TeamSection'
import WorkSection from './components/sections/WorkSection'
import PackagesSection from './components/sections/PackagesSection'
import ContactSection from './components/sections/ContactSection'
import { N } from './data'

export default function Page() {
  const [cur, setCur] = useState(0)
  const [loadingDone, setLoadingDone] = useState(false)
  const hintRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLElement | null)[]>([])
  const lockRef = useRef(false)
  const hintHiddenRef = useRef(false)
  const curRef = useRef(0)
  const reducedRef = useRef(false)

  useEffect(() => { curRef.current = cur }, [cur])

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const hideHint = useCallback(() => {
    if (!hintHiddenRef.current) {
      hintHiddenRef.current = true
      hintRef.current?.classList.add('opacity-0', 'pointer-events-none')
    }
  }, [])

  const playIn = useCallback((panel: HTMLElement, dir: number) => {
    const inner = panel.querySelector('.panel-inner') as HTMLElement | null
    if (inner) inner.scrollTop = 0
    if (reducedRef.current) return

    import('gsap').then(({ default: gsap }) => {
      const items = panel.querySelectorAll('[data-anim]')
      gsap.killTweensOf(items)
      gsap.fromTo(items,
        { opacity: 0, y: dir >= 0 ? 36 : -36, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7, ease: 'power3.out',
          stagger: { amount: 0.35, from: 'start' },
          clearProps: 'scale',
        }
      )
      const words = panel.querySelectorAll('[data-split] .w')
      if (words.length) {
        gsap.fromTo(words,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05, delay: 0.06 }
        )
      }
    })
  }, [])

  const go = useCallback((n: number, dirHint?: number) => {
    n = Math.max(0, Math.min(N - 1, n))
    if (lockRef.current || n === curRef.current) return
    lockRef.current = true

    const dir = dirHint !== undefined ? dirHint : (n > curRef.current ? 1 : -1)
    const oldPanel = panelRefs.current[curRef.current]
    const newPanel = panelRefs.current[n]
    const reduced = reducedRef.current

    curRef.current = n
    hideHint()

    flushSync(() => setCur(n))
    if (newPanel) playIn(newPanel, dir)

    setTimeout(() => { lockRef.current = false }, reduced ? 60 : 420)
  }, [playIn, hideHint])

  // Hero animation is now handled inside HeroSection (triggered by ready=loadingDone)

  // Wheel navigation between panels
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 10) return   // ignore inertia tail
      e.preventDefault()
      clearTimeout(timer)
      timer = setTimeout(() => {
        const dir = e.deltaY > 0 ? 1 : -1
        go(curRef.current + dir, dir)
      }, 50)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      clearTimeout(timer)
    }
  }, [go])

  // Hero parallax
  useEffect(() => {
    if (reducedRef.current) return
    const handleMove = (e: PointerEvent) => {
      if (curRef.current !== 0) return
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      import('gsap').then(({ default: gsap }) => {
        gsap.to('#heroTitle', { rotationY: x * 8, rotationX: -y * 6, duration: 0.6, ease: 'power2.out' })
      })
    }
    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  const ref = (i: number) => (el: HTMLElement | null) => { panelRefs.current[i] = el }

  return (
    <>
      {!loadingDone && <LoadingScreen onDone={() => setLoadingDone(true)} />}

      <Orb hue={0} hoverIntensity={0.3} rotateOnHover backgroundColor="#000000" />

      {/* Vignette */}
      <div className="fixed inset-0 z-[1] pointer-events-none [background:radial-gradient(120%_90%_at_78%_18%,transparent_30%,rgba(0,0,0,0.8)_100%)]" />

      <AppNav cur={cur} go={go} />

      {/* Deck */}
      <div className="panel-deck fixed inset-0 z-[2]">
        <HeroSection      active={cur === 0} ready={loadingDone} sectionRef={ref(0)} />
        <VisionSection    active={cur === 1} sectionRef={ref(1)} />
        <TeamSection      active={cur === 2} sectionRef={ref(2)} />
        <WorkSection      active={cur === 3} sectionRef={ref(3)} />
        <PackagesSection  active={cur === 4} sectionRef={ref(4)} />
        <ContactSection   active={cur === 5} sectionRef={ref(5)} />
      </div>

      <NavDots cur={cur} go={go} />
    </>
  )
}
