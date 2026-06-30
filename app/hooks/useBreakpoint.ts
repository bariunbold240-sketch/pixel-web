'use client'
import { useMediaQuery } from './useMediaQuery'

/** Keep in sync with the @theme --breakpoint-* tokens in app/globals.css */
export const BREAKPOINTS = {
  md: 768,
  tablet: 820,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

interface BreakpointState {
  isMobile: boolean    // < 768
  isTablet: boolean    // 768-1023 (md but not lg)
  isDesktop: boolean   // >= 1024
  isMd: boolean        // >= 768
  isTabletBp: boolean  // >= 820 (the named `tablet:` token specifically)
  isLg: boolean        // >= 1024
  isXl: boolean        // >= 1280
  is2xl: boolean       // >= 1536
}

export function useBreakpoint(): BreakpointState {
  const isMd       = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`)
  const isTabletBp = useMediaQuery(`(min-width: ${BREAKPOINTS.tablet}px)`)
  const isLg       = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`)
  const isXl       = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`)
  const is2xl      = useMediaQuery(`(min-width: ${BREAKPOINTS['2xl']}px)`)

  return {
    isMobile: !isMd,
    isTablet: isMd && !isLg,
    isDesktop: isLg,
    isMd,
    isTabletBp,
    isLg,
    isXl,
    is2xl,
  }
}
