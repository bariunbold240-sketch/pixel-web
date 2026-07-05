'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  /** The final, already-formatted value, e.g. "6,932", "120+", "100%", "5.3K". */
  value: string
  /** Animation length in ms. */
  duration?: number
  className?: string
}

interface Parsed {
  prefix: string
  suffix: string
  numeric: number
  hasComma: boolean
  decimals: number
}

// Splits "6,932" / "120+" / "100%" / "5.3K" into prefix + number + suffix.
// Returns null when there's nothing sensible to count (e.g. "24/7", "—").
function parse(value: string): Parsed | null {
  const m = /^(\D*)([\d,]*\.?\d+)(.*)$/.exec(value)
  if (!m) return null
  const [, prefix, rawNum, suffix] = m
  if (/\d/.test(suffix)) return null // e.g. "24/7" — the "/7" makes counting meaningless
  const hasComma = rawNum.includes(',')
  const numeric = Number.parseFloat(rawNum.replace(/,/g, ''))
  if (!Number.isFinite(numeric)) return null
  const dot = rawNum.indexOf('.')
  const decimals = dot === -1 ? 0 : rawNum.length - dot - 1
  return { prefix, suffix, numeric, hasComma, decimals }
}

function format(n: number, hasComma: boolean, decimals: number): string {
  const fixed = n.toFixed(decimals)
  if (!hasComma) return fixed
  const [int, frac] = fixed.split('.')
  const withCommas = Number(int).toLocaleString('en-US')
  return frac !== undefined ? `${withCommas}.${frac}` : withCommas
}

/**
 * Counts a stat number up from 0 when it first scrolls into view — mobile only,
 * so desktop stays pixel-identical. Honors prefers-reduced-motion (renders the
 * final value immediately). SSR/first render output is the final value, so there
 * is no hydration mismatch; the animation only starts client-side, on mobile.
 */
export default function CountUp({ value, duration = 1200, className }: CountUpProps) {
  const [display, setDisplay] = useState(value)
  const elRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const parsed = parse(value)
    const mobile = window.matchMedia('(max-width: 767px)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Desktop and reduced-motion: leave the final value untouched.
    if (!parsed || !mobile || reduced) {
      setDisplay(value)
      return
    }

    const { prefix, suffix, numeric, hasComma, decimals } = parsed
    setDisplay(`${prefix}${format(0, hasComma, decimals)}${suffix}`)

    const el = elRef.current
    if (!el) {
      setDisplay(value)
      return
    }

    let raf = 0
    let startTs = 0
    let started = false

    const tick = (ts: number) => {
      if (!startTs) startTs = ts
      const t = Math.min(1, (ts - startTs) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      if (t < 1) {
        setDisplay(`${prefix}${format(numeric * eased, hasComma, decimals)}${suffix}`)
        raf = requestAnimationFrame(tick)
      } else {
        setDisplay(value) // snap to the exact original formatting
      }
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true
          obs.disconnect()
          raf = requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)

    return () => {
      obs.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])

  // tabular-nums keeps digit widths stable so the count doesn't jitter the layout.
  return (
    <span ref={elRef} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {display}
    </span>
  )
}
