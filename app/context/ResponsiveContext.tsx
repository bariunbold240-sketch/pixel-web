'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { BREAKPOINTS, MEDIA_QUERIES, createResponsiveSnapshot, type ResponsiveSnapshot } from '../utils/responsive'

const FALLBACK = createResponsiveSnapshot({
  viewportWidth: 0,
  viewportHeight: 0,
  canHover: false,
  prefersReducedMotion: false,
})

const ResponsiveContext = createContext<ResponsiveSnapshot>(FALLBACK)

function getResponsiveSnapshot(): ResponsiveSnapshot {
  if (typeof window === 'undefined') return FALLBACK

  const canHover = window.matchMedia(MEDIA_QUERIES.hover).matches
  const prefersReducedMotion = window.matchMedia(MEDIA_QUERIES.reducedMotion).matches

  return createResponsiveSnapshot({
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    canHover,
    prefersReducedMotion,
  })
}

function attachQueryListener(
  mql: MediaQueryList,
  onChange: () => void,
) {
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

export function ResponsiveProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<ResponsiveSnapshot>(getResponsiveSnapshot)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const update = () => setSnapshot(getResponsiveSnapshot())

    const hoverQuery = window.matchMedia(MEDIA_QUERIES.hover)
    const motionQuery = window.matchMedia(MEDIA_QUERIES.reducedMotion)

    const cleanups = [
      attachQueryListener(hoverQuery, update),
      attachQueryListener(motionQuery, update),
    ]

    window.addEventListener('resize', update, { passive: true })
    window.addEventListener('orientationchange', update)
    update()

    return () => {
      cleanups.forEach((cleanup) => cleanup())
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  const value = useMemo(() => snapshot, [snapshot])

  return <ResponsiveContext.Provider value={value}>{children}</ResponsiveContext.Provider>
}

export function useResponsive() {
  return useContext(ResponsiveContext)
}

export { BREAKPOINTS }

