'use client'
import { useEffect, useRef } from 'react'

export function useSectionAnim(active: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches

    // Mobile: once animated, skip re-runs so active-change never re-hides items
    if (mobile && hasAnimated.current) return

    if (!active && !mobile) return

    let idleTimer: ReturnType<typeof setInterval>
    const off: (() => void)[] = []
    let alive = true

    const run = () => {
      hasAnimated.current = true  // claim slot before async import
      import('gsap').then(({ default: gsap }) => {
        if (!alive) return

        const items = Array.from(el.querySelectorAll<HTMLElement>('[data-anim]'))
        if (!items.length) return

        gsap.set(items, { y: 26, opacity: 0 })

        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.085,
          ease: 'power3.out',
          delay: 0.1,
          onComplete() {
            if (!alive) return

            items.forEach(item => {
              if (item.hasAttribute('data-no-hover')) return

              let onIn: () => void
              let onOut: () => void

              if (item.classList.contains('glass-card')) {
                onIn  = () => gsap.to(item, { y: -4, scale: 1.025, duration: 0.25, ease: 'power2.out',   overwrite: 'auto' })
                onOut = () => gsap.to(item, { y: 0,  scale: 1,     duration: 0.4,  ease: 'power2.inOut', overwrite: 'auto' })
              } else if (item.tagName === 'P' || item.tagName === 'H2') {
                onIn  = () => gsap.to(item, { x: 5, duration: 0.25, ease: 'power2.out', overwrite: 'auto' })
                onOut = () => gsap.to(item, { x: 0, duration: 0.4,  ease: 'power2.out', overwrite: 'auto' })
              } else {
                onIn  = () => gsap.to(item, { scale: 1.03, duration: 0.25, ease: 'power2.out', overwrite: 'auto' })
                onOut = () => gsap.to(item, { scale: 1,    duration: 0.4,  ease: 'power2.out', overwrite: 'auto' })
              }

              item.addEventListener('mouseenter', onIn)
              item.addEventListener('mouseleave', onOut)
              off.push(
                () => item.removeEventListener('mouseenter', onIn),
                () => item.removeEventListener('mouseleave', onOut),
              )
            })

            let cycle = 0
            idleTimer = setInterval(() => {
              if (!alive || !document.contains(el)) return
              const cards = items.filter(i => i.classList.contains('glass-card'))
              const heads = items.filter(i => i.tagName === 'H2' || (i.tagName === 'P' && i.className.includes('tracking-[0.22em]')))

              if (cycle % 3 === 0 && cards.length) {
                gsap.fromTo(cards,
                  { y: 0 },
                  { y: -6, duration: 0.26, stagger: 0.1, ease: 'power2.out', yoyo: true, repeat: 1 })
              } else if (cycle % 3 === 1 && cards.length) {
                gsap.fromTo(cards,
                  { scale: 1 },
                  { scale: 1.03, duration: 0.26, stagger: 0.1, ease: 'power2.out', yoyo: true, repeat: 1 })
              } else if (heads.length) {
                gsap.fromTo(heads,
                  { x: 0 },
                  { x: 6, duration: 0.22, stagger: 0.1, ease: 'power1.inOut', yoyo: true, repeat: 1 })
              }
              cycle++
            }, 8000)
          },
        })
      })
    }

    // Mobile: trigger via IntersectionObserver when section scrolls into view
    let obs: IntersectionObserver | undefined
    if (mobile) {
      obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { obs!.disconnect(); run() } },
        { threshold: 0.12, rootMargin: '0px 0px -16px 0px' },
      )
      obs.observe(el.closest('section') ?? el)
    } else {
      run()
    }

    return () => {
      alive = false
      obs?.disconnect()
      clearInterval(idleTimer)
      off.forEach(fn => fn())
    }
  }, [active])

  return ref
}
