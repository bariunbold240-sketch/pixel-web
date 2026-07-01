export const BREAKPOINTS = {
  xs: 430,
  sm: 640,
  md: 768,
  tablet: 820,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type ResponsiveBreakpoint = keyof typeof BREAKPOINTS

export const MEDIA_QUERIES = {
  compactMobile: `(max-width: ${BREAKPOINTS.xs - 1}px)`,
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  tabletWide: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,
  hover: '(hover: hover) and (pointer: fine)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
} as const

export interface ResponsiveSnapshot {
  viewportWidth: number
  viewportHeight: number
  isCompactMobile: boolean
  isMobile: boolean
  isLargeMobile: boolean
  isTablet: boolean
  isTabletWide: boolean
  isDesktop: boolean
  isXl: boolean
  is2xl: boolean
  canHover: boolean
  isTouch: boolean
  prefersReducedMotion: boolean
}

export interface ResponsiveInput {
  viewportWidth: number
  viewportHeight: number
  canHover: boolean
  prefersReducedMotion: boolean
}

export function createResponsiveSnapshot({
  viewportWidth,
  viewportHeight,
  canHover,
  prefersReducedMotion,
}: ResponsiveInput): ResponsiveSnapshot {
  const isCompactMobile = viewportWidth < BREAKPOINTS.xs
  const isMobile = viewportWidth < BREAKPOINTS.md
  const isLargeMobile = viewportWidth >= BREAKPOINTS.xs && viewportWidth < BREAKPOINTS.md
  const isTablet = viewportWidth >= BREAKPOINTS.md && viewportWidth < BREAKPOINTS.lg
  const isTabletWide = viewportWidth >= BREAKPOINTS.tablet && viewportWidth < BREAKPOINTS.lg
  const isDesktop = viewportWidth >= BREAKPOINTS.lg
  const isXl = viewportWidth >= BREAKPOINTS.xl
  const is2xl = viewportWidth >= BREAKPOINTS['2xl']

  return {
    viewportWidth,
    viewportHeight,
    isCompactMobile,
    isMobile,
    isLargeMobile,
    isTablet,
    isTabletWide,
    isDesktop,
    isXl,
    is2xl,
    canHover,
    isTouch: !canHover,
    prefersReducedMotion,
  }
}

